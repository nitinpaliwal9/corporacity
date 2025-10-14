-- RLS Migration script for existing Corporacity database
-- This script safely applies RLS policies to existing tables

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE corp_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_statuses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their companies" ON corp_companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can update their companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can delete their companies" ON corp_companies;

DROP POLICY IF EXISTS "Users can view company memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can create memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can update memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can delete memberships" ON corp_memberships;

DROP POLICY IF EXISTS "Users can view their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can view join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Authenticated users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can delete join requests" ON corp_join_requests;

DROP POLICY IF EXISTS "Users can view company statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Members can create statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can update their statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can delete their statuses" ON corp_statuses;

DROP POLICY IF EXISTS "Users can view all profiles" ON corp_profiles;
DROP POLICY IF EXISTS "Users can create their profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can delete their profile" ON corp_profiles;

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

-- Success message
SELECT 'RLS policies applied successfully! All tables are now secured with Row Level Security.' as message;
