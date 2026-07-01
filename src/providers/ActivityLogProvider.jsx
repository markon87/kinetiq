'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ACTIVITY_STORAGE_KEY = 'kinetiq-activities-v1'

const initialActivities = [
  { id: 1, type: 'Easy Run', date: 'May 21, 2026', distance: '10.2', pace: '5:24', hr: 138, duration: '55:05', elevation: 42, emoji: '🏃' },
  { id: 2, type: 'Tempo Run', date: 'May 19, 2026', distance: '8.1', pace: '4:28', hr: 152, duration: '36:12', elevation: 85, emoji: '⚡' },
  { id: 3, type: 'Long Run', date: 'May 17, 2026', distance: '18.2', pace: '5:38', hr: 141, duration: '1:42:31', elevation: 210, emoji: '🏔' },
  { id: 4, type: 'Recovery Run', date: 'May 15, 2026', distance: '6.4', pace: '6:02', hr: 128, duration: '38:33', elevation: 18, emoji: '🌿' },
  { id: 5, type: 'Interval', date: 'May 13, 2026', distance: '9.5', pace: '4:12', hr: 168, duration: '39:54', elevation: 55, emoji: '🔥' },
  { id: 6, type: 'Easy Run', date: 'May 11, 2026', distance: '11.0', pace: '5:29', hr: 136, duration: '1:00:19', elevation: 63, emoji: '🏃' },
  { id: 7, type: 'Tempo Run', date: 'May 9, 2026', distance: '7.8', pace: '4:33', hr: 155, duration: '35:17', elevation: 72, emoji: '⚡' },
  { id: 8, type: 'Long Run', date: 'May 7, 2026', distance: '16.5', pace: '5:41', hr: 143, duration: '1:33:47', elevation: 185, emoji: '🏔' },
]

const typeToEmoji = {
  'Easy Run': '🏃',
  'Tempo Run': '⚡',
  'Long Run': '🏔',
  'Recovery Run': '🌿',
  Interval: '🔥',
}

function formatNumber(num, fractionDigits = 1) {
  return Number(num).toFixed(fractionDigits)
}

function parseDurationToSeconds(value) {
  if (!value) return 0
  const parts = String(value).split(':').map((v) => Number.parseInt(v, 10))

  if (parts.some((p) => Number.isNaN(p))) return 0
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}

function formatTotalDuration(seconds) {
  const totalHours = Math.floor(seconds / 3600)
  const totalMinutes = Math.round((seconds % 3600) / 60)
  return `${totalHours}h ${totalMinutes}m`
}

function parsePaceToSeconds(value) {
  if (!value) return 0
  const cleaned = String(value).replace('/km', '').trim()
  const [mins, secs] = cleaned.split(':').map((v) => Number.parseInt(v, 10))
  if (Number.isNaN(mins) || Number.isNaN(secs)) return 0
  return mins * 60 + secs
}

function formatPaceFromSeconds(seconds) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function getStoredActivities() {
  if (typeof window === 'undefined') {
    return initialActivities
  }

  const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY)
  if (!raw) {
    return initialActivities
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : initialActivities
  } catch {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY)
    return initialActivities
  }
}

const ActivityLogContext = createContext({
  activities: [],
  stats: [],
  isFormOpen: false,
  formInitialValues: null,
  openManualForm: () => {},
  openManualFormFromAnalysis: () => {},
  closeManualForm: () => {},
  saveActivity: () => {},
})

export function ActivityLogProvider({ children }) {
  const [activities, setActivities] = useState(getStoredActivities)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formInitialValues, setFormInitialValues] = useState(null)

  const persistActivities = useCallback((nextActivities) => {
    setActivities(nextActivities)
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(nextActivities))
  }, [])

  const openManualForm = useCallback((prefill = null) => {
    setFormInitialValues(prefill)
    setIsFormOpen(true)
  }, [])

  const openManualFormFromAnalysis = useCallback((analysis) => {
    const metrics = analysis?.extractedMetrics || {}
    const paceRaw = metrics.pace ? String(metrics.pace).replace('/km', '').trim() : ''

    setFormInitialValues({
      type: analysis?.workoutType || 'Easy Run',
      date: new Date().toISOString().slice(0, 16),
      distance: metrics.distanceKm ? String(metrics.distanceKm) : '',
      pace: paceRaw,
      hr: metrics.avgHeartRate ? String(metrics.avgHeartRate) : '',
      duration: metrics.duration ? String(metrics.duration).replace(/^00:/, '') : '',
      elevation: metrics.elevationGainM ? String(metrics.elevationGainM) : '',
    })
    setIsFormOpen(true)
  }, [])

  const closeManualForm = useCallback(() => {
    setIsFormOpen(false)
    setFormInitialValues(null)
  }, [])

  const saveActivity = useCallback((activityForm) => {
    const dateLabel = new Date(activityForm.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const newActivity = {
      id: Date.now(),
      type: activityForm.type,
      date: dateLabel,
      distance: activityForm.distance,
      pace: activityForm.pace,
      hr: Number(activityForm.hr),
      duration: activityForm.duration,
      elevation: Number(activityForm.elevation || 0),
      emoji: typeToEmoji[activityForm.type] || '🏃',
    }

    const nextActivities = [newActivity, ...activities]
    persistActivities(nextActivities)
    closeManualForm()
  }, [activities, closeManualForm, persistActivities])

  const stats = useMemo(() => {
    const totalRuns = activities.length
    const totalDistance = activities.reduce((acc, item) => acc + Number.parseFloat(item.distance || 0), 0)
    const totalDuration = activities.reduce((acc, item) => acc + parseDurationToSeconds(item.duration), 0)
    const avgPaceSeconds =
      totalRuns > 0
        ? Math.round(activities.reduce((acc, item) => acc + parsePaceToSeconds(item.pace), 0) / totalRuns)
        : 0

    return [
      { label: 'Total Runs', value: String(totalRuns), unit: 'logged' },
      { label: 'Total Distance', value: formatNumber(totalDistance), unit: 'km' },
      { label: 'Total Time', value: formatTotalDuration(totalDuration), unit: 'total' },
      { label: 'Avg Pace', value: formatPaceFromSeconds(avgPaceSeconds), unit: '/km' },
    ]
  }, [activities])

  const value = useMemo(() => ({
    activities,
    stats,
    isFormOpen,
    formInitialValues,
    openManualForm,
    openManualFormFromAnalysis,
    closeManualForm,
    saveActivity,
  }), [activities, stats, isFormOpen, formInitialValues, openManualForm, openManualFormFromAnalysis, closeManualForm, saveActivity])

  return <ActivityLogContext.Provider value={value}>{children}</ActivityLogContext.Provider>
}

export const useActivityLog = () => useContext(ActivityLogContext)
