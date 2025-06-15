
-- Create a table for personality test results
CREATE TABLE public.personality_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments for clarity
COMMENT ON TABLE public.personality_test_results IS 'Stores results from the Big Five personality tests taken by users.';
COMMENT ON COLUMN public.personality_test_results.scores IS 'A JSON object containing the scores for each personality trait.';

-- Add Row Level Security (RLS) to ensure users can only access their own data
ALTER TABLE public.personality_test_results ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own test results
CREATE POLICY "Users can view their own personality test results"
  ON public.personality_test_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own test results
CREATE POLICY "Users can insert their own personality test results"
  ON public.personality_test_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

