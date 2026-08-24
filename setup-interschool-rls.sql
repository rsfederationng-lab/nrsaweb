-- Enable RLS on interschool tables
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

-- Championship Phases policies (public read, authenticated write)
CREATE POLICY "championship_phases_select_policy" ON championship_phases FOR SELECT USING (true);
CREATE POLICY "championship_phases_insert_policy" ON championship_phases FOR INSERT WITH CHECK (true);
CREATE POLICY "championship_phases_update_policy" ON championship_phases FOR UPDATE USING (true);
CREATE POLICY "championship_phases_delete_policy" ON championship_phases FOR DELETE USING (true);

-- School Registrations policies (public insert for school registration, authenticated for admin management)
CREATE POLICY "school_registrations_select_policy" ON school_registrations FOR SELECT USING (true);
CREATE POLICY "school_registrations_insert_policy" ON school_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "school_registrations_update_policy" ON school_registrations FOR UPDATE USING (true);
CREATE POLICY "school_registrations_delete_policy" ON school_registrations FOR DELETE USING (true);
