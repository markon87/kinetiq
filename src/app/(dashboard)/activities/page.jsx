'use client'

import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useActivityLog } from '../../../providers/ActivityLogProvider'

const typeColor = {
  'Easy Run':     { dot: 'var(--accent-lime)', bg: 'var(--bg-lime-tint)', text: 'var(--accent-lime)' },
  'Tempo Run':    { dot: 'var(--accent-orange)', bg: 'var(--bg-orange-tint)', text: 'var(--accent-orange)' },
  'Long Run':     { dot: 'var(--accent-cyan)', bg: 'var(--bg-cyan-tint)', text: 'var(--accent-cyan)' },
  'Recovery Run': { dot: 'var(--text-secondary)', bg: 'var(--bg-neutral-tint)', text: 'var(--text-secondary)' },
  'Interval':     { dot: 'var(--status-danger)', bg: 'var(--bg-red-tint)', text: 'var(--status-danger)' },
}

function parsePaceToSeconds(pace) {
  const [mins, secs] = String(pace || '').split(':').map((value) => Number.parseInt(value, 10))
  if (Number.isNaN(mins) || Number.isNaN(secs)) return 0
  return (mins * 60) + secs
}

function parseDurationToSeconds(duration) {
  const parts = String(duration || '').split(':').map((value) => Number.parseInt(value, 10))
  if (parts.some((value) => Number.isNaN(value))) return 0
  if (parts.length === 2) return (parts[0] * 60) + parts[1]
  if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2]
  return 0
}

function formatPace(paceSeconds) {
  const mins = Math.floor(paceSeconds / 60)
  const secs = String(paceSeconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function buildStats(activities) {
  const totalRuns = activities.length
  const totalDistance = activities.reduce((sum, activity) => sum + Number(activity.distance || 0), 0)
  const totalDurationSeconds = activities.reduce((sum, activity) => sum + parseDurationToSeconds(activity.duration), 0)
  const avgPaceSeconds = totalRuns
    ? Math.round(activities.reduce((sum, activity) => sum + parsePaceToSeconds(activity.pace), 0) / totalRuns)
    : 0

  const totalHours = Math.floor(totalDurationSeconds / 3600)
  const totalMinutes = Math.round((totalDurationSeconds % 3600) / 60)

  return [
    { label: 'Total Runs', value: String(totalRuns), unit: 'logged' },
    { label: 'Total Distance', value: totalDistance.toFixed(1), unit: 'km' },
    { label: 'Total Time', value: `${totalHours}h ${totalMinutes}m`, unit: 'total' },
    { label: 'Avg Pace', value: formatPace(avgPaceSeconds), unit: '/km' },
  ]
}

export default function ActivitiesPage() {
  const {
    activities,
    isLoading,
    openManualForm,
    openEditForm,
    deleteActivity,
  } = useActivityLog()
  const [monthFilter, setMonthFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const monthOptions = useMemo(() => {
    const unique = new Map()

    for (const activity of activities) {
      const date = new Date(activity.performedAt)
      if (Number.isNaN(date.getTime())) continue

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const key = `${year}-${month}`

      if (!unique.has(key)) {
        unique.set(key, date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
      }
    }

    return [...unique.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([value, label]) => ({ value, label }))
  }, [activities])

  const typeOptions = useMemo(() => {
    return [...new Set(activities.map((activity) => activity.type))].sort()
  }, [activities])

  const activeMonthFilter = monthOptions.some((option) => option.value === monthFilter) ? monthFilter : 'all'
  const activeTypeFilter = typeOptions.includes(typeFilter) ? typeFilter : 'all'

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const monthMatches = activeMonthFilter === 'all'
        ? true
        : (() => {
          const date = new Date(activity.performedAt)
          if (Number.isNaN(date.getTime())) return false
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          return `${year}-${month}` === activeMonthFilter
        })()

      const typeMatches = activeTypeFilter === 'all' || activity.type === activeTypeFilter
      return monthMatches && typeMatches
    })
  }, [activities, activeMonthFilter, activeTypeFilter])

  const filteredStats = useMemo(() => buildStats(filteredActivities), [filteredActivities])

  const handleDelete = async (activityId) => {
    const confirmed = window.confirm('Remove this activity from your log?')
    if (!confirmed) return

    try {
      await deleteActivity(activityId)
    } catch (error) {
      window.alert(error.message || 'Failed to remove activity.')
    }
  }

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

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-xs text-[var(--text-muted)]">
          Filter by month
          <select
            value={activeMonthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
          >
            <option value="all">All months</option>
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="text-xs text-[var(--text-muted)]">
          Filter by activity type
          <select
            value={activeTypeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
          >
            <option value="all">All activity types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {filteredStats.map(s => (
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
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto_auto] gap-4 px-4 lg:px-5 py-3 border-b border-[var(--border-color)]">
          {['Activity', 'Date', 'Distance', 'Pace', 'Avg HR', 'Cadence', 'Time', 'Actions'].map(h => (
            <div key={h} className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--border-color)]">
          {filteredActivities.map(a => {
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
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)] sm:grid-cols-4">
                    <div>Pace: <span className="font-semibold text-[var(--text-primary)]">{a.pace}</span></div>
                    <div>HR: <span className="font-semibold text-[var(--text-primary)]">{a.hr}</span></div>
                    <div>Cad: <span className="font-semibold text-[var(--text-primary)]">{a.cadence || '—'}</span></div>
                    <div>Time: <span className="font-semibold text-[var(--text-primary)]">{a.duration}</span></div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(a)}
                      className="min-h-11 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="min-h-11 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-semibold text-[var(--status-danger)] transition-colors hover:bg-[var(--bg-red-tint)]"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto_auto] gap-4 px-4 lg:px-5 py-4 items-center">
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

                <div className="text-sm text-[var(--text-secondary)] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {a.cadence ? (
                    <>
                      {a.cadence} <span className="text-xs text-[var(--text-muted)]">spm</span>
                    </>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  )}
                </div>

                <div className="text-sm text-[var(--text-secondary)] whitespace-nowrap font-mono" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {a.duration}
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEditForm(a)}
                    className="min-h-11 min-w-11 rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                    aria-label={`Edit ${a.type} activity`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    className="min-h-11 min-w-11 rounded-lg p-2 text-[var(--status-danger)] transition-colors hover:bg-[var(--bg-red-tint)]"
                    aria-label={`Remove ${a.type} activity`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                </div>
              </div>
            )
          })}

          {!isLoading && !filteredActivities.length ? (
            <div className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
              {activities.length
                ? 'No activities match the selected filters.'
                : 'No activities logged yet. Add your first run to get started.'}
            </div>
          ) : null}

          {isLoading ? (
            <div className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
              Loading activities...
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
