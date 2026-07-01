'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '../../lib/supabase/client'

export default function AuthClient({ redirectedFrom = '/dashboard', variant = 'compact' }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isLanding = variant === 'landing'

  const supabase = getSupabaseBrowserClient()

  const handleEmailAuth = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        setMessage('Account created. You can now sign in.')
        setIsSignUp(false)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        window.location.assign(redirectedFrom)
      }
    } catch (authError) {
      setError(authError.message || 'Authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectedFrom)}`,
        },
      })

      if (oauthError) throw oauthError
    } catch (authError) {
      setError(authError.message || 'Google sign in failed.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-dvh bg-[var(--bg-main)] text-[var(--text-primary)] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className={`w-full ${isLanding ? 'max-w-6xl grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 items-center' : 'max-w-md'}`}>
        {isLanding ? (
          <section className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-[var(--accent-cyan)]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[var(--accent-lime)]/20 blur-2xl" />
            <p className="inline-flex items-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Training Intelligence Platform
            </p>
            <h1
              className="mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
            >
              Measure less guesswork,
              <span className="text-[var(--accent-lime)]"> train with clarity.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-[var(--text-secondary)]">
              Kinetiq turns your sessions into actionable guidance. Log activities, track readiness, and spot performance trends from one focused dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 text-xs text-[var(--text-muted)]">
              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1">Activity Timeline</span>
              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1">Training Load Signals</span>
              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1">Recovery Insights</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false)
                  setError('')
                  setMessage('')
                }}
                className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  !isSignUp
                    ? 'bg-[var(--accent-lime)] text-[var(--bg-main)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true)
                  setError('')
                  setMessage('')
                }}
                className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isSignUp
                    ? 'bg-[var(--accent-lime)] text-[var(--bg-main)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                Create account
              </button>
            </div>
          </section>
        ) : null}

        <section className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-xl">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {isSignUp ? 'Create account' : 'Sign in'}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Access your Kinetiq dashboard and synced activity history.
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-3 mt-5">
            <label className="block text-xs text-[var(--text-muted)]">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
              />
            </label>
            <label className="block text-xs text-[var(--text-muted)]">
              Password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-11 rounded-lg bg-[var(--accent-lime)] px-4 py-2 text-sm font-semibold text-[var(--bg-main)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="mt-3 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-50"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp((prev) => !prev)
              setError('')
              setMessage('')
            }}
            className="mt-4 text-sm text-[var(--accent-lime)] hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>

          {message ? <p className="mt-3 text-xs text-[var(--accent-lime)]">{message}</p> : null}
          {error ? <p className="mt-3 text-xs text-[var(--status-danger)]">{error}</p> : null}
        </section>
      </div>
    </main>
  )
}
