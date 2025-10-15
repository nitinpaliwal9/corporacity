// Real-time Chat Service for WhatsApp-like communication
import supabase from './supabaseClient';
import EncryptionService from './encryptionService';
import AuditService from './auditService';
import SecurityService from './securityService';

class ChatService {
  constructor() {
    this.supabase = supabase;
    this.activeChannels = new Map();
  }

  // Create a new chat room
  async createRoom(companyId, roomData) {
    const {
      name,
      description = '',
      roomType = 'general',
      department = null,
      projectId = null,
      participants = [],
      admins = []
    } = roomData;

    const currentUser = (await this.supabase.auth.getUser()).data.user;
    const allParticipants = [...new Set([currentUser.id, ...participants])];

    const { data, error } = await this.supabase
      .from('corp_chat_rooms')
      .insert([{
        company_id: companyId,
        name,
        description,
        room_type: roomType,
        department,
        project_id: projectId,
        created_by: currentUser.id,
        participants: allParticipants,
        admins: admins.length > 0 ? admins : [currentUser.id]
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get chat rooms for a company
  async getRooms(companyId, userId) {
    const { data, error } = await this.supabase
      .from('corp_chat_rooms')
      .select(`
        *,
        created_by_user:corp_profiles!corp_chat_rooms_created_by_fkey(full_name, email)
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .contains('participants', [userId])
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Add unread message counts for each room
    const roomsWithUnreadCounts = await Promise.all(
      data.map(async (room) => {
        const unreadCount = await this.getUnreadMessageCount(room.id, userId);
        return {
          ...room,
          unreadCount
        };
      })
    );

    return roomsWithUnreadCounts;
  }

  // Get messages for a room
  async getMessages(roomId, userId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      before = null
    } = options;

    let query = this.supabase
      .from('corp_chat_messages')
      .select(`
        *,
        sender:corp_profiles!corp_chat_messages_sender_id_fkey(full_name, email),
        reply_to_message:corp_chat_messages!corp_chat_messages_reply_to_fkey(
          id,
          message,
          sender:corp_profiles!corp_chat_messages_sender_id_fkey(full_name)
        )
      `)
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Decrypt messages if they are encrypted
    const decryptedMessages = await Promise.all(
      (data || []).map(async (message) => {
        if (message.is_encrypted && message.encrypted_message) {
          try {
            const decryptedContent = await EncryptionService.decryptChatMessage(message);
            return {
              ...message,
              message: decryptedContent
            };
          } catch (error) {
            return {
              ...message,
              message: '[Encrypted message - decryption failed]'
            };
          }
        }
        return message;
      })
    );

    // Mark messages as read
    await this.markMessagesAsRead(roomId, userId);

    return decryptedMessages.reverse(); // Return in chronological order
  }

  // Send a message
  async sendMessage(roomId, messageData) {
    const {
      message,
      messageType = 'text',
      replyTo = null,
      attachments = []
    } = messageData;

    const currentUser = (await this.supabase.auth.getUser()).data.user;

    // Get room info for company ID
    const { data: room, error: roomError } = await this.supabase
      .from('corp_chat_rooms')
      .select('company_id')
      .eq('id', roomId)
      .single();

    if (roomError) throw roomError;

    // Encrypt message if encryption is enabled
    let encryptedMessage = null;
    let encryptionKeyId = null;
    let isEncrypted = false;

    try {
      const encrypted = await EncryptionService.encryptChatMessage(room.company_id, message, currentUser.id);
      if (encrypted.isEncrypted) {
        encryptedMessage = encrypted.encryptedMessage;
        encryptionKeyId = encrypted.encryptionKeyId;
        isEncrypted = true;
      }
    } catch (error) {
      // Encryption failed, continue with unencrypted
    }

    const { data, error } = await this.supabase
      .from('corp_chat_messages')
      .insert([{
        room_id: roomId,
        sender_id: currentUser.id,
        message: isEncrypted ? null : message,
        encrypted_message: encryptedMessage,
        encryption_key_id: encryptionKeyId,
        is_encrypted: isEncrypted,
        message_type: messageType,
        reply_to: replyTo,
        attachments
      }])
      .select(`
        *,
        sender:corp_profiles!corp_chat_messages_sender_id_fkey(full_name, email),
        reply_to_message:corp_chat_messages!corp_chat_messages_reply_to_fkey(
          id,
          message,
          sender:corp_profiles!corp_chat_messages_sender_id_fkey(full_name)
        )
      `)
      .single();

    if (error) throw error;

    // Log the message send
    await AuditService.logEvent({
      userId: currentUser.id,
      companyId: room.company_id,
      action: 'chat_message_sent',
      resourceType: 'chat_message',
      resourceId: data.id,
      severity: 'info',
      description: 'Chat message sent',
      metadata: { 
        roomId, 
        messageType, 
        isEncrypted,
        hasAttachments: attachments.length > 0
      }
    });

    // Monitor for suspicious activity
    await SecurityService.monitorDataAccess(
      currentUser.id, 
      room.company_id, 
      'chat_message', 
      data.id, 
      'create'
    );

    // Update room's updated_at timestamp
    await this.supabase
      .from('corp_chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', roomId);

    return data;
  }

  // Edit a message
  async editMessage(messageId, newMessage) {
    const { data, error } = await this.supabase
      .from('corp_chat_messages')
      .update({
        message: newMessage,
        is_edited: true,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a message (soft delete)
  async deleteMessage(messageId) {
    const { error } = await this.supabase
      .from('corp_chat_messages')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) throw error;
  }

  // Add reaction to a message
  async addReaction(messageId, emoji, userId) {
    const { data: message, error: fetchError } = await this.supabase
      .from('corp_chat_messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    if (fetchError) throw fetchError;

    const reactions = message.reactions || {};
    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }
    
    if (!reactions[emoji].includes(userId)) {
      reactions[emoji].push(userId);
    }

    const { error } = await this.supabase
      .from('corp_chat_messages')
      .update({ reactions })
      .eq('id', messageId);

    if (error) throw error;
  }

  // Remove reaction from a message
  async removeReaction(messageId, emoji, userId) {
    const { data: message, error: fetchError } = await this.supabase
      .from('corp_chat_messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    if (fetchError) throw fetchError;

    const reactions = message.reactions || {};
    if (reactions[emoji]) {
      reactions[emoji] = reactions[emoji].filter(id => id !== userId);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    }

    const { error } = await this.supabase
      .from('corp_chat_messages')
      .update({ reactions })
      .eq('id', messageId);

    if (error) throw error;
  }

  // Mark messages as read
  async markMessagesAsRead(roomId, userId) {
    const { data: messages, error: fetchError } = await this.supabase
      .from('corp_chat_messages')
      .select('id, read_by')
      .eq('room_id', roomId)
      .neq('sender_id', userId)
      .eq('is_deleted', false);

    if (fetchError) throw fetchError;

    const updates = messages.map(message => {
      const readBy = message.read_by || {};
      readBy[userId] = true;
      return {
        id: message.id,
        read_by: readBy
      };
    });

    if (updates.length > 0) {
      const { error } = await this.supabase
        .from('corp_chat_messages')
        .upsert(updates);

      if (error) throw error;
    }
  }

  // Get unread message count for a room
  async getUnreadMessageCount(roomId, userId) {
    const { data, error } = await this.supabase
      .rpc('get_unread_messages_count', {
        user_id_param: userId,
        room_id_param: roomId
      });

    if (error) throw error;
    return data || 0;
  }

  // Add participant to room
  async addParticipant(roomId, userId) {
    const { data: room, error: fetchError } = await this.supabase
      .from('corp_chat_rooms')
      .select('participants')
      .eq('id', roomId)
      .single();

    if (fetchError) throw fetchError;

    const participants = room.participants || [];
    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    const { error } = await this.supabase
      .from('corp_chat_rooms')
      .update({ participants })
      .eq('id', roomId);

    if (error) throw error;
  }

  // Remove participant from room
  async removeParticipant(roomId, userId) {
    const { data: room, error: fetchError } = await this.supabase
      .from('corp_chat_rooms')
      .select('participants')
      .eq('id', roomId)
      .single();

    if (fetchError) throw fetchError;

    const participants = (room.participants || []).filter(id => id !== userId);

    const { error } = await this.supabase
      .from('corp_chat_rooms')
      .update({ participants })
      .eq('id', roomId);

    if (error) throw error;
  }

  // Subscribe to room messages
  subscribeToRoom(roomId, callback) {
    const channel = this.supabase
      .channel(`room_${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'corp_chat_messages',
        filter: `room_id=eq.${roomId}`
      }, callback)
      .subscribe();

    this.activeChannels.set(roomId, channel);
    return channel;
  }

  // Subscribe to room updates
  subscribeToRoomUpdates(roomId, callback) {
    const channel = this.supabase
      .channel(`room_updates_${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'corp_chat_rooms',
        filter: `id=eq.${roomId}`
      }, callback)
      .subscribe();

    return channel;
  }

  // Unsubscribe from room
  unsubscribeFromRoom(roomId) {
    const channel = this.activeChannels.get(roomId);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.activeChannels.delete(roomId);
    }
  }

  // Get room participants with user details
  async getRoomParticipants(roomId) {
    const { data: room, error: roomError } = await this.supabase
      .from('corp_chat_rooms')
      .select('participants, admins')
      .eq('id', roomId)
      .single();

    if (roomError) throw roomError;

    const { data: participants, error: participantsError } = await this.supabase
      .from('corp_profiles')
      .select('id, full_name, email')
      .in('id', room.participants);

    if (participantsError) throw participantsError;

    return participants.map(participant => ({
      ...participant,
      isAdmin: room.admins.includes(participant.id)
    }));
  }

  // Search messages in a room
  async searchMessages(roomId, searchTerm, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const { data, error } = await this.supabase
      .from('corp_chat_messages')
      .select(`
        *,
        sender:corp_profiles!corp_chat_messages_sender_id_fkey(full_name, email)
      `)
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .ilike('message', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }

  // Get room types for UI
  getRoomTypes() {
    return [
      { value: 'general', label: 'General', icon: '💬', color: 'blue' },
      { value: 'department', label: 'Department', icon: '🏢', color: 'green' },
      { value: 'project', label: 'Project', icon: '📋', color: 'purple' },
      { value: 'private', label: 'Private', icon: '🔒', color: 'gray' }
    ];
  }

  // Get message types for UI
  getMessageTypes() {
    return [
      { value: 'text', label: 'Text', icon: '💬' },
      { value: 'image', label: 'Image', icon: '🖼️' },
      { value: 'file', label: 'File', icon: '📎' },
      { value: 'system', label: 'System', icon: '⚙️' },
      { value: 'announcement', label: 'Announcement', icon: '📢' }
    ];
  }

  // Cleanup all subscriptions
  cleanup() {
    this.activeChannels.forEach((channel, roomId) => {
      this.supabase.removeChannel(channel);
    });
    this.activeChannels.clear();
  }
}

export default new ChatService();
