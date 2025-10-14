-- Migration script for existing Corporacity database
-- This script safely updates existing tables to match the new schema

-- First, let's check what tables exist and update them accordingly

-- Update corp_profiles table if it exists
DO $$ 
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'corp_profiles' AND column_name = 'phone') THEN
        ALTER TABLE corp_profiles ADD COLUMN phone text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'corp_profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE corp_profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Add constraints if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'corp_profiles_pkey') THEN
        ALTER TABLE corp_profiles ADD CONSTRAINT corp_profiles_pkey PRIMARY KEY (id);
    END IF;
END $$;

-- Update companies table to corp_companies if needed
DO $$
BEGIN
    -- Rename table if it exists as 'companies'
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
        ALTER TABLE companies RENAME TO corp_companies;
    END IF;
    
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'corp_companies' AND column_name = 'updated_at') THEN
        ALTER TABLE corp_companies ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Update memberships table to corp_memberships if needed
DO $$
BEGIN
    -- Rename table if it exists as 'memberships'
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'memberships') THEN
        ALTER TABLE memberships RENAME TO corp_memberships;
    END IF;
    
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'corp_memberships_user_id_company_id_key') THEN
        ALTER TABLE corp_memberships ADD CONSTRAINT corp_memberships_user_id_company_id_key UNIQUE (user_id, company_id);
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'corp_memberships' AND column_name = 'updated_at') THEN
        ALTER TABLE corp_memberships ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Update join_requests table to corp_join_requests if needed
DO $$
BEGIN
    -- Rename table if it exists as 'join_requests'
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'join_requests') THEN
        ALTER TABLE join_requests RENAME TO corp_join_requests;
    END IF;
    
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'corp_join_requests_user_id_company_id_key') THEN
        ALTER TABLE corp_join_requests ADD CONSTRAINT corp_join_requests_user_id_company_id_key UNIQUE (user_id, company_id);
    END IF;
END $$;

-- Update statuses table to corp_statuses if needed
DO $$
BEGIN
    -- Rename table if it exists as 'statuses'
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'statuses') THEN
        ALTER TABLE statuses RENAME TO corp_statuses;
    END IF;
END $$;

-- Create status_type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_type') THEN
        CREATE TYPE status_type AS ENUM ('present','late','leave','visit','short_leave');
    END IF;
END $$;

-- Update corp_statuses table to use the enum type
DO $$
BEGIN
    -- Check if the type column exists and update it to use the enum
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'corp_statuses' AND column_name = 'type') THEN
        -- First, let's see what the current type is
        IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'corp_statuses' AND column_name = 'type') != 'USER-DEFINED' THEN
            -- Update existing data to match enum values
            UPDATE corp_statuses SET type = 'present' WHERE type = 'Present';
            UPDATE corp_statuses SET type = 'late' WHERE type = 'Late';
            UPDATE corp_statuses SET type = 'leave' WHERE type = 'Leave';
            UPDATE corp_statuses SET type = 'visit' WHERE type = 'Visit';
            UPDATE corp_statuses SET type = 'short_leave' WHERE type = 'Short Leave';
            
            -- Change column type to enum
            ALTER TABLE corp_statuses ALTER COLUMN type TYPE status_type USING type::status_type;
        END IF;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_corp_statuses_company_id_timestamp ON corp_statuses (company_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_corp_statuses_user_id ON corp_statuses (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_memberships_user_id ON corp_memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_memberships_company_id ON corp_memberships (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_user_id ON corp_join_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_join_requests_company_id ON corp_join_requests (company_id);

-- Add foreign key constraint for join requests if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_cjr_company') THEN
        ALTER TABLE corp_join_requests 
        ADD CONSTRAINT fk_cjr_company 
        FOREIGN KEY (company_id) REFERENCES corp_companies(id);
    END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at if they don't exist
DO $$
BEGIN
    -- Trigger for corp_companies
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_corp_companies_updated_at') THEN
        CREATE TRIGGER update_corp_companies_updated_at 
        BEFORE UPDATE ON corp_companies
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger for corp_memberships
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_corp_memberships_updated_at') THEN
        CREATE TRIGGER update_corp_memberships_updated_at 
        BEFORE UPDATE ON corp_memberships
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger for corp_profiles
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_corp_profiles_updated_at') THEN
        CREATE TRIGGER update_corp_profiles_updated_at 
        BEFORE UPDATE ON corp_profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Add constraints for data integrity if they don't exist
DO $$
BEGIN
    -- Company name constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'corp_companies_name_not_empty') THEN
        ALTER TABLE corp_companies ADD CONSTRAINT corp_companies_name_not_empty CHECK (length(trim(name)) > 0);
    END IF;
    
    -- Company code format constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'corp_companies_code_format') THEN
        ALTER TABLE corp_companies ADD CONSTRAINT corp_companies_code_format CHECK (code ~ '^[A-Z0-9]{5,10}$');
    END IF;
    
    -- Membership role constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'corp_memberships_role_valid') THEN
        ALTER TABLE corp_memberships ADD CONSTRAINT corp_memberships_role_valid CHECK (role IN ('owner', 'employee', 'admin'));
    END IF;
    
    -- Status type constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'corp_statuses_type_valid') THEN
        ALTER TABLE corp_statuses ADD CONSTRAINT corp_statuses_type_valid CHECK (type IN ('present', 'late', 'leave', 'visit', 'short_leave'));
    END IF;
END $$;

-- Success message
SELECT 'Migration completed successfully! All tables have been updated to the new schema.' as message;
