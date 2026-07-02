'use client'

import { useState } from 'react'
import { TrendingUp, AlertCircle, Target, Footprints } from 'lucide-react'
import { useDashboardData } from '../../../providers/DashboardDataProvider'

const typeStyles = {
  success: { Icon: TrendingUp, color: 'var(--accent-lime)', bg: 'var(--bg-lime-tint)', border: 'var(--border-lime-tint)', label: 'Positive signal' },
  warning: { Icon: AlertCircle, color: 'var(--accent-orange)', bg: 'var(--bg-orange-tint)', border: 'var(--border-orange-tint)', label: 'Watch signal' },
  info: { Icon: Target, color: 'var(--accent-cyan)', bg: 'var(--bg-cyan-tint)', border: 'var(--border-cyan-tint)', label: 'Info signal' },
}

export default function InsightsPage() {
  const { dashboardData, refreshDashboardData } = useDashboardData()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState(null)
  const insightsMeta = dashboardData.insightsMeta || { source: 'rules', generatedAt: null }
  const insights = dashboardData.insights.map((item) => ({ ...item, ...typeStyles[item.type] }))

  const handleRefresh = async () => {
    setRefreshError(null)
    setIsRefreshing(true)

    try {
      const response = await fetch('/api/ai-activity-insights', {
        method: 'POST',
        credentials: 'include',
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to refresh AI insights.')
      }

      await refreshDashboardData()
    } catch (error) {
      setRefreshError(error.message || 'Failed to refresh AI insights.')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
            AI Insights
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Insights generated from your recent activities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
            insightsMeta.source === 'ai'
              ? 'bg-[var(--bg-lime-tint)] border-[var(--border-lime-tint)] text-[var(--accent-lime)]'
              : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)]'
          }`}>
            {insightsMeta.source === 'ai' ? 'AI model active' : 'Rules fallback'}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="min-h-11 inline-flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-lime)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh AI'}
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
        <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">Latest Generation</div>
        <div className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: "'Inter', sans-serif" }}>
          {insightsMeta.generatedAt
            ? new Date(insightsMeta.generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
            : 'No AI generation yet. Click Refresh AI to generate insights from current activities.'}
        </div>
        {refreshError ? (
          <p className="mt-2 text-xs text-[var(--status-danger)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {refreshError}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {insights.map(({ Icon, title, description, confidence, color, bg, border, label }) => (
          <article key={title} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4" aria-label={title}>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
                <Icon size={16} style={{ color }} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold mb-1" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{description}</p>
                <div className="text-[10px] mt-2 font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</div>
                <div className="text-xs mt-1.5 font-medium" style={{ color }}>Confidence: {confidence}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5" aria-label="Weekly focus">
        <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">Weekly Focus</div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
            <Footprints size={16} className="text-[var(--text-secondary)]" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {dashboardData.weeklyFocus.title}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              {dashboardData.weeklyFocus.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
