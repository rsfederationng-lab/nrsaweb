-- Fix clubs table schema to match TypeScript definition
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS manager_name TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS is_registered BOOLEAN DEFAULT true;