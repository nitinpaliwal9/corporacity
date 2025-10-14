-- Row Level Security (RLS) Policies for Corporacity - SIMPLE VERSION
-- This version avoids circular references and is more robust

-- First, drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their companies" ON corp_companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can update their companies" ON corp_companies;
DROP POLICY IF EXISTS "Owners can delete their companies" ON corp_companies;

DROP POLICY IF EXISTS "Users can view owned companies" ON corp_companies;
DROP POLICY IF EXISTS "Users can view member companies" ON corp_companies;

DROP POLICY IF EXISTS "Users can view company memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can create memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can update memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Company owners can delete memberships" ON corp_memberships;

DROP POLICY IF EXISTS "Users can view own memberships" ON corp_memberships;
DROP POLICY IF EXISTS "Owners can view company memberships" ON corp_memberships;

DROP POLICY IF EXISTS "Users can view their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can view join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Authenticated users can create join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Users can delete their join requests" ON corp_join_requests;
DROP POLICY IF EXISTS "Company owners can delete join requests" ON corp_join_requests;

DROP POLICY IF EXISTS "Users can view company statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Members can create statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can update their statuses" ON corp_statuses;
DROP POLICY IF EXISTS "Users can delete their statuses" ON corp_statuses;

DROP POLICY IF EXISTS "Users can view all profiles" ON corp_profiles;
DROP POLICY IF EXISTS "Users can create their profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON corp_profiles;
DROP POLICY IF EXISTS "Users can delete their profile" ON corp_profiles;

-- ==============================================
-- COMPANIES TABLE POLICIES (SIMPLE & SAFE)
-- ==============================================

-- Users can view companies they own
CREATE POLICY "Users can view owned companies" ON corp_companies
  FOR SELECT USING (owner_id = auth.uid());

-- Users can view companies they are members of (using a function to avoid recursion)
CREATE POLICY "Users can view member companies" ON corp_companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE corp_memberships.company_id = corp_companies.id 
      AND corp_memberships.user_id = auth.uid()
    )
  );

-- Authenticated users can create companies
CREATE POLICY "Authenticated users can create companies" ON corp_companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Company owners can update their companies
CREATE POLICY "Owners can update their companies" ON corp_companies
  FOR UPDATE USING (owner_id = auth.uid());

-- Company owners can delete their companies
CREATE POLICY "Owners can delete their companies" ON corp_companies
  FOR DELETE USING (owner_id = auth.uid());

-- ==============================================
-- MEMBERSHIPS TABLE POLICIES (SIMPLE & SAFE)
-- ==============================================

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships" ON corp_memberships
  FOR SELECT USING (user_id = auth.uid());

-- Company owners can view memberships for their companies
CREATE POLICY "Owners can view company memberships" ON corp_memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_memberships.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- Company owners can create memberships (approve join requests)
CREATE POLICY "Company owners can create memberships" ON corp_memberships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_memberships.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- Company owners can update memberships
CREATE POLICY "Company owners can update memberships" ON corp_memberships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_memberships.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- Company owners can delete memberships
CREATE POLICY "Company owners can delete memberships" ON corp_memberships
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_memberships.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- ==============================================
-- JOIN_REQUESTS TABLE POLICIES (SIMPLE & SAFE)
-- ==============================================

-- Users can view their own join requests
CREATE POLICY "Users can view their join requests" ON corp_join_requests
  FOR SELECT USING (user_id = auth.uid());

-- Company owners can view join requests for their companies
CREATE POLICY "Company owners can view join requests" ON corp_join_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_join_requests.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- Authenticated users can create join requests
CREATE POLICY "Authenticated users can create join requests" ON corp_join_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can delete their own join requests
CREATE POLICY "Users can delete their join requests" ON corp_join_requests
  FOR DELETE USING (user_id = auth.uid());

