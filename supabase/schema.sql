-- Corporacity MVP schema (run in Supabase SQL editor)

create table companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique not null,
  owner_id uuid references auth.users (id),
  created_at timestamptz default now()
);

create table memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id),
  company_id uuid references companies (id),
  role text default 'employee',
  created_at timestamptz default now()
);

create table join_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id),
  company_id uuid references companies (id),
  message text,
  created_at timestamptz default now()
);

create type status_type as enum ('present','late','leave','visit','short_leave');

create table statuses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id),
  company_id uuid references companies (id),
  type status_type not null,
  message text,
  timestamp timestamptz default now(),
  is_auto boolean default false
);

create index on statuses (company_id, timestamp);
