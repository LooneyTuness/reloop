import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const returnUrl = searchParams.get('returnUrl')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get user to check seller status
      const { data: { user } } = await supabase.auth.getUser()
      let redirectPath = returnUrl || next || '/'
      
      if (user) {
        // Check if user is a seller
        const { data: sellerProfile } = await supabase
          .from('seller_profiles')
          .select('is_approved, role')
          .eq('user_id', user.id)
          .single()
        
        if (sellerProfile) {
          // Check if user is an approved seller
          const isApprovedSeller = sellerProfile.is_approved === true && 
            (sellerProfile.role === 'seller' || sellerProfile.role === 'admin')
          
          if (isApprovedSeller) {
            redirectPath = returnUrl || next || '/seller-dashboard'
          } else {
            redirectPath = returnUrl || next || '/seller-application'
          }
        }
      }
      
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${redirectPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/callback?error=Could not authenticate user`)
}
