-- Simple fix for corp_memberships RLS - more permissive for testing
-- This allows any authenticated user to create memberships

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
DROP POLICY IF EXISTS "Authenticated users can view memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Users can create own memberships" ON corp_memberships;

-- Create simple, permissive policies
CREATE POLICY "Authenticated users can view memberships" ON corp_memberships
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create memberships" ON corp_memberships
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own memberships" ON corp_memberships
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own memberships" ON corp_memberships
  FOR DELETE USING (user_id = auth.uid());
