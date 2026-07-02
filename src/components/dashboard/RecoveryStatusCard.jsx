'use client'

import { Info, AlertTriangle } from 'lucide-react'
import CircleGauge from '../ui/CircleGauge'
import { useDashboardData } from '../../providers/DashboardDataProvider'

export default function RecoveryStatusCard() {
  const { dashboardData } = useDashboardData()
  const { recovery } = dashboardData
  const metrics = recovery.metrics || []

  const trendToStyle = {
    up: { color: 'var(--accent-lime)', icon: '↑' },
    down: { color: 'var(--status-danger)', icon: '↓' },
    stable: { color: 'var(--text-secondary)', icon: '→' },
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-4 lg:p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Recovery Status</span>
        <span title="Recovery Status estimates how ready your body is for harder training based on your recent load trend and current weekly stress.">
          <Info size={13} className="text-[var(--text-muted)]" />
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-1">
        <div className="relative shrink-0">
          <CircleGauge
            percent={recovery.gaugePercent}
            color="var(--accent-orange)"
            size={108}
            ariaLabel={`Recovery status ${Math.round(recovery.gaugePercent * 100)} percent`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {recovery.status.split(' ')[0]}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">{recovery.status.split(' ').slice(1).join(' ')}</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2.5 sm:space-y-3">
          {metrics.map(({ label, change, direction, trend }) => {
            const style = trendToStyle[direction] || trendToStyle.stable
            return (
              <div key={label} className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
              <span className="text-xs sm:text-sm font-semibold" style={{ color: style.color }}>
                {style.icon} {trend}{change ? ` (${change})` : ''}
              </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-[var(--bg-amber-tint)] border border-[var(--border-amber-tint)]">
        <AlertTriangle size={13} className="text-[var(--accent-orange)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          {recovery.warning}
        </p>
      </div>
    </div>
  )
}
