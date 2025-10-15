// Announcements Service for CEO/HR announcements
import supabase from './supabaseClient';

class AnnouncementsService {
  constructor() {
    this.supabase = supabase;
  }

  // Create a new announcement
  async createAnnouncement(companyId, announcementData) {
    const {
      title,
      content,
      type = 'general',
      priority = 'normal',
      targetAudience = 'all',
      targetDepartments = [],
      targetDesignations = [],
      targetUsers = [],
      isPinned = false,
      scheduledAt = null,
      expiresAt = null,
      attachments = []
    } = announcementData;

    const { data, error } = await this.supabase
      .from('corp_announcements')
      .insert([{
        company_id: companyId,
        created_by: (await this.supabase.auth.getUser()).data.user.id,
        title,
        content,
        announcement_type: type,
        priority,
        target_audience: targetAudience,
        target_departments: targetDepartments,
        target_designations: targetDesignations,
        target_users: targetUsers,
        is_pinned: isPinned,
        scheduled_at: scheduledAt,
        expires_at: expiresAt,
        attachments
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get announcements for a company (with user-specific filtering)
  async getAnnouncements(companyId, userId, options = {}) {
    const {
      limit = 20,
      offset = 0,
      includeExpired = false,
      priority = null,
      type = null
    } = options;

    let query = this.supabase
      .from('corp_announcements')
      .select(`
        *,
        created_by_user:corp_profiles!corp_announcements_created_by_fkey(full_name, email)
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (!includeExpired) {
      query = query.or('expires_at.is.null,expires_at.gt.now()');
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    if (type) {
      query = query.eq('announcement_type', type);
    }

    // Apply user-specific filtering based on target audience
    const userMembership = await this.getUserMembership(userId, companyId);
    if (userMembership) {
      query = query.or(`
        target_audience.eq.all,
        and(target_audience.eq.department,target_departments.cs.{${userMembership.department}}),
        and(target_audience.eq.designation,target_designations.cs.{${userMembership.designation_id}}),
        and(target_audience.eq.specific,target_users.cs.{${userId}})
      `);
    }

    const { data, error } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Add read status for each announcement
    const announcementsWithReadStatus = data.map(announcement => ({
      ...announcement,
      isRead: announcement.read_by?.[userId] === true,
      readCount: Object.values(announcement.read_by || {}).filter(Boolean).length
    }));

    return announcementsWithReadStatus;
  }

  // Mark announcement as read
  async markAsRead(announcementId, userId) {
    const { data: announcement, error: fetchError } = await this.supabase
      .from('corp_announcements')
      .select('read_by')
      .eq('id', announcementId)
      .single();

    if (fetchError) throw fetchError;

    const readBy = announcement.read_by || {};
    readBy[userId] = true;

    const { error } = await this.supabase
      .from('corp_announcements')
      .update({ read_by: readBy })
      .eq('id', announcementId);

    if (error) throw error;
  }

  // Get unread announcements count
  async getUnreadCount(companyId, userId) {
    const { data, error } = await this.supabase
      .rpc('get_unread_announcements_count', {
        user_id_param: userId,
        company_id_param: companyId
      });

    if (error) throw error;
    return data || 0;
  }

  // Update announcement
  async updateAnnouncement(announcementId, updates) {
    const { data, error } = await this.supabase
      .from('corp_announcements')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', announcementId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete announcement (soft delete)
  async deleteAnnouncement(announcementId) {
    const { error } = await this.supabase
      .from('corp_announcements')
      .update({ is_active: false })
      .eq('id', announcementId);

    if (error) throw error;
  }

  // Pin/Unpin announcement
  async togglePin(announcementId, isPinned) {
    const { error } = await this.supabase
      .from('corp_announcements')
      .update({ is_pinned: isPinned })
      .eq('id', announcementId);

    if (error) throw error;
  }

  // Get announcement statistics
  async getAnnouncementStats(companyId, announcementId) {
    const { data, error } = await this.supabase
      .from('corp_announcements')
      .select('read_by, target_audience, target_departments, target_designations, target_users')
      .eq('id', announcementId)
      .eq('company_id', companyId)
      .single();

    if (error) throw error;

    const readBy = data.read_by || {};
    const readCount = Object.values(readBy).filter(Boolean).length;

    // Calculate total target audience
    let totalTargetAudience = 0;
    if (data.target_audience === 'all') {
      const { count } = await this.supabase
        .from('corp_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('is_active', true);
      totalTargetAudience = count || 0;
    } else if (data.target_audience === 'department') {
      const { count } = await this.supabase
        .from('corp_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('is_active', true)
        .overlaps('department', data.target_departments);
      totalTargetAudience = count || 0;
    } else if (data.target_audience === 'designation') {
      const { count } = await this.supabase
        .from('corp_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('is_active', true)
        .overlaps('designation_id', data.target_designations);
      totalTargetAudience = count || 0;
    } else if (data.target_audience === 'specific') {
      totalTargetAudience = data.target_users.length;
    }

    return {
      readCount,
      totalTargetAudience,
      readPercentage: totalTargetAudience > 0 ? Math.round((readCount / totalTargetAudience) * 100) : 0
    };
  }

  // Get user membership for filtering
  async getUserMembership(userId, companyId) {
    const { data, error } = await this.supabase
      .from('corp_memberships')
      .select('department, designation_id')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  }

  // Subscribe to real-time announcements
  subscribeToAnnouncements(companyId, callback) {
    return this.supabase
      .channel(`announcements_${companyId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'corp_announcements',
        filter: `company_id=eq.${companyId}`
      }, callback)
      .subscribe();
  }

  // Get announcement types and priorities for UI
  getAnnouncementTypes() {
    return [
      { value: 'general', label: 'General', icon: '📢', color: 'blue' },
      { value: 'urgent', label: 'Urgent', icon: '🚨', color: 'red' },
      { value: 'meeting', label: 'Meeting', icon: '📅', color: 'green' },
      { value: 'policy', label: 'Policy Update', icon: '📋', color: 'purple' },
      { value: 'celebration', label: 'Celebration', icon: '🎉', color: 'yellow' }
    ];
  }

  getPriorities() {
    return [
      { value: 'low', label: 'Low', color: 'gray' },
      { value: 'normal', label: 'Normal', color: 'blue' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'urgent', label: 'Urgent', color: 'red' }
    ];
  }

  getTargetAudiences() {
    return [
      { value: 'all', label: 'All Employees' },
      { value: 'department', label: 'Specific Departments' },
      { value: 'designation', label: 'Specific Designations' },
      { value: 'specific', label: 'Specific Employees' }
    ];
  }
}

export default new AnnouncementsService();
