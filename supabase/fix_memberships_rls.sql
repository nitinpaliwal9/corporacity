-- Fix RLS policies for corp_memberships to allow CEO approval
-- This allows company owners to create memberships for other users

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

-- Create new policies for memberships
CREATE POLICY "Users can view own memberships" ON corp_memberships
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can view memberships" ON corp_memberships
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow users to create their own memberships (for self-joining)
CREATE POLICY "Users can create own memberships" ON corp_memberships
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Allow company owners to create memberships for others (for CEO approval)
CREATE POLICY "Company owners can create memberships" ON corp_memberships
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_memberships.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- Allow users to update their own memberships
CREATE POLICY "Users can update own memberships" ON corp_memberships
  FOR UPDATE USING (user_id = auth.uid());

-- Allow company owners to update memberships in their companies
CREATE POLICY "Company owners can update memberships" ON corp_memberships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_memberships.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- Allow users to delete their own memberships
CREATE POLICY "Users can delete own memberships" ON corp_memberships
  FOR DELETE USING (user_id = auth.uid());

-- Allow company owners to delete memberships in their companies
CREATE POLICY "Company owners can delete memberships" ON corp_memberships
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_memberships.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );
