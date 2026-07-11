-- Supabase Schema for RSU Voting System

-- Enable UUID extension (though we use text for existing custom IDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Students Table
CREATE TABLE students (
  id text PRIMARY KEY,
  name text NOT NULL,
  password_hash text NOT NULL,
  password_changed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 2. Admins Table
CREATE TABLE admins (
  id text PRIMARY KEY,
  name text NOT NULL,
  password_hash text NOT NULL,
  password_changed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 3. Elections Table
CREATE TABLE elections (
  id text PRIMARY KEY,
  title text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Candidates Table
CREATE TABLE candidates (
  id text PRIMARY KEY,
  election_id text NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  name text NOT NULL,
  photo_url text NOT NULL,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- 5. Votes Table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id text NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  candidate_id text NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  -- Ensure a student can only vote once per election
  UNIQUE (election_id, student_id)
);

-- Setup Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for the prototype (replace with proper auth in production)
CREATE POLICY "Enable read/write for all students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all admins" ON admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all elections" ON elections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all candidates" ON candidates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all votes" ON votes FOR ALL USING (true) WITH CHECK (true);
