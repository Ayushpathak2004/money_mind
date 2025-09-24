import { createClient } from '@supabase/supabase-js'

// Note: These values should be set in your Supabase project settings
// Get them from: https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
  console.error('Supabase URL is not configured. Please check your environment variables.')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
  console.error('Supabase Anon Key is not configured. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)