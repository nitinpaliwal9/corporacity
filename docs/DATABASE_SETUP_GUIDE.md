# Database Setup Guide

## Fixing the Audit Logs Error

The error you're seeing:
```
GET https://omaecioniuolrnyzkvts.supabase.co/rest/v1/corp_audit_logs?select=*%2…id=eq.3d59c6f0-18e7-44f6-803e-36c90e02f8cc&order=created_at.desc&limit=100 400 (Bad Request)
```

This occurs because the security-related database tables haven't been created yet. Here's how to fix it:

## Solution

### Step 1: Run the Security Tables Script

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/create_security_tables.sql`
4. Run the script

This will create all the missing security tables:
- `corp_audit_logs`
- `corp_security_events`
- `corp_encryption_keys`
- `corp_data_access_logs`
- `corp_privacy_settings`
- `corp_data_retention_policies`
- `corp_rate_limits`
- `corp_security_alerts`

### Step 2: Verify the Tables

After running the script, you should see:
- All security tables created
- Proper indexes for performance
- Row Level Security (RLS) policies enabled
- Default data retention policies inserted

### Step 3: Test the Application

Once the tables are created, the audit logs error should be resolved and the security dashboard should work properly.

## What the Script Does

1. **Creates Security Tables**: All the tables needed for audit logging, security monitoring, and privacy controls
2. **Sets Up Indexes**: For optimal query performance
3. **Enables RLS**: Row Level Security policies to ensure data privacy
4. **Creates Cleanup Functions**: Automatic cleanup of old data
5. **Inserts Default Policies**: Basic data retention policies for all companies

## Alternative: Manual Table Creation

If you prefer to create tables manually, you can run individual CREATE TABLE statements from the script. However, running the complete script is recommended as it sets up all the necessary relationships and policies.

## Troubleshooting

If you still see errors after running the script:

1. **Check Table Permissions**: Ensure your Supabase user has the necessary permissions
2. **Verify RLS Policies**: Make sure the Row Level Security policies are working correctly
3. **Check Foreign Keys**: Ensure all referenced tables (like `corp_companies`, `auth.users`) exist

## Next Steps

After creating the security tables:
1. The audit logs will start being populated automatically
2. Security monitoring will become active
3. Privacy controls will be available
4. The security dashboard will display real data

The application is now ready for production use with full security and audit capabilities!
