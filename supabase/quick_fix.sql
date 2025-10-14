-- QUICK FIX for infinite recursion error
-- Run this in Supabase SQL Editor to fix the create company issue

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view their companies" ON corp_companies;

-- Create a simpler, safer policy for viewing companies
CREATE POLICY "Users can view owned companies" ON corp_companies
  FOR SELECT USING (owner_id = auth.uid());

-- Create a separate policy for viewing companies they're members of
CREATE POLICY "Users can view member companies" ON corp_companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE corp_memberships.company_id = corp_companies.id 
      AND corp_memberships.user_id = auth.uid()
    )
  );

-- Ensure the create policy is simple and doesn't cause recursion
DROP POLICY IF EXISTS "Authenticated users can create companies" ON corp_companies;
CREATE POLICY "Authenticated users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());
