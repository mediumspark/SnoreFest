// Supabase Configuration
// Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com -> Your Project -> Settings -> API

const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Your anon/public key

// Initialize Supabase client (only if Supabase library is loaded and credentials are set)
if (typeof window.supabase !== 'undefined' && 
    SUPABASE_URL && 
    SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
    SUPABASE_ANON_KEY && 
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
  try {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    window.supabaseClient = null;
  }
} else {
  if (typeof window.supabase === 'undefined') {
    console.warn('Supabase library not loaded. Make sure the Supabase CDN script is included before this file.');
  } else {
    console.warn('Supabase credentials not configured. Please update supabase-config.js with your project URL and anon key.');
  }
  // Create a dummy client to prevent errors
  window.supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      onAuthStateChange: () => ({ data: { subscription: null }, unsubscribe: () => {} })
    },
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    })
  };
}

