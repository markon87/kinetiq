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

export default function ConsistencySection() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
      <div className="flex gap-6">
        {/* Heatmap */}
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Consistency</span>
            <span
              className="text-sm font-bold text-[var(--accent-lime)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              85%
            </span>
          </div>
          <div className="flex gap-1 mb-1">
            {DAYS.map((d, i) => (
              <div key={i} className="w-6 text-center text-[10px] text-[var(--text-muted)]">{d}</div>
            ))}
          </div>
          <div className="space-y-1">
            {GRID.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((cell, ci) => (
                  <div key={ci} className={`w-6 h-4 rounded-sm ${COLOR[cell]}`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-5 gap-x-4 items-center pl-6 border-l border-[var(--border-color)]">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5 leading-tight">
                {s.label}
              </div>
              <div
                className="text-xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
              >
                {s.value}
                <span className="text-sm font-normal text-[var(--text-secondary)] ml-0.5">{s.unit}</span>
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
    </div>
  )
}
