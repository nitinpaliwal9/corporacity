-- COMPREHENSIVE FIX FOR ALL RLS POLICIES
-- This fixes company lookup, join requests, and related data access

-- ==============================================
-- 1. FIX COMPANIES TABLE
-- ==============================================

-- Drop ALL existing policies on corp_companies
DROP POLICY IF EXISTS "Users can view owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view member companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view companies for joining" ON corp_companies;
DROP POLICY IF EXISTS "Allow company lookup for joining" ON corp_companies;
DROP POLICY IF EXISTS "Users can create companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can update owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can delete owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can update their companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can delete their companies" ON corp_companies;

-- Create new policies for companies
CREATE POLICY "Allow company lookup for joining" ON corp_companies
  FOR SELECT USING (true);

CREATE POLICY "Users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "Users can update owned companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete owned companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());

-- ==============================================
-- 2. FIX JOIN REQUESTS TABLE
-- ==============================================

-- Drop ALL existing policies on corp_join_requests
DROP POLICY IF EXISTS "Users can view their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can view join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Authenticated users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can delete join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can view own join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete own join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Authenticated users can view join requests" ON corp_join_requests;

-- Create new policies for join requests
CREATE POLICY "Users can view own join requests" ON corp_join_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can view join requests" ON corp_join_requests
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create join requests" ON corp_join_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can delete own join requests" ON corp_join_requests
  FOR DELETE USING (user_id = auth.uid());

-- ==============================================
-- 3. FIX PROFILES TABLE (for enriched queries)
-- ==============================================

-- Drop existing policies on corp_profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON corp_profiles;
DROP POLICY IF EXISTS "Users can create their profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can delete their profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON corp_profiles;

-- Create new policies for profiles
CREATE POLICY "Users can view all profiles" ON corp_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create own profile" ON corp_profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

CREATE POLICY "Users can update own profile" ON corp_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can delete own profile" ON corp_profiles
  FOR DELETE USING (id = auth.uid());

-- ==============================================
-- 4. FIX MEMBERSHIPS TABLE
-- ==============================================

-- Drop existing policies on corp_memberships
DROP POLICY IF EXISTS "Users can view company memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can create memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can update memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can delete memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Users can view own memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Users can update own memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Users can delete own memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Owners can view company memberships" ON corp_memberships;

-- Create new policies for memberships
CREATE POLICY "Users can view own memberships" ON corp_memberships
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can view memberships" ON corp_memberships
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create memberships" ON corp_memberships
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update own memberships" ON corp_memberships
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own memberships" ON corp_memberships
  FOR DELETE USING (user_id = auth.uid());

-- ==============================================
-- 5. FIX STATUSES TABLE
-- ==============================================

-- Drop existing policies on corp_statuses
DROP POLICY IF EXISTS "Users can view company statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Members can create statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can update their statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can delete their statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can view own statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can create statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can update own statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can delete own statuses" ON corp_statuses;

-- Create new policies for statuses
CREATE POLICY "Users can view own statuses" ON corp_statuses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can view statuses" ON corp_statuses
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create statuses" ON corp_statuses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update own statuses" ON corp_statuses
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own statuses" ON corp_statuses
  FOR DELETE USING (user_id = auth.uid());
