import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import supabase from '../lib/supabaseClient';

export default function Mobile() {
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState({});
  const [biometricSettings, setBiometricSettings] = useState({});
  const [mobileFeatures, setMobileFeatures] = useState([]);
  const [offlineCapabilities, setOfflineCapabilities] = useState({});

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
          await loadMobileData(membership.company_id);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const loadMobileData = async (companyId) => {
    try {
      // Mock location-based status data
      const mockLocationStatus = {
        currentLocation: {
          address: '123 Business Ave, New York, NY',
          coordinates: '40.7128, -74.0060',
          accuracy: '5 meters',
          lastUpdate: '2 minutes ago'
        },
        workLocations: [
          {
            name: 'Main Office',
            address: '123 Business Ave, New York, NY',
            radius: '100 meters',
            status: 'in_range',
            distance: '45 meters'
          },
          {
            name: 'Client Site A',
            address: '456 Client St, Brooklyn, NY',
            radius: '50 meters',
            status: 'out_of_range',
            distance: '2.3 km'
          }
        ],
        autoStatus: {
          enabled: true,
          lastTrigger: '9:15 AM',
          currentStatus: 'present',
          confidence: 94
        }
      };

      const mockBiometricSettings = {
        faceRecognition: {
          enabled: true,
          accuracy: 98,
          lastUsed: '9:15 AM',
          confidence: 'high'
        },
        fingerprint: {
          enabled: true,
          accuracy: 99,
          lastUsed: '9:14 AM',
          confidence: 'high'
        },
        voiceRecognition: {
          enabled: false,
          accuracy: 0,
          lastUsed: null,
          confidence: 'disabled'
        }
      };

      const mockMobileFeatures = [
        {
          id: 1,
          name: 'Location-Based Check-in',
          description: 'Automatically update status when entering/leaving work locations',
          icon: '📍',
          status: 'active',
          accuracy: '95%',
          color: 'from-blue-500 to-indigo-600'
        },
        {
          id: 2,
          name: 'Biometric Authentication',
          description: 'Secure login with face recognition and fingerprint scanning',
          icon: '👤',
          status: 'active',
          accuracy: '98%',
          color: 'from-green-500 to-emerald-600'
        },
        {
          id: 3,
          name: 'Offline Mode',
          description: 'Full functionality without internet connection',
          icon: '📱',
          status: 'active',
          accuracy: '100%',
          color: 'from-purple-500 to-violet-600'
        },
        {
          id: 4,
          name: 'Push Notifications',
          description: 'Smart notifications based on location and schedule',
          icon: '🔔',
          status: 'active',
          accuracy: '92%',
          color: 'from-amber-500 to-orange-600'
        },
        {
          id: 5,
          name: 'Voice Commands',
          description: 'Update status using voice commands',
          icon: '🎤',
          status: 'beta',
          accuracy: '87%',
          color: 'from-rose-500 to-pink-600'
        },
        {
          id: 6,
          name: 'Smart Widgets',
          description: 'Quick status updates from home screen widgets',
          icon: '⚡',
          status: 'active',
          accuracy: '100%',
          color: 'from-cyan-500 to-blue-600'
        }
      ];

      const mockOfflineCapabilities = {
        statusUpdates: {
          available: true,
          lastSync: '2 minutes ago',
          pendingUpdates: 0
        },
        teamView: {
          available: true,
          lastSync: '5 minutes ago',
          cachedData: '24 hours'
        },
        analytics: {
          available: true,
          lastSync: '1 hour ago',
          cachedData: '7 days'
        }
      };

      setLocationStatus(mockLocationStatus);
      setBiometricSettings(mockBiometricSettings);
      setMobileFeatures(mockMobileFeatures);
      setOfflineCapabilities(mockOfflineCapabilities);
    } catch (error) {
      console.error('Error loading mobile data:', error);
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
            <p className="text-gray-600 mb-8">You need to be part of a company to view mobile features.</p>
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
                  Mobile Premium Features
                </h1>
                <p className="text-gray-600 mt-1">Advanced mobile capabilities with location intelligence and biometric security</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Mobile Active</span>
                </div>
                <Button 
                  onClick={() => {
                    // In a real app, this would redirect to app stores or download page
                    alert('Mobile app download feature coming soon! This would redirect to the App Store and Google Play Store for downloading the Corporacity mobile app.');
                  }}
                  variant="outline" 
                  size="small"
                >
                  Download App
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
            {/* Location Status */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Intelligence</h2>
                <p className="text-gray-600">Smart location-based status updates and geofencing</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Current Location</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📍</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{locationStatus.currentLocation?.address}</p>
                        <p className="text-xs text-gray-500">Accuracy: {locationStatus.currentLocation?.accuracy}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🔄</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto Status: {locationStatus.autoStatus?.currentStatus}</p>
                        <p className="text-xs text-gray-500">Confidence: {locationStatus.autoStatus?.confidence}%</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Work Locations</h3>
                  <div className="space-y-3">
                    {locationStatus.workLocations?.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{location.name}</p>
                          <p className="text-xs text-gray-500">{location.distance}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          location.status === 'in_range' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.status === 'in_range' ? 'In Range' : 'Out of Range'}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Biometric Settings */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Biometric Security</h2>
                <p className="text-gray-600">Advanced biometric authentication and security features</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(biometricSettings).map(([method, data], index) => (
                  <Card key={method} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        data.enabled ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        <span className="text-white text-2xl">
                          {method === 'faceRecognition' ? '👤' :
                           method === 'fingerprint' ? '👆' : '🎤'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                        {method.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {data.accuracy}%
                      </div>
                      <div className={`text-sm font-semibold mb-2 ${
                        data.enabled ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {data.enabled ? 'Enabled' : 'Disabled'}
                      </div>
                      {data.lastUsed && (
                        <div className="text-xs text-gray-500">
                          Last used: {data.lastUsed}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Mobile Features */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Mobile Features</h2>
                <p className="text-gray-600">Advanced mobile capabilities for seamless team management</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mobileFeatures.map((feature, index) => (
                  <Card key={feature.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm group">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <span className="text-white text-2xl">{feature.icon}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          feature.status === 'active' ? 'bg-green-100 text-green-800' :
                          feature.status === 'beta' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {feature.status}
                        </div>
                        <div className="text-xs text-gray-500">
                          {feature.accuracy} accuracy
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Offline Capabilities */}
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Offline Capabilities</h2>
                <p className="text-gray-600">Full functionality without internet connection</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(offlineCapabilities).map(([feature, data], index) => (
                  <Card key={feature} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        data.available ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        <span className="text-white text-2xl">
                          {feature === 'statusUpdates' ? '📝' :
                           feature === 'teamView' ? '👥' : '📊'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className={`text-sm font-semibold mb-2 ${
                        data.available ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {data.available ? 'Available' : 'Unavailable'}
                      </div>
                      {data.lastSync && (
                        <div className="text-xs text-gray-500 mb-1">
                          Last sync: {data.lastSync}
                        </div>
                      )}
                      {data.cachedData && (
                        <div className="text-xs text-gray-500">
                          Cached: {data.cachedData}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Mobile Benefits */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Mobile-First?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Always Connected</h4>
                      <p className="text-sm text-gray-600">Update status from anywhere with location intelligence and offline capabilities</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Secure & Fast</h4>
                      <p className="text-sm text-gray-600">Biometric authentication and instant updates with 99.9% accuracy</p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Smart Automation</h4>
                      <p className="text-sm text-gray-600">AI-powered location detection and voice commands for hands-free operation</p>
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
