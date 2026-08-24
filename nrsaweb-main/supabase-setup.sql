-- Create admins table for local development
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO admins (email, name, role) 
VALUES ('admin@nrsa.com.ng', 'NRSA Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;