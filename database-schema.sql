-- Snore : Gig Tracker - Supabase Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- 1. Accounts table (uses Supabase Auth, but we can add additional fields if needed)
-- Note: Supabase Auth handles email/password encryption automatically
-- This table is for any additional user profile data if needed

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Submissions table for average pay calculations
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- Encrypted username hash (using user_id hash for anonymity)
  username_hash TEXT NOT NULL,
  month DATE NOT NULL, -- Format: YYYY-MM-01 (first day of month)
  platform TEXT NOT NULL CHECK (platform IN ('Uber', 'DoorDash', 'Instacart', 'Prolific', 'MTurk')),
  total_earnings DECIMAL(10, 2) NOT NULL CHECK (total_earnings >= 0),
  total_minutes INTEGER NOT NULL CHECK (total_minutes > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  -- Indexes for performance
  INDEX idx_submissions_month (month),
  INDEX idx_submissions_platform (platform),
  INDEX idx_submissions_user_id (user_id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for user_profiles
-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. RLS Policies for submissions
-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can read aggregated data (for calculating averages)
-- But we'll use a function to ensure anonymity
CREATE POLICY "Anyone can read aggregated submission data"
  ON public.submissions FOR SELECT
  USING (true);

-- 6. Function to create username hash from user_id
CREATE OR REPLACE FUNCTION generate_username_hash(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  -- Create a hash of the user_id for anonymity
  -- This ensures the same user always has the same hash
  RETURN encode(digest(user_uuid::text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- 7. Function to calculate platform averages
CREATE OR REPLACE FUNCTION get_platform_averages()
RETURNS TABLE (
  platform TEXT,
  avg_hourly_rate DECIMAL(10, 2),
  submission_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.platform,
    ROUND(
      SUM(s.total_earnings) / NULLIF(SUM(s.total_minutes)::DECIMAL / 60, 0),
      2
    ) AS avg_hourly_rate,
    COUNT(*) AS submission_count
  FROM public.submissions s
  WHERE s.month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
  GROUP BY s.platform
  HAVING COUNT(*) >= 5 -- Minimum submissions for statistical validity
  ORDER BY s.platform;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger to automatically set username_hash on insert
CREATE OR REPLACE FUNCTION set_username_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.username_hash := generate_username_hash(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_submission_username_hash
  BEFORE INSERT ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_username_hash();

-- 9. View for public averages (anonymous, aggregated data)
CREATE OR REPLACE VIEW public.platform_averages AS
SELECT 
  platform,
  ROUND(
    SUM(total_earnings) / NULLIF(SUM(total_minutes)::DECIMAL / 60, 0),
    2
  ) AS avg_hourly_rate,
  COUNT(*) AS submission_count,
  MIN(month) AS earliest_month,
  MAX(month) AS latest_month
FROM public.submissions
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
GROUP BY platform
HAVING COUNT(*) >= 5;

-- Grant access to the view
GRANT SELECT ON public.platform_averages TO anon, authenticated;


