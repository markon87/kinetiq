import { Info, AlertTriangle } from 'lucide-react'
import { dashboardData } from '../../data/mockData'

const { recovery } = dashboardData

const metrics = [
  { label: 'Sleep',        change: null,                                        color: 'var(--status-danger)', dir: '↓' },
  { label: 'HR Stability', change: null,                                        color: 'var(--status-danger)', dir: '↓' },
  { label: 'Mileage',      change: `+${recovery.mileageIncrease}%`,             color: 'var(--accent-lime)', dir: '↑' },
]

function CircleGauge({ percent, color, size = 120 }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const filled = percent * circ

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border-color)" strokeWidth="9" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color} strokeWidth="9"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function RecoveryStatusCard() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Recovery Status</span>
        <Info size={13} className="text-[var(--text-muted)]" />
      </div>

      <div className="flex items-center gap-4 flex-1">
        <div className="relative shrink-0">
          <CircleGauge percent={recovery.gaugePercent} color="var(--accent-orange)" size={120} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-base font-bold text-[var(--text-primary)] leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {recovery.status.split(' ')[0]}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">{recovery.status.split(' ').slice(1).join(' ')}</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {metrics.map(({ label, change, color, dir }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
              <span className="text-sm font-semibold" style={{ color }}>
                {dir} {change || ''}
              </span>
            </div>
          ))}
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
