import { Info } from 'lucide-react'
import { dashboardData } from '../../data/mockData'

const { trainingLoad } = dashboardData

function CircleGauge({ value, max, color, trackColor = 'var(--border-color)', strokeWidth = 9, size = 140 }) {
  const r = 46
  const circ = 2 * Math.PI * r
  const filled = (value / max) * circ

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function TrainingLoadCard() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Training Load</span>
        <Info size={13} className="text-[var(--text-muted)]" />
      </div>

      <div className="flex flex-col items-center flex-1 justify-center">
        <div className="relative">
          <CircleGauge value={trainingLoad.value} max={trainingLoad.max} color="var(--accent-lime)" size={140} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-4xl font-bold text-[var(--text-primary)] leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
            >
              {trainingLoad.value}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-1.5">Optimal Range</span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">{trainingLoad.optimalMin} – {trainingLoad.optimalMax}</span>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-lime-tint)] border border-[var(--border-lime-tint)] text-[var(--accent-lime)] text-xs font-semibold">
          ✓ Within target
        </div>
      </div>
    </div>
  )
}
