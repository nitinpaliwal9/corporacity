import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import AnnouncementsService from '../../lib/announcementsService';
import supabase from '../../lib/supabaseClient';

const Announcements = ({ companyId, userId, userRole = 'employee' }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    loadAnnouncements();
    loadUnreadCount();
    
    // Subscribe to real-time updates
    const subscription = AnnouncementsService.subscribeToAnnouncements(companyId, (payload) => {
      if (payload.eventType === 'INSERT') {
        setAnnouncements(prev => [payload.new, ...prev]);
        loadUnreadCount();
      } else if (payload.eventType === 'UPDATE') {
        setAnnouncements(prev => 
          prev.map(ann => ann.id === payload.new.id ? payload.new : ann)
        );
      } else if (payload.eventType === 'DELETE') {
        setAnnouncements(prev => prev.filter(ann => ann.id !== payload.old.id));
      }
    });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [companyId, userId]);

  const loadAnnouncements = async () => {
    try {
      const data = await AnnouncementsService.getAnnouncements(companyId, userId);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await AnnouncementsService.getUnreadCount(companyId, userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const markAsRead = async (announcementId) => {
    try {
      await AnnouncementsService.markAsRead(announcementId, userId);
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === announcementId 
            ? { ...ann, isRead: true, readCount: ann.readCount + 1 }
            : ann
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'meeting': return '📅';
      case 'policy': return '📋';
      case 'celebration': return '🎉';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {(userRole === 'owner' || userRole === 'admin') && (
          <Button
            onClick={() => setShowCreateForm(true)}
            size="small"
            className="bg-blue-600 hover:bg-blue-700"
          >
            + New Announcement
          </Button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        <AnimatePresence>
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  !announcement.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                } ${announcement.is_pinned ? 'ring-2 ring-yellow-200 bg-yellow-50/30' : ''}`}
                onClick={() => {
                  setSelectedAnnouncement(announcement);
                  if (!announcement.isRead) {
                    markAsRead(announcement.id);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getTypeIcon(announcement.announcement_type)}</span>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {announcement.title}
                      </h3>
                      {announcement.is_pinned && (
                        <span className="text-yellow-500">📌</span>
                      )}
                      {!announcement.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By {announcement.created_by_user?.full_name || 'Unknown'}</span>
                        <span>{formatDate(announcement.created_at)}</span>
                        {announcement.readCount > 0 && (
                          <span>{announcement.readCount} read</span>
                        )}
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {announcements.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-600">
              {userRole === 'owner' || userRole === 'admin' 
                ? 'Create your first announcement to keep your team informed.'
                : 'No announcements have been posted yet.'
              }
            </p>
          </Card>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showCreateForm && (
        <CreateAnnouncementModal
          companyId={companyId}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadAnnouncements();
          }}
        />
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetailModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          userRole={userRole}
        />
      )}
    </div>
  );
};

// Create Announcement Modal Component
const CreateAnnouncementModal = ({ companyId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    targetAudience: 'all',
    targetDepartments: [],
    targetDesignations: [],
    targetUsers: [],
    isPinned: false,
    expiresAt: null
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AnnouncementsService.createAnnouncement(companyId, formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create Announcement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter announcement content"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AnnouncementsService.getAnnouncementTypes().map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AnnouncementsService.getPriorities().map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isPinned" className="text-sm text-gray-700">
              Pin this announcement
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Announcement Detail Modal Component
const AnnouncementDetailModal = ({ announcement, onClose, userRole }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'meeting': return '📅';
      case 'policy': return '📋';
      case 'celebration': return '🎉';
      default: return '📢';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(announcement.announcement_type)}</span>
            <h2 className="text-xl font-semibold text-gray-900">
              {announcement.title}
            </h2>
            {announcement.is_pinned && (
              <span className="text-yellow-500">📌</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>By {announcement.created_by_user?.full_name || 'Unknown'}</span>
            <span>•</span>
            <span>{new Date(announcement.created_at).toLocaleString()}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
              {announcement.priority}
            </span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>

          {announcement.readCount > 0 && (
            <div className="text-sm text-gray-500">
              Read by {announcement.readCount} people
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Announcements;
