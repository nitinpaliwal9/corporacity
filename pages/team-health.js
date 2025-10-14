import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import supabase from '../lib/supabaseClient';

export default function TeamHealth() {
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamHealth, setTeamHealth] = useState({});
  const [wellnessAlerts, setWellnessAlerts] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState({});

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
          await loadTeamHealthData(membership.company_id);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const loadTeamHealthData = async (companyId) => {
    try {
      // Mock team health data
      const mockTeamHealth = {
        overall: {
          score: 78,
          trend: '+5%',
          status: 'good'
        },
        stress: {
          level: 35,
          trend: '-8%',
          status: 'low'
        },
        workLifeBalance: {
          score: 72,
          trend: '+3%',
          status: 'good'
        },
        satisfaction: {
          score: 85,
          trend: '+7%',
          status: 'excellent'
        }
      };

      const mockAlerts = [
        {
          id: 1,
          type: 'burnout',
          severity: 'high',
          member: 'Sarah Chen',
          title: 'High Burnout Risk Detected',
          description: 'Working 12+ hours daily for 5 consecutive days. Immediate intervention recommended.',
          confidence: 89,
          action: 'Schedule Check-in'
        },
        {
          id: 2,
          type: 'stress',
          severity: 'medium',
          member: 'Mike Rodriguez',
          title: 'Elevated Stress Levels',
          description: 'Stress indicators increased 25% this week. Consider workload adjustment.',
          confidence: 76,
          action: 'Review Workload'
        },
        {
          id: 3,
          type: 'engagement',
          severity: 'low',
          member: 'Emily Johnson',
          title: 'Engagement Drop',
          description: 'Participation in team activities decreased. May need recognition or new challenges.',
          confidence: 68,
          action: 'Team Check-in'
        }
      ];

      const mockEngagement = {
        participation: 87,
        collaboration: 92,
        innovation: 78,
        retention: 94
      };

      setTeamHealth(mockTeamHealth);
      setWellnessAlerts(mockAlerts);
      setEngagementMetrics(mockEngagement);
    } catch (error) {
      console.error('Error loading team health data:', error);
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
            <p className="text-gray-600 mb-8">You need to be part of a company to view team health.</p>
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
                  Team Health Monitor
                </h1>
                <p className="text-gray-600 mt-1">AI-powered wellness tracking and engagement insights</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Monitoring Active</span>
                </div>
                <Button 
                  onClick={() => {
                    // In a real app, this would generate and download a team health report
                    alert('Team health report export feature coming soon! This would download a comprehensive wellness report as a PDF.');
                  }}
                  variant="outline" 
                  size="small"
                >
                  Export Report
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
            {/* Overall Health Score */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white text-3xl">💚</span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter value={teamHealth.overall?.score} />%
                  </h2>
                  <p className="text-xl text-gray-600 mb-4">Overall Team Health</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-600 font-semibold">{teamHealth.overall?.trend}</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Health Metrics */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(teamHealth).filter(([key]) => key !== 'overall').map(([key, data], index) => (
                  <Card key={key} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        key === 'stress' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                        key === 'workLifeBalance' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        'bg-gradient-to-br from-emerald-500 to-green-600'
                      }`}>
                        <span className="text-white text-2xl">
                          {key === 'stress' ? '😰' :
                           key === 'workLifeBalance' ? '⚖️' : '😊'}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        <AnimatedCounter value={data.score || data.level} />%
                      </div>
                      <div className="text-sm text-gray-600 capitalize mb-2">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className={`text-sm font-semibold ${
                        data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.trend} vs last month
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Wellness Alerts */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Wellness Alerts</h2>
                <p className="text-gray-600">AI-detected patterns requiring attention</p>
              </div>
              <div className="space-y-4">
                {wellnessAlerts.map((alert, index) => (
                  <Card key={alert.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        alert.severity === 'high' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                        alert.severity === 'medium' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                        'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        <span className="text-white text-xl">
                          {alert.type === 'burnout' ? '⚠️' :
                           alert.type === 'stress' ? '😰' : '📉'}
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
                            {alert.severity} priority
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          <span className="font-medium">{alert.member}:</span> {alert.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Confidence: {alert.confidence}%
                          </div>
                          <Button 
                            onClick={() => {
                              // In a real app, this would take action on the team health alert
                              alert(`Taking action on: ${alert.title}\n\nThis would open a detailed view with specific wellness recommendations and intervention options.`);
                            }}
                            size="small" 
                            variant="outline"
                          >
                            {alert.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Engagement Metrics */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Engagement Metrics</h2>
                <p className="text-gray-600">Team participation and collaboration indicators</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(engagementMetrics).map(([key, value], index) => (
                  <Card key={key} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">
                          {key === 'participation' ? '👥' :
                           key === 'collaboration' ? '🤝' :
                           key === 'innovation' ? '💡' : '💎'}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        <AnimatedCounter value={value} />%
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Wellness Recommendations */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Wellness Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Flexible Hours</h4>
                      <p className="text-sm text-gray-600">Implement flexible working hours to improve work-life balance by 15%</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Mental Health Support</h4>
                      <p className="text-sm text-gray-600">Add mental health resources to reduce stress levels by 20%</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Recognition Program</h4>
                      <p className="text-sm text-gray-600">Implement peer recognition to boost engagement by 12%</p>
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
