import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/supabase.server'
import { supabaseAdmin } from '@/lib/supabase/supabase.admin'

export async function GET(request: NextRequest) {
  console.log('=== CONFIRM ROUTE HIT ===');
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect')
  const isVendor = searchParams.get('vendor') === 'true'
  
  console.log('Confirm route called with:', { token_hash: !!token_hash, type, code: !!code, redirect, isVendor })

  // Add error handling for missing parameters
  if (!token_hash && !code) {
    console.error('No authentication parameters found - redirecting to home');
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = await createServerClient()

  // Will be set based on user role and redirect parameter
  let next = '/'

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
        
        // Handle vendor sign-up by creating seller profile
        if (isVendor && user.user_metadata?.is_vendor && supabaseAdmin) {
          console.log('Vendor sign-up detected, creating seller profile...')
          
          try {
            // Check if seller profile already exists
            const { data: existingProfile } = await supabaseAdmin
              .from('seller_profiles')
              .select('id')
              .eq('user_id', user.id)
              .single()
            
            if (!existingProfile) {
              // Create seller profile
              const isApproved = process.env.NODE_ENV !== 'production'
              
              const { data: sellerProfile, error: createError } = await supabaseAdmin
                .from('seller_profiles')
                .insert({
                  user_id: user.id,
                  email: user.email || '',
                  full_name: user.user_metadata?.full_name || '',
                  role: 'seller',
                  is_approved: isApproved
                })
                .select()
                .single()
              
              if (createError) {
                console.error('Error creating seller profile:', createError)
              } else {
                console.log('Seller profile created successfully:', sellerProfile?.id)
              }
            }
          } catch (error) {
            console.error('Error in vendor profile creation:', error)
          }
        }
        
        // Check if user is a seller
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('is_approved, role')
          .eq('user_id', user.id)
          .single()
        
        if (profileError) {
          console.log('No seller profile found for user:', user.email)
          // No seller profile - use redirect or default to home
          if (redirect) {
            next = redirect
          } else {
            next = '/'
          }
        } else if (profile) {
          // Check if user is an approved seller
          const sellerProfile = profile as { is_approved: boolean; role: string }
          const isApprovedSeller = sellerProfile.is_approved === true && 
            (sellerProfile.role === 'seller' || sellerProfile.role === 'admin')
          
          if (isApprovedSeller) {
            console.log('User is an approved seller, redirecting to dashboard')
            next = '/seller-dashboard'
          } else {
            console.log('User is a seller but not approved, redirecting to application')
            next = '/seller-application'
          }
        } else {
          console.log('User is not a seller')
          // Not a seller - use redirect or default to home
          if (redirect) {
            next = redirect
          } else {
            next = '/'
          }
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
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('is_approved, role')
          .eq('user_id', user.id)
          .single()
        
        if (profileError) {
          console.log('No seller profile found for user:', user.email)
          // No seller profile - use redirect or default to home
          if (redirect) {
            next = redirect
          } else {
            next = '/'
          }
        } else if (profile) {
          // Check if user is an approved seller
          const sellerProfile = profile as { is_approved: boolean; role: string }
          const isApprovedSeller = sellerProfile.is_approved === true && 
            (sellerProfile.role === 'seller' || sellerProfile.role === 'admin')
          
          if (isApprovedSeller) {
            console.log('User is an approved seller, redirecting to dashboard')
            next = '/seller-dashboard'
          } else {
            console.log('User is a seller but not approved, redirecting to application')
            next = '/seller-application'
          }
        } else {
          console.log('User is not a seller')
          // Not a seller - use redirect or default to home
          if (redirect) {
            next = redirect
          } else {
            next = '/'
          }
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
