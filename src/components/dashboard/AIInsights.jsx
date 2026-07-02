'use client'

import { useState } from 'react'
import { TrendingUp, AlertCircle, Target, Footprints, ChevronRight } from 'lucide-react'
import { useDashboardData } from '../../providers/DashboardDataProvider'

const typeStyles = {
  success: { Icon: TrendingUp, color: 'var(--accent-lime)', bg: 'var(--bg-lime-tint)', border: 'var(--border-lime-tint)', label: 'Positive signal' },
  warning: { Icon: AlertCircle, color: 'var(--accent-orange)', bg: 'var(--bg-orange-tint)', border: 'var(--border-orange-tint)', label: 'Watch signal' },
  info:    { Icon: Target,      color: 'var(--accent-cyan)', bg: 'var(--bg-cyan-tint)', border: 'var(--border-cyan-tint)', label: 'Info signal' },
}

export default function AIInsights() {
  const { dashboardData, refreshDashboardData } = useDashboardData()
  const insights = dashboardData.insights.map((item) => ({ ...item, ...typeStyles[item.type] }))
  const insightsMeta = dashboardData.insightsMeta || { source: 'rules', generatedAt: null }
  const { weeklyFocus } = dashboardData
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState(null)

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
    <section aria-labelledby="ai-insights-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="ai-insights-heading" className="text-[11px] sm:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">AI Insights</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="min-h-11 px-2 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-lime)] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
          aria-label="Refresh AI insights"
        >
          {isRefreshing ? 'Refreshing…' : 'Refresh AI'}
        </button>
      </div>

      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wide">
        <span className={`rounded-full border px-2 py-0.5 font-semibold ${
          insightsMeta.source === 'ai'
            ? 'border-[var(--border-lime-tint)] bg-[var(--bg-lime-tint)] text-[var(--accent-lime)]'
            : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
        }`}>
          {insightsMeta.source === 'ai' ? 'Source: AI Model' : 'Source: Rules Fallback'}
        </span>
        {insightsMeta.generatedAt ? (
          <span className="text-[var(--text-muted)]">
            {new Date(insightsMeta.generatedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        ) : null}
      </div>

      {refreshError ? (
        <p className="mb-2 text-xs text-[var(--status-danger)]" style={{ fontFamily: "'Inter', sans-serif" }}>
          {refreshError}
        </p>
      ) : null}

      <div className="space-y-2">
        {insights.map(({ Icon, title, description, confidence, color, bg, border, label }) => (
          <article key={title} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-4" aria-label={title}>
            <div className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <Icon size={16} style={{ color }} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] sm:text-sm font-semibold mb-1" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {title}
                </div>
                <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {description}
                </p>
                <div className="text-[10px] mt-2 font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  {label}
                </div>
                <div className="text-xs mt-2 font-medium" style={{ color }}>
                  Confidence: {confidence}
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Weekly Focus */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-4" aria-label="Weekly focus">
          <div className="text-[11px] sm:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">Weekly Focus</div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
              <Footprints size={16} className="text-[var(--text-secondary)]" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {weeklyFocus.title}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {weeklyFocus.description}
              </p>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" aria-hidden="true" />
          </div>
        </section>
      </div>
    </section>
  )
}
