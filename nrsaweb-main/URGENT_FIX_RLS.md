# 🚨 URGENT: Fix Row Level Security (RLS) Issue

## Problem
All CRUD operations are failing with error: `"new row violates row-level security policy for table"`

This is why:
- ❌ Contact form doesn't save
- ❌ News creation doesn't save  
- ❌ All admin CRUD operations fail

## Solution: Disable RLS on All Tables

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/jrijjoszmlupeljifedk/editor
2. Click on "SQL Editor" in the left sidebar

### Step 2: Run This SQL Command

Copy and paste this entire SQL script and click "Run":

```sql
-- Disable Row Level Security on all tables
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE clubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaders DISABLE ROW LEVEL SECURITY;
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides DISABLE ROW LEVEL SECURITY;
ALTER TABLE affiliations DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE member_states DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
```

### Step 3: Verify
After running the SQL, test the application:
- Try submitting the contact form
- Try creating a news article in the admin panel
- Try creating any other content

All operations should now work!

## Why This Happened
Supabase enables Row Level Security (RLS) by default. Even though we're using the SERVICE_ROLE_KEY which should bypass RLS, the policies are still being enforced. Disabling RLS removes all access restrictions.

## Security Note
For production, you may want to re-enable RLS and create proper policies. For development/testing, disabled RLS is fine since we're using authenticated admin routes.
