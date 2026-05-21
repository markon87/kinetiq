const activities = [
  { id: 1, type: 'Easy Run',     date: 'May 21, 2026', distance: '10.2', pace: '5:24', hr: 138, duration: '55:05', elevation: 42,  emoji: '🏃' },
  { id: 2, type: 'Tempo Run',    date: 'May 19, 2026', distance: '8.1',  pace: '4:28', hr: 152, duration: '36:12', elevation: 85,  emoji: '⚡' },
  { id: 3, type: 'Long Run',     date: 'May 17, 2026', distance: '18.2', pace: '5:38', hr: 141, duration: '1:42:31', elevation: 210, emoji: '🏔' },
  { id: 4, type: 'Recovery Run', date: 'May 15, 2026', distance: '6.4',  pace: '6:02', hr: 128, duration: '38:33', elevation: 18,  emoji: '🌿' },
  { id: 5, type: 'Interval',     date: 'May 13, 2026', distance: '9.5',  pace: '4:12', hr: 168, duration: '39:54', elevation: 55,  emoji: '🔥' },
  { id: 6, type: 'Easy Run',     date: 'May 11, 2026', distance: '11.0', pace: '5:29', hr: 136, duration: '1:00:19', elevation: 63,  emoji: '🏃' },
  { id: 7, type: 'Tempo Run',    date: 'May 9, 2026',  distance: '7.8',  pace: '4:33', hr: 155, duration: '35:17', elevation: 72,  emoji: '⚡' },
  { id: 8, type: 'Long Run',     date: 'May 7, 2026',  distance: '16.5', pace: '5:41', hr: 143, duration: '1:33:47', elevation: 185, emoji: '🏔' },
]

const typeColor = {
  'Easy Run':     { dot: 'var(--accent-lime)', bg: 'var(--bg-lime-tint)', text: 'var(--accent-lime)' },
  'Tempo Run':    { dot: 'var(--accent-orange)', bg: 'var(--bg-orange-tint)', text: 'var(--accent-orange)' },
  'Long Run':     { dot: 'var(--accent-cyan)', bg: 'var(--bg-cyan-tint)', text: 'var(--accent-cyan)' },
  'Recovery Run': { dot: 'var(--text-secondary)', bg: 'var(--bg-neutral-tint)', text: 'var(--text-secondary)' },
  'Interval':     { dot: 'var(--status-danger)', bg: 'var(--bg-red-tint)', text: 'var(--status-danger)' },
}

const stats = [
  { label: 'Total Runs',     value: '24',     unit: 'this month' },
  { label: 'Total Distance', value: '248.3',  unit: 'km' },
  { label: 'Total Time',     value: '21h 4m', unit: 'this month' },
  { label: 'Avg Pace',       value: '5:08',   unit: '/km' },
]

export default function ActivitiesPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          Activities
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Your complete training history
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
              {s.value}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Activity list */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border-color)]">
          {['Activity', 'Date', 'Distance', 'Pace', 'Avg HR', 'Time'].map(h => (
            <div key={h} className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--border-color)]">
          {activities.map(a => {
            const style = typeColor[a.type] ?? typeColor['Easy Run']
            return (
              <div
                key={a.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              >
                {/* Activity name + type badge */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                    style={{ backgroundColor: style.bg }}
                  >
                    {a.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-primary)] truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {a.type}
                    </div>
                    <div
                      className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: style.dot }} />
                      {a.type}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[var(--text-secondary)] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>{a.date}</div>

                <div className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {a.distance} <span className="text-xs font-normal text-[var(--text-muted)]">km</span>
                </div>

                <div className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {a.pace} <span className="text-xs font-normal text-[var(--text-muted)]">/km</span>
                </div>

                <div className="text-sm text-[var(--text-secondary)] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {a.hr} <span className="text-xs text-[var(--text-muted)]">bpm</span>
                </div>

                <div className="text-sm text-[var(--text-secondary)] whitespace-nowrap font-mono" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {a.duration}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
