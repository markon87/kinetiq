'use client'

import { TrendingUp, AlertCircle, Target, Footprints, ChevronRight } from 'lucide-react'
import { dashboardData } from '../../data/mockData'
import { useUploadAnalysis } from '../../providers/UploadAnalysisProvider'

const typeStyles = {
  success: { Icon: TrendingUp, color: 'var(--accent-lime)', bg: 'var(--bg-lime-tint)', border: 'var(--border-lime-tint)', label: 'Positive signal' },
  warning: { Icon: AlertCircle, color: 'var(--accent-orange)', bg: 'var(--bg-orange-tint)', border: 'var(--border-orange-tint)', label: 'Watch signal' },
  info:    { Icon: Target,      color: 'var(--accent-cyan)', bg: 'var(--bg-cyan-tint)', border: 'var(--border-cyan-tint)', label: 'Info signal' },
}

const insights = dashboardData.insights.map(i => ({ ...i, ...typeStyles[i.type] }))
const { weeklyFocus } = dashboardData

export default function AIInsights() {
  const { analysisResult } = useUploadAnalysis()

  const latestInsight = analysisResult
    ? {
        title: `${analysisResult.workoutType} analyzed`,
        description: analysisResult.suggestedInsights?.[0] || 'New screenshot analysis is available.',
        confidence: `${analysisResult.confidence}%`,
        color: 'var(--accent-cyan)',
        bg: 'var(--bg-cyan-tint)',
        border: 'var(--border-cyan-tint)',
      }
    : null

  return (
    <section aria-labelledby="ai-insights-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="ai-insights-heading" className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">AI Insights</h2>
        <button
          type="button"
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-lime)] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
          aria-label="View all insights"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {latestInsight ? (
          <article className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4" aria-label={latestInsight.title}>
            <div className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: latestInsight.bg, border: `1px solid ${latestInsight.border}` }}
              >
                <Target size={16} style={{ color: latestInsight.color }} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-1" style={{ color: latestInsight.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {latestInsight.title}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {latestInsight.description}
                </p>
                <div className="text-[10px] mt-2 font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Source: Screenshot analysis
                </div>
                <div className="text-xs mt-2 font-medium" style={{ color: latestInsight.color }}>
                  Confidence: {latestInsight.confidence}
                </div>
              </div>
            </div>
          </article>
        ) : null}

        {insights.map(({ Icon, title, description, confidence, color, bg, border, label }) => (
          <article key={title} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4" aria-label={title}>
            <div className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <Icon size={16} style={{ color }} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-1" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {title}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
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
        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4" aria-label="Weekly focus">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">Weekly Focus</div>
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
