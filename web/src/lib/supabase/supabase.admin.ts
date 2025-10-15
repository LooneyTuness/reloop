import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './supabase.types';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Create admin client only when service role key is available
export const supabaseAdmin: SupabaseClient<Database> | null = (() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey || !supabaseUrl) {
    const missingVars = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!serviceRoleKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
    
    console.error(`❌ Supabase admin client not initialized: Missing environment variables: ${missingVars.join(', ')}`);
    console.error(`📍 Environment: ${process.env.NODE_ENV || 'unknown'}`);
    console.error(`🔧 Please check your environment configuration:`);
    console.error(`   - Development: Create .env.local file with required variables`);
    console.error(`   - Production: Set environment variables in your deployment platform`);
    return null;
  }
  
  // Validate URL format
  if (!supabaseUrl.includes('supabase.co')) {
    console.error(`❌ Invalid Supabase URL format: ${supabaseUrl}`);
    console.error(`📍 Expected format: https://your-project-id.supabase.co`);
    return null;
  }
  
  // Validate service role key format
  if (!serviceRoleKey.startsWith('eyJ')) {
    console.error(`❌ Invalid service role key format`);
    console.error(`📍 Service role key should start with 'eyJ'`);
    return null;
  }
  
  console.log(`✅ Supabase admin client initialized successfully`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'unknown'}`);
  console.log(`🔗 Database: ${supabaseUrl}`);
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });
})();
