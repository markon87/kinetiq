import AuthClient from '../components/auth/AuthClient'

export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const redirectedFrom = resolvedSearchParams?.redirectedFrom || '/dashboard'

  return <AuthClient redirectedFrom={redirectedFrom} variant="landing" />
}
