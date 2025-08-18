import * as SupabaseSSR from '@supabase/ssr'
import { Database } from './supabase.types';

export function createBrowserClient() {
  // Create a supabase client on the browser with project's credentials
  return SupabaseSSR.createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
