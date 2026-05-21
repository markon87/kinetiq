const overviewCards = [
  {
    label: 'HRV',
    value: '52',
    unit: 'ms',
    change: '+4 ms',
    caption: 'vs last week',
    note: 'Excellent',
    noteColor: 'var(--accent-lime)',
    sparkline: [44, 46, 43, 48, 47, 50, 51, 52],
    color: 'var(--accent-lime)',
  },
  {
    label: 'Resting Heart Rate',
    value: '48',
    unit: 'bpm',
    change: '−2 bpm',
    caption: 'vs last week',
    note: 'Athletic',
    noteColor: 'var(--accent-lime)',
    sparkline: [54, 53, 52, 51, 51, 50, 49, 48],
    color: 'var(--accent-cyan)',
  },
  {
    label: 'Avg Sleep',
    value: '7.4',
    unit: 'hrs',
    change: '+0.3 hrs',
    caption: 'vs last week',
    note: 'Good',
    noteColor: 'var(--status-warning)',
    sparkline: [6.8, 7.0, 6.5, 7.2, 7.5, 7.1, 7.6, 7.4],
    color: 'var(--color-purple)',
  },
  {
    label: 'Recovery Score',
    value: '74',
    unit: '/ 100',
    change: '+6 pts',
    caption: 'vs last week',
    note: 'Good',
    noteColor: 'var(--accent-lime)',
    sparkline: [58, 62, 55, 68, 65, 70, 72, 74],
    color: 'var(--accent-lime)',
  },
]

const sleepData = [
  { day: 'Wed', duration: 6.8, quality: 'fair',   deep: 1.1, rem: 1.4 },
  { day: 'Thu', duration: 7.2, quality: 'good',   deep: 1.4, rem: 1.8 },
  { day: 'Fri', duration: 7.8, quality: 'great',  deep: 1.8, rem: 2.1 },
  { day: 'Sat', duration: 8.2, quality: 'great',  deep: 2.0, rem: 2.3 },
  { day: 'Sun', duration: 7.1, quality: 'good',   deep: 1.3, rem: 1.7 },
  { day: 'Mon', duration: 6.5, quality: 'fair',   deep: 1.0, rem: 1.3 },
  { day: 'Tue', duration: 7.6, quality: 'good',   deep: 1.6, rem: 1.9 },
]

const qualityColor = {
  great: 'var(--accent-lime)',
  good:  'var(--status-warning)',
  fair:  'var(--accent-orange)',
  poor:  'var(--status-danger)',
}

const hrvHistory = [44, 46, 43, 48, 47, 46, 50, 51, 49, 52, 53, 52]
const rhrHistory = [54, 53, 53, 52, 51, 52, 50, 50, 49, 49, 48, 48]

const bodyMetrics = [
  { label: 'Body Weight',     value: '72.4', unit: 'kg',  change: '−0.6', trend: 'down-good', bar: 68 },
  { label: 'Body Fat',        value: '12.8', unit: '%',   change: '−0.4', trend: 'down-good', bar: 40 },
  { label: 'Hydration',       value: '62',   unit: '%',   change: '−2%',  trend: 'warn',      bar: 62 },
  { label: 'Stress Level',    value: '32',   unit: '/ 100', change: '−8', trend: 'down-good', bar: 32 },
]

const injuryRisks = [
  { area: 'Left Knee',    risk: 'Low',      pct: 18, color: 'var(--accent-lime)' },
  { area: 'Right Achilles', risk: 'Moderate', pct: 52, color: 'var(--status-warning)' },
  { area: 'Lower Back',   risk: 'Low',      pct: 22, color: 'var(--accent-lime)' },
  { area: 'Left Hip',     risk: 'Low',      pct: 14, color: 'var(--accent-lime)' },
]

