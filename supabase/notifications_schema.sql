-- Notifications system schema
-- This creates the notifications table and related functionality

-- Create notifications table
CREATE TABLE IF NOT EXISTS corp_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES corp_companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('status_update', 'join_request', 'approval', 'reminder', 'announcement', 'system')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_corp_notifications_company_id ON corp_notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_notifications_user_id ON corp_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_notifications_created_at ON corp_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corp_notifications_read ON corp_notifications(read);

-- Enable RLS
ALTER TABLE corp_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON corp_notifications
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (user_id IS NULL AND company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can update their notifications" ON corp_notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON corp_notifications
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_company_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT,
  p_user_id UUID DEFAULT NULL,
  p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO corp_notifications (
    company_id,
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    p_company_id,
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create company-wide notification
CREATE OR REPLACE FUNCTION create_company_notification(
  p_company_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT,
  p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO corp_notifications (
    company_id,
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    p_company_id,
    NULL, -- NULL means company-wide
    p_type,
    p_title,
    p_message,
    p_data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_corp_notifications_updated_at
  BEFORE UPDATE ON corp_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
