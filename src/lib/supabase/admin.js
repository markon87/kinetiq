import { createClient } from '@supabase/supabase-js'
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from './env'

let adminClient

export function getSupabaseAdminClient() {
  if (!adminClient) {
    const { url } = getSupabasePublicEnv()
    const serviceRoleKey = getSupabaseServiceRoleKey()

    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return adminClient
}
