-- Announcements and Real-time Communication Schema
-- Extends existing schema with announcements, designations, and chat features

-- Employee Designations/Roles Table
CREATE TABLE IF NOT EXISTS corp_designations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Software Engineer', 'Product Manager', 'Designer', etc.
  description TEXT,
  level INTEGER DEFAULT 1, -- 1-10 hierarchy level
  department TEXT, -- 'Engineering', 'Marketing', 'Sales', etc.
  permissions JSONB, -- Custom permissions for this designation
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update memberships table to include designation
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS designation_id UUID REFERENCES corp_designations(id);
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS employee_id TEXT; -- Employee ID/Number
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS salary_range TEXT; -- Optional, for HR use
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES auth.users(id); -- Direct manager
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Announcements Table
CREATE TABLE IF NOT EXISTS corp_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT DEFAULT 'general', -- 'general', 'urgent', 'meeting', 'policy', 'celebration'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  target_audience TEXT DEFAULT 'all', -- 'all', 'department', 'designation', 'specific'
  target_departments TEXT[], -- Array of department names
  target_designations UUID[], -- Array of designation IDs
  target_users UUID[], -- Array of specific user IDs
  is_pinned BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  scheduled_at TIMESTAMPTZ, -- For scheduled announcements
  expires_at TIMESTAMPTZ, -- Auto-expire announcements
  attachments JSONB, -- File attachments info
  read_by JSONB DEFAULT '{}', -- Track who has read the announcement
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time Chat System
CREATE TABLE IF NOT EXISTS corp_chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT DEFAULT 'general', -- 'general', 'department', 'project', 'private'
  department TEXT, -- For department-specific rooms
  project_id TEXT, -- For project-specific rooms
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participants UUID[] NOT NULL, -- Array of user IDs
  admins UUID[] DEFAULT '{}', -- Array of admin user IDs
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}', -- Room settings (mute, notifications, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS corp_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES corp_chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'system', 'announcement'
  reply_to UUID REFERENCES corp_chat_messages(id), -- For message replies
  attachments JSONB, -- File attachments
  reactions JSONB DEFAULT '{}', -- Emoji reactions
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  read_by JSONB DEFAULT '{}', -- Track who has read the message
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Message Status (for read receipts)
CREATE TABLE IF NOT EXISTS corp_chat_message_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES corp_chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read'
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS corp_notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  email_announcements BOOLEAN DEFAULT TRUE,
  email_chat_messages BOOLEAN DEFAULT FALSE,
  push_announcements BOOLEAN DEFAULT TRUE,
  push_chat_messages BOOLEAN DEFAULT TRUE,
  push_status_updates BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME, -- e.g., '22:00'
  quiet_hours_end TIME, -- e.g., '08:00'
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_corp_designations_company_id ON corp_designations (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_designations_is_active ON corp_designations (is_active);

CREATE INDEX IF NOT EXISTS idx_corp_announcements_company_id ON corp_announcements (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_announcements_created_at ON corp_announcements (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corp_announcements_is_active ON corp_announcements (is_active);
CREATE INDEX IF NOT EXISTS idx_corp_announcements_priority ON corp_announcements (priority);
CREATE INDEX IF NOT EXISTS idx_corp_announcements_scheduled_at ON corp_announcements (scheduled_at);

CREATE INDEX IF NOT EXISTS idx_corp_chat_rooms_company_id ON corp_chat_rooms (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_chat_rooms_participants ON corp_chat_rooms USING GIN (participants);
CREATE INDEX IF NOT EXISTS idx_corp_chat_rooms_room_type ON corp_chat_rooms (room_type);

CREATE INDEX IF NOT EXISTS idx_corp_chat_messages_room_id ON corp_chat_messages (room_id);
CREATE INDEX IF NOT EXISTS idx_corp_chat_messages_created_at ON corp_chat_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corp_chat_messages_sender_id ON corp_chat_messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_corp_chat_messages_is_deleted ON corp_chat_messages (is_deleted);

CREATE INDEX IF NOT EXISTS idx_corp_chat_message_status_message_id ON corp_chat_message_status (message_id);
CREATE INDEX IF NOT EXISTS idx_corp_chat_message_status_user_id ON corp_chat_message_status (user_id);

CREATE INDEX IF NOT EXISTS idx_corp_notification_preferences_user_id ON corp_notification_preferences (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_notification_preferences_company_id ON corp_notification_preferences (company_id);

-- Row Level Security Policies
ALTER TABLE corp_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_chat_message_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Designations
CREATE POLICY "Company members can view designations" ON corp_designations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() AND company_id = corp_designations.company_id
    )
  );

CREATE POLICY "Company admins can manage designations" ON corp_designations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() 
        AND company_id = corp_designations.company_id 
        AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for Announcements
CREATE POLICY "Company members can view announcements" ON corp_announcements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() AND company_id = corp_announcements.company_id
    )
  );

CREATE POLICY "Company admins can manage announcements" ON corp_announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() 
        AND company_id = corp_announcements.company_id 
        AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for Chat Rooms
CREATE POLICY "Room participants can view rooms" ON corp_chat_rooms
  FOR SELECT USING (
    auth.uid() = ANY(participants) OR
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() AND company_id = corp_chat_rooms.company_id
    )
  );

