-- FIX JOIN REQUESTS DISPLAY ISSUE
-- This allows company owners to see join requests for their companies

-- Drop ALL existing policies on corp_join_requests
DROP POLICY IF EXISTS "Users can view their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can view join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Authenticated users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can delete join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can view own join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete own join requests" ON corp_join_requests;

-- Create new policies for join requests
-- 1. Users can view their own join requests
CREATE POLICY "Users can view own join requests" ON corp_join_requests
  FOR SELECT USING (user_id = auth.uid());

-- 2. Company owners can view join requests for their companies
CREATE POLICY "Company owners can view join requests" ON corp_join_requests
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );

-- 3. Authenticated users can create join requests
CREATE POLICY "Users can create join requests" ON corp_join_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 4. Users can delete their own join requests
CREATE POLICY "Users can delete own join requests" ON corp_join_requests
  FOR DELETE USING (user_id = auth.uid());

-- 5. Company owners can delete join requests for their companies
CREATE POLICY "Company owners can delete join requests" ON corp_join_requests
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM corp_companies WHERE owner_id = auth.uid()
    )
  );
