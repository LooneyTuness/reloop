import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect')
  
  console.log('Confirm route called with:', { token_hash: !!token_hash, type, code: !!code, redirect })

  // Add error handling for missing parameters
  if (!token_hash && !code) {
    console.error('No authentication parameters found - redirecting to home');
    return NextResponse.redirect(`${origin}/`);
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Default redirect to home, but will be updated based on user role
  let next = redirect || '/'

  // Handle OTP-based confirmation (token_hash + type)
  if (token_hash && type) {
    console.log('Attempting OTP verification...')
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      console.log('OTP verification successful')
      
      // Get the user to check if they're a seller
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Error getting user after OTP verification:', userError)
        return NextResponse.redirect(`${origin}/?error=${encodeURIComponent('Authentication successful but user data error')}`)
      }
      
      console.log('User authenticated successfully:', user?.email)
      console.log('User ID:', user?.id)
      
      // Check if we have a session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session after OTP verification:', {
        hasSession: !!session,
        userEmail: session?.user?.email,
        userId: session?.user?.id
      })
      
      if (user) {
        console.log('User authenticated:', user.email)
        
        // Check if user is a seller
        const { data: sellerProfile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('is_approved')
          .eq('user_id', user.id)
          .single()
        
        if (profileError) {
          console.log('No seller profile found for user:', user.email)
        } else if (sellerProfile) {
          console.log('User is a seller, redirecting to dashboard (bypassing approval check)')
          next = '/seller-dashboard'
        } else {
          console.log('User is not a seller')
        }
        
        if (redirect && next === '/') {
          // Use the provided redirect URL if no seller-specific redirect
          next = redirect
        }
      }
      
      console.log('Final redirect URL:', next)
      // Redirect to client-side callback to handle session establishment
      return NextResponse.redirect(`${origin}/auth/callback?redirect=${encodeURIComponent(next)}&confirmed=true`)
    } else {
      console.error('OTP verification error:', error)
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
    }
  }

  // Handle PKCE-based confirmation (code)
  if (code) {
    console.log('Attempting code exchange...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log('Code exchange successful')
      
      // Get the user to check if they're a seller
      const { data: { user } } = await supabase.auth.getUser()
      
      console.log('User authenticated via code exchange:', user?.email)
      console.log('User ID:', user?.id)
      
      // Check if we have a session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session after code exchange:', {
        hasSession: !!session,
        userEmail: session?.user?.email,
        userId: session?.user?.id
      })
      
      if (user) {
        // Check if user is a seller
        const { data: sellerProfile } = await supabase
          .from('seller_profiles')
          .select('is_approved')
          .eq('user_id', user.id)
          .single()
        
        if (sellerProfile) {
          console.log('User is a seller, redirecting to dashboard (bypassing approval check)')
          next = '/seller-dashboard'
        } else if (redirect) {
          // Use the provided redirect URL
          next = redirect
        } else {
          // Default to home page
          next = '/'
        }
      }
      
      // Redirect to client-side callback to handle session establishment
      return NextResponse.redirect(`${origin}/auth/callback?redirect=${encodeURIComponent(next)}`)
    } else {
      console.error('Code exchange error:', error)
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
    }
  }

  // No valid confirmation parameters found
  console.error('No valid confirmation parameters')
  return NextResponse.redirect(`${origin}/?error=${encodeURIComponent('Invalid confirmation link')}`)
}