CREATE POLICY "Company members can create rooms" ON corp_chat_rooms
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() AND company_id = corp_chat_rooms.company_id
    )
  );

CREATE POLICY "Room admins can update rooms" ON corp_chat_rooms
  FOR UPDATE USING (
    auth.uid() = ANY(admins) OR
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() 
        AND company_id = corp_chat_rooms.company_id 
        AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for Chat Messages
CREATE POLICY "Room participants can view messages" ON corp_chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_chat_rooms 
      WHERE id = corp_chat_messages.room_id 
        AND (auth.uid() = ANY(participants) OR
             EXISTS (
               SELECT 1 FROM corp_memberships 
               WHERE user_id = auth.uid() AND company_id = corp_chat_rooms.company_id
             ))
    )
  );

CREATE POLICY "Room participants can send messages" ON corp_chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM corp_chat_rooms 
      WHERE id = corp_chat_messages.room_id 
        AND auth.uid() = ANY(participants)
    )
  );

CREATE POLICY "Message senders can update their messages" ON corp_chat_messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- RLS Policies for Message Status
CREATE POLICY "Users can view their message status" ON corp_chat_message_status
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their message status" ON corp_chat_message_status
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Notification Preferences
CREATE POLICY "Users can manage their notification preferences" ON corp_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Functions for Real-time Features
CREATE OR REPLACE FUNCTION get_unread_announcements_count(user_id_param UUID, company_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM corp_announcements
  WHERE company_id = company_id_param
    AND is_active = TRUE
    AND (read_by->user_id_param::TEXT IS NULL OR read_by->user_id_param::TEXT = 'false');
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_unread_messages_count(user_id_param UUID, room_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM corp_chat_messages
  WHERE room_id = room_id_param
    AND sender_id != user_id_param
    AND is_deleted = FALSE
    AND (read_by->user_id_param::TEXT IS NULL OR read_by->user_id_param::TEXT = 'false');
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at columns
CREATE TRIGGER update_corp_designations_updated_at 
  BEFORE UPDATE ON corp_designations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_announcements_updated_at 
  BEFORE UPDATE ON corp_announcements 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_chat_rooms_updated_at 
  BEFORE UPDATE ON corp_chat_rooms 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_notification_preferences_updated_at 
  BEFORE UPDATE ON corp_notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default designations for existing companies
INSERT INTO corp_designations (company_id, name, description, level, department)
SELECT 
  id as company_id,
  'Employee' as name,
  'General employee designation' as description,
  1 as level,
  'General' as department
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations WHERE company_id = corp_companies.id
);

-- Create default general chat room for existing companies
INSERT INTO corp_chat_rooms (company_id, name, description, room_type, created_by, participants)
SELECT 
  id as company_id,
  'General' as name,
  'General company chat room' as description,
  'general' as room_type,
  owner_id as created_by,
  ARRAY[owner_id] as participants
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_chat_rooms WHERE company_id = corp_companies.id AND room_type = 'general'
);
