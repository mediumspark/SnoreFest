# Supabase Setup Guide

This guide will help you set up Supabase for authentication and data collection in Snore : Gig Tracker.

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or sign in
3. Click "New Project"
4. Fill in:
   - **Name**: Snore Gig Tracker (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes 1-2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure the App

1. Open `supabase-config.js` in your project
2. Replace the placeholders:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Paste your Project URL here
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Paste your anon key here
   ```

## Step 4: Set Up the Database

1. In Supabase dashboard, go to **SQL Editor**
2. Open `database-schema.sql` from your project
3. Copy the entire SQL file contents
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Step 5: Configure Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL** to your app's URL (e.g., `https://yoursite.com`)
5. Add **Redirect URLs**:
   - `https://yoursite.com/reset-password`
   - `https://yoursite.com/**` (for development)

## Step 6: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the templates if desired:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**

## Step 7: Test the Setup

1. Open your app in a browser
2. Click the **Account** tab (should appear after setup)
3. Try signing up with a test email
4. Check your email for the confirmation link
5. After confirming, try signing in
6. Go to **Contribute** tab and submit test data

## Database Tables Created

### `user_profiles`
- Stores additional user profile data (if needed)
- Linked to Supabase Auth users

### `submissions`
- Stores user-submitted dashboard data
- Fields:
  - `user_id`: Links to authenticated user
  - `username_hash`: Encrypted hash for anonymity
  - `month`: Month of submission (YYYY-MM-01)
  - `platform`: Platform name
  - `total_earnings`: Total earnings for the month
  - `total_minutes`: Total minutes worked
  - `created_at`: Timestamp

### `platform_averages` (View)
- Public view that calculates averages from submissions
- Automatically aggregates data from last 12 months
- Requires minimum 5 submissions per platform for statistical validity

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Password Encryption**: Handled automatically by Supabase Auth
- **Username Hashing**: User IDs are hashed for anonymity in submissions
- **Email Verification**: Required for new accounts
- **Password Reset**: Secure email-based reset flow

## Troubleshooting

### "Failed to fetch averages from Supabase"
- Check that `supabase-config.js` has correct credentials
- Verify the `platform_averages` view exists in your database
- Check browser console for detailed error messages

### "You must be signed in to submit data"
- Make sure user has confirmed their email
- Check that authentication is working in the Account tab

### Email not sending
- Check Supabase dashboard → Authentication → Email Templates
- Verify email provider is configured (Supabase uses default SMTP)
- Check spam folder

### Database errors
- Verify SQL schema was run successfully
- Check Supabase dashboard → Database → Tables
- Ensure RLS policies are enabled

## Next Steps

Once set up:
1. Users can sign up and contribute data
2. Averages are calculated automatically from submissions
3. The ticker will show real-time averages from your database
4. All data is anonymous and aggregated


