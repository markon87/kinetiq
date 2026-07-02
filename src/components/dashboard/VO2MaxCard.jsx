'use client'

import { Activity } from 'lucide-react'
import InfoTooltip from '../ui/InfoTooltip'
import { useDashboardData } from '../../providers/DashboardDataProvider'

const badgeColors = {
  Low: 'bg-[var(--bg-red-tint)] text-[var(--status-danger)] border-[var(--status-danger)]/30',
  'Below Average': 'bg-[var(--bg-orange-tint)] text-[var(--accent-orange)] border-[var(--accent-orange)]/30',
  Average: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]',
  'Above Average': 'bg-[var(--bg-cyan-tint)] text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30',
  High: 'bg-[var(--bg-lime-tint)] text-[var(--accent-lime)] border-[var(--accent-lime)]/30',
}

const stageOrder = ['Low', 'Below Average', 'Average', 'Above Average', 'High']

const stageColors = {
  Low: 'bg-[var(--status-danger)]',
  'Below Average': 'bg-[var(--accent-orange)]',
  Average: 'bg-[var(--text-secondary)]',
  'Above Average': 'bg-[var(--accent-cyan)]',
  High: 'bg-[var(--accent-lime)]',
}

export default function VO2MaxCard() {
  const { dashboardData } = useDashboardData()
  const vo2max = dashboardData.vo2max

  const badgeClass = badgeColors[vo2max.category] || badgeColors.Average

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-4 lg:p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">VO2 Max</span>
        <Activity size={13} className="text-[var(--text-muted)]" />
        <InfoTooltip text="VO2 Max estimates aerobic capacity from your recent qualified run and profile inputs like age, sex, and weight." />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="flex items-end gap-2">
          <div
            className="text-4xl font-bold text-[var(--text-primary)] leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
          >
            {vo2max.value != null ? vo2max.value.toFixed(1) : '—'}
          </div>
          <div className="text-xs text-[var(--text-muted)] mb-1">ml/kg/min</div>
        </div>

        <div className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {vo2max.category}
        </div>

        <div className="space-y-2">
          <div className="flex gap-1.5">
            {stageOrder.map((stage) => {
              const isActive = stage === vo2max.category
              return (
                <div
                  key={stage}
                  className={`h-2.5 flex-1 rounded-full transition-all ${
                    isActive ? `${stageColors[stage]} ring-2 ring-offset-1 ring-offset-[var(--bg-card)] ring-[var(--text-primary)]/50` : 'bg-[var(--bg-secondary)]'
                  }`}
                  aria-hidden="true"
                />
              )
            })}
          </div>

          <div className="grid grid-cols-5 gap-1 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            {stageOrder.map((stage) => (
              <span
                key={stage}
                className={`text-center ${stage === vo2max.category ? 'font-semibold text-[var(--text-primary)]' : ''}`}
              >
                {stage === 'Below Average' ? 'Below' : stage === 'Above Average' ? 'Above' : stage}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {vo2max.note}
        </p>
      </div>
    </div>
  )
}
