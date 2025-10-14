import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import supabase from '../lib/supabaseClient';

export default function Integrations() {
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState([]);
  const [connectedApps, setConnectedApps] = useState([]);
  const [workflows, setWorkflows] = useState([]);

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
          await loadIntegrationData(membership.company_id);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const loadIntegrationData = async (companyId) => {
    try {
      // Mock integration data
      const mockIntegrations = [
        {
          id: 1,
          name: 'Salesforce',
          category: 'CRM',
          description: 'Sync team status with customer interactions and sales pipeline',
          icon: '☁️',
          status: 'available',
          features: ['Lead tracking', 'Customer status sync', 'Sales analytics'],
          color: 'from-blue-500 to-indigo-600'
        },
        {
          id: 2,
          name: 'Slack',
          category: 'Communication',
          description: 'Automated status updates and team notifications',
          icon: '💬',
          status: 'connected',
          features: ['Status broadcasting', 'Team notifications', 'Channel updates'],
          color: 'from-purple-500 to-violet-600'
        },
        {
          id: 3,
          name: 'Jira',
          category: 'Project Management',
          description: 'Link team availability with project timelines and sprints',
          icon: '🎯',
          status: 'available',
          features: ['Sprint planning', 'Task assignment', 'Progress tracking'],
          color: 'from-blue-500 to-cyan-600'
        },
        {
          id: 4,
          name: 'Microsoft Teams',
          category: 'Communication',
          description: 'Seamless integration with Teams meetings and presence',
          icon: '👥',
          status: 'available',
          features: ['Meeting sync', 'Presence status', 'Calendar integration'],
          color: 'from-indigo-500 to-blue-600'
        },
        {
          id: 5,
          name: 'Asana',
          category: 'Project Management',
          description: 'Connect team status with project milestones and deadlines',
          icon: '📋',
          status: 'available',
          features: ['Project tracking', 'Milestone sync', 'Team coordination'],
          color: 'from-red-500 to-pink-600'
        },
        {
          id: 6,
          name: 'HubSpot',
          category: 'CRM',
          description: 'Integrate team performance with customer success metrics',
          icon: '🎯',
          status: 'available',
          features: ['Customer insights', 'Performance tracking', 'Success metrics'],
          color: 'from-orange-500 to-red-600'
        },
        {
          id: 7,
          name: 'Google Workspace',
          category: 'Productivity',
          description: 'Sync with Google Calendar, Drive, and Gmail for seamless workflow',
          icon: '📧',
          status: 'available',
          features: ['Calendar sync', 'Drive integration', 'Email automation'],
          color: 'from-green-500 to-emerald-600'
        },
        {
          id: 8,
          name: 'Monday.com',
          category: 'Project Management',
          description: 'Connect team status with Monday.com boards and workflows',
          icon: '📊',
          status: 'available',
          features: ['Board updates', 'Workflow automation', 'Progress tracking'],
          color: 'from-pink-500 to-rose-600'
        }
      ];

      const mockConnectedApps = [
        {
          id: 1,
          name: 'Slack',
          status: 'active',
          lastSync: '2 minutes ago',
          dataPoints: 1247,
          icon: '💬',
          color: 'from-purple-500 to-violet-600'
        }
      ];

      const mockWorkflows = [
        {
          id: 1,
          name: 'Daily Status to Slack',
          description: 'Automatically post daily team status updates to #general channel',
          trigger: 'Daily at 9:00 AM',
          status: 'active',
          integrations: ['Slack'],
          executions: 47
        },
        {
          id: 2,
          name: 'Absence Alert to Manager',
          description: 'Notify managers when team members are absent or late',
          trigger: 'Real-time',
          status: 'active',
          integrations: ['Slack', 'Email'],
          executions: 12
        },
        {
          id: 3,
          name: 'Weekly Report Generation',
          description: 'Generate and send weekly team performance reports',
          trigger: 'Every Friday 5:00 PM',
          status: 'active',
          integrations: ['Email', 'Google Drive'],
          executions: 8
        }
      ];

      setIntegrations(mockIntegrations);
      setConnectedApps(mockConnectedApps);
      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Error loading integration data:', error);
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
            <p className="text-gray-600 mb-8">You need to be part of a company to view integrations.</p>
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
                  Enterprise Integrations
                </h1>
                <p className="text-gray-600 mt-1">Connect Corporacity with your favorite tools and automate workflows</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>API Active</span>
                </div>
                <Button variant="outline" size="small">
                  Create Workflow
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
            {/* Connected Apps */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connected Apps</h2>
                <p className="text-gray-600">Currently active integrations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedApps.map((app, index) => (
                  <Card key={app.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-2xl">{app.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{app.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">{app.status}</span>
                        </div>
                        <p className="text-xs text-gray-500">Last sync: {app.lastSync}</p>
                        <p className="text-xs text-gray-500">{app.dataPoints} data points synced</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Available Integrations */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Integrations</h2>
                <p className="text-gray-600">Connect with 50+ popular business tools</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {integrations.map((integration, index) => (
                  <Card key={integration.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm group">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${integration.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <span className="text-white text-2xl">{integration.icon}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                      <div className="text-xs text-blue-600 font-semibold mb-2">{integration.category}</div>
                      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                      <div className="space-y-1 mb-4">
                        {integration.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="text-xs text-gray-500 flex items-center">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                      <Button 
                        size="small" 
                        variant={integration.status === 'connected' ? 'outline' : 'primary'}
                        className="w-full"
                      >
                        {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Automated Workflows */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Automated Workflows</h2>
                <p className="text-gray-600">AI-powered automation to streamline your processes</p>
              </div>
              <div className="space-y-4">
                {workflows.map((workflow, index) => (
                  <Card key={workflow.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">⚡</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{workflow.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Trigger: {workflow.trigger}</span>
                            <span>Executions: {workflow.executions}</span>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 font-medium">{workflow.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {workflow.integrations.map((integration, idx) => (
                            <div key={idx} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-600">{integration.charAt(0)}</span>
                            </div>
                          ))}
                        </div>
                        <Button size="small" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Integration Benefits */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl">🔗</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Integrate?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Seamless Workflow</h4>
                      <p className="text-sm text-gray-600">Eliminate manual data entry and keep all your tools in sync automatically</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Enhanced Productivity</h4>
                      <p className="text-sm text-gray-600">Save 2+ hours per week with automated status updates and notifications</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Better Insights</h4>
                      <p className="text-sm text-gray-600">Combine team data with project metrics for comprehensive business intelligence</p>
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