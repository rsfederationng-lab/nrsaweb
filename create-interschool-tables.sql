-- Create interschool tables if they don't exist

-- Championship Phases table
CREATE TABLE IF NOT EXISTS championship_phases (
  id SERIAL PRIMARY KEY,
  year_id INTEGER NOT NULL REFERENCES interschool_years(id) ON DELETE CASCADE,
  state_name TEXT NOT NULL,
  venue TEXT,
  registration_opens TIMESTAMP,
  registration_closes TIMESTAMP,
  competition_date TIMESTAMP,
  max_schools INTEGER DEFAULT 9,
  whatsapp_group_link TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- School Registrations table
CREATE TABLE IF NOT EXISTS school_registrations (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER NOT NULL REFERENCES championship_phases(id) ON DELETE CASCADE,
  year_id INTEGER NOT NULL REFERENCES interschool_years(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  state TEXT NOT NULL,
  school_address TEXT NOT NULL,
  principal_name TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  coordinator_phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT NOT NULL,
  athlete_count INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('junior', 'senior', 'both')),
  events_categories TEXT,
  additional_notes TEXT,
  logo_url TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'selected', 'not_selected', 'waitlisted', 'withdrawn')),
  admin_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enable RLS on all interschool tables
ALTER TABLE interschool_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE interschool_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE championship_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "interschool_years_select_policy" ON interschool_years;
DROP POLICY IF EXISTS "interschool_years_insert_policy" ON interschool_years;
DROP POLICY IF EXISTS "interschool_years_update_policy" ON interschool_years;
DROP POLICY IF EXISTS "interschool_years_delete_policy" ON interschool_years;

DROP POLICY IF EXISTS "school_standings_select_policy" ON school_standings;
DROP POLICY IF EXISTS "school_standings_insert_policy" ON school_standings;
DROP POLICY IF EXISTS "school_standings_update_policy" ON school_standings;
DROP POLICY IF EXISTS "school_standings_delete_policy" ON school_standings;

DROP POLICY IF EXISTS "interschool_news_select_policy" ON interschool_news;
DROP POLICY IF EXISTS "interschool_news_insert_policy" ON interschool_news;
DROP POLICY IF EXISTS "interschool_news_update_policy" ON interschool_news;
DROP POLICY IF EXISTS "interschool_news_delete_policy" ON interschool_news;

DROP POLICY IF EXISTS "championship_phases_select_policy" ON championship_phases;
DROP POLICY IF EXISTS "championship_phases_insert_policy" ON championship_phases;
DROP POLICY IF EXISTS "championship_phases_update_policy" ON championship_phases;
DROP POLICY IF EXISTS "championship_phases_delete_policy" ON championship_phases;

DROP POLICY IF EXISTS "school_registrations_select_policy" ON school_registrations;
DROP POLICY IF EXISTS "school_registrations_insert_policy" ON school_registrations;
DROP POLICY IF EXISTS "school_registrations_update_policy" ON school_registrations;
DROP POLICY IF EXISTS "school_registrations_delete_policy" ON school_registrations;

-- Create RLS policies (allowing all operations - backend handles auth)

-- Interschool Years policies
CREATE POLICY "interschool_years_select_policy" ON interschool_years FOR SELECT USING (true);
CREATE POLICY "interschool_years_insert_policy" ON interschool_years FOR INSERT WITH CHECK (true);
CREATE POLICY "interschool_years_update_policy" ON interschool_years FOR UPDATE USING (true);
CREATE POLICY "interschool_years_delete_policy" ON interschool_years FOR DELETE USING (true);

-- School Standings policies
CREATE POLICY "school_standings_select_policy" ON school_standings FOR SELECT USING (true);
CREATE POLICY "school_standings_insert_policy" ON school_standings FOR INSERT WITH CHECK (true);
CREATE POLICY "school_standings_update_policy" ON school_standings FOR UPDATE USING (true);
CREATE POLICY "school_standings_delete_policy" ON school_standings FOR DELETE USING (true);

-- Interschool News policies
CREATE POLICY "interschool_news_select_policy" ON interschool_news FOR SELECT USING (true);
CREATE POLICY "interschool_news_insert_policy" ON interschool_news FOR INSERT WITH CHECK (true);
CREATE POLICY "interschool_news_update_policy" ON interschool_news FOR UPDATE USING (true);
CREATE POLICY "interschool_news_delete_policy" ON interschool_news FOR DELETE USING (true);

-- Championship Phases policies
CREATE POLICY "championship_phases_select_policy" ON championship_phases FOR SELECT USING (true);
CREATE POLICY "championship_phases_insert_policy" ON championship_phases FOR INSERT WITH CHECK (true);
CREATE POLICY "championship_phases_update_policy" ON championship_phases FOR UPDATE USING (true);
CREATE POLICY "championship_phases_delete_policy" ON championship_phases FOR DELETE USING (true);

-- School Registrations policies
CREATE POLICY "school_registrations_select_policy" ON school_registrations FOR SELECT USING (true);
CREATE POLICY "school_registrations_insert_policy" ON school_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "school_registrations_update_policy" ON school_registrations FOR UPDATE USING (true);
CREATE POLICY "school_registrations_delete_policy" ON school_registrations FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_championship_phases_year_id ON championship_phases(year_id);
CREATE INDEX IF NOT EXISTS idx_championship_phases_state ON championship_phases(state_name);
CREATE INDEX IF NOT EXISTS idx_school_registrations_phase_id ON school_registrations(phase_id);
CREATE INDEX IF NOT EXISTS idx_school_registrations_year_id ON school_registrations(year_id);
CREATE INDEX IF NOT EXISTS idx_school_registrations_status ON school_registrations(status);
