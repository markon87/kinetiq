import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { getSupabasePublicEnv } from './env'

export async function updateSession(request) {
  const pathname = request.nextUrl.pathname
  const isHomeRoute = pathname === '/'
  const isLandingRoute = pathname.startsWith('/landing')
  const isAuthRoute = pathname === '/auth'
  const isAuthCallbackRoute = pathname.startsWith('/auth/callback')
  const isPublicAsset = pathname.startsWith('/_next') || pathname.startsWith('/favicon')
  const isApiRoute = pathname.startsWith('/api')
  const isPublicRoute = isHomeRoute || isLandingRoute || isAuthRoute || isAuthCallbackRoute || isPublicAsset

  let response = NextResponse.next({ request })
  let user = null

  try {
    const { url, publishableKey } = getSupabasePublicEnv()

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
      data: { user: sessionUser },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      user = null
    } else {
      user = sessionUser
    }
  } catch {
    // If middleware cannot initialize auth (e.g. missing env in deployment),
    // avoid crashing edge runtime and redirect protected pages to public home.
    if (!isPublicRoute && !isApiRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      redirectUrl.searchParams.set('authError', '1')
      return NextResponse.redirect(redirectUrl)
    }

    return response
  }

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
