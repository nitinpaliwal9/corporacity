-- Audit Logs and Security schema - FIXED VERSION
-- This creates the audit logs table for security monitoring
-- Create audit logs table
CREATE TABLE IF NOT EXISTS corp_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES corp_companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_company_id ON corp_audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_user_id ON corp_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_action ON corp_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_severity ON corp_audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_created_at ON corp_audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE corp_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit logs
CREATE POLICY "Company owners can view audit logs" ON corp_audit_logs
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "System can create audit logs" ON corp_audit_logs
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

-- Function to create audit log entry (FIXED - parameters reordered)
CREATE OR REPLACE FUNCTION create_audit_log(
  p_company_id UUID,
  p_action VARCHAR(100),
  p_description TEXT,
  p_user_id UUID DEFAULT NULL,
  p_severity VARCHAR(20) DEFAULT 'low',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO corp_audit_logs (
    company_id,
    user_id,
    action,
    description,
    severity,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_company_id,
    p_user_id,
    p_action,
    p_description,
    p_severity,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user login
CREATE OR REPLACE FUNCTION log_user_login(
  p_company_id UUID,
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'login',
    'User logged in successfully',
    p_user_id,
    'low',
    p_ip_address,
    p_user_agent,
    '{}'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log failed login
CREATE OR REPLACE FUNCTION log_failed_login(
  p_company_id UUID,
  p_reason TEXT,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'login_failed',
    p_reason,
    p_user_id,
    'medium',
    p_ip_address,
    p_user_agent,
    '{}'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user logout
CREATE OR REPLACE FUNCTION log_user_logout(
  p_company_id UUID,
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'logout',
    'User logged out',
    p_user_id,
    'low',
    p_ip_address,
    p_user_agent,
    '{}'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log status update
CREATE OR REPLACE FUNCTION log_status_update(
  p_company_id UUID,
  p_user_id UUID,
  p_status_type VARCHAR(50),
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'status_update',
    'User updated status to: ' || p_status_type,
    p_user_id,
    'low',
    p_ip_address,
    p_user_agent,
    jsonb_build_object('status_type', p_status_type)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log join request
CREATE OR REPLACE FUNCTION log_join_request(
  p_company_id UUID,
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'join_request',
    'User requested to join company',
    p_user_id,
    'low',
    p_ip_address,
    p_user_agent,
    '{}'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log approval
CREATE OR REPLACE FUNCTION log_approval(
  p_company_id UUID,
  p_user_id UUID,
  p_approved_by UUID,
  p_action_type VARCHAR(50),
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'approval',
    'User request approved: ' || p_action_type,
    p_user_id,
    'low',
    p_ip_address,
    p_user_agent,
    jsonb_build_object('approved_by', p_approved_by, 'action_type', p_action_type)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log data access
CREATE OR REPLACE FUNCTION log_data_access(
  p_company_id UUID,
  p_user_id UUID,
  p_data_type VARCHAR(100),
  p_access_type VARCHAR(50),
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'data_access',
    'User accessed: ' || p_data_type || ' (' || p_access_type || ')',
    p_user_id,
    'low',
    p_ip_address,
    p_user_agent,
    jsonb_build_object('data_type', p_data_type, 'access_type', p_access_type)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log permission changes
CREATE OR REPLACE FUNCTION log_permission_change(
  p_company_id UUID,
  p_user_id UUID,
  p_changed_by UUID,
  p_old_role VARCHAR(50),
  p_new_role VARCHAR(50),
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  RETURN create_audit_log(
    p_company_id,
    'permission_change',
    'User role changed from ' || p_old_role || ' to ' || p_new_role,
    p_user_id,
    'high',
    p_ip_address,
    p_user_agent,
    jsonb_build_object('changed_by', p_changed_by, 'old_role', p_old_role, 'new_role', p_new_role)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
