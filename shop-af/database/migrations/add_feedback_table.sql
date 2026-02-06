-- Create feedback table for suggestions and bug reports
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('suggestion', 'bug')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (even anonymous)
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Only admins can read all feedback
CREATE POLICY "Admins can read all feedback" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Users can read their own feedback
CREATE POLICY "Users can read own feedback" ON feedback
  FOR SELECT USING (user_id = auth.uid());

-- Admins can update feedback status
CREATE POLICY "Admins can update feedback" ON feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );
