const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const GRID = [
  ['high','med','high','low','high','low','low'],
  ['med','high','high','med','low','low','low'],
  ['high','high','med','high','low','low','low'],
  ['med','high','high','high','med','low','low'],
  ['high','med','med','high','high','low','low'],
  ['high','high','high','med','high','low','low'],
  ['med','high','high','high','med','low','low'],
]

const COLOR = {
  high: 'bg-[var(--accent-lime)]',
  med:  'bg-[var(--bg-lime-med)]',
  low:  'bg-[var(--border-color)]',
}

const stats = [
  { label: 'Weekly Mileage',  value: '64.3', unit: 'km',   change: '↑ 12%',  up: true  },
  { label: 'Long Run',        value: '18.2', unit: 'km',   note: 'Sat, Jun 8'           },
  { label: 'Avg Pace',        value: '5:02', unit: '/km',  change: '↓ 0:06', up: true  },
  { label: 'Avg HR',          value: '142',  unit: 'bpm',  change: '↓ 3',    up: true  },
  { label: 'Elevation Gain',  value: '620',  unit: 'm',    change: '↑ 8%',   up: true  },
]

const legendItems = [
  { label: 'High', colorClass: COLOR.high },
  { label: 'Medium', colorClass: COLOR.med },
  { label: 'Low', colorClass: COLOR.low },
]

export default function ConsistencySection() {
  return (
    <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-4 lg:p-5" aria-labelledby="consistency-heading">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Heatmap */}
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <h2 id="consistency-heading" className="text-[11px] sm:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Consistency</h2>
            <span
              className="text-base sm:text-sm font-bold text-[var(--accent-lime)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              85%
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3" aria-label="Consistency level legend">
            {legendItems.map(({ label, colorClass }) => (
              <div key={label} className="inline-flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${colorClass}`} aria-hidden="true" />
                <span className="text-[11px] sm:text-[10px] text-[var(--text-secondary)]">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mb-1">
            {DAYS.map((d, i) => (
              <div key={i} className="w-5 sm:w-6 text-center text-[10px] text-[var(--text-muted)]">{d}</div>
            ))}
          </div>
          <div className="space-y-1">
            {GRID.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((cell, ci) => (
                  <div key={ci} className={`w-5 sm:w-6 h-3.5 sm:h-4 rounded-sm ${COLOR[cell]}`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 items-start pt-3 border-t border-[var(--border-color)] lg:pt-0 lg:pl-6 lg:border-t-0 lg:border-l">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5 leading-tight">
                {s.label}
              </div>
              <div
                className="text-lg sm:text-xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
              >
                {s.value}
                <span className="text-xs sm:text-sm font-normal text-[var(--text-secondary)] ml-0.5">{s.unit}</span>
              </div>
              {s.change && (
                <div className="text-xs text-[var(--accent-lime)] mt-0.5 font-medium">{s.change}</div>
              )}
              {s.note && (
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">{s.note}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
