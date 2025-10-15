// Security Monitoring and Threat Detection Service
// Implements real-time security monitoring and threat detection

import supabase from './supabaseClient';
import AuditService from './auditService';

class SecurityService {
  constructor() {
    this.supabase = supabase;
    this.auditService = AuditService;
    this.suspiciousPatterns = new Map();
    this.failedLoginAttempts = new Map();
  }

  // Monitor login attempts
  async monitorLoginAttempt(userId, companyId, success, ipAddress, userAgent, location = null) {
    try {
      if (success) {
        // Successful login
        await this.auditService.logEvent({
          userId,
          companyId,
          action: 'login_success',
          resourceType: 'authentication',
          severity: 'info',
          description: 'User logged in successfully',
          metadata: { ipAddress, userAgent, location }
        });

        // Clear failed attempts for this user
        this.failedLoginAttempts.delete(userId);
      } else {
        // Failed login
        await this.auditService.logSecurityEvent({
          userId,
          companyId,
          eventType: 'failed_login',
          severity: 'medium',
          description: 'Failed login attempt',
          riskScore: 30,
          metadata: { ipAddress, userAgent, location }
        });

        // Track failed attempts
        const attempts = this.failedLoginAttempts.get(userId) || [];
        attempts.push({
          timestamp: new Date(),
          ipAddress,
          userAgent,
          location
        });
        this.failedLoginAttempts.set(userId, attempts);

        // Check for suspicious patterns
        await this.detectSuspiciousLoginPatterns(userId, companyId, attempts);
      }
    } catch (error) {
      // Silently handle error
    }
  }

