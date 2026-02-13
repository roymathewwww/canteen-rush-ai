
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mnficpuywfomzrravez.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZmljcHV5d2ZvbW56cnJhdmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjU3NzUsImV4cCI6MjA4NjAwMTc3NX0.4ercqyv26oXE7TLM-8kCtfTNUzdr5q8BaJot4QIpjQU"

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables! Check .env.local')
}

// Export null if variables are missing to prevent crash, fallback to mocks
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

