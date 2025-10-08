import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = '/'

  console.log('Confirm route called with:', { token_hash: !!token_hash, type, code: !!code })

  // Create response that will redirect to home
  let response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Handle OTP-based confirmation (token_hash + type)
  if (token_hash && type) {
    console.log('Attempting OTP verification...')
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      console.log('OTP verification successful')
      response = NextResponse.redirect(`${origin}/?confirmed=true`)
      return response
    } else {
      console.error('OTP verification error:', error)
      response = NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
      return response
    }
  }

  // Handle PKCE-based confirmation (code)
  if (code) {
    console.log('Attempting code exchange...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log('Code exchange successful')
      response = NextResponse.redirect(`${origin}/?confirmed=true`)
      return response
    } else {
      console.error('Code exchange error:', error)
      response = NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
      return response
    }
  }

  // No valid confirmation parameters found
  console.error('No valid confirmation parameters')
  response = NextResponse.redirect(`${origin}/?error=${encodeURIComponent('Invalid confirmation link')}`)
  return response
}
