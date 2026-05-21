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
        <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest leading-none mb-1">
          Today's Readiness
        </div>
      </div>
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#1E2530" strokeWidth="4" />
          <circle
            cx="28" cy="28" r={r} fill="none"
            stroke="#C6FF2E" strokeWidth="4"
            strokeDasharray={`${filled} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-[#F5F7FA] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {score}
          </span>
        </div>
      </div>
      <div className="text-sm font-semibold text-[#C6FF2E]">{label}</div>
    </div>
  )
}

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#1E2530] bg-[#0B0F14] shrink-0">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          {user.greeting}, {user.name}.
        </h1>
        <p className="text-sm text-[#A8B0BD] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Your aerobic efficiency{' '}
          <span className="text-[#C6FF2E] font-medium">{user.aerobicTrend}</span> this week.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <ReadinessRing score={readiness.score} label={readiness.label} />

        <div className="flex items-center gap-1 text-[#6F7A88]">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[#151B23] hover:text-[#F5F7FA] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 rounded-lg hover:bg-[#151B23] hover:text-[#F5F7FA] transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C6FF2E]" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#151B23] hover:text-[#F5F7FA] transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
