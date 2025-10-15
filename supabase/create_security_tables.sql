-- Create Security Tables for Corporacity
-- Run this script in your Supabase SQL editor to create the missing security tables

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Data Access Logs
CREATE TABLE IF NOT EXISTS corp_data_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL, -- 'read', 'write', 'delete', 'export'
  resource_type TEXT NOT NULL, -- 'user_profile', 'status', 'announcement', etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  access_granted BOOLEAN DEFAULT TRUE,
  reason TEXT, -- Reason for access denial if applicable
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Privacy Settings
CREATE TABLE IF NOT EXISTS corp_privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  data_sharing_enabled BOOLEAN DEFAULT TRUE,
  analytics_enabled BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  data_retention_days INTEGER DEFAULT 365,
  gdpr_consent BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Retention Policies
CREATE TABLE IF NOT EXISTS corp_data_retention_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'audit_logs', 'status_updates', 'chat_messages', etc.
  retention_days INTEGER NOT NULL,
  auto_delete BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate Limiting
CREATE TABLE IF NOT EXISTS corp_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'login', 'status_update', 'api_call', etc.
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Alerts
CREATE TABLE IF NOT EXISTS corp_security_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'failed_login_spike', 'unusual_activity', 'data_breach', etc.
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_company_id ON corp_audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_user_id ON corp_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_created_at ON corp_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_action ON corp_audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_corp_security_events_company_id ON corp_security_events(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_security_events_severity ON corp_security_events(severity);
CREATE INDEX IF NOT EXISTS idx_corp_security_events_created_at ON corp_security_events(created_at);

CREATE INDEX IF NOT EXISTS idx_corp_encryption_keys_company_id ON corp_encryption_keys(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_encryption_keys_type ON corp_encryption_keys(key_type);

CREATE INDEX IF NOT EXISTS idx_corp_data_access_logs_user_id ON corp_data_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_data_access_logs_company_id ON corp_data_access_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_data_access_logs_created_at ON corp_data_access_logs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE corp_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_data_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_security_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit logs
DROP POLICY IF EXISTS "Users can view audit logs for their company" ON corp_audit_logs;
CREATE POLICY "Users can view audit logs for their company" ON corp_audit_logs
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can insert audit logs" ON corp_audit_logs;
CREATE POLICY "System can insert audit logs" ON corp_audit_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for security events
DROP POLICY IF EXISTS "Users can view security events for their company" ON corp_security_events;
CREATE POLICY "Users can view security events for their company" ON corp_security_events
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can insert security events" ON corp_security_events;
CREATE POLICY "System can insert security events" ON corp_security_events
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for encryption keys
DROP POLICY IF EXISTS "Users can view encryption keys for their company" ON corp_encryption_keys;
CREATE POLICY "Users can view encryption keys for their company" ON corp_encryption_keys
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can manage encryption keys" ON corp_encryption_keys;
CREATE POLICY "System can manage encryption keys" ON corp_encryption_keys
  FOR ALL USING (true);

-- Create RLS policies for data access logs
DROP POLICY IF EXISTS "Users can view their own data access logs" ON corp_data_access_logs;
CREATE POLICY "Users can view their own data access logs" ON corp_data_access_logs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can insert data access logs" ON corp_data_access_logs;
CREATE POLICY "System can insert data access logs" ON corp_data_access_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for privacy settings
DROP POLICY IF EXISTS "Users can manage their own privacy settings" ON corp_privacy_settings;
CREATE POLICY "Users can manage their own privacy settings" ON corp_privacy_settings
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for data retention policies
DROP POLICY IF EXISTS "Company owners can manage data retention policies" ON corp_data_retention_policies;
CREATE POLICY "Company owners can manage data retention policies" ON corp_data_retention_policies
  FOR ALL USING (
    company_id IN (
      SELECT id FROM corp_companies 
      WHERE owner_id = auth.uid()
    )
  );

-- Create RLS policies for rate limits
DROP POLICY IF EXISTS "Users can view their own rate limits" ON corp_rate_limits;
CREATE POLICY "Users can view their own rate limits" ON corp_rate_limits
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can manage rate limits" ON corp_rate_limits;
CREATE POLICY "System can manage rate limits" ON corp_rate_limits
  FOR ALL USING (true);

-- Create RLS policies for security alerts
DROP POLICY IF EXISTS "Users can view security alerts for their company" ON corp_security_alerts;
CREATE POLICY "Users can view security alerts for their company" ON corp_security_alerts
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can manage security alerts" ON corp_security_alerts;
CREATE POLICY "System can manage security alerts" ON corp_security_alerts
  FOR ALL USING (true);

-- Insert default data retention policies
INSERT INTO corp_data_retention_policies (company_id, data_type, retention_days, auto_delete)
SELECT 
  id as company_id,
  'audit_logs' as data_type,
  90 as retention_days,
  true as auto_delete
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_data_retention_policies 
  WHERE company_id = corp_companies.id AND data_type = 'audit_logs'
);

INSERT INTO corp_data_retention_policies (company_id, data_type, retention_days, auto_delete)
SELECT 
  id as company_id,
  'status_updates' as data_type,
  365 as retention_days,
  true as auto_delete
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
  true as auto_delete
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_data_retention_policies 
  WHERE company_id = corp_companies.id AND data_type = 'chat_messages'
);

-- Create a function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM corp_audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean up old security events
CREATE OR REPLACE FUNCTION cleanup_old_security_events()
RETURNS void AS $$
BEGIN
  DELETE FROM corp_security_events 
  WHERE created_at < NOW() - INTERVAL '180 days' 
  AND is_resolved = true;
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean up old data access logs
CREATE OR REPLACE FUNCTION cleanup_old_data_access_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM corp_data_access_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean up old rate limits
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM corp_rate_limits 
  WHERE created_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'Security tables created successfully!' as message;
