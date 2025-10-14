-- SIMPLE FIX FOR COMPANY LOOKUP ISSUE
-- This allows anyone to look up companies by code (needed for joining)

-- Drop existing policies that might be blocking company lookup
DROP POLICY IF EXISTS "Users can view owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view member companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view companies for joining" ON corp_companies;

-- Create a simple policy that allows viewing companies by code
-- This is needed for the join functionality to work
CREATE POLICY "Allow company lookup for joining" ON corp_companies
  FOR SELECT USING (true);

-- Keep the other policies for security
CREATE POLICY "Users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "Users can update owned companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete owned companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());
