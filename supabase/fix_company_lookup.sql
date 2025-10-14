-- FIX COMPANY LOOKUP ISSUE
-- This will allow users to look up companies by code for joining

-- First, let's add a policy that allows anyone to view companies by code
-- This is needed for the join functionality to work

-- Drop existing policies that might be blocking company lookup
DROP POLICY IF EXISTS "Users can view owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view member companies" ON corp_companies;

-- Create a new policy that allows viewing companies by code (for joining)
CREATE POLICY "Anyone can view companies by code" ON corp_companies
  FOR SELECT USING (true);

-- Keep the other policies for security
CREATE POLICY "Users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "Users can update owned companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete owned companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());