function Sparkline({ data, color, width = 72, height = 28 }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

const maxSleep = Math.max(...sleepData.map(d => d.duration))

export default function HealthPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          Health
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Recovery, sleep, and biometric overview
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-4 gap-4">
        {overviewCards.map(c => (
          <div key={c.label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">{c.label}</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold leading-none text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
                  {c.value}
                  <span className="text-sm font-normal text-[var(--text-muted)] ml-1">{c.unit}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-lime-tint)', color: 'var(--accent-lime)' }}>
                    {c.change}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">{c.caption}</span>
                </div>
                <div className="mt-1.5 text-xs font-semibold" style={{ color: c.noteColor }}>{c.note}</div>
              </div>
              <Sparkline data={c.sparkline} color={c.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Sleep + HRV/RHR side by side */}
      <div className="grid grid-cols-[1fr_300px] gap-4">
        {/* Sleep */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Sleep — Last 7 Nights</div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-[var(--accent-lime)]" />Great</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-[var(--status-warning)]" />Good</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-[var(--accent-orange)]" />Fair</span>
            </div>
          </div>
          <div className="flex items-end gap-3" style={{ height: '110px' }}>
            {sleepData.map(d => {
              const pct = (d.duration / maxSleep) * 100
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-[var(--text-secondary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {d.duration}h
                  </div>
                  <div className="w-full flex items-end" style={{ height: '72px' }}>
                    <div
                      className="w-full rounded-t-md"
                      style={{ height: `${pct}%`, backgroundColor: qualityColor[d.quality], opacity: 0.85, minHeight: '4px' }}
                    />
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">{d.day}</div>
                </div>
              )
            })}
          </div>
          {/* Deep + REM breakdown */}
          <div className="mt-4 pt-4 border-t border-[var(--border-color)] grid grid-cols-7 gap-3">
            {sleepData.map(d => (
              <div key={d.day} className="text-center">
                <div className="text-[10px] text-[var(--accent-cyan)] font-medium">{d.deep}h</div>
                <div className="text-[9px] text-[var(--text-muted)]">deep</div>
                <div className="text-[10px] text-[var(--color-purple)] font-medium mt-1">{d.rem}h</div>
                <div className="text-[9px] text-[var(--text-muted)]">rem</div>
              </div>
            ))}
          </div>
        </div>

        {/* HRV + RHR trends */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">HRV Trend</div>
              <span className="text-lg font-bold text-[var(--accent-lime)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>52 ms</span>
            </div>
            <Sparkline data={hrvHistory} color="var(--accent-lime)" width={252} height={48} />
            <div className="flex justify-between mt-1 text-[10px] text-[var(--text-muted)]">
              <span>12 wks ago</span><span>Now</span>
            </div>
          </div>
          <div className="border-t border-[var(--border-color)] pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Resting HR Trend</div>
              <span className="text-lg font-bold text-[var(--accent-cyan)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>48 bpm</span>
            </div>
            <Sparkline data={rhrHistory} color="var(--accent-cyan)" width={252} height={48} />
            <div className="flex justify-between mt-1 text-[10px] text-[var(--text-muted)]">
              <span>12 wks ago</span><span>Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body metrics + Injury risk */}
      <div className="grid grid-cols-2 gap-4">
        {/* Body metrics */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Body Metrics</div>
          <div className="space-y-4">
            {bodyMetrics.map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: "'Inter', sans-serif" }}>{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: m.trend === 'warn' ? 'var(--status-warning)' : 'var(--accent-lime)' }}>{m.change}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {m.value} <span className="text-xs font-normal text-[var(--text-muted)]">{m.unit}</span>
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--border-color)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.bar}%`,
                      backgroundColor: m.trend === 'warn' ? 'var(--status-warning)' : 'var(--accent-lime)',
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Injury risk */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Injury Risk Monitor</div>
          <div className="space-y-4">
            {injuryRisks.map(r => (
              <div key={r.area}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: "'Inter', sans-serif" }}>{r.area}</span>
                  <span className="text-xs font-semibold" style={{ color: r.color }}>{r.risk}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--border-color)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.pct}%`, backgroundColor: r.color, opacity: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-start gap-2 p-3 rounded-lg bg-[var(--bg-amber-tint)] border-[var(--border-amber-tint)]">
            <span className="text-[var(--accent-orange)] text-xs shrink-0">⚠</span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Right Achilles showing elevated load. Consider extra warm-up and reduced intensity on next run.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
