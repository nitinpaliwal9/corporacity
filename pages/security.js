import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import supabase from '../lib/supabaseClient';

export default function Security() {
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [securityMetrics, setSecurityMetrics] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [complianceStatus, setComplianceStatus] = useState({});
  const [threatAlerts, setThreatAlerts] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Get user's company
        const { data: membership } = await supabase
          .from('corp_memberships')
          .select('company_id')
          .eq('user_id', user.id)
          .single();
        
        if (membership) {
          setCompanyId(membership.company_id);
          await loadSecurityData(membership.company_id);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const loadSecurityData = async (companyId) => {
    try {
      // Mock security metrics
      const mockSecurityMetrics = {
        overall: {
          score: 94,
          trend: '+2%',
          status: 'excellent'
        },
        dataEncryption: {
          level: 100,
          status: 'active',
          algorithm: 'AES-256'
        },
        accessControl: {
          score: 92,
          mfaEnabled: true,
          sessionTimeout: '8 hours'
        },
        auditTrail: {
          completeness: 98,
          retention: '7 years',
          lastBackup: '2 hours ago'
        }
      };

      const mockAuditLogs = [
        {
          id: 1,
          timestamp: '2024-01-15 14:30:22',
          user: 'John Doe',
          action: 'Status Update',
          resource: 'Team Dashboard',
          ip: '192.168.1.100',
          location: 'New York, US',
          status: 'success',
          risk: 'low'
        },
        {
          id: 2,
          timestamp: '2024-01-15 14:25:15',
          user: 'Sarah Chen',
          action: 'Login',
          resource: 'Authentication',
          ip: '203.45.67.89',
          location: 'San Francisco, US',
          status: 'success',
          risk: 'low'
        },
        {
          id: 3,
          timestamp: '2024-01-15 14:20:08',
          user: 'Mike Rodriguez',
          action: 'Data Export',
          resource: 'Analytics Dashboard',
          ip: '45.78.123.45',
          location: 'London, UK',
          status: 'success',
          risk: 'medium'
        },
        {
          id: 4,
          timestamp: '2024-01-15 14:15:33',
          user: 'Unknown',
          action: 'Failed Login',
          resource: 'Authentication',
          ip: '185.220.101.45',
          location: 'Unknown',
          status: 'failed',
          risk: 'high'
        }
      ];

      const mockComplianceStatus = {
        gdpr: {
          status: 'compliant',
          score: 98,
          lastAudit: '2024-01-10',
          nextAudit: '2024-04-10'
        },
        soc2: {
          status: 'compliant',
          score: 96,
          lastAudit: '2024-01-05',
          nextAudit: '2024-07-05'
        },
        hipaa: {
          status: 'compliant',
          score: 94,
          lastAudit: '2024-01-08',
          nextAudit: '2024-04-08'
        },
        iso27001: {
          status: 'in-progress',
          score: 87,
          lastAudit: '2024-01-12',
          nextAudit: '2024-02-12'
        }
      };

      const mockThreatAlerts = [
        {
          id: 1,
          type: 'suspicious_login',
          severity: 'medium',
          title: 'Unusual Login Pattern Detected',
          description: 'Multiple failed login attempts from IP 185.220.101.45',
          timestamp: '2024-01-15 14:15:33',
          status: 'investigating',
          action: 'IP Blocked'
        },
        {
          id: 2,
          type: 'data_access',
          severity: 'low',
          title: 'Bulk Data Export',
          description: 'Large data export initiated by Mike Rodriguez',
          timestamp: '2024-01-15 14:20:08',
          status: 'approved',
          action: 'Logged'
        },
        {
          id: 3,
          type: 'permission_change',
          severity: 'low',
          title: 'Role Permission Updated',
          description: 'Admin role permissions modified by Sarah Chen',
          timestamp: '2024-01-15 13:45:22',
          status: 'reviewed',
          action: 'Approved'
        }
      ];

      setSecurityMetrics(mockSecurityMetrics);
      setAuditLogs(mockAuditLogs);
      setComplianceStatus(mockComplianceStatus);
      setThreatAlerts(mockThreatAlerts);
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (!user || !companyId) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-8">You need to be part of a company to view security settings.</p>
            <Button href="/create-company">Create Company</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Security & Compliance
                </h1>
                <p className="text-gray-600 mt-1">Enterprise-grade security monitoring and compliance management</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure</span>
                </div>
                <Button 
                  onClick={() => {
                    // In a real app, this would generate and download a security report
                    alert('Security report generation feature coming soon! This would create a comprehensive security audit report with compliance status and recommendations.');
                  }}
                  variant="outline" 
                  size="small"
                >
                  Security Report
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Security Overview */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 bg-gradient-to-br from-white to-green-50 border-0 shadow-xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white text-3xl">🛡️</span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter value={securityMetrics.overall?.score} />%
                  </h2>
                  <p className="text-xl text-gray-600 mb-4">Overall Security Score</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-600 font-semibold">{securityMetrics.overall?.trend}</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Security Metrics */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(securityMetrics).filter(([key]) => key !== 'overall').map(([key, data], index) => (
                  <Card key={key} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        key === 'dataEncryption' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        key === 'accessControl' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                        'bg-gradient-to-br from-emerald-500 to-green-600'
                      }`}>
                        <span className="text-white text-2xl">
                          {key === 'dataEncryption' ? '🔐' :
                           key === 'accessControl' ? '🔑' : '📋'}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        <AnimatedCounter value={data.score || data.level} />%
                      </div>
                      <div className="text-sm text-gray-600 capitalize mb-2">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      {data.algorithm && (
                        <div className="text-xs text-gray-500">{data.algorithm}</div>
                      )}
                      {data.mfaEnabled && (
                        <div className="text-xs text-green-600 font-semibold">MFA Enabled</div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Compliance Status */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Compliance Status</h2>
                <p className="text-gray-600">Regulatory compliance and certification status</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(complianceStatus).map(([standard, data], index) => (
                  <Card key={standard} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        data.status === 'compliant' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        data.status === 'in-progress' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                        'bg-gradient-to-br from-red-500 to-rose-600'
                      }`}>
                        <span className="text-white text-2xl">
                          {data.status === 'compliant' ? '✅' :
                           data.status === 'in-progress' ? '🔄' : '❌'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 uppercase">{standard}</h3>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        <AnimatedCounter value={data.score} />%
                      </div>
                      <div className={`text-sm font-semibold mb-2 ${
                        data.status === 'compliant' ? 'text-green-600' :
                        data.status === 'in-progress' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {data.status}
                      </div>
                      <div className="text-xs text-gray-500">
                        Next audit: {data.nextAudit}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Threat Alerts */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Alerts</h2>
                <p className="text-gray-600">Real-time threat detection and security monitoring</p>
              </div>
              <div className="space-y-4">
                {threatAlerts.map((alert, index) => (
                  <Card key={alert.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        alert.severity === 'high' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                        alert.severity === 'medium' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                        'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        <span className="text-white text-xl">
                          {alert.type === 'suspicious_login' ? '🚨' :
                           alert.type === 'data_access' ? '📊' : '🔧'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity} severity
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {alert.timestamp} • Status: {alert.status}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            Action: {alert.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Audit Logs */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Audit Logs</h2>
                <p className="text-gray-600">Complete audit trail of all system activities</p>
              </div>
              <Card className="p-6 border-0 bg-white/90 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Timestamp</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Resource</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, index) => (
                        <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{log.timestamp}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{log.user}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{log.action}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{log.resource}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{log.location}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              log.status === 'success' ? 'bg-green-100 text-green-800' :
                              log.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              log.risk === 'low' ? 'bg-green-100 text-green-800' :
                              log.risk === 'medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {log.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {/* Security Features */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl">🔒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Security Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Data Encryption</h4>
                      <p className="text-sm text-gray-600">AES-256 encryption at rest and in transit with end-to-end protection</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Access Control</h4>
                      <p className="text-sm text-gray-600">Multi-factor authentication, role-based permissions, and session management</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Audit & Compliance</h4>
                      <p className="text-sm text-gray-600">Complete audit trails, GDPR compliance, and SOC 2 Type II certification</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