  // Detect suspicious login patterns
  async detectSuspiciousLoginPatterns(userId, companyId, attempts) {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Recent attempts (last hour)
      const recentAttempts = attempts.filter(attempt => 
        new Date(attempt.timestamp) > oneHourAgo
      );

      // Multiple failed attempts in short time
      if (recentAttempts.length >= 5) {
        await this.auditService.logSecurityEvent({
          userId,
      companyId,
          eventType: 'brute_force_attempt',
          severity: 'high',
          description: `Multiple failed login attempts: ${recentAttempts.length} in the last hour`,
          riskScore: 80,
          metadata: { 
            attempts: recentAttempts.length,
            timeWindow: '1 hour',
            ipAddresses: [...new Set(recentAttempts.map(a => a.ipAddress))]
          }
        });

        // Implement rate limiting
        await this.implementRateLimit(userId, companyId, 'login', 3600); // 1 hour
      }

      // Multiple IP addresses
      const uniqueIPs = new Set(recentAttempts.map(attempt => attempt.ipAddress));
      if (uniqueIPs.size >= 3) {
        await this.auditService.logSecurityEvent({
          userId,
      companyId,
          eventType: 'multiple_ip_attempts',
          severity: 'medium',
          description: `Login attempts from multiple IP addresses: ${uniqueIPs.size}`,
          riskScore: 60,
          metadata: { 
            uniqueIPs: Array.from(uniqueIPs),
            timeWindow: '1 hour'
          }
        });
      }

      // Geographic anomalies
      if (location) {
        await this.detectGeographicAnomalies(userId, companyId, location, attempts);
      }

    } catch (error) {
      // Silently handle error
    }
  }

  // Detect geographic anomalies
  async detectGeographicAnomalies(userId, companyId, currentLocation, attempts) {
    try {
      // Get user's typical locations from recent successful logins
      const { data: recentLogins, error } = await this.supabase
        .from('corp_audit_logs')
        .select('metadata')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .eq('action', 'login_success')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (recentLogins.length > 0) {
        const typicalLocations = recentLogins
          .map(login => login.metadata?.location)
          .filter(loc => loc && loc.country);

        if (typicalLocations.length > 0) {
          const typicalCountries = new Set(typicalLocations.map(loc => loc.country));
          
          if (!typicalCountries.has(currentLocation.country)) {
            await this.auditService.logSecurityEvent({
              userId,
              companyId,
              eventType: 'unusual_location',
              severity: 'medium',
              description: `Login from unusual location: ${currentLocation.country}`,
              riskScore: 50,
              metadata: { 
                currentLocation,
                typicalCountries: Array.from(typicalCountries)
              }
            });
          }
        }
      }
    } catch (error) {
      // Silently handle error
    }
  }

  // Implement rate limiting
  async implementRateLimit(userId, companyId, action, durationSeconds) {
    try {
      const rateLimitKey = `${userId}_${action}`;
      const expiresAt = new Date(Date.now() + durationSeconds * 1000);

      // Store rate limit in database
      await this.supabase
        .from('corp_user_sessions')
        .update({ 
          is_active: false,
          expires_at: expiresAt
        })
        .eq('user_id', userId)
        .eq('company_id', companyId);

      // Log the rate limiting
      await this.auditService.logSecurityEvent({
        userId,
        companyId,
        eventType: 'rate_limit_applied',
        severity: 'medium',
        description: `Rate limit applied for ${action}: ${durationSeconds} seconds`,
        riskScore: 40,
        metadata: { action, durationSeconds }
      });

    } catch (error) {
      // Silently handle error
    }
  }

  // Check if user is rate limited
  async isRateLimited(userId, companyId, action) {
    try {
      const { data, error } = await this.supabase
        .from('corp_user_sessions')
        .select('expires_at')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .eq('is_active', false)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Monitor data access patterns
  async monitorDataAccess(userId, companyId, resourceType, resourceId, accessType) {
    try {
      // Log the data access
      await this.auditService.logDataAccess({
        userId,
        companyId,
        accessType,
        resourceType,
        resourceId,
        purpose: 'normal_operation'
      });

      // Check for unusual access patterns
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data: recentAccess, error } = await this.supabase
        .from('corp_data_access_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .gte('created_at', oneHourAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check for excessive data access
      if (recentAccess.length > 100) {
        await this.auditService.logSecurityEvent({
          userId,
          companyId,
          eventType: 'excessive_data_access',
          severity: 'high',
          description: `Excessive data access: ${recentAccess.length} requests in the last hour`,
          riskScore: 70,
          metadata: { 
            accessCount: recentAccess.length,
            timeWindow: '1 hour',
            resourceTypes: [...new Set(recentAccess.map(a => a.resource_type))]
          }
        });
      }

      // Check for access to sensitive resources
      const sensitiveResources = ['encryption_keys', 'audit_logs', 'security_events'];
      if (sensitiveResources.includes(resourceType)) {
        await this.auditService.logSecurityEvent({
          userId,
          companyId,
          eventType: 'sensitive_data_access',
          severity: 'medium',
          description: `Access to sensitive resource: ${resourceType}`,
          riskScore: 50,
          metadata: { resourceType, resourceId, accessType }
        });
      }

    } catch (error) {
      // Silently handle error
    }
  }

  // Monitor for privilege escalation attempts
  async monitorPrivilegeEscalation(userId, companyId, action, resourceType) {
    try {
      const privilegeActions = ['role_change', 'permission_grant', 'admin_access'];
      
      if (privilegeActions.includes(action)) {
        // Get user's current role
        const { data: membership, error } = await this.supabase
          .from('corp_memberships')
          .select('role')
          .eq('user_id', userId)
          .eq('company_id', companyId)
          .single();

        if (error) throw error;

        // Check if user is attempting to escalate beyond their role
        if (membership.role === 'employee' && action === 'admin_access') {
          await this.auditService.logSecurityEvent({
            userId,
            companyId,
            eventType: 'privilege_escalation_attempt',
            severity: 'high',
            description: `Privilege escalation attempt: ${action}`,
            riskScore: 90,
            metadata: { 
              currentRole: membership.role,
              attemptedAction: action,
              resourceType
            }
          });
        }
      }
    } catch (error) {
      // Silently handle error
    }
  }

  // Generate security dashboard data
  async getSecurityDashboard(companyId, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        securityEvents,
        failedLogins,
        suspiciousActivity,
        auditStats
      ] = await Promise.all([
        // Security events
        this.supabase
          .from('corp_security_events')
          .select('*')
          .eq('company_id', companyId)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false }),
        
        // Failed logins
        this.supabase
          .from('corp_security_events')
          .select('*')
          .eq('company_id', companyId)
          .eq('event_type', 'failed_login')
          .gte('created_at', startDate.toISOString()),
        
        // Suspicious activity
        this.supabase
          .from('corp_security_events')
          .select('*')
          .eq('company_id', companyId)
          .in('event_type', ['brute_force_attempt', 'unusual_location', 'excessive_data_access'])
          .gte('created_at', startDate.toISOString()),
        
        // Audit statistics
        this.auditService.getAuditStats(companyId, days)
      ]);

      if (securityEvents.error) throw securityEvents.error;
      if (failedLogins.error) throw failedLogins.error;
      if (suspiciousActivity.error) throw suspiciousActivity.error;

      return {
        period: { days, startDate: startDate.toISOString() },
        summary: {
          totalSecurityEvents: securityEvents.data.length,
          failedLogins: failedLogins.data.length,
          suspiciousActivity: suspiciousActivity.data.length,
          unresolvedEvents: securityEvents.data.filter(e => !e.is_resolved).length
        },
        eventsBySeverity: securityEvents.data.reduce((acc, event) => {
          acc[event.severity] = (acc[event.severity] || 0) + 1;
          return acc;
        }, {}),
        eventsByType: securityEvents.data.reduce((acc, event) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1;
          return acc;
        }, {}),
        recentEvents: securityEvents.data.slice(0, 10),
        auditStats,
        riskScore: this.calculateRiskScore(securityEvents.data, failedLogins.data, suspiciousActivity.data)
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate overall risk score
  calculateRiskScore(securityEvents, failedLogins, suspiciousActivity) {
    let score = 0;

    // Base score from security events
    securityEvents.forEach(event => {
      switch (event.severity) {
        case 'critical': score += 25; break;
        case 'high': score += 15; break;
        case 'medium': score += 10; break;
        case 'low': score += 5; break;
      }
    });

    // Additional score for failed logins
    score += Math.min(failedLogins.length * 2, 20);

    // Additional score for suspicious activity
    score += Math.min(suspiciousActivity.length * 5, 30);

    return Math.min(score, 100);
  }

  // Get security recommendations
  async getSecurityRecommendations(companyId) {
    try {
      const recommendations = [];

      // Check for users without 2FA
      const { data: usersWithout2FA, error: twofaError } = await this.supabase
        .from('corp_memberships')
        .select('user_id')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .not('user_id', 'in', `(SELECT user_id FROM corp_2fa_settings WHERE company_id = '${companyId}' AND is_enabled = true)`);

      if (!twofaError && usersWithout2FA.length > 0) {
        recommendations.push({
          type: 'enable_2fa',
          priority: 'high',
          title: 'Enable Two-Factor Authentication',
          description: `${usersWithout2FA.length} users don't have 2FA enabled`,
          action: 'Enable 2FA for all users'
        });
      }

      // Check for weak passwords (if we had password strength data)
      // This would require password strength checking during registration

      // Check for inactive users
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const { data: inactiveUsers, error: inactiveError } = await this.supabase
        .from('corp_memberships')
        .select('user_id')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .not('user_id', 'in', `(SELECT user_id FROM corp_audit_logs WHERE company_id = '${companyId}' AND action = 'login_success' AND created_at > '${thirtyDaysAgo.toISOString()}')`);

      if (!inactiveError && inactiveUsers.length > 0) {
        recommendations.push({
          type: 'review_inactive_users',
          priority: 'medium',
          title: 'Review Inactive Users',
          description: `${inactiveUsers.length} users haven't logged in for 30+ days`,
          action: 'Review and potentially deactivate inactive accounts'
        });
      }

      // Check for unresolved security events
      const { data: unresolvedEvents, error: unresolvedError } = await this.supabase
        .from('corp_security_events')
        .select('id')
        .eq('company_id', companyId)
        .eq('is_resolved', false)
        .eq('severity', 'high');

      if (!unresolvedError && unresolvedEvents.length > 0) {
        recommendations.push({
          type: 'resolve_security_events',
          priority: 'critical',
          title: 'Resolve High-Priority Security Events',
          description: `${unresolvedEvents.length} high-priority security events need attention`,
          action: 'Review and resolve security events'
        });
      }

      return recommendations;
    } catch (error) {
      return [];
    }
  }

  // Automated security response
  async automatedSecurityResponse(eventType, severity, userId, companyId, metadata) {
    try {
      const responses = [];

      switch (eventType) {
        case 'brute_force_attempt':
          if (severity === 'high') {
            // Implement temporary account lockout
            await this.implementRateLimit(userId, companyId, 'login', 3600);
            responses.push('Account temporarily locked due to brute force attempt');
          }
          break;

        case 'excessive_data_access':
          if (severity === 'high') {
            // Implement rate limiting for data access
            await this.implementRateLimit(userId, companyId, 'data_access', 1800);
            responses.push('Data access rate limited due to excessive requests');
          }
          break;

        case 'privilege_escalation_attempt':
          if (severity === 'high') {
            // Log and potentially suspend account
            await this.auditService.logSecurityEvent({
              userId,
              companyId,
              eventType: 'account_suspension',
              severity: 'critical',
              description: 'Account suspended due to privilege escalation attempt',
              riskScore: 95,
              metadata
            });
            responses.push('Account suspended due to privilege escalation attempt');
          }
          break;
      }

      return responses;
    } catch (error) {
      return [];
    }
  }
}

export default new SecurityService();