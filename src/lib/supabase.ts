import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    supabase = createClient(supabaseUrl, supabaseKey)
  }
  return supabase
}

// Re-export createClient for use in components
export const createClient = getSupabaseClient

// Also export the supabase instance directly
export const supabase = createClient