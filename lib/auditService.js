// Comprehensive Audit Logging Service
// Implements enterprise-grade audit trails for compliance and security

import supabase from './supabaseClient';

class AuditService {
  constructor() {
    this.supabase = supabase;
  }

  // Log a general audit event
  async logEvent(eventData) {
    const {
      userId,
      companyId,
      action,
      resourceType = null,
      resourceId = null,
      oldValues = null,
      newValues = null,
      severity = 'info',
      description = null,
      metadata = null
    } = eventData;

    try {
      const { data, error } = await this.supabase.rpc('log_audit_event', {
        p_user_id: userId,
        p_company_id: companyId,
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_old_values: oldValues,
        p_new_values: newValues,
        p_severity: severity,
        p_description: description,
        p_metadata: metadata
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Log security events
  async logSecurityEvent(eventData) {
    const {
      userId,
      companyId,
      eventType,
      severity,
      description,
      riskScore = 0,
      metadata = null
    } = eventData;

    try {
      const { data, error } = await this.supabase.rpc('log_security_event', {
        p_user_id: userId,
        p_company_id: companyId,
        p_event_type: eventType,
        p_severity: severity,
        p_description: description,
        p_risk_score: riskScore,
        p_metadata: metadata
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Log data access (GDPR compliance)
  async logDataAccess(eventData) {
    const {
      userId,
      companyId,
      accessType,
      resourceType,
      resourceId = null,
      purpose = null
    } = eventData;

    try {
      const { data, error } = await this.supabase.rpc('log_data_access', {
        p_user_id: userId,
        p_company_id: companyId,
        p_access_type: accessType,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_purpose: purpose
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get audit logs with filtering
  async getAuditLogs(companyId, options = {}) {
    const {
      userId = null,
      action = null,
      resourceType = null,
      severity = null,
      startDate = null,
      endDate = null,
      limit = 100,
      offset = 0
    } = options;

    try {
      let query = this.supabase
        .from('corp_audit_logs')
        .select(`
          *,
          user:corp_profiles!corp_audit_logs_user_id_fkey(full_name, email)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (userId) query = query.eq('user_id', userId);
      if (action) query = query.eq('action', action);
      if (resourceType) query = query.eq('resource_type', resourceType);
      if (severity) query = query.eq('severity', severity);
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      const { data, error } = await query
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  // Get security events
  async getSecurityEvents(companyId, options = {}) {
    const {
      severity = null,
      eventType = null,
      isResolved = null,
      startDate = null,
      endDate = null,
      limit = 100,
      offset = 0
    } = options;

    try {
      let query = this.supabase
        .from('corp_security_events')
        .select(`
          *,
          user:corp_profiles!corp_security_events_user_id_fkey(full_name, email),
          resolved_by_user:corp_profiles!corp_security_events_resolved_by_fkey(full_name, email)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (severity) query = query.eq('severity', severity);
      if (eventType) query = query.eq('event_type', eventType);
      if (isResolved !== null) query = query.eq('is_resolved', isResolved);
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      const { data, error } = await query
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  // Get data access logs
  async getDataAccessLogs(userId, companyId, options = {}) {
    const {
      accessType = null,
      resourceType = null,
      startDate = null,
      endDate = null,
      limit = 100,
      offset = 0
    } = options;

    try {
      let query = this.supabase
        .from('corp_data_access_logs')
        .select(`
          *,
          accessed_by_user:corp_profiles!corp_data_access_logs_accessed_by_fkey(full_name, email)
        `)
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (accessType) query = query.eq('access_type', accessType);
      if (resourceType) query = query.eq('resource_type', resourceType);
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      const { data, error } = await query
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  // Resolve security event
  async resolveSecurityEvent(eventId, resolvedBy, resolutionNotes) {
    try {
      const { data, error } = await this.supabase
        .from('corp_security_events')
        .update({
          is_resolved: true,
          resolved_by: resolvedBy,
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;

      // Log the resolution
      await this.logEvent({
        userId: resolvedBy,
        companyId: data.company_id,
        action: 'security_event_resolved',
        resourceType: 'security_event',
        resourceId: eventId,
        severity: 'info',
        description: `Security event resolved: ${data.event_type}`,
        metadata: { resolutionNotes }
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get audit statistics
  async getAuditStats(companyId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [auditLogs, securityEvents] = await Promise.all([
        this.supabase
          .from('corp_audit_logs')
          .select('action, severity, created_at')
          .eq('company_id', companyId)
          .gte('created_at', startDate.toISOString()),
        
        this.supabase
          .from('corp_security_events')
          .select('event_type, severity, is_resolved, created_at')
          .eq('company_id', companyId)
          .gte('created_at', startDate.toISOString())
      ]);

      if (auditLogs.error) throw auditLogs.error;
      if (securityEvents.error) throw securityEvents.error;

      const stats = {
        totalAuditEvents: auditLogs.data.length,
        totalSecurityEvents: securityEvents.data.length,
        unresolvedSecurityEvents: securityEvents.data.filter(e => !e.is_resolved).length,
        eventsByAction: {},
        eventsBySeverity: {},
        securityEventsByType: {},
        dailyActivity: {}
      };

      // Process audit logs
      auditLogs.data.forEach(log => {
        stats.eventsByAction[log.action] = (stats.eventsByAction[log.action] || 0) + 1;
        stats.eventsBySeverity[log.severity] = (stats.eventsBySeverity[log.severity] || 0) + 1;
        
        const date = new Date(log.created_at).toISOString().split('T')[0];
        stats.dailyActivity[date] = (stats.dailyActivity[date] || 0) + 1;
      });

      // Process security events
      securityEvents.data.forEach(event => {
        stats.securityEventsByType[event.event_type] = (stats.securityEventsByType[event.event_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Export audit logs (for compliance)
  async exportAuditLogs(companyId, options = {}) {
    const {
      startDate,
      endDate,
      format = 'json' // 'json', 'csv'
    } = options;

    try {
      const logs = await this.getAuditLogs(companyId, {
        startDate,
        endDate,
        limit: 10000 // Large limit for export
      });

      if (format === 'csv') {
        return this.convertToCSV(logs);
      }

      return logs;
    } catch (error) {
      throw error;
    }
  }

  // Convert audit logs to CSV format
  convertToCSV(logs) {
    if (logs.length === 0) return '';

    const headers = [
      'Timestamp',
      'User',
      'Action',
      'Resource Type',
      'Resource ID',
      'Severity',
      'Description',
      'IP Address',
      'User Agent'
    ];

    const rows = logs.map(log => [
      log.created_at,
      log.user?.full_name || log.user?.email || 'Unknown',
      log.action,
      log.resource_type || '',
      log.resource_id || '',
      log.severity,
      log.description || '',
      log.ip_address || '',
      log.user_agent || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Clean up old audit logs (data retention)
  async cleanupOldLogs(companyId, retentionDays = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const { data, error } = await this.supabase.rpc('cleanup_old_audit_logs');

      if (error) throw error;

      // Log the cleanup
      await this.logEvent({
        userId: null, // System action
        companyId,
        action: 'audit_cleanup',
        severity: 'info',
        description: `Cleaned up ${data} old audit logs older than ${retentionDays} days`,
        metadata: { retentionDays, deletedCount: data }
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Monitor for suspicious activity
  async detectSuspiciousActivity(companyId, userId) {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      // Check for multiple failed logins
      const { data: failedLogins, error: loginError } = await this.supabase
        .from('corp_security_events')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .eq('event_type', 'failed_login')
        .gte('created_at', oneHourAgo.toISOString());

      if (loginError) throw loginError;

      if (failedLogins.length >= 5) {
        await this.logSecurityEvent({
          userId,
          companyId,
          eventType: 'multiple_failed_logins',
          severity: 'high',
          description: `Multiple failed login attempts detected: ${failedLogins.length} in the last hour`,
          riskScore: 80,
          metadata: { failedAttempts: failedLogins.length, timeWindow: '1 hour' }
        });
      }

      // Check for unusual access patterns
      const { data: recentAccess, error: accessError } = await this.supabase
        .from('corp_audit_logs')
        .select('ip_address, created_at')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .gte('created_at', oneHourAgo.toISOString())
        .order('created_at', { ascending: false });

      if (accessError) throw accessError;

      // Check for multiple IP addresses
      const uniqueIPs = new Set(recentAccess.map(access => access.ip_address));
      if (uniqueIPs.size > 3) {
        await this.logSecurityEvent({
          userId,
          companyId,
          eventType: 'unusual_access_pattern',
          severity: 'medium',
          description: `Unusual access pattern detected: ${uniqueIPs.size} different IP addresses in the last hour`,
          riskScore: 60,
          metadata: { 
            uniqueIPs: Array.from(uniqueIPs),
            timeWindow: '1 hour',
            accessCount: recentAccess.length
          }
        });
      }

    } catch (error) {
      // Silently handle error
    }
  }

  // Get compliance report
  async getComplianceReport(companyId, startDate, endDate) {
    try {
      const [auditStats, securityStats, dataAccessStats] = await Promise.all([
        this.getAuditStats(companyId, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))),
        this.getSecurityEvents(companyId, { startDate, endDate, limit: 1000 }),
        this.supabase
          .from('corp_data_access_logs')
          .select('*')
          .eq('company_id', companyId)
          .gte('created_at', startDate)
          .lte('created_at', endDate)
      ]);

      if (dataAccessStats.error) throw dataAccessStats.error;

      return {
        period: { startDate, endDate },
        auditEvents: auditStats,
        securityEvents: {
          total: securityStats.length,
          unresolved: securityStats.filter(e => !e.is_resolved).length,
          bySeverity: securityStats.reduce((acc, event) => {
            acc[event.severity] = (acc[event.severity] || 0) + 1;
            return acc;
          }, {})
        },
        dataAccess: {
          total: dataAccessStats.data.length,
          byType: dataAccessStats.data.reduce((acc, access) => {
            acc[access.access_type] = (acc[access.access_type] || 0) + 1;
            return acc;
          }, {})
        },
        compliance: {
          hasAuditTrail: auditStats.totalAuditEvents > 0,
          hasSecurityMonitoring: securityStats.length > 0,
          hasDataAccessLogging: dataAccessStats.data.length > 0,
          unresolvedSecurityIssues: securityStats.filter(e => !e.is_resolved).length
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuditService();
