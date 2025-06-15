
-- Create a table for user session realizations
CREATE TABLE public.realizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  emotion TEXT NOT NULL,
  frequency INTEGER NOT NULL,
  meditation_length INTEGER NOT NULL, -- store meditation length in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security for the table
ALTER TABLE public.realizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own realizations
CREATE POLICY "Users can view their own realizations" 
  ON public.realizations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only INSERT their own realizations
CREATE POLICY "Users can create their own realizations"
  ON public.realizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own realizations
CREATE POLICY "Users can update their own realizations"
  ON public.realizations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only DELETE their own realizations
CREATE POLICY "Users can delete their own realizations"
  ON public.realizations FOR DELETE
  USING (auth.uid() = user_id);
