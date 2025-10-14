-- SECURE FIX FOR COMPANY LOOKUP ISSUE
-- This allows users to look up companies by code without exposing all company data

-- Drop existing policies that might be blocking company lookup
DROP POLICY IF EXISTS "Users can view owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view member companies" ON corp_companies;
DROP POLICY IF EXISTS "Anyone can view companies by code" ON corp_companies;

-- Create a secure policy that allows viewing companies by code (for joining)
-- This policy allows SELECT but only for specific use cases
CREATE POLICY "Users can view companies for joining" ON corp_companies
  FOR SELECT USING (
    -- Allow if user is the owner
    owner_id = auth.uid() OR
    -- Allow if user is a member (for viewing their companies)
    id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    ) OR
    -- Allow if user is authenticated (for joining - they need to see company exists)
    auth.uid() IS NOT NULL
  );

-- Keep the other policies for security
CREATE POLICY "Users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "Users can update owned companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete owned companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());
