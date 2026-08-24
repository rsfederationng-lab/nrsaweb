-- Create Interschool Years (Seasons) Table
CREATE TABLE interschool_years (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  theme_color TEXT DEFAULT '#10b981',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create School Standings Table
CREATE TABLE school_standings (
  id SERIAL PRIMARY KEY,
  year_id INTEGER NOT NULL REFERENCES interschool_years(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  state TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create School Activations Table
CREATE TABLE school_activations (
  id SERIAL PRIMARY KEY,
  year_id INTEGER NOT NULL REFERENCES interschool_years(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  event_title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE interschool_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_activations ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read, Admin Write)

-- Interschool Years
CREATE POLICY "Public years are viewable by everyone."
  ON interschool_years FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert years."
  ON interschool_years FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update years."
  ON interschool_years FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete years."
  ON interschool_years FOR DELETE
  USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- School Standings
CREATE POLICY "Public standings are viewable by everyone."
  ON school_standings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert standings."
  ON school_standings FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update standings."
  ON school_standings FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete standings."
  ON school_standings FOR DELETE
  USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- School Activations
CREATE POLICY "Public activations are viewable by everyone."
  ON school_activations FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert activations."
  ON school_activations FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update activations."
  ON school_activations FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete activations."
  ON school_activations FOR DELETE
  USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');
