const trendCards = [
  {
    label: 'Avg Pace',
    value: '5:08',
    unit: '/km',
    change: '−0:14',
    direction: 'up',
    caption: 'vs last 4 weeks',
    sparkline: [5.5, 5.45, 5.38, 5.32, 5.28, 5.22, 5.18, 5.13],
    color: 'var(--accent-lime)',
  },
  {
    label: 'Avg Heart Rate',
    value: '142',
    unit: 'bpm',
    change: '−3 bpm',
    direction: 'up',
    caption: 'lower at same pace',
    sparkline: [148, 147, 146, 145, 145, 143, 143, 142],
    color: 'var(--accent-lime)',
  },
  {
    label: 'Weekly Mileage',
    value: '57.3',
    unit: 'km',
    change: '+12%',
    direction: 'up',
    caption: 'vs last 4 weeks',
    sparkline: [44, 46, 48, 50, 51, 54, 55, 57],
    color: 'var(--accent-orange)',
  },
  {
    label: 'Cadence',
    value: '174',
    unit: 'spm',
    change: '+3 spm',
    direction: 'up',
    caption: 'improving efficiency',
    sparkline: [168, 169, 170, 171, 171, 172, 173, 174],
    color: 'var(--accent-cyan)',
  },
]

const weeklyLoad = [
  { week: 'W1', load: 520, recovery: 72 },
  { week: 'W2', load: 580, recovery: 68 },
  { week: 'W3', load: 610, recovery: 75 },
  { week: 'W4', load: 540, recovery: 80 },
  { week: 'W5', load: 680, recovery: 65 },
  { week: 'W6', load: 720, recovery: 70 },
  { week: 'W7', load: 700, recovery: 73 },
  { week: 'W8', load: 742, recovery: 82 },
]

const hrZones = [
  { zone: 'Z1 Recovery',   pct: 18, range: '< 121 bpm', color: 'var(--accent-cyan)' },
  { zone: 'Z2 Aerobic',    pct: 42, range: '121–142 bpm', color: 'var(--accent-lime)' },
  { zone: 'Z3 Tempo',      pct: 22, range: '143–155 bpm', color: 'var(--status-warning)' },
  { zone: 'Z4 Threshold',  pct: 13, range: '156–168 bpm', color: 'var(--accent-orange)' },
  { zone: 'Z5 VO₂ Max',    pct: 5,  range: '> 168 bpm',  color: 'var(--status-danger)' },
]

const paceHistory = [
  { week: 'W1', easy: '5:42', threshold: '4:55', race: '4:38' },
  { week: 'W2', easy: '5:38', threshold: '4:52', race: '4:35' },
  { week: 'W3', easy: '5:35', threshold: '4:50', race: '4:32' },
  { week: 'W4', easy: '5:30', threshold: '4:47', race: '4:28' },
  { week: 'W5', easy: '5:26', threshold: '4:44', race: '4:25' },
  { week: 'W6', easy: '5:22', threshold: '4:41', race: '4:22' },
  { week: 'W7', easy: '5:18', threshold: '4:38', race: '4:18' },
  { week: 'W8', easy: '5:14', threshold: '4:35', race: '4:14' },
]

function Sparkline({ data, color }) {
  const w = 80
  const h = 28
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

const maxLoad = Math.max(...weeklyLoad.map(w => w.load))

export default function TrendsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          Trends
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          8-week performance and training trends
        </p>
      </div>

      {/* Trend cards */}
      <div className="grid grid-cols-4 gap-4">
        {trendCards.map(t => (
          <div key={t.label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">{t.label}</div>
            <div className="flex items-end justify-between">
              <div>
                <div
                  className="text-3xl font-bold leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                >
                  {t.value}
                  <span className="text-sm font-normal text-[var(--text-muted)] ml-1">{t.unit}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'var(--bg-lime-tint)', color: 'var(--accent-lime)' }}
                  >
                    {t.change}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">{t.caption}</span>
                </div>
              </div>
              <Sparkline data={t.sparkline} color={t.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Load + HR Zones */}
      <div className="grid grid-cols-[1fr_340px] gap-4">
        {/* Weekly load bars */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Weekly Training Load</div>
            <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[var(--accent-lime)]" />Load
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[var(--accent-cyan)]" />Recovery
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2" style={{ height: '100px' }}>
            {weeklyLoad.map(({ week, load, recovery }, i) => {
              const loadPct = (load / maxLoad) * 100
              const recPct = (recovery / 100) * 100
              const isCurrent = i === weeklyLoad.length - 1
              return (
                <div key={week} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex items-end gap-0.5" style={{ height: '80px' }}>
                    <div
                      className="flex-1 rounded-t-sm"
                      style={{ height: `${loadPct}%`, backgroundColor: isCurrent ? 'var(--accent-lime)' : 'var(--bg-lime-strong)', minHeight: '3px' }}
                    />
                    <div
                      className="flex-1 rounded-t-sm"
                      style={{ height: `${recPct}%`, backgroundColor: isCurrent ? 'var(--accent-cyan)' : 'var(--border-cyan-tint)', minHeight: '3px' }}
                    />
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{week}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* HR Zones */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">HR Zone Distribution</div>
          <div className="space-y-3">
            {hrZones.map(z => (
              <div key={z.zone}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[var(--text-secondary)]" style={{ fontFamily: "'Inter', sans-serif" }}>{z.zone}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)]">{z.range}</span>
                    <span className="text-xs font-semibold" style={{ color: z.color }}>{z.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[var(--border-color)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${z.pct}%`, backgroundColor: z.color, opacity: 0.85 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pace history table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Pace by Zone — 8 Week History</div>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1.5 text-[var(--accent-lime)]"><span className="w-2 h-0.5 inline-block bg-[var(--accent-lime)] rounded" />Easy</span>
            <span className="flex items-center gap-1.5 text-[var(--accent-orange)]"><span className="w-2 h-0.5 inline-block bg-[var(--accent-orange)] rounded" />Threshold</span>
            <span className="flex items-center gap-1.5 text-[var(--accent-cyan)]"><span className="w-2 h-0.5 inline-block bg-[var(--accent-cyan)] rounded" />Race</span>
          </div>
        </div>
        <div className="grid grid-cols-8 divide-x divide-[var(--border-color)]">
          {paceHistory.map((w, i) => {
            const isCurrent = i === paceHistory.length - 1
            return (
              <div
                key={w.week}
                className="px-3 py-4 text-center"
                style={{ backgroundColor: isCurrent ? 'var(--bg-lime-dim)' : 'transparent' }}
              >
                <div className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${isCurrent ? 'text-[var(--accent-lime)]' : 'text-[var(--text-muted)]'}`}>
                  {w.week}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[var(--accent-lime)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{w.easy}</div>
                  <div className="text-xs font-semibold text-[var(--accent-orange)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{w.threshold}</div>
                  <div className="text-xs font-semibold text-[var(--accent-cyan)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{w.race}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
