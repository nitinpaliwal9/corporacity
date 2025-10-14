-- DIAGNOSE RLS POLICIES - Run this to see what policies are currently active
-- This will help us identify the exact cause of the infinite recursion

-- 1. Check all current policies on corp_companies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'corp_companies'
ORDER BY policyname;

-- 2. Check all current policies on corp_memberships
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'corp_memberships'
ORDER BY policyname;

-- 3. Check if RLS is enabled on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('corp_companies', 'corp_memberships', 'corp_join_requests', 'corp_statuses', 'corp_profiles')
ORDER BY tablename;

-- 4. Check for any circular dependencies in policies
-- This query will show policies that reference other tables
SELECT 
    p1.tablename as table1,
    p1.policyname as policy1,
    p1.qual as condition1,
    p2.tablename as table2,
    p2.policyname as policy2,
    p2.qual as condition2
FROM pg_policies p1
JOIN pg_policies p2 ON p1.qual LIKE '%' || p2.tablename || '%' 
    AND p2.qual LIKE '%' || p1.tablename || '%'
WHERE p1.tablename != p2.tablename
    AND p1.tablename IN ('corp_companies', 'corp_memberships', 'corp_join_requests', 'corp_statuses', 'corp_profiles')
    AND p2.tablename IN ('corp_companies', 'corp_memberships', 'corp_join_requests', 'corp_statuses', 'corp_profiles');
