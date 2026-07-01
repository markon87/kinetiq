'use client'

import { createBrowserClient } from '@supabase/ssr'

let browserClient
let reportedMissingEnv = false

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const publishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !publishableKey) {
      if (!reportedMissingEnv) {
        reportedMissingEnv = true
        console.warn('Supabase public environment variables are missing. Auth features are disabled until configured.')
      }
      return null
    }

    browserClient = createBrowserClient(url, publishableKey)
  }

  return browserClient
}
