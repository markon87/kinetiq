'use client'

import CircleGauge from '../ui/CircleGauge'
import InfoTooltip from '../ui/InfoTooltip'
import { useDashboardData } from '../../providers/DashboardDataProvider'

export default function TrainingLoadCard() {
  const { dashboardData } = useDashboardData()
  const { trainingLoad } = dashboardData

  const isWithinTarget = trainingLoad.value >= trainingLoad.optimalMin && trainingLoad.value <= trainingLoad.optimalMax
  const isBelowTarget = trainingLoad.value < trainingLoad.optimalMin

  const statusText = isWithinTarget ? 'Within target' : isBelowTarget ? 'Below target' : 'Above target'
  const statusClass = isWithinTarget
    ? 'bg-[var(--bg-lime-tint)] border-[var(--border-lime-tint)] text-[var(--accent-lime)]'
    : isBelowTarget
      ? 'bg-[var(--bg-cyan-tint)] border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)]'
      : 'bg-[var(--bg-amber-tint)] border-[var(--border-amber-tint)] text-[var(--accent-orange)]'

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-4 lg:p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Training Load</span>
        <InfoTooltip text="Training Load combines your recent distance and effort to show whether weekly stress is below, within, or above your target range." />
      </div>

      <div className="flex flex-col items-center flex-1 justify-center">
        <div className="relative">
          <CircleGauge
            value={trainingLoad.value}
            max={trainingLoad.max}
            color="var(--accent-lime)"
            size={120}
            ariaLabel={`Training load ${trainingLoad.value} out of ${trainingLoad.max}`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
            >
              {trainingLoad.value}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-1.5">Optimal Range</span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">{trainingLoad.optimalMin} – {trainingLoad.optimalMax}</span>
          </div>
        </div>

        <div className={`mt-4 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold ${statusClass}`}>
          ✓ Status: {statusText}
        </div>
      </div>
    </div>
  )
}