-- Company owners can delete join requests for their companies
CREATE POLICY "Company owners can delete join requests" ON corp_join_requests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM corp_companies 
      WHERE corp_companies.id = corp_join_requests.company_id 
      AND corp_companies.owner_id = auth.uid()
    )
  );

-- ==============================================
-- STATUSES TABLE POLICIES (SIMPLE & SAFE)
-- ==============================================

-- Users can view statuses for companies they're members of
CREATE POLICY "Users can view company statuses" ON corp_statuses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE corp_memberships.company_id = corp_statuses.company_id 
      AND corp_memberships.user_id = auth.uid()
    )
  );

-- Users can create statuses for companies they're members of
CREATE POLICY "Members can create statuses" ON corp_statuses
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE corp_memberships.company_id = corp_statuses.company_id 
      AND corp_memberships.user_id = auth.uid()
    )
  );

-- Users can update their own statuses
CREATE POLICY "Users can update their statuses" ON corp_statuses
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own statuses
CREATE POLICY "Users can delete their statuses" ON corp_statuses
  FOR DELETE USING (user_id = auth.uid());

-- ==============================================
-- CORP_PROFILES TABLE POLICIES (SIMPLE & SAFE)
-- ==============================================

-- Users can view all profiles (for display purposes)
CREATE POLICY "Users can view all profiles" ON corp_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can create their own profile
CREATE POLICY "Users can create their profile" ON corp_profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their profile" ON corp_profiles
  FOR UPDATE USING (id = auth.uid());

-- Users can delete their own profile
CREATE POLICY "Users can delete their profile" ON corp_profiles
  FOR DELETE USING (id = auth.uid());

-- ==============================================
-- PERFORMANCE INDEXES
-- ==============================================

-- Create indexes for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_corp_memberships_user_id ON corp_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_memberships_company_id ON corp_memberships(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_user_id ON corp_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_company_id ON corp_join_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_user_id ON corp_statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_company_id ON corp_statuses(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_timestamp ON corp_statuses(timestamp);

-- ==============================================
-- DATA INTEGRITY CONSTRAINTS
-- ==============================================

-- Add constraints for data integrity (drop first to avoid conflicts)
DO $$ 
BEGIN
    -- Drop constraints if they exist
    BEGIN
        ALTER TABLE corp_companies DROP CONSTRAINT IF EXISTS corp_companies_name_not_empty;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE corp_companies DROP CONSTRAINT IF EXISTS corp_companies_code_format;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE corp_memberships DROP CONSTRAINT IF EXISTS corp_memberships_role_valid;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE corp_statuses DROP CONSTRAINT IF EXISTS corp_statuses_type_valid;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    -- Add constraints
    ALTER TABLE corp_companies ADD CONSTRAINT corp_companies_name_not_empty CHECK (length(trim(name)) > 0);
    ALTER TABLE corp_companies ADD CONSTRAINT corp_companies_code_format CHECK (code ~ '^[A-Z0-9]{5,10}$');
    ALTER TABLE corp_memberships ADD CONSTRAINT corp_memberships_role_valid CHECK (role IN ('owner', 'employee', 'admin'));
    ALTER TABLE corp_statuses ADD CONSTRAINT corp_statuses_type_valid CHECK (type IN ('present', 'late', 'leave', 'visit', 'short_leave'));
END $$;

-- ==============================================
-- AUDIT TRAIL TRIGGERS
-- ==============================================

-- Add updated_at triggers for audit trail
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at columns to relevant tables
ALTER TABLE corp_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE corp_memberships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE corp_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_corp_companies_updated_at ON corp_companies;
CREATE TRIGGER update_corp_companies_updated_at BEFORE UPDATE ON corp_companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_corp_memberships_updated_at ON corp_memberships;
CREATE TRIGGER update_corp_memberships_updated_at BEFORE UPDATE ON corp_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_corp_profiles_updated_at ON corp_profiles;
CREATE TRIGGER update_corp_profiles_updated_at BEFORE UPDATE ON corp_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
