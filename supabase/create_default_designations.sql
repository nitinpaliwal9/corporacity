-- Create Default Designations for Companies
-- Run this script in your Supabase SQL editor to add default designations

-- Insert default designations for all existing companies
INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'CEO' as name,
  'Chief Executive Officer' as description,
  1 as level,
  'Executive' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'CEO'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'CTO' as name,
  'Chief Technology Officer' as description,
  2 as level,
  'Executive' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'CTO'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'Manager' as name,
  'Team Manager' as description,
  3 as level,
  'Management' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'Manager'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'Senior Software Engineer' as name,
  'Senior Software Engineer' as description,
  4 as level,
  'Engineering' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'Senior Software Engineer'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'Software Engineer' as name,
  'Software Engineer' as description,
  5 as level,
  'Engineering' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'Software Engineer'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'Product Manager' as name,
  'Product Manager' as description,
  4 as level,
  'Product' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'Product Manager'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'UI/UX Designer' as name,
  'User Interface/User Experience Designer' as description,
  5 as level,
  'Design' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'UI/UX Designer'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'Marketing Manager' as name,
  'Marketing Manager' as description,
  4 as level,
  'Marketing' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'Marketing Manager'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'Sales Representative' as name,
  'Sales Representative' as description,
  5 as level,
  'Sales' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'Sales Representative'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'HR Manager' as name,
  'Human Resources Manager' as description,
  4 as level,
  'Human Resources' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'HR Manager'
);

INSERT INTO corp_designations (company_id, name, description, level, department, is_active)
SELECT 
  id as company_id,
  'Intern' as name,
  'Intern' as description,
  6 as level,
  'General' as department,
  true as is_active
FROM corp_companies
WHERE NOT EXISTS (
  SELECT 1 FROM corp_designations 
  WHERE company_id = corp_companies.id AND name = 'Intern'
);

-- Success message
SELECT 'Default designations created successfully for all companies!' as message;
