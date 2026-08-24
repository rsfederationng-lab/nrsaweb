-- Fix contacts table schema to match TypeScript definition
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE contacts DROP COLUMN IF EXISTS status;