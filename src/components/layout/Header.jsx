'use client'

import { Bell, Settings, Sun, Moon } from 'lucide-react'
import { dashboardData } from '../../data/mockData'
import { useTheme } from '../../providers/ThemeProvider'

const { user, readiness } = dashboardData

function ReadinessRing({ score, label }) {
  const r = 24
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">
          Today's Readiness
        </div>
      </div>
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border-color)" strokeWidth="4" />
          <circle
            cx="28" cy="28" r={r} fill="none"
            stroke="var(--accent-lime)" strokeWidth="4"
            strokeDasharray={`${filled} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-[var(--text-primary)] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {score}
          </span>
        </div>
      </div>
      <div className="text-sm font-semibold text-[var(--accent-lime)]">{label}</div>
    </div>
  )
}

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-main)] shrink-0">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          {user.greeting}, {user.name}.
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Your aerobic efficiency{' '}
          <span className="text-[var(--accent-lime)] font-medium">{user.aerobicTrend}</span> this week.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <ReadinessRing score={readiness.score} label={readiness.label} />

        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 rounded-lg hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)]" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
