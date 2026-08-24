-- Repair all missing columns and setup protected super admin

-- Fix contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE contacts DROP COLUMN IF EXISTS status;

-- Fix admins table
ALTER TABLE admins ADD COLUMN IF NOT EXISTS protected BOOLEAN DEFAULT false;

-- Create protected super admin
INSERT INTO admins (name, email, password_hash, role, protected) 
VALUES ('Super Admin', 'admin@nrsa.com.ng', '$2b$10$dummy.hash.for.initial.setup', 'super-admin', true)
ON CONFLICT (email) DO UPDATE SET role = 'super-admin', protected = true;