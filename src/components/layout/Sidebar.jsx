'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Activity, BarChart2, TrendingUp,
  Heart, Lightbulb, Target, Upload, ChevronDown
} from 'lucide-react'
import { dashboardData } from '../../data/mockData'
import { useUploadAnalysis } from '../../providers/UploadAnalysisProvider'

const { user } = dashboardData

const navItems = [
  { label: 'Dashboard',  href: '/',           icon: LayoutDashboard },
  { label: 'Activities', href: '/activities', icon: Activity },
  { label: 'Progress',   href: '/progress',   icon: BarChart2 },
  { label: 'Trends',     href: '/trends',     icon: TrendingUp },
  { label: 'Health',     href: '/health',     icon: Heart },
  { label: 'Insights',   href: '/insights',   icon: Lightbulb },
  { label: 'Goals',      href: '/goals',      icon: Target },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { openModal } = useUploadAnalysis()

  return (
    <aside className="w-56 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col h-full shrink-0" aria-label="Sidebar">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--border-color)]">
        <Image src="/kinetiq-logo.png" alt="Kinetiq logo" width={112} height={28} className="h-7 w-auto" priority />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5" aria-label="Primary">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-4 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)] ${
                active
                  ? 'bg-[var(--bg-lime-tint)] text-[var(--accent-lime)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Upload + User */}
      <div className="p-3 space-y-3 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={openModal}
          aria-label="Upload workout screenshots"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] group-hover:animate-pulse" />
          <Upload size={14} />
          Upload Screenshots
        </button>
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-lime)] to-[var(--accent-cyan)] flex items-center justify-center text-xs font-bold text-[var(--bg-main)] shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</div>
            <div className="text-xs text-[var(--accent-lime)]">{user.plan}</div>
          </div>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </div>
      </div>
    </aside>
  )
}
