-- Quick Fix for Audit Logs Error
-- Run this script in your Supabase SQL editor to fix the audit logs issue

-- Create the audit logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS corp_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  severity TEXT DEFAULT 'info',
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE corp_audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view audit logs for their company" ON corp_audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON corp_audit_logs;

-- Create policies
CREATE POLICY "Users can view audit logs for their company" ON corp_audit_logs
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit logs" ON corp_audit_logs
  FOR INSERT WITH CHECK (true);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_company_id ON corp_audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_user_id ON corp_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_audit_logs_created_at ON corp_audit_logs(created_at);

-- Success message
SELECT 'Audit logs table created successfully! The error should now be fixed.' as message;
