-- Fix RLS policies for corp_join_requests to allow CEO deletion
-- This allows company owners to delete join requests for their companies

-- Drop existing policies on corp_join_requests
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

-- Allow users to delete their own join requests
CREATE POLICY "Users can delete own join requests" ON corp_join_requests
  FOR DELETE USING (user_id = auth.uid());

-- Allow company owners to delete join requests for their companies
CREATE POLICY "Company owners can delete join requests" ON corp_join_requests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_join_requests.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );
