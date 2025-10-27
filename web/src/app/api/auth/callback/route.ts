import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/supabase.server';

import * as Routes from '@/lib/routes';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') ?? Routes.DASHBOARD.getPath();
  const origin = requestUrl.origin;

  const supabase = await createServerClient();
  let data = null;
  let error = null;

  // Handle OAuth code exchange (for social login like Google)
  if (code) {
    const response = await supabase.auth.exchangeCodeForSession(code);
    data = response.data;
    error = response.error;
  }
  // Handle magic link verification
  else if (token_hash && type === 'email') {
    console.log('Verifying magic link with token_hash:', token_hash.substring(0, 30) + '...');
    const response = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email',
    });
    data = response.data;
    error = response.error;
    
    if (error) {
      console.error('Magic link verification failed:', error);
    } else {
      console.log('Magic link verified successfully for user:', data?.user?.email);
    }
  }
  // Handle invite verification
  else if (token_hash && type === 'invite') {
    const response = await supabase.auth.verifyOtp({
      token_hash,
      type: 'invite',
    });
    data = response.data;
    error = response.error;
  }

  if (error) {
    console.error('Auth error:', error.message);
    return NextResponse.redirect(`${origin}/sign-in?oauth_error=1`);
  }

  if (data?.user) {
    // Check if user is a seller to determine proper redirect
    let finalNext = next;
    
    if (next.includes('seller-dashboard')) {
      const { data: sellerProfile } = await supabase
        .from('seller_profiles')
        .select('is_approved, role')
        .eq('user_id', data.user.id)
        .single();
      
      if (sellerProfile) {
        const profile = sellerProfile as { is_approved: boolean; role: string };
        const isApprovedSeller = profile.is_approved === true || 
          (profile.role === 'seller' || profile.role === 'admin');
        
        if (!isApprovedSeller) {
          // Not approved, redirect to application
          finalNext = '/seller-application';
        }
      } else {
        // No seller profile, go to home
        finalNext = '/';
      }
    }

    const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development';
    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${finalNext}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${finalNext}`);
    } else {
      return NextResponse.redirect(`${origin}${finalNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?oauth_error=1`);
}
