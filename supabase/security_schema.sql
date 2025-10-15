-- Security and Privacy Schema for Corporacity
-- Implements enterprise-grade security features

-- Audit Logging System
CREATE TABLE IF NOT EXISTS corp_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'login', 'logout', 'status_update', 'announcement_create', etc.
  resource_type TEXT, -- 'user', 'announcement', 'chat_message', 'designation', etc.
  resource_id UUID, -- ID of the affected resource
  old_values JSONB, -- Previous values (for updates)
  new_values JSONB, -- New values (for creates/updates)
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
  description TEXT,
  metadata JSONB, -- Additional context
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Events Table (for critical security events)
CREATE TABLE IF NOT EXISTS corp_security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'failed_login', 'suspicious_activity', 'data_breach_attempt', etc.
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  location_data JSONB, -- Geolocation data
  risk_score INTEGER DEFAULT 0, -- 0-100 risk assessment
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encryption Keys Management
CREATE TABLE IF NOT EXISTS corp_encryption_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL, -- 'chat', 'announcement', 'status', 'general'
  key_version INTEGER DEFAULT 1,
  encrypted_key TEXT NOT NULL, -- Base64 encoded encrypted key
  key_hash TEXT NOT NULL, -- Hash of the key for verification
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(company_id, key_type, key_version)
);

-- User Privacy Settings
CREATE TABLE IF NOT EXISTS corp_privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  data_collection_level TEXT DEFAULT 'basic', -- 'minimal', 'basic', 'enhanced', 'full'
  allow_analytics BOOLEAN DEFAULT TRUE,
  allow_location_tracking BOOLEAN DEFAULT FALSE,
  allow_behavior_tracking BOOLEAN DEFAULT FALSE,
  allow_ai_insights BOOLEAN DEFAULT TRUE,
  data_retention_days INTEGER DEFAULT 365,
  auto_delete_data BOOLEAN DEFAULT FALSE,
  share_data_with_third_parties BOOLEAN DEFAULT FALSE,
  marketing_communications BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Data Access Logs (GDPR compliance)
CREATE TABLE IF NOT EXISTS corp_data_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL, -- 'view', 'export', 'delete', 'modify'
  resource_type TEXT NOT NULL,
  resource_id UUID,
  accessed_by UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  purpose TEXT, -- Legal basis for access
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Management
CREATE TABLE IF NOT EXISTS corp_user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  location_data JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Two-Factor Authentication
CREATE TABLE IF NOT EXISTS corp_2fa_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  method TEXT NOT NULL, -- 'totp', 'sms', 'email', 'backup_codes'
  secret_key TEXT, -- Encrypted secret for TOTP
  backup_codes TEXT[], -- Encrypted backup codes
  is_enabled BOOLEAN DEFAULT FALSE,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id, method)
);

-- Data Retention Policies
CREATE TABLE IF NOT EXISTS corp_data_retention_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'status_updates', 'chat_messages', 'announcements', etc.
  retention_days INTEGER NOT NULL,
  auto_delete BOOLEAN DEFAULT FALSE,
  archive_before_delete BOOLEAN DEFAULT TRUE,
  legal_hold BOOLEAN DEFAULT FALSE, -- Prevent deletion for legal reasons
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Status Table with Encryption
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS encrypted_message BYTEA;
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS encryption_key_id UUID REFERENCES corp_encryption_keys(id);
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT FALSE;

-- Enhanced Chat Messages with Encryption
ALTER TABLE corp_chat_messages ADD COLUMN IF NOT EXISTS encrypted_message BYTEA;
ALTER TABLE corp_chat_messages ADD COLUMN IF NOT EXISTS encryption_key_id UUID REFERENCES corp_encryption_keys(id);
ALTER TABLE corp_chat_messages ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT FALSE;

