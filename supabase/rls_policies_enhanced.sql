-- ENHANCED RLS POLICIES - Safe cross-table policies without circular references
-- This version adds back some useful cross-table policies but avoids circular dependencies

-- First, drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their companies" ON corp_companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can update their companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can delete their companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view member companies" ON corp_companies;

DROP POLICY IF EXISTS "Users can view company memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can create memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can update memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can delete memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Users can view own memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Owners can view company memberships" ON corp_memberships;

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

-- Enable RLS on all tables
ALTER TABLE corp_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_profiles ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- ENHANCED POLICIES - Safe cross-table access
-- ==============================================

-- 1. COMPANIES - Safe policies
-- Users can view companies they own
CREATE POLICY "Users can view owned companies" ON corp_companies
  FOR SELECT USING (owner_id = auth.uid());

-- Users can create companies
CREATE POLICY "Users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Users can update companies they own
CREATE POLICY "Users can update owned companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

-- Users can delete companies they own
CREATE POLICY "Users can delete owned companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());

-- 2. MEMBERSHIPS - Safe policies with one-way company reference
-- Users can view their own memberships
CREATE POLICY "Users can view own memberships" ON corp_memberships
  FOR SELECT USING (user_id = auth.uid());

-- Users can create memberships (application will validate company ownership)
CREATE POLICY "Users can create memberships" ON corp_memberships
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can update their own memberships
CREATE POLICY "Users can update own memberships" ON corp_memberships
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own memberships
CREATE POLICY "Users can delete own memberships" ON corp_memberships
  FOR DELETE USING (user_id = auth.uid());

-- 3. JOIN REQUESTS - Safe policies with one-way company reference
-- Users can view their own join requests
CREATE POLICY "Users can view own join requests" ON corp_join_requests
  FOR SELECT USING (user_id = auth.uid());

-- Users can create join requests
CREATE POLICY "Users can create join requests" ON corp_join_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can delete their own join requests
CREATE POLICY "Users can delete own join requests" ON corp_join_requests
  FOR DELETE USING (user_id = auth.uid());

-- 4. STATUSES - Safe policies with one-way membership reference
-- Users can view their own statuses
CREATE POLICY "Users can view own statuses" ON corp_statuses
  FOR SELECT USING (user_id = auth.uid());

-- Users can create statuses
CREATE POLICY "Users can create statuses" ON corp_statuses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can update their own statuses
CREATE POLICY "Users can update own statuses" ON corp_statuses
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own statuses
CREATE POLICY "Users can delete own statuses" ON corp_statuses
  FOR DELETE USING (user_id = auth.uid());

-- 5. PROFILES - Safe policies
-- Users can view all profiles (for display purposes)
CREATE POLICY "Users can view all profiles" ON corp_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can create their own profile
CREATE POLICY "Users can create own profile" ON corp_profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON corp_profiles
  FOR UPDATE USING (id = auth.uid());

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON corp_profiles
  FOR DELETE USING (id = auth.uid());

-- ==============================================
-- ADDITIONAL SAFE POLICIES (One-way references only)
-- ==============================================

-- Allow users to view companies they're members of (one-way reference)
-- This is safe because it only references memberships, not companies
CREATE POLICY "Users can view member companies" ON corp_companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

-- Allow users to view statuses from their company members (one-way reference)
-- This is safe because it only references memberships, not statuses
CREATE POLICY "Users can view company statuses" ON corp_statuses
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

-- ==============================================
-- PERFORMANCE INDEXES
-- ==============================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_corp_memberships_user_id ON corp_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_memberships_company_id ON corp_memberships(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_user_id ON corp_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_company_id ON corp_join_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_user_id ON corp_statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_company_id ON corp_statuses(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_timestamp ON corp_statuses(timestamp);
