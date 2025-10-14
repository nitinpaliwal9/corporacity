-- TEMPORARILY DISABLE RLS TO TEST COMPANY CREATION
-- Run this to temporarily disable RLS and test if company creation works
-- This will help us confirm if the issue is with RLS policies

-- Disable RLS on all tables temporarily
ALTER TABLE corp_companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE corp_memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE corp_join_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE corp_statuses DISABLE ROW LEVEL SECURITY;
ALTER TABLE corp_profiles DISABLE ROW LEVEL SECURITY;

-- Check if RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('corp_companies', 'corp_memberships', 'corp_join_requests', 'corp_statuses', 'corp_profiles')
ORDER BY tablename;
