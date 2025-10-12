import * as SupabaseSSR from '@supabase/ssr'
import { Database } from './supabase.types';

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Supabase config:');
  console.log('- URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('- Key:', supabaseAnonKey ? 'Set' : 'Missing');
  console.log('- URL value:', supabaseUrl);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', { supabaseUrl, supabaseAnonKey });
    throw new Error('Missing Supabase environment variables');
  }
  
  // Create a supabase client on the browser with project's credentials
  return SupabaseSSR.createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
}
