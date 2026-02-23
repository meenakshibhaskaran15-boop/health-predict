-- Create a table for health risk predictions
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  prediction_level TEXT NOT NULL,
  risk_score FLOAT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own predictions
CREATE POLICY "Users can view their own predictions" 
ON predictions FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own predictions
CREATE POLICY "Users can insert their own predictions" 
ON predictions FOR INSERT 
WITH CHECK (auth.uid() = user_id);
