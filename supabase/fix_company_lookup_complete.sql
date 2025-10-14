-- COMPLETE FIX FOR COMPANY LOOKUP ISSUE
-- This drops ALL existing policies and creates new ones

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

-- Create new policies
-- 1. Allow anyone to view companies (needed for joining)
CREATE POLICY "Allow company lookup for joining" ON corp_companies
  FOR SELECT USING (true);

-- 2. Only authenticated users can create companies
CREATE POLICY "Users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- 3. Only company owners can update their companies
CREATE POLICY "Users can update owned companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

-- 4. Only company owners can delete their companies
CREATE POLICY "Users can delete owned companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());
