'use client'

import { Plus } from 'lucide-react'
import { useActivityLog } from '../../../providers/ActivityLogProvider'

const typeColor = {
  'Easy Run':     { dot: 'var(--accent-lime)', bg: 'var(--bg-lime-tint)', text: 'var(--accent-lime)' },
  'Tempo Run':    { dot: 'var(--accent-orange)', bg: 'var(--bg-orange-tint)', text: 'var(--accent-orange)' },
  'Long Run':     { dot: 'var(--accent-cyan)', bg: 'var(--bg-cyan-tint)', text: 'var(--accent-cyan)' },
  'Recovery Run': { dot: 'var(--text-secondary)', bg: 'var(--bg-neutral-tint)', text: 'var(--text-secondary)' },
  'Interval':     { dot: 'var(--status-danger)', bg: 'var(--bg-red-tint)', text: 'var(--status-danger)' },
}

export default function ActivitiesPage() {
  const { activities, stats, openManualForm } = useActivityLog()

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
            Activities
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Your complete training history
          </p>
        </div>
        <button
          type="button"
          onClick={() => openManualForm()}
          className="min-h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-lime)] px-4 py-2 text-sm font-semibold text-[var(--bg-main)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"
        >
          <Plus size={16} />
          Add Activity
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 lg:px-5 py-3 border-b border-[var(--border-color)]">
          {['Activity', 'Date', 'Distance', 'Pace', 'Avg HR', 'Time'].map(h => (
            <div key={h} className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--border-color)]">
          {activities.map(a => {
            const style = typeColor[a.type] ?? typeColor['Easy Run']
            return (
              <div key={a.id} className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                <div className="md:hidden px-4 py-4 space-y-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0" style={{ backgroundColor: style.bg }}>
                      {a.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[var(--text-primary)] truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {a.type}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{a.date}</div>
                    </div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {a.distance} km
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-[var(--text-secondary)]">
                    <div>Pace: <span className="font-semibold text-[var(--text-primary)]">{a.pace}</span></div>
                    <div>HR: <span className="font-semibold text-[var(--text-primary)]">{a.hr}</span></div>
                    <div>Time: <span className="font-semibold text-[var(--text-primary)]">{a.duration}</span></div>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 lg:px-5 py-4 items-center">
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
              </div>
            )
          })}

          {!activities.length ? (
            <div className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
              No activities logged yet. Add your first run to get started.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
