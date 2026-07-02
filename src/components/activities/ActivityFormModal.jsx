'use client'

import { useState } from 'react'
import { Camera, Plus, X } from 'lucide-react'
import { useActivityLog } from '../../providers/ActivityLogProvider'
import { useUploadAnalysis } from '../../providers/UploadAnalysisProvider'

const activityTypes = ['Easy Run', 'Tempo Run', 'Long Run', 'Recovery Run', 'Interval']

const emptyForm = {
  type: 'Easy Run',
  date: new Date().toISOString().slice(0, 16),
  distance: '',
  pace: '',
  hr: '',
  duration: '',
  elevation: '',
}

function isValidPace(value) {
  const parts = String(value).trim().split(':')
  if (parts.length !== 2) return false

  const [mins, secs] = parts.map((part) => Number.parseInt(part, 10))
  if (Number.isNaN(mins) || Number.isNaN(secs)) return false

  return mins >= 0 && secs >= 0 && secs < 60
}

function isValidDuration(value) {
  const parts = String(value).trim().split(':')
  if (parts.length !== 2 && parts.length !== 3) return false

  const nums = parts.map((part) => Number.parseInt(part, 10))
  if (nums.some((num) => Number.isNaN(num) || num < 0)) return false

  if (parts.length === 2) {
    const [, secs] = nums
    return secs < 60
  }

  const [, mins, secs] = nums
  return mins < 60 && secs < 60
}

function normalizePace(value) {
  const parts = String(value).trim().split(':')
  if (parts.length !== 2) return value

  const mins = Number.parseInt(parts[0], 10)
  const secs = Number.parseInt(parts[1], 10)
  if (Number.isNaN(mins) || Number.isNaN(secs)) return value

  return `${mins}:${String(secs).padStart(2, '0')}`
}

function normalizeDuration(value) {
  const parts = String(value).trim().split(':')
  if (parts.length !== 2 && parts.length !== 3) return value

  const nums = parts.map((part) => Number.parseInt(part, 10))
  if (nums.some((num) => Number.isNaN(num))) return value

  if (parts.length === 2) {
    const [mins, secs] = nums
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  const [hours, mins, secs] = nums
  return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function ActivityFormModal() {
  const {
    isFormOpen,
    formInitialValues,
    closeManualForm,
    saveActivity,
  } = useActivityLog()

  if (!isFormOpen) return null

  return (
    <ActivityFormDialog
      initialValues={formInitialValues}
      closeManualForm={closeManualForm}
      saveActivity={saveActivity}
    />
  )
}

function ActivityFormDialog({ initialValues, closeManualForm, saveActivity }) {
  const { openModal } = useUploadAnalysis()
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initialValues }))
  const isEditing = Boolean(form.id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!form.type || !form.date || !form.distance || !form.pace || !form.hr || !form.duration) {
      setError('Please complete all required fields.')
      return
    }

    if (!isValidPace(form.pace)) {
      setError('Pace must use m:ss format (for example 5:24).')
      return
    }

    if (!isValidDuration(form.duration)) {
      setError('Duration must use m:ss or h:mm:ss format.')
      return
    }

    if (Number(form.distance) <= 0) {
      setError('Distance must be greater than 0.')
      return
    }

    if (Number(form.hr) <= 0) {
      setError('Average heart rate must be greater than 0.')
      return
    }

    if (form.elevation && Number(form.elevation) < 0) {
      setError('Elevation gain cannot be negative.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await saveActivity(form)
    } catch (saveError) {
      setError(saveError.message || 'Failed to save activity.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeManualForm}
        aria-label="Close activity form"
      />

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isEditing ? 'Edit Activity' : 'Log Activity'}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">Manual entry with screenshot-assisted prefill</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closeManualForm()
                openModal()
              }}
              className="min-h-11 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
            >
              <Camera size={14} />
              Upload Screenshot
            </button>
            <button
              type="button"
              onClick={closeManualForm}
              className="min-h-11 min-w-11 rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
          <label className="text-xs text-[var(--text-muted)]">
            Activity type*
            <select
              value={form.type}
              onChange={(e) => onChange('type', e.target.value)}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            >
              {activityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Date and time*
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Distance (km)*
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.distance}
              onChange={(e) => onChange('distance', e.target.value)}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Pace (m:ss)*
            <input
              type="text"
              placeholder="5:24"
              inputMode="numeric"
              value={form.pace}
              onChange={(e) => onChange('pace', e.target.value)}
              onBlur={() => onChange('pace', normalizePace(form.pace))}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
            <div className="mt-1 text-[10px] text-[var(--text-muted)]">Use minutes:seconds format, e.g. 5:24</div>
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Avg HR (bpm)*
            <input
              type="number"
              min="0"
              value={form.hr}
              onChange={(e) => onChange('hr', e.target.value)}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Duration (m:ss or h:mm:ss)*
            <input
              type="text"
              placeholder="55:05"
              inputMode="numeric"
              value={form.duration}
              onChange={(e) => onChange('duration', e.target.value)}
              onBlur={() => onChange('duration', normalizeDuration(form.duration))}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
            <div className="mt-1 text-[10px] text-[var(--text-muted)]">Use m:ss (55:05) or h:mm:ss (1:05:12)</div>
          </label>

          <label className="text-xs text-[var(--text-muted)] sm:col-span-2">
            Elevation gain (m)
            <input
              type="number"
              min="0"
              value={form.elevation}
              onChange={(e) => onChange('elevation', e.target.value)}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
          </label>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border-color)] px-5 py-4">
          <div className="text-xs text-[var(--status-danger)]">{error || ''}</div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-lime)] px-3 py-2 text-xs font-semibold text-[var(--bg-main)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
          >
            <Plus size={14} />
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Activity'}
          </button>
        </div>
      </form>
    </div>
  )
}
