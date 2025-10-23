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
    const response = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email',
    });
    data = response.data;
    error = response.error;
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

    const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development';
    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?oauth_error=1`);
}
