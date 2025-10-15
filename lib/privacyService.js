// Privacy Management Service
// Implements GDPR compliance and user privacy controls

import supabase from './supabaseClient';
import AuditService from './auditService';

class PrivacyService {
  constructor() {
    this.supabase = supabase;
    this.auditService = AuditService;
  }

  // Get user privacy settings
  async getPrivacySettings(userId, companyId) {
    try {
      const { data, error } = await this.supabase
        .from('corp_privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      // Return default settings if none exist
      if (!data) {
        return this.getDefaultPrivacySettings();
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update user privacy settings
  async updatePrivacySettings(userId, companyId, settings) {
    try {
      const { data, error } = await this.supabase
        .from('corp_privacy_settings')
        .upsert({
          user_id: userId,
          company_id: companyId,
          ...settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,company_id'
        })
        .select()
        .single();

      if (error) throw error;

      // Log the privacy settings change
      await this.auditService.logEvent({
        userId,
        companyId,
        action: 'privacy_settings_updated',
        resourceType: 'privacy_settings',
        resourceId: data.id,
        newValues: settings,
        severity: 'info',
        description: 'User privacy settings updated'
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get default privacy settings
  getDefaultPrivacySettings() {
    return {
      data_collection_level: 'basic',
      allow_analytics: true,
      allow_location_tracking: false,
      allow_behavior_tracking: false,
      allow_ai_insights: true,
      data_retention_days: 365,
      auto_delete_data: false,
      share_data_with_third_parties: false,
      marketing_communications: false
    };
  }

  // Check if user has consented to specific data collection
  async hasConsent(userId, companyId, consentType) {
    try {
      const settings = await this.getPrivacySettings(userId, companyId);
      
      switch (consentType) {
        case 'analytics':
          return settings.allow_analytics;
        case 'location':
          return settings.allow_location_tracking;
        case 'behavior':
          return settings.allow_behavior_tracking;
        case 'ai_insights':
          return settings.allow_ai_insights;
        case 'third_party':
          return settings.share_data_with_third_parties;
        case 'marketing':
          return settings.marketing_communications;
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Request data export (GDPR Article 20)
  async requestDataExport(userId, companyId, requestedBy) {
    try {
      // Log the data export request
      await this.auditService.logDataAccess({
        userId,
        companyId,
        accessType: 'export',
        resourceType: 'user_data',
        purpose: 'GDPR data portability request'
      });

      // Collect all user data
      const userData = await this.collectUserData(userId, companyId);

      // Log the successful export
      await this.auditService.logEvent({
        userId,
        companyId,
        action: 'data_export_completed',
        resourceType: 'user_data',
        severity: 'info',
        description: 'User data export completed',
        metadata: { 
          exportedBy: requestedBy,
          dataSize: JSON.stringify(userData).length,
          dataTypes: Object.keys(userData)
        }
      });

      return userData;
    } catch (error) {
      throw error;
    }
  }

  // Collect all user data for export
  async collectUserData(userId, companyId) {
    try {
      const [
        profile,
        memberships,
        statuses,
        announcements,
        chatMessages,
        auditLogs,
        dataAccessLogs,
        privacySettings
      ] = await Promise.all([
        // User profile
        this.supabase
          .from('corp_profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        
        // Company memberships
        this.supabase
          .from('corp_memberships')
          .select('*')
          .eq('user_id', userId),
        
        // Status updates
        this.supabase
          .from('corp_statuses')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId),
        
        // Announcements (only those targeted to user)
        this.supabase
          .from('corp_announcements')
          .select('*')
          .eq('company_id', companyId)
          .or(`target_audience.eq.all,target_users.cs.{${userId}}`),
        
        // Chat messages
        this.supabase
          .from('corp_chat_messages')
          .select('*')
          .eq('sender_id', userId),
        
        // Audit logs
        this.supabase
          .from('corp_audit_logs')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId),
        
        // Data access logs
        this.supabase
          .from('corp_data_access_logs')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId),
        
        // Privacy settings
        this.supabase
          .from('corp_privacy_settings')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId)
      ]);

      return {
        profile: profile.data,
        memberships: memberships.data,
        statuses: statuses.data,
        announcements: announcements.data,
        chatMessages: chatMessages.data,
        auditLogs: auditLogs.data,
        dataAccessLogs: dataAccessLogs.data,
        privacySettings: privacySettings.data,
        exportDate: new Date().toISOString(),
        exportVersion: '1.0'
      };
    } catch (error) {
      throw error;
    }
  }

  // Request data deletion (GDPR Article 17)
  async requestDataDeletion(userId, companyId, requestedBy, reason = 'user_request') {
    try {
      // Check if user has auto-delete enabled
      const privacySettings = await this.getPrivacySettings(userId, companyId);
      
      if (!privacySettings.auto_delete_data && reason === 'user_request') {
        // Log the deletion request but don't auto-delete
        await this.auditService.logEvent({
          userId,
          companyId,
          action: 'data_deletion_requested',
          resourceType: 'user_data',
          severity: 'warning',
          description: 'User requested data deletion',
          metadata: { reason, requestedBy }
        });

        return { status: 'requested', message: 'Data deletion request logged. Manual review required.' };
      }

      // Proceed with deletion
      const deletedData = await this.deleteUserData(userId, companyId, reason);

      // Log the deletion
      await this.auditService.logEvent({
        userId,
        companyId,
        action: 'data_deletion_completed',
        resourceType: 'user_data',
        severity: 'critical',
        description: 'User data deletion completed',
        metadata: { 
          reason, 
          requestedBy,
          deletedRecords: deletedData
        }
      });

      return { status: 'completed', deletedRecords: deletedData };
    } catch (error) {
      throw error;
    }
  }

  // Delete user data
  async deleteUserData(userId, companyId, reason) {
    try {
      const deletedRecords = {};

      // Delete status updates
      const { data: statuses, error: statusError } = await this.supabase
        .from('corp_statuses')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .select('id');

      if (statusError) throw statusError;
      deletedRecords.statuses = statuses.length;

      // Delete chat messages (soft delete)
      const { data: messages, error: messageError } = await this.supabase
        .from('corp_chat_messages')
        .update({ 
          is_deleted: true, 
          deleted_at: new Date().toISOString(),
          message: '[Message deleted]'
        })
        .eq('sender_id', userId)
        .select('id');

      if (messageError) throw messageError;
      deletedRecords.chatMessages = messages.length;

      // Delete privacy settings
      const { data: privacy, error: privacyError } = await this.supabase
        .from('corp_privacy_settings')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .select('id');

      if (privacyError) throw privacyError;
      deletedRecords.privacySettings = privacy.length;

      // Delete user sessions
      const { data: sessions, error: sessionError } = await this.supabase
        .from('corp_user_sessions')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .select('id');

      if (sessionError) throw sessionError;
      deletedRecords.sessions = sessions.length;

      // Delete 2FA settings
      const { data: twofa, error: twofaError } = await this.supabase
        .from('corp_2fa_settings')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .select('id');

      if (twofaError) throw twofaError;
      deletedRecords.twofaSettings = twofa.length;

      // Note: We don't delete audit logs, data access logs, or memberships
      // as these may be required for legal/compliance reasons

      return deletedRecords;
    } catch (error) {
      throw error;
    }
  }

  // Get data retention policies
  async getDataRetentionPolicies(companyId) {
    try {
      const { data, error } = await this.supabase
        .from('corp_data_retention_policies')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  // Update data retention policy
  async updateDataRetentionPolicy(companyId, dataType, retentionDays, autoDelete, updatedBy) {
    try {
      const { data, error } = await this.supabase
        .from('corp_data_retention_policies')
        .upsert({
          company_id: companyId,
          data_type: dataType,
          retention_days: retentionDays,
          auto_delete: autoDelete,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'company_id,data_type'
        })
        .select()
        .single();

      if (error) throw error;

      // Log the policy update
      await this.auditService.logEvent({
        userId: updatedBy,
        companyId,
        action: 'data_retention_policy_updated',
        resourceType: 'data_retention_policy',
        resourceId: data.id,
        newValues: { dataType, retentionDays, autoDelete },
        severity: 'info',
        description: `Data retention policy updated for ${dataType}`
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Process data retention (cleanup old data)
  async processDataRetention(companyId, dataType) {
    try {
      const policy = await this.supabase
        .from('corp_data_retention_policies')
        .select('*')
        .eq('company_id', companyId)
        .eq('data_type', dataType)
        .single();

      if (policy.error) throw policy.error;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - policy.data.retention_days);

      let deletedCount = 0;

      switch (dataType) {
        case 'status_updates':
          const { data: statuses, error: statusError } = await this.supabase
            .from('corp_statuses')
            .delete()
            .eq('company_id', companyId)
            .lt('created_at', cutoffDate.toISOString())
            .select('id');

          if (statusError) throw statusError;
          deletedCount = statuses.length;
          break;

        case 'chat_messages':
          const { data: messages, error: messageError } = await this.supabase
            .from('corp_chat_messages')
            .delete()
            .lt('created_at', cutoffDate.toISOString())
            .select('id');

          if (messageError) throw messageError;
          deletedCount = messages.length;
          break;

        case 'announcements':
          const { data: announcements, error: announcementError } = await this.supabase
            .from('corp_announcements')
            .update({ is_active: false })
            .eq('company_id', companyId)
            .lt('created_at', cutoffDate.toISOString())
            .select('id');

          if (announcementError) throw announcementError;
          deletedCount = announcements.length;
          break;
      }

      // Log the retention processing
      await this.auditService.logEvent({
        userId: null, // System action
        companyId,
        action: 'data_retention_processed',
        resourceType: 'data_retention',
        severity: 'info',
        description: `Data retention processed for ${dataType}: ${deletedCount} records`,
        metadata: { 
          dataType, 
          retentionDays: policy.data.retention_days,
          deletedCount,
          cutoffDate: cutoffDate.toISOString()
        }
      });

      return deletedCount;
    } catch (error) {
      throw error;
    }
  }

  // Get privacy compliance report
  async getPrivacyComplianceReport(companyId, startDate, endDate) {
    try {
      const [
        privacySettings,
        dataExports,
        dataDeletions,
        retentionPolicies
      ] = await Promise.all([
        // Privacy settings
        this.supabase
          .from('corp_privacy_settings')
          .select('*')
          .eq('company_id', companyId),
        
        // Data export requests
        this.supabase
          .from('corp_audit_logs')
          .select('*')
          .eq('company_id', companyId)
          .eq('action', 'data_export_completed')
          .gte('created_at', startDate)
          .lte('created_at', endDate),
        
        // Data deletion requests
        this.supabase
          .from('corp_audit_logs')
          .select('*')
          .eq('company_id', companyId)
          .eq('action', 'data_deletion_completed')
          .gte('created_at', startDate)
          .lte('created_at', endDate),
        
        // Data retention policies
        this.supabase
          .from('corp_data_retention_policies')
          .select('*')
          .eq('company_id', companyId)
      ]);

      if (privacySettings.error) throw privacySettings.error;
      if (dataExports.error) throw dataExports.error;
      if (dataDeletions.error) throw dataDeletions.error;
      if (retentionPolicies.error) throw retentionPolicies.error;

      return {
        period: { startDate, endDate },
        privacySettings: {
          total: privacySettings.data.length,
          withAnalytics: privacySettings.data.filter(s => s.allow_analytics).length,
          withLocationTracking: privacySettings.data.filter(s => s.allow_location_tracking).length,
          withBehaviorTracking: privacySettings.data.filter(s => s.allow_behavior_tracking).length,
          withAutoDelete: privacySettings.data.filter(s => s.auto_delete_data).length
        },
        dataRequests: {
          exports: dataExports.data.length,
          deletions: dataDeletions.data.length
        },
        retentionPolicies: retentionPolicies.data,
        compliance: {
          hasPrivacySettings: privacySettings.data.length > 0,
          hasRetentionPolicies: retentionPolicies.data.length > 0,
          hasDataRequestHandling: (dataExports.data.length + dataDeletions.data.length) > 0,
          gdprCompliant: privacySettings.data.length > 0 && retentionPolicies.data.length > 0
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate privacy compliance
  async validatePrivacyCompliance(companyId) {
    try {
      const issues = [];

      // Check if privacy settings exist for all users
      const { data: memberships, error: membershipsError } = await this.supabase
        .from('corp_memberships')
        .select('user_id')
        .eq('company_id', companyId)
        .eq('is_active', true);

      if (membershipsError) throw membershipsError;

      const { data: privacySettings, error: privacyError } = await this.supabase
        .from('corp_privacy_settings')
        .select('user_id')
        .eq('company_id', companyId);

      if (privacyError) throw privacyError;

      const usersWithPrivacySettings = new Set(privacySettings.map(s => s.user_id));
      const usersWithoutSettings = memberships.filter(m => !usersWithPrivacySettings.has(m.user_id));

      if (usersWithoutSettings.length > 0) {
        issues.push({
          type: 'missing_privacy_settings',
          severity: 'high',
          description: `${usersWithoutSettings.length} users without privacy settings`,
          affectedUsers: usersWithoutSettings.length
        });
      }

      // Check data retention policies
      const { data: retentionPolicies, error: retentionError } = await this.supabase
        .from('corp_data_retention_policies')
        .select('data_type')
        .eq('company_id', companyId);

      if (retentionError) throw retentionError;

      const requiredPolicies = ['status_updates', 'chat_messages', 'announcements'];
      const existingPolicies = new Set(retentionPolicies.map(p => p.data_type));
      const missingPolicies = requiredPolicies.filter(p => !existingPolicies.has(p));

      if (missingPolicies.length > 0) {
        issues.push({
          type: 'missing_retention_policies',
          severity: 'medium',
          description: `Missing data retention policies: ${missingPolicies.join(', ')}`,
          missingPolicies
        });
      }

      return {
        isCompliant: issues.length === 0,
        issues,
        score: Math.max(0, 100 - (issues.length * 20)) // Simple scoring
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new PrivacyService();
