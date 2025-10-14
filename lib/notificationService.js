// lib/notificationService.js - Notification service for sending notifications
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

export class NotificationService {
  // Create a notification for a specific user
  static async createUserNotification(companyId, userId, type, title, message, data = {}) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return null
      
      const { data: notification, error } = await supabaseAdmin
        .from('corp_notifications')
        .insert([{
          company_id: companyId,
          user_id: userId,
          type,
          title,
          message,
          data
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating user notification:', error)
        return null
      }

      return notification
    } catch (err) {
      console.error('Error creating user notification:', err)
      return null
    }
  }

  // Create a company-wide notification
  static async createCompanyNotification(companyId, type, title, message, data = {}) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return null
      
      const { data: notification, error } = await supabaseAdmin
        .from('corp_notifications')
        .insert([{
          company_id: companyId,
          user_id: null, // null means company-wide
          type,
          title,
          message,
          data
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating company notification:', error)
        return null
      }

      return notification
    } catch (err) {
      console.error('Error creating company notification:', err)
      return null
    }
  }

  // Send notification when someone joins the company
  static async notifyJoinRequest(companyId, userId, userName) {
    return await this.createCompanyNotification(
      companyId,
      'join_request',
      'New Join Request',
      `${userName} has requested to join your company`,
      { user_id: userId, user_name: userName }
    )
  }

  // Send notification when join request is approved
  static async notifyJoinApproved(companyId, userId, userName) {
    return await this.createUserNotification(
      companyId,
      userId,
      'approval',
      'Join Request Approved',
      `Welcome to the team! Your request to join has been approved.`,
      { user_name: userName }
    )
  }

  // Send notification when someone updates their status
  static async notifyStatusUpdate(companyId, userId, userName, statusType) {
    const statusLabels = {
      present: 'Present',
      late: 'Late',
      leave: 'On Leave',
      visit: 'On Visit'
    }

    return await this.createCompanyNotification(
      companyId,
      'status_update',
      'Status Update',
      `${userName} is now ${statusLabels[statusType] || statusType}`,
      { user_id: userId, user_name: userName, status_type: statusType }
    )
  }

  // Send reminder notification
  static async sendReminder(companyId, userId, message) {
    return await this.createUserNotification(
      companyId,
      userId,
      'reminder',
      'Reminder',
      message
    )
  }

  // Send company-wide announcement
  static async sendAnnouncement(companyId, title, message) {
    return await this.createCompanyNotification(
      companyId,
      'announcement',
      title,
      message
    )
  }

  // Send system notification
  static async sendSystemNotification(companyId, title, message, data = {}) {
    return await this.createCompanyNotification(
      companyId,
      'system',
      title,
      message,
      data
    )
  }

  // Get notifications for a user
  static async getUserNotifications(userId, companyId, limit = 20) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return []
      
      const { data, error } = await supabaseAdmin
        .from('corp_notifications')
        .select('*')
        .eq('company_id', companyId)
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error getting user notifications:', error)
        return []
      }

      return data || []
    } catch (err) {
      console.error('Error getting user notifications:', err)
      return []
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return false
      
      const { error } = await supabaseAdmin
        .from('corp_notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) {
        console.error('Error marking notification as read:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Error marking notification as read:', err)
      return false
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId, companyId) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return false
      
      const { error } = await supabaseAdmin
        .from('corp_notifications')
        .update({ read: true })
        .eq('company_id', companyId)
        .or(`user_id.eq.${userId},user_id.is.null`)
        .eq('read', false)

      if (error) {
        console.error('Error marking all notifications as read:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      return false
    }
  }

  // Get unread count for a user
  static async getUnreadCount(userId, companyId) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      if (!supabaseAdmin) return 0
      
      const { count, error } = await supabaseAdmin
        .from('corp_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .or(`user_id.eq.${userId},user_id.is.null`)
        .eq('read', false)

      if (error) {
        console.error('Error getting unread count:', error)
        return 0
      }

      return count || 0
    } catch (err) {
      console.error('Error getting unread count:', err)
      return 0
    }
  }
}
