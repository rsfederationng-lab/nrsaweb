-- Run this in your Supabase dashboard under SQL Editor
-- Creates the subscribers table for the NRSA newsletter

CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (backend only)
CREATE POLICY "Service role full access" ON subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);
