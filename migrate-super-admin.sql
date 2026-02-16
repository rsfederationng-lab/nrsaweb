-- Migrate existing admin to permanent super-admin
ALTER TABLE admins ADD COLUMN IF NOT EXISTS protected BOOLEAN DEFAULT false;
UPDATE admins SET role = 'super-admin', protected = true WHERE id = 1;