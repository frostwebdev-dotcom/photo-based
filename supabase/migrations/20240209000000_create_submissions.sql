-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Quoted', 'Scheduled', 'Archived')),
  item_description text NOT NULL,
  pickup_location text NOT NULL,
  contact_details text NOT NULL,
  image_path text NOT NULL,
  image_mime text NOT NULL,
  image_size int NOT NULL,
  admin_notes text
);

-- Indexes for filtering and search
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at DESC);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Deny anon access (server uses service role which bypasses RLS)
-- Drop first so migration is idempotent when re-run
DROP POLICY IF EXISTS "Deny anon reads" ON submissions;
CREATE POLICY "Deny anon reads" ON submissions
  FOR SELECT USING (false);

DROP POLICY IF EXISTS "Deny anon inserts" ON submissions;
CREATE POLICY "Deny anon inserts" ON submissions
  FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS "Deny anon updates" ON submissions;
CREATE POLICY "Deny anon updates" ON submissions
  FOR UPDATE USING (false);

-- Allow authenticated users (admin) - optional, if using session-based reads
-- Uncomment if you want RLS policies for authenticated admin reads:
-- CREATE POLICY "Allow authenticated read" ON submissions
--   FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated update" ON submissions
--   FOR UPDATE USING (auth.role() = 'authenticated');
