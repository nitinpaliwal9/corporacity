// lib/securityService.js - Security and audit logging service
import { createClient } from '@supabase/supabase-js'

// Only create client on client side
const getSupabaseAdmin = () => {
  if (typeof window === 'undefined') {
    return null // Server-side, return null
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export class SecurityService {
  // Get client IP address (simplified)
  static getClientIP() {
    if (typeof window === 'undefined') return null
    // In a real implementation, you would get this from the server
    return '127.0.0.1' // Placeholder
  }

  // Get user agent
  static getUserAgent() {
    if (typeof window === 'undefined') return null
    return navigator.userAgent
  }

  // Create audit log entry
  static async createAuditLog(companyId, userId, action, description, severity = 'low', metadata = {}) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return null

      const { data, error } = await supabaseAdmin
        .from('corp_audit_logs')
        .insert([{
          company_id: companyId,
          user_id: userId,
          action,
          description,
          severity,
          ip_address: this.getClientIP(),
          user_agent: this.getUserAgent(),
          metadata
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating audit log:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error creating audit log:', err)
      return null
    }
  }

  // Log user login
  static async logLogin(companyId, userId) {
    return await this.createAuditLog(
      companyId,
      userId,
      'login',
      'User logged in successfully',
      'low'
    )
  }

  // Log failed login
  static async logFailedLogin(companyId, userId = null, reason = 'Invalid credentials') {
    return await this.createAuditLog(
      companyId,
      userId,
      'login_failed',
      reason,
      'medium'
    )
  }

  // Log user logout
  static async logLogout(companyId, userId) {
    return await this.createAuditLog(
      companyId,
      userId,
      'logout',
      'User logged out',
      'low'
    )
  }

  // Log status update
  static async logStatusUpdate(companyId, userId, statusType) {
    return await this.createAuditLog(
      companyId,
      userId,
      'status_update',
      `User updated status to: ${statusType}`,
      'low',
      { status_type: statusType }
    )
  }

  // Log join request
  static async logJoinRequest(companyId, userId) {
    return await this.createAuditLog(
      companyId,
      userId,
      'join_request',
      'User requested to join company',
      'low'
    )
  }

  // Log approval
  static async logApproval(companyId, userId, approvedBy, actionType) {
    return await this.createAuditLog(
      companyId,
      userId,
      'approval',
      `User request approved: ${actionType}`,
      'low',
      { approved_by: approvedBy, action_type: actionType }
    )
  }

  // Log data access
  static async logDataAccess(companyId, userId, dataType, accessType) {
    return await this.createAuditLog(
      companyId,
      userId,
      'data_access',
      `User accessed: ${dataType} (${accessType})`,
      'low',
      { data_type: dataType, access_type: accessType }
    )
  }

  // Log permission changes
  static async logPermissionChange(companyId, userId, changedBy, oldRole, newRole) {
    return await this.createAuditLog(
      companyId,
      userId,
      'permission_change',
      `User role changed from ${oldRole} to ${newRole}`,
      'high',
      { changed_by: changedBy, old_role: oldRole, new_role: newRole }
    )
  }

  // Log suspicious activity
  static async logSuspiciousActivity(companyId, userId, description, severity = 'high') {
    return await this.createAuditLog(
      companyId,
      userId,
      'suspicious_activity',
      description,
      severity
    )
  }

  // Get audit logs for a company
  static async getAuditLogs(companyId, limit = 100, offset = 0) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return []

      const { data, error } = await supabaseAdmin
        .from('corp_audit_logs')
        .select(`
          *,
          corp_profiles!inner(full_name, email)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error getting audit logs:', error)
        return []
      }

      return data || []
    } catch (err) {
      console.error('Error getting audit logs:', err)
      return []
    }
  }

  // Get security metrics
  static async getSecurityMetrics(companyId) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return null

      // Get total users
      const { count: totalUsers } = await supabaseAdmin
        .from('corp_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      // Get active users (users with recent activity)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: activeUsers } = await supabaseAdmin
        .from('corp_statuses')
        .select('user_id', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('timestamp', sevenDaysAgo.toISOString())

      // Get failed logins
      const { count: failedLogins } = await supabaseAdmin
        .from('corp_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('action', 'login_failed')

      // Get suspicious activity
      const { count: suspiciousActivity } = await supabaseAdmin
        .from('corp_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('severity', 'high')

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        failedLogins: failedLogins || 0,
        suspiciousActivity: suspiciousActivity || 0
      }
    } catch (err) {
      console.error('Error getting security metrics:', err)
      return null
    }
  }

  // Check for suspicious activity patterns
  static async checkSuspiciousActivity(companyId, userId) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return false

      // Check for multiple failed logins in the last hour
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)

      const { count: recentFailedLogins } = await supabaseAdmin
        .from('corp_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .eq('action', 'login_failed')
        .gte('created_at', oneHourAgo.toISOString())

      // If more than 5 failed logins in the last hour, flag as suspicious
      if (recentFailedLogins > 5) {
        await this.logSuspiciousActivity(
          companyId,
          userId,
          `Multiple failed login attempts: ${recentFailedLogins} in the last hour`,
          'high'
        )
        return true
      }

      return false
    } catch (err) {
      console.error('Error checking suspicious activity:', err)
      return false
    }
  }

  // Rate limiting check
  static async checkRateLimit(companyId, userId, action, limit = 10, windowMinutes = 60) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return true

      const windowStart = new Date()
      windowStart.setMinutes(windowStart.getMinutes() - windowMinutes)

      const { count } = await supabaseAdmin
        .from('corp_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .eq('action', action)
        .gte('created_at', windowStart.toISOString())

      return (count || 0) < limit
    } catch (err) {
      console.error('Error checking rate limit:', err)
      return true // Allow on error
    }
  }
}
