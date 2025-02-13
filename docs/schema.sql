-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orcas table
CREATE TABLE IF NOT EXISTS orcas (
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orca_id TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT NOT NULL CHECK (photo_url ~ '^https?://'),
  coordinates JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coordinates_check CHECK (
    coordinates ? 'latitude' AND 
    coordinates ? 'longitude' AND 
    (coordinates->>'latitude')::numeric BETWEEN -90 AND 90 AND 
    (coordinates->>'longitude')::numeric BETWEEN -180 AND 180
  )
);

-- Create auth_codes table
CREATE TABLE IF NOT EXISTS auth_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  code CHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS orca_name_idx ON orcas(name);
CREATE INDEX IF NOT EXISTS entries_orca_id_idx ON entries(orca_id);
CREATE INDEX IF NOT EXISTS auth_codes_email_idx ON auth_codes(email);
CREATE INDEX IF NOT EXISTS auth_codes_expires_at_idx ON auth_codes(expires_at);
CREATE INDEX IF NOT EXISTS sessions_email_idx ON sessions(email);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE orcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orcas
CREATE POLICY "Enable read access for all users" ON orcas
  FOR SELECT USING (true);

-- Create RLS policies for entries
CREATE POLICY "Enable read access for all users" ON entries
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON entries
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for auth_codes
CREATE POLICY "Enable insert for all users" ON auth_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON auth_codes
  FOR SELECT USING (true);

CREATE POLICY "Enable delete for all users" ON auth_codes
  FOR DELETE USING (true);

-- Create RLS policies for sessions
CREATE POLICY "Enable insert for all users" ON sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON sessions
  FOR SELECT USING (true);

-- Add cleanup function for expired records
CREATE OR REPLACE FUNCTION cleanup_expired_records()
RETURNS void AS $$
BEGIN
  -- Delete expired auth codes
  DELETE FROM auth_codes WHERE expires_at < NOW();
  
  -- Delete expired sessions
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every hour
SELECT cron.schedule(
  'cleanup-expired-records',
  '0 * * * *', -- Every hour
  'SELECT cleanup_expired_records();'
);

-- Comments
COMMENT ON TABLE orcas IS 'ORCA figures that can be tracked';
COMMENT ON TABLE entries IS 'Travel entries for ORCA figures';
COMMENT ON TABLE auth_codes IS 'Email verification codes for authentication';
COMMENT ON TABLE sessions IS 'User sessions';

COMMENT ON COLUMN entries.coordinates IS 'JSON containing latitude and longitude';
COMMENT ON COLUMN auth_codes.expires_at IS 'Timestamp when the auth code expires';
COMMENT ON COLUMN sessions.expires_at IS 'Timestamp when the session expires';
