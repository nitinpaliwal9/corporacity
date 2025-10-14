import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import supabase from '../lib/supabaseClient';

export default function Analytics() {
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);

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
          await loadAnalytics(membership.company_id);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const loadAnalytics = async (companyId) => {
    try {
      // Simulate AI-powered analytics data
      const mockAnalytics = {
        productivity: {
          current: 87,
          trend: '+12%',
          prediction: 92
        },
        engagement: {
          current: 78,
          trend: '+8%',
          prediction: 85
        },
        attendance: {
          current: 94,
          trend: '+3%',
          prediction: 96
        },
        burnoutRisk: {
          current: 15,
          trend: '-5%',
          prediction: 12
        }
      };

      const mockInsights = [
        {
          id: 1,
          type: 'productivity',
          title: 'Peak Performance Window Identified',
          description: 'Your team shows 23% higher productivity between 9-11 AM. Consider scheduling critical tasks during this window.',
          impact: 'high',
          confidence: 94,
          icon: '⚡',
          color: 'emerald'
        },
        {
          id: 2,
          type: 'engagement',
          title: 'Friday Afternoon Engagement Drop',
          description: 'Team engagement decreases by 18% after 2 PM on Fridays. Consider lighter workload or team activities.',
          impact: 'medium',
          confidence: 87,
          icon: '📉',
          color: 'amber'
        },
        {
          id: 3,
          type: 'burnout',
          title: 'Sarah Chen Shows Burnout Risk',
          description: 'Pattern analysis indicates 78% burnout risk for Sarah. Recommend workload adjustment and check-in.',
          impact: 'high',
          confidence: 78,
          icon: '⚠️',
          color: 'red'
        },
        {
          id: 4,
          type: 'optimization',
          title: 'Meeting Optimization Opportunity',
          description: 'Reducing meeting frequency by 20% could increase productivity by 15% based on current patterns.',
          impact: 'medium',
          confidence: 82,
          icon: '🎯',
          color: 'blue'
        }
      ];

      const mockPredictions = [
        {
          id: 1,
          metric: 'Productivity',
          current: 87,
          predicted: 92,
          timeframe: 'Next 30 days',
          confidence: 89,
          factors: ['Improved scheduling', 'Reduced burnout risk', 'Better engagement']
        },
        {
          id: 2,
          metric: 'Team Retention',
          current: 94,
          predicted: 97,
          timeframe: 'Next quarter',
          confidence: 76,
          factors: ['Wellness initiatives', 'Workload balance', 'Recognition programs']
        },
        {
          id: 3,
          metric: 'Project Delivery',
          current: 78,
          predicted: 85,
          timeframe: 'Next sprint',
          confidence: 83,
          factors: ['Resource optimization', 'Timeline adjustments', 'Team alignment']
        }
      ];

      setAnalytics(mockAnalytics);
      setInsights(mockInsights);
      setPredictions(mockPredictions);
    } catch (error) {
      console.error('Error loading analytics:', error);
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
            <p className="text-gray-600 mb-8">You need to be part of a company to view analytics.</p>
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
                  AI Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Strategic insights powered by artificial intelligence</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>AI Active</span>
                </div>
                <Button variant="outline" size="small">
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
            {/* Key Metrics */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analytics && Object.entries(analytics).map(([key, data], index) => (
                  <Card key={key} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        key === 'productivity' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                        key === 'engagement' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        key === 'attendance' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                        'bg-gradient-to-br from-rose-500 to-pink-600'
                      }`}>
                        <span className="text-white text-xl">
                          {key === 'productivity' ? '⚡' :
                           key === 'engagement' ? '👥' :
                           key === 'attendance' ? '📊' : '⚠️'}
                        </span>
                      </div>
                      <div className={`text-sm font-semibold ${
                        data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.trend}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      <AnimatedCounter value={data.current} />%
                    </div>
                    <div className="text-sm text-gray-600 capitalize mb-3">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Predicted: {data.prediction}% next month
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Insights</h2>
                <p className="text-gray-600">Strategic recommendations based on team behavior analysis</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <Card key={insight.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm group">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        insight.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                        insight.color === 'amber' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                        insight.color === 'red' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                        'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        <span className="text-white text-xl">{insight.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                            insight.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {insight.impact} impact
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Confidence: {insight.confidence}%
                          </div>
                          <Button size="small" variant="outline">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Predictive Analytics */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Predictive Analytics</h2>
                <p className="text-gray-600">AI-powered forecasts for strategic planning</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {predictions.map((prediction, index) => (
                  <Card key={prediction.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{prediction.metric}</h3>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        <AnimatedCounter value={prediction.current} />%
                      </div>
                      <div className="text-sm text-gray-600">Current</div>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        <AnimatedCounter value={prediction.predicted} />%
                      </div>
                      <div className="text-sm text-gray-600">Predicted</div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-xs text-gray-500 text-center">
                        {prediction.timeframe} • {prediction.confidence}% confidence
                      </div>
                      <div className="space-y-1">
                        {prediction.factors.map((factor, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}