-- Complete corrected SQL schema to fix all missing columns and errors

-- Add missing subject column to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS subject TEXT;

-- Add missing columns to media table
ALTER TABLE media ADD COLUMN IF NOT EXISTS is_external BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE media ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Create member_states table if not exists
CREATE TABLE IF NOT EXISTS member_states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    representative_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    is_registered BOOLEAN DEFAULT false
);

-- Ensure all required columns exist in existing tables
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin' NOT NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS protected BOOLEAN DEFAULT false NOT NULL;

-- Fix any missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_leaders_order ON leaders("order");
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides("order");

-- Enable RLS (Row Level Security) for all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Public read access" ON news;
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON events;
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON players;
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON clubs;
CREATE POLICY "Public read access" ON clubs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON leaders;
CREATE POLICY "Public read access" ON leaders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON media;
CREATE POLICY "Public read access" ON media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON hero_slides;
CREATE POLICY "Public read access" ON hero_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON member_states;
CREATE POLICY "Public read access" ON member_states FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON site_settings;
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);

-- Allow public contact form submissions
DROP POLICY IF EXISTS "Public contact submissions" ON contacts;
CREATE POLICY "Public contact submissions" ON contacts FOR INSERT WITH CHECK (true);