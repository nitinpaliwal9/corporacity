import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import SecurityService from '../../lib/securityService';
import AuditService from '../../lib/auditService';
import PrivacyService from '../../lib/privacyService';
import supabase from '../../lib/supabaseClient';

const SecurityDashboard = ({ companyId, userRole }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [complianceReport, setComplianceReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSecurityData();
  }, [companyId]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      const [dashboard, events, recs, compliance] = await Promise.all([
        SecurityService.getSecurityDashboard(companyId, 7),
        SecurityService.getSecurityEvents(companyId, { limit: 20 }),
        SecurityService.getSecurityRecommendations(companyId),
        PrivacyService.getPrivacyComplianceReport(companyId, 
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        )
      ]);

      setDashboardData(dashboard);
      setSecurityEvents(events);
      setRecommendations(recs);
      setComplianceReport(compliance);
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  const resolveSecurityEvent = async (eventId) => {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      await AuditService.resolveSecurityEvent(eventId, currentUser.id, 'Resolved by admin');
      loadSecurityData();
    } catch (error) {
      // Silently handle error
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (userRole !== 'owner' && userRole !== 'admin') {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only administrators can access security information.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
          <p className="text-gray-600">Monitor security events and compliance status</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${getRiskScoreColor(dashboardData?.riskScore || 0)}`}>
              {dashboardData?.riskScore || 0}
            </div>
            <div className="text-sm text-gray-500">Risk Score</div>
          </div>
          <Button
            onClick={loadSecurityData}
            variant="outline"
            size="small"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'events', label: 'Security Events', icon: '🚨' },
            { id: 'recommendations', label: 'Recommendations', icon: '💡' },
            { id: 'compliance', label: 'Compliance', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Security Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.summary.totalSecurityEvents}
                  </p>
                </div>
                <div className="text-2xl">🚨</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed Logins</p>
                  <p className="text-2xl font-bold text-red-600">
                    {dashboardData.summary.failedLogins}
                  </p>
                </div>
                <div className="text-2xl">🔐</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Suspicious Activity</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {dashboardData.summary.suspiciousActivity}
                  </p>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unresolved</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {dashboardData.summary.unresolvedEvents}
                  </p>
                </div>
                <div className="text-2xl">⏳</div>
              </div>
            </Card>
          </div>

          {/* Events by Severity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Severity</h3>
            <div className="space-y-3">
              {Object.entries(dashboardData.eventsBySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(severity)}`}>
                    {severity.toUpperCase()}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Events */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
            <div className="space-y-3">
              {dashboardData.recentEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                      <span className="font-medium text-gray-900">{event.event_type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!event.is_resolved && (
                    <Button
                      onClick={() => resolveSecurityEvent(event.id)}
                      size="small"
                      variant="outline"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Security Events Tab */}
      {activeTab === 'events' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Security Events</h3>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                    <span className="font-semibold text-gray-900">{event.event_type}</span>
                    <span className="text-sm text-gray-500">
                      Risk: {event.risk_score}/100
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.is_resolved ? (
                      <span className="text-green-600 text-sm">✅ Resolved</span>
                    ) : (
                      <Button
                        onClick={() => resolveSecurityEvent(event.id)}
                        size="small"
                        variant="outline"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{event.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>User: {event.user?.full_name || event.user?.email || 'Unknown'}</span>
                  <span>{new Date(event.created_at).toLocaleString()}</span>
                </div>
                {event.metadata && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer">View Details</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{rec.description}</p>
                <p className="text-sm text-gray-600">
                  <strong>Action:</strong> {rec.action}
                </p>
              </div>
            ))}
            {recommendations.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Good!</h3>
                <p className="text-gray-600">No security recommendations at this time.</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && complianceReport && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Compliance Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="font-medium">{complianceReport.privacySettings.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">With Analytics</span>
                    <span className="font-medium">{complianceReport.privacySettings.withAnalytics}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">With Auto-Delete</span>
                    <span className="font-medium">{complianceReport.privacySettings.withAutoDelete}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Data Requests</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Exports</span>
                    <span className="font-medium">{complianceReport.dataRequests.exports}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Deletions</span>
                    <span className="font-medium">{complianceReport.dataRequests.deletions}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className={complianceReport.compliance.hasPrivacySettings ? 'text-green-500' : 'text-red-500'}>
                  {complianceReport.compliance.hasPrivacySettings ? '✅' : '❌'}
                </span>
                <span className="text-gray-700">Privacy Settings Configured</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={complianceReport.compliance.hasRetentionPolicies ? 'text-green-500' : 'text-red-500'}>
                  {complianceReport.compliance.hasRetentionPolicies ? '✅' : '❌'}
                </span>
                <span className="text-gray-700">Data Retention Policies</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={complianceReport.compliance.hasDataRequestHandling ? 'text-green-500' : 'text-red-500'}>
                  {complianceReport.compliance.hasDataRequestHandling ? '✅' : '❌'}
                </span>
                <span className="text-gray-700">Data Request Handling</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={complianceReport.compliance.gdprCompliant ? 'text-green-500' : 'text-red-500'}>
                  {complianceReport.compliance.gdprCompliant ? '✅' : '❌'}
                </span>
                <span className="text-gray-700">GDPR Compliant</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
