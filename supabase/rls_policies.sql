-- Row Level Security (RLS) Policies for Corporacity
-- Run this in Supabase SQL Editor after the main schema

-- Enable RLS on all tables
ALTER TABLE corp_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_profiles ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- COMPANIES TABLE POLICIES
-- ==============================================

-- Users can view companies they own or are members of
CREATE POLICY "Users can view their companies" ON corp_companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    ) OR owner_id = auth.uid()
  );

-- Only authenticated users can create companies
CREATE POLICY "Authenticated users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Only company owners can update their companies
CREATE POLICY "Owners can update their companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

-- Only company owners can delete their companies
CREATE POLICY "Owners can delete their companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());

-- ==============================================
-- MEMBERSHIPS TABLE POLICIES
-- ==============================================

-- Users can view memberships for companies they're part of
CREATE POLICY "Users can view company memberships" ON corp_memberships
  FOR SELECT USING (
    user_id = auth.uid() OR 
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );

-- Only company owners can create memberships (approve join requests)
CREATE POLICY "Company owners can create memberships" ON corp_memberships
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );

-- Only company owners can update memberships
CREATE POLICY "Company owners can update memberships" ON corp_memberships
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );

-- Only company owners can delete memberships
CREATE POLICY "Company owners can delete memberships" ON corp_memberships
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );

-- ==============================================
-- JOIN_REQUESTS TABLE POLICIES
-- ==============================================

-- Users can view their own join requests
CREATE POLICY "Users can view their join requests" ON corp_join_requests
  FOR SELECT USING (user_id = auth.uid());

-- Company owners can view join requests for their companies
CREATE POLICY "Company owners can view join requests" ON corp_join_requests
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );

-- Authenticated users can create join requests
CREATE POLICY "Authenticated users can create join requests" ON corp_join_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can delete their own join requests
CREATE POLICY "Users can delete their join requests" ON corp_join_requests
  FOR DELETE USING (user_id = auth.uid());

-- Company owners can delete join requests for their companies
CREATE POLICY "Company owners can delete join requests" ON corp_join_requests
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );

-- ==============================================
-- STATUSES TABLE POLICIES
-- ==============================================

-- Users can view statuses for companies they're members of
CREATE POLICY "Users can view company statuses" ON corp_statuses
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

-- Users can create statuses for companies they're members of
CREATE POLICY "Members can create statuses" ON corp_statuses
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

-- Users can update their own statuses
CREATE POLICY "Users can update their statuses" ON corp_statuses
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own statuses
CREATE POLICY "Users can delete their statuses" ON corp_statuses
  FOR DELETE USING (user_id = auth.uid());

-- ==============================================
-- CORP_PROFILES TABLE POLICIES
-- ==============================================

-- Users can view all profiles (for display purposes)
CREATE POLICY "Users can view all profiles" ON corp_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can create their own profile
CREATE POLICY "Users can create their profile" ON corp_profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their profile" ON corp_profiles
  FOR UPDATE USING (id = auth.uid());

-- Users can delete their own profile
CREATE POLICY "Users can delete their profile" ON corp_profiles
  FOR DELETE USING (id = auth.uid());

-- ==============================================
-- ADDITIONAL SECURITY MEASURES
-- ==============================================

-- Create indexes for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_corp_memberships_user_id ON corp_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_memberships_company_id ON corp_memberships(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_user_id ON corp_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_company_id ON corp_join_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_user_id ON corp_statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_company_id ON corp_statuses(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_timestamp ON corp_statuses(timestamp);

-- Add constraints for data integrity
ALTER TABLE corp_companies ADD CONSTRAINT corp_companies_name_not_empty CHECK (length(trim(name)) > 0);
ALTER TABLE corp_companies ADD CONSTRAINT corp_companies_code_format CHECK (code ~ '^[A-Z0-9]{5,10}$');
ALTER TABLE corp_memberships ADD CONSTRAINT corp_memberships_role_valid CHECK (role IN ('owner', 'employee', 'admin'));
ALTER TABLE corp_statuses ADD CONSTRAINT corp_statuses_type_valid CHECK (type IN ('present', 'late', 'leave', 'visit', 'short_leave'));

-- Add updated_at triggers for audit trail
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at columns to relevant tables
ALTER TABLE corp_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE corp_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create triggers for updated_at
CREATE TRIGGER update_corp_companies_updated_at BEFORE UPDATE ON corp_companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_memberships_updated_at BEFORE UPDATE ON corp_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_profiles_updated_at BEFORE UPDATE ON corp_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
