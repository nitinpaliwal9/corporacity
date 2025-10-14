import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import supabase from '../lib/supabaseClient';

export default function Schedule() {
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [teamAvailability, setTeamAvailability] = useState({});

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
          await loadScheduleData(membership.company_id);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const loadScheduleData = async (companyId) => {
    try {
      // Mock AI-powered scheduling data
      const mockSchedules = [
        {
          id: 1,
          title: 'Weekly Team Sync',
          time: '10:00 AM',
          duration: 60,
          participants: ['John Doe', 'Sarah Chen', 'Mike Rodriguez'],
          aiScore: 92,
          reason: 'Optimal energy levels and availability',
          type: 'recurring'
        },
        {
          id: 2,
          title: 'Project Review',
          time: '2:00 PM',
          duration: 90,
          participants: ['Sarah Chen', 'Emily Johnson', 'Alex Kim'],
          aiScore: 78,
          reason: 'Good focus time, but consider morning slot',
          type: 'one-time'
        },
        {
          id: 3,
          title: 'Client Meeting',
          time: '11:30 AM',
          duration: 45,
          participants: ['John Doe', 'Sarah Chen'],
          aiScore: 95,
          reason: 'Peak productivity window identified',
          type: 'external'
        }
      ];

      const mockRecommendations = [
        {
          id: 1,
          type: 'optimization',
          title: 'Reschedule Friday Afternoon Meetings',
          description: 'Move 3 PM meetings to 10 AM for 23% better engagement',
          impact: 'high',
          confidence: 89,
          action: 'Reschedule'
        },
        {
          id: 2,
          type: 'wellness',
          title: 'Add Buffer Time Between Meetings',
          description: 'Current back-to-back meetings reduce productivity by 15%',
          impact: 'medium',
          confidence: 76,
          action: 'Add Buffers'
        },
        {
          id: 3,
          type: 'efficiency',
          title: 'Optimize Meeting Duration',
          description: 'Reduce meeting length by 15 minutes for 20% better focus',
          impact: 'medium',
          confidence: 82,
          action: 'Optimize'
        }
      ];

      const mockAvailability = {
        'John Doe': {
          energy: { morning: 95, afternoon: 78, evening: 45 },
          focus: { morning: 92, afternoon: 65, evening: 30 },
          availability: ['9:00-12:00', '14:00-17:00']
        },
        'Sarah Chen': {
          energy: { morning: 88, afternoon: 92, evening: 70 },
          focus: { morning: 85, afternoon: 95, evening: 60 },
          availability: ['8:00-11:00', '13:00-18:00']
        },
        'Mike Rodriguez': {
          energy: { morning: 75, afternoon: 85, evening: 90 },
          focus: { morning: 70, afternoon: 88, evening: 85 },
          availability: ['10:00-13:00', '15:00-19:00']
        }
      };

      setSchedules(mockSchedules);
      setAiRecommendations(mockRecommendations);
      setTeamAvailability(mockAvailability);
    } catch (error) {
      console.error('Error loading schedule data:', error);
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
            <p className="text-gray-600 mb-8">You need to be part of a company to view schedules.</p>
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
                  Smart Scheduling
                </h1>
                <p className="text-gray-600 mt-1">AI-optimized meeting times for maximum productivity</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>AI Active</span>
                </div>
                <Button 
                  onClick={() => {
                    // In a real app, this would open a meeting creation modal
                    alert('Meeting creation feature coming soon! This would open a calendar to schedule meetings.');
                  }}
                  variant="outline" 
                  size="small"
                >
                  Create Meeting
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
            {/* AI Recommendations */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Recommendations</h2>
                <p className="text-gray-600">Smart suggestions to optimize your team's schedule</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {aiRecommendations.map((rec, index) => (
                  <Card key={rec.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm group">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        rec.type === 'optimization' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                        rec.type === 'wellness' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                        'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        <span className="text-white text-xl">
                          {rec.type === 'optimization' ? '⚡' :
                           rec.type === 'wellness' ? '🛡️' : '🎯'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                            rec.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.impact} impact
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Confidence: {rec.confidence}%
                          </div>
                          <Button 
                            onClick={() => {
                              // In a real app, this would execute the recommendation
                              alert(`Executing: ${rec.action}\n\nThis would implement the AI recommendation for better scheduling.`);
                            }}
                            size="small" 
                            variant="outline"
                          >
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Meetings */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Meetings</h2>
                <p className="text-gray-600">AI-optimized schedule with productivity scores</p>
              </div>
              <div className="space-y-4">
                {schedules.map((schedule, index) => (
                  <Card key={schedule.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          schedule.type === 'recurring' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                          schedule.type === 'one-time' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                          'bg-gradient-to-br from-emerald-500 to-green-600'
                        }`}>
                          <span className="text-white text-xl">
                            {schedule.type === 'recurring' ? '🔄' :
                             schedule.type === 'one-time' ? '📅' : '🤝'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                          <p className="text-sm text-gray-600">
                            {schedule.time} • {schedule.duration} min • {schedule.participants.length} participants
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{schedule.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          schedule.aiScore >= 90 ? 'text-green-600' :
                          schedule.aiScore >= 75 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {schedule.aiScore}
                        </div>
                        <div className="text-xs text-gray-500">AI Score</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Team Availability */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Energy Patterns</h2>
                <p className="text-gray-600">AI-analyzed productivity windows for optimal scheduling</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.entries(teamAvailability).map(([name, data], index) => (
                  <Card key={name} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">{name}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Energy Levels</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Morning</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500"
                                  style={{ width: `${data.energy.morning}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700">{data.energy.morning}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Afternoon</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                  style={{ width: `${data.energy.afternoon}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700">{data.energy.afternoon}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Evening</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-500"
                                  style={{ width: `${data.energy.evening}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700">{data.energy.evening}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Available Times</div>
                        <div className="space-y-1">
                          {data.availability.map((time, idx) => (
                            <div key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              {time}
                            </div>
                          ))}
                        </div>
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