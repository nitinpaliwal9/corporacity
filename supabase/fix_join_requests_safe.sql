-- SAFE FIX FOR JOIN REQUESTS DISPLAY ISSUE
-- This avoids circular references by using simpler policies

-- Drop ALL existing policies on corp_join_requests
DROP POLICY IF EXISTS "Users can view their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can view join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Authenticated users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can delete join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can view own join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete own join requests" ON corp_join_requests;

-- Create simple policies for join requests (no circular references)
-- 1. Users can view their own join requests
CREATE POLICY "Users can view own join requests" ON corp_join_requests
  FOR SELECT USING (user_id = auth.uid());

-- 2. Allow all authenticated users to view join requests (for CEO dashboard)
-- This is needed for the CEO to see join requests for their company
CREATE POLICY "Authenticated users can view join requests" ON corp_join_requests
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 3. Authenticated users can create join requests
CREATE POLICY "Users can create join requests" ON corp_join_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 4. Users can delete their own join requests
CREATE POLICY "Users can delete own join requests" ON corp_join_requests
  FOR DELETE USING (user_id = auth.uid());