-- Enhanced Announcements with Encryption
ALTER TABLE corp_announcements ADD COLUMN IF NOT EXISTS encrypted_content BYTEA;
ALTER TABLE corp_announcements ADD COLUMN IF NOT EXISTS encryption_key_id UUID REFERENCES corp_encryption_keys(id);
ALTER TABLE corp_announcements ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT FALSE;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_user_id ON corp_audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_company_id ON corp_audit_logs (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_action ON corp_audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_created_at ON corp_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_severity ON corp_audit_logs (severity);

CREATE INDEX IF NOT EXISTS idx_corp_security_events_company_id ON corp_security_events (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_security_events_severity ON corp_security_events (severity);
CREATE INDEX IF NOT EXISTS idx_corp_security_events_created_at ON corp_security_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corp_security_events_is_resolved ON corp_security_events (is_resolved);

CREATE INDEX IF NOT EXISTS idx_corp_encryption_keys_company_id ON corp_encryption_keys (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_encryption_keys_type ON corp_encryption_keys (key_type);
CREATE INDEX IF NOT EXISTS idx_corp_encryption_keys_is_active ON corp_encryption_keys (is_active);

CREATE INDEX IF NOT EXISTS idx_corp_privacy_settings_user_id ON corp_privacy_settings (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_privacy_settings_company_id ON corp_privacy_settings (company_id);

CREATE INDEX IF NOT EXISTS idx_corp_data_access_logs_user_id ON corp_data_access_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_data_access_logs_company_id ON corp_data_access_logs (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_data_access_logs_created_at ON corp_data_access_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_corp_user_sessions_user_id ON corp_user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_user_sessions_company_id ON corp_user_sessions (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_user_sessions_is_active ON corp_user_sessions (is_active);
CREATE INDEX IF NOT EXISTS idx_corp_user_sessions_expires_at ON corp_user_sessions (expires_at);

CREATE INDEX IF NOT EXISTS idx_corp_2fa_settings_user_id ON corp_2fa_settings (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_2fa_settings_company_id ON corp_2fa_settings (company_id);

-- Row Level Security Policies
ALTER TABLE corp_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_data_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_2fa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_data_retention_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Audit Logs
CREATE POLICY "Company admins can view audit logs" ON corp_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() 
        AND company_id = corp_audit_logs.company_id 
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "System can insert audit logs" ON corp_audit_logs
  FOR INSERT WITH CHECK (true); -- System inserts are allowed

-- RLS Policies for Security Events
CREATE POLICY "Company admins can view security events" ON corp_security_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() 
        AND company_id = corp_security_events.company_id 
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "System can insert security events" ON corp_security_events
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Encryption Keys
CREATE POLICY "Company admins can manage encryption keys" ON corp_encryption_keys
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() 
        AND company_id = corp_encryption_keys.company_id 
        AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for Privacy Settings
CREATE POLICY "Users can manage their own privacy settings" ON corp_privacy_settings
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Data Access Logs
CREATE POLICY "Users can view their own data access logs" ON corp_data_access_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert data access logs" ON corp_data_access_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for User Sessions
CREATE POLICY "Users can manage their own sessions" ON corp_user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for 2FA Settings
CREATE POLICY "Users can manage their own 2FA settings" ON corp_2fa_settings
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Data Retention Policies
CREATE POLICY "Company admins can manage retention policies" ON corp_data_retention_policies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() 
        AND company_id = corp_data_retention_policies.company_id 
        AND role IN ('owner', 'admin')
    )
  );

-- Functions for Security Operations
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_company_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info',
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO corp_audit_logs (
    user_id, company_id, action, resource_type, resource_id,
    old_values, new_values, severity, description, metadata,
    ip_address, user_agent, session_id
  ) VALUES (
    p_user_id, p_company_id, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_severity, p_description, p_metadata,
    inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent',
    current_setting('request.headers', true)::json->>'x-session-id'
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_company_id UUID,
  p_event_type TEXT,
  p_severity TEXT,
  p_description TEXT,
  p_risk_score INTEGER DEFAULT 0,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO corp_security_events (
    user_id, company_id, event_type, severity, description,
    risk_score, metadata, ip_address, user_agent
  ) VALUES (
    p_user_id, p_company_id, p_event_type, p_severity, p_description,
    p_risk_score, p_metadata, inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_data_access(
  p_user_id UUID,
  p_company_id UUID,
  p_access_type TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_purpose TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  access_id UUID;
BEGIN
  INSERT INTO corp_data_access_logs (
    user_id, company_id, access_type, resource_type, resource_id,
    accessed_by, purpose, ip_address, user_agent
  ) VALUES (
    p_user_id, p_company_id, p_access_type, p_resource_type, p_resource_id,
    auth.uid(), p_purpose, inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO access_id;
  
  RETURN access_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM corp_user_sessions 
  WHERE expires_at < NOW() OR last_activity < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old audit logs (data retention)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  retention_days INTEGER := 365; -- Default 1 year retention
BEGIN
  DELETE FROM corp_audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 day' * retention_days
    AND severity IN ('info', 'warning'); -- Keep critical and error logs longer
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      NEW.user_id,
      NEW.company_id,
      'create',
      TG_TABLE_NAME,
      NEW.id,
      NULL,
      to_jsonb(NEW),
      'info',
      'Record created'
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      NEW.user_id,
      NEW.company_id,
      'update',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      'info',
      'Record updated'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      OLD.user_id,
      OLD.company_id,
      'delete',
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD),
      NULL,
      'warning',
      'Record deleted'
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_corp_statuses_trigger
  AFTER INSERT OR UPDATE OR DELETE ON corp_statuses
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_corp_announcements_trigger
  AFTER INSERT OR UPDATE OR DELETE ON corp_announcements
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_corp_chat_messages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON corp_chat_messages
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_corp_memberships_trigger
  AFTER INSERT OR UPDATE OR DELETE ON corp_memberships
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Trigger to update updated_at columns
CREATE TRIGGER update_corp_privacy_settings_updated_at 
  BEFORE UPDATE ON corp_privacy_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_2fa_settings_updated_at 
  BEFORE UPDATE ON corp_2fa_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_data_retention_policies_updated_at 
  BEFORE UPDATE ON corp_data_retention_policies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data retention policies
INSERT INTO corp_data_retention_policies (company_id, data_type, retention_days, auto_delete)
SELECT 
  id as company_id,
  'status_updates' as data_type,
  365 as retention_days,
  false as auto_delete
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_data_retention_policies 
  WHERE company_id = corp_companies.id AND data_type = 'status_updates'
);

INSERT INTO corp_data_retention_policies (company_id, data_type, retention_days, auto_delete)
SELECT 
  id as company_id,
  'chat_messages' as data_type,
  180 as retention_days,
  false as auto_delete
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_data_retention_policies 
  WHERE company_id = corp_companies.id AND data_type = 'chat_messages'
);

INSERT INTO corp_data_retention_policies (company_id, data_type, retention_days, auto_delete)
SELECT 
  id as company_id,
  'announcements' as data_type,
  730 as retention_days,
  false as auto_delete
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_data_retention_policies 
  WHERE company_id = corp_companies.id AND data_type = 'announcements'
);
