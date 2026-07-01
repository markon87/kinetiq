'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicEnv } from './env'

let browserClient

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, publishableKey } = getSupabasePublicEnv()
    browserClient = createBrowserClient(url, publishableKey)
  }

  return browserClient
}
