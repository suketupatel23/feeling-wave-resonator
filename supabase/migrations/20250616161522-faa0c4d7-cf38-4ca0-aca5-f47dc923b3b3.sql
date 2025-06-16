
-- Create a table for EQ assessment results
CREATE TABLE public.eq_assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  scores JSONB NOT NULL,
  emotional_insights JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.eq_assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own EQ results
CREATE POLICY "Users can view their own EQ results" 
  ON public.eq_assessment_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own EQ results
CREATE POLICY "Users can create their own EQ results" 
  ON public.eq_assessment_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own EQ results
CREATE POLICY "Users can update their own EQ results" 
  ON public.eq_assessment_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own EQ results
CREATE POLICY "Users can delete their own EQ results" 
  ON public.eq_assessment_results 
  FOR DELETE 
  USING (auth.uid() = user_id);
