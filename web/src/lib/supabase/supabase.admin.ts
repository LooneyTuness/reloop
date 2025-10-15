import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './supabase.types';

// Create admin client only when service role key is available
export const supabaseAdmin: SupabaseClient<Database> | null = (() => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase admin client not initialized: Missing environment variables');
    return null;
  }
  
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });
})();
