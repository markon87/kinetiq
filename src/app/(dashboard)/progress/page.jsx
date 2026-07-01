const personalRecords = [
  { label: '5K',            time: '22:14', date: 'Mar 15, 2026', improvement: '−0:48', color: 'var(--accent-lime)' },
  { label: '10K',           time: '46:02', date: 'Apr 28, 2026', improvement: '−2:18', color: 'var(--accent-lime)' },
  { label: 'Half Marathon', time: '1:43:55', date: 'Feb 9, 2026', improvement: '−4:12', color: 'var(--accent-cyan)' },
  { label: 'Marathon',      time: '3:52:30', date: 'Oct 12, 2025', improvement: '−8:45', color: 'var(--accent-orange)' },
]

const monthlyVolume = [
  { month: 'Dec', km: 142 },
  { month: 'Jan', km: 168 },
  { month: 'Feb', km: 195 },
  { month: 'Mar', km: 178 },
  { month: 'Apr', km: 220 },
  { month: 'May', km: 248 },
]

const fitnessMetrics = [
  { label: 'VO₂ Max',          value: '52.4', unit: 'ml/kg/min', change: '+1.8',  trend: 'up',   color: 'var(--accent-lime)' },
  { label: 'Aerobic Threshold', value: '4:55', unit: '/km',       change: '−0:12', trend: 'up',   color: 'var(--accent-lime)' },
  { label: 'Lactate Threshold', value: '4:18', unit: '/km',       change: '−0:08', trend: 'up',   color: 'var(--accent-cyan)' },
  { label: 'Running Economy',   value: '198',  unit: 'ml/kg/km',  change: '−4',    trend: 'up',   color: 'var(--accent-lime)' },
  { label: 'Avg Weekly Mileage',value: '57.3', unit: 'km',        change: '+12%',  trend: 'up',   color: 'var(--accent-orange)' },
  { label: 'Long Run Distance', value: '21.5', unit: 'km avg',    change: '+2.1',  trend: 'up',   color: 'var(--accent-cyan)' },
]

const milestones = [
  { label: 'First sub-50 10K',     date: 'Jan 2026', achieved: true },
  { label: '500 km logged',         date: 'Feb 2026', achieved: true },
  { label: 'Sub-45 10K',            date: 'Target: Jul 2026', achieved: false },
  { label: 'Sub-3:45 Marathon',     date: 'Target: Oct 2026', achieved: false },
]

const maxKm = Math.max(...monthlyVolume.map(m => m.km))

export default function ProgressPage() {
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-5 sm:space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          Progress
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Personal records, volume trends, and fitness development
        </p>
      </div>

      {/* Personal Records */}
      <div>
        <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">Personal Records</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {personalRecords.map(pr => (
            <div key={pr.label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">{pr.label}</div>
              <div
                className="text-3xl font-bold leading-none mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em', color: pr.color }}
              >
                {pr.time}
              </div>
              <div className="text-xs text-[var(--text-muted)] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{pr.date}</div>
              <div
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--bg-lime-tint)', color: 'var(--accent-lime)' }}
              >
                ↑ {pr.improvement} from prev PR
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Volume */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Monthly Volume</div>
          <span className="text-xs text-[var(--text-secondary)]">Last 6 months</span>
        </div>
        <div className="flex items-end gap-3 h-32">
          {monthlyVolume.map(({ month, km }) => {
            const pct = (km / maxKm) * 100
            const isCurrent = month === 'May'
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-[var(--text-secondary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {km}
                </div>
                <div className="w-full flex items-end" style={{ height: '80px' }}>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: isCurrent ? 'var(--accent-lime)' : 'var(--bg-lime-strong)',
                      minHeight: '4px',
                    }}
                  />
                </div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{month}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fitness Metrics + Milestones side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        {/* Fitness Metrics */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Fitness Metrics</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {fitnessMetrics.map(m => (
              <div key={m.label} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 leading-tight">{m.label}</div>
                <div
                  className="text-xl font-bold leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: m.color }}
                >
                  {m.value}
                  <span className="text-xs font-normal text-[var(--text-muted)] ml-1">{m.unit}</span>
                </div>
                <div className="text-xs text-[var(--accent-lime)] mt-1.5 font-medium">{m.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Milestones</div>
          <div className="space-y-3">
            {milestones.map(m => (
              <div key={m.label} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: m.achieved ? 'var(--bg-lime-tint)' : 'var(--bg-card)',
                    border: `1.5px solid ${m.achieved ? 'var(--accent-lime)' : 'var(--border-color)'}`,
                    color: m.achieved ? 'var(--accent-lime)' : 'var(--text-muted)',
                  }}
                >
                  {m.achieved ? '✓' : '○'}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium leading-tight"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: m.achieved ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {m.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: m.achieved ? 'var(--accent-lime)' : 'var(--text-muted)' }}>
                    {m.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
