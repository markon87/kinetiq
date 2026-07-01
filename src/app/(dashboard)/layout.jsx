import { redirect } from 'next/navigation'
import DashboardShell from '../../components/layout/DashboardShell'
import { getSupabaseServerClient } from '../../lib/supabase/server'

export default async function DashboardLayout({ children }) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/?redirectedFrom=/dashboard')
    }
  } catch {
    redirect('/?redirectedFrom=/dashboard')
  }

  return <DashboardShell>{children}</DashboardShell>
}
