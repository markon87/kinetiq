'use client'

import { Bell, Settings, Sun, Moon, PanelLeft } from 'lucide-react'
import { dashboardData } from '../../data/mockData'
import { useTheme } from '../../providers/ThemeProvider'
import CircleGauge from '../ui/CircleGauge'

const { user, readiness } = dashboardData

function ReadinessRing({ score, label }) {
  return (
    <section className="flex items-center gap-2.5 lg:gap-3" aria-label="Today readiness summary">
      <div className="text-right">
        <div className="text-[11px] lg:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">
          Today&apos;s Readiness
        </div>
      </div>
      <div className="relative w-14 h-14">
        <CircleGauge
          value={score}
          max={100}
          color="var(--accent-lime)"
          size={56}
          strokeWidth={4}
          className="w-full h-full -rotate-90"
          ariaLabel={`Readiness score ${score} out of 100`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-[var(--text-primary)] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {score}
          </span>
        </div>
      </div>
      <div className="text-xs lg:text-sm font-semibold text-[var(--accent-lime)]">Status: {label}</div>
    </section>
  )
}

export default function Header({ onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6 border-b border-[var(--border-color)] bg-[var(--bg-main)] shrink-0">
      <div className="flex items-start justify-between gap-3 sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 md:hidden mb-1">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="min-h-11 min-w-11 p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"
              aria-label="Open sidebar"
            >
              <PanelLeft size={18} />
            </button>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
            {user.greeting}, {user.name}.
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Your aerobic efficiency{' '}
            <span className="text-[var(--accent-lime)] font-medium">{user.aerobicTrend}</span> this week.
          </p>
        </div>

      <div className="hidden md:flex items-center gap-3 lg:gap-5">
        <div className="hidden lg:block">
          <ReadinessRing score={readiness.score} label={readiness.label} />
        </div>

        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-11 min-w-11 p-2.5 rounded-lg hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="min-h-11 min-w-11 p-2.5 rounded-lg hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"
            aria-label="Open notifications"
          >
            <Bell size={18} />
            <span className="sr-only">1 unread notification</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)]" />
          </button>
          <button
            type="button"
            className="min-h-11 min-w-11 p-2.5 rounded-lg hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"
            aria-label="Open settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
      </div>
    </header>
  )
}
