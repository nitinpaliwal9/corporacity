-- Corporacity MVP schema (run in Supabase SQL editor)

-- User profiles table
create table corp_profiles (
  id uuid references auth.users (id) primary key,
  email text,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- Companies table
create table corp_companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique not null,
  owner_id uuid references auth.users (id),
  created_at timestamptz default now()
);

-- Memberships table
create table corp_memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id),
  company_id uuid references corp_companies (id),
  role text default 'employee',
  created_at timestamptz default now(),
  unique(user_id, company_id)
);

-- Join requests table
create table corp_join_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id),
  company_id uuid references corp_companies (id),
  message text,
  created_at timestamptz default now(),
  unique(user_id, company_id)
);

-- Status types enum
create type status_type as enum ('present','late','leave','visit','short_leave');

-- Statuses table
create table corp_statuses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id),
  company_id uuid references corp_companies (id),
  type status_type not null,
  message text,
  timestamp timestamptz default now(),
  is_auto boolean default false
);

-- Indexes for performance
create index idx_corp_statuses_company_id_timestamp on corp_statuses (company_id, timestamp desc);
create index idx_corp_statuses_user_id on corp_statuses (user_id);
create index idx_corp_memberships_user_id on corp_memberships (user_id);
create index idx_corp_memberships_company_id on corp_memberships (company_id);
create index idx_corp_join_requests_user_id on corp_join_requests (user_id);
create index idx_corp_join_requests_company_id on corp_join_requests (company_id);

-- Foreign key constraint for join requests to companies
alter table corp_join_requests 
add constraint fk_cjr_company 
foreign key (company_id) references corp_companies(id);
