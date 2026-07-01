import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { getSupabasePublicEnv } from './env'

export async function updateSession(request) {
  const { url, publishableKey } = getSupabasePublicEnv()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isHomeRoute = pathname === '/'
  const isLandingRoute = pathname.startsWith('/landing')
  const isAuthRoute = pathname === '/auth'
  const isAuthCallbackRoute = pathname.startsWith('/auth/callback')
  const isPublicAsset = pathname.startsWith('/_next') || pathname.startsWith('/favicon')
  const isApiRoute = pathname.startsWith('/api')

  if (isAuthRoute || isLandingRoute) {
    const redirectUrl = request.nextUrl.clone()

    if (user) {
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    redirectUrl.pathname = '/'
    if (!redirectUrl.searchParams.get('redirectedFrom')) {
      redirectUrl.searchParams.set('redirectedFrom', '/dashboard')
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (!user && !isHomeRoute && !isAuthCallbackRoute && !isPublicAsset && !isApiRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && isHomeRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
