'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const defaultStats = [
  { label: 'Total Runs', value: '0', unit: 'logged' },
  { label: 'Total Distance', value: '0.0', unit: 'km' },
  { label: 'Total Time', value: '0h 0m', unit: 'total' },
  { label: 'Avg Pace', value: '0:00', unit: '/km' },
]

function toDateTimeLocal(isoDateString) {
  const parsed = new Date(isoDateString)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 16)
  }

  const local = new Date(parsed.getTime() - (parsed.getTimezoneOffset() * 60000))
  return local.toISOString().slice(0, 16)
}

const ActivityLogContext = createContext({
  activities: [],
  stats: defaultStats,
  isLoading: false,
  isFormOpen: false,
  formInitialValues: null,
  openManualForm: () => {},
  openEditForm: () => {},
  openManualFormFromAnalysis: () => {},
  closeManualForm: () => {},
  saveActivity: () => {},
  deleteActivity: () => {},
})

export function ActivityLogProvider({ children }) {
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState(defaultStats)
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formInitialValues, setFormInitialValues] = useState(null)

  const loadActivities = useCallback(async () => {
    try {
      const response = await fetch('/api/activities?limit=200', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      })

      if (response.status === 401) {
        setActivities([])
        setStats(defaultStats)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch activities.')
      }

      const payload = await response.json()
      setActivities(payload.activities || [])
      setStats(payload.stats || defaultStats)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadActivities().catch(() => {
      setActivities([])
      setStats(defaultStats)
      setIsLoading(false)
    })
  }, [loadActivities])

  const openManualForm = useCallback((prefill = null) => {
    setFormInitialValues(prefill)
    setIsFormOpen(true)
  }, [])

  const openEditForm = useCallback((activity) => {
    setFormInitialValues({
      id: activity.id,
      type: activity.type,
      date: toDateTimeLocal(activity.performedAt),
      distance: String(activity.distance),
      pace: String(activity.pace),
      hr: String(activity.hr),
      cadence: activity.cadence ? String(activity.cadence) : '',
      duration: String(activity.duration),
      elevation: String(activity.elevation || 0),
    })
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
      cadence: metrics.cadenceSpm ? String(metrics.cadenceSpm) : '',
      duration: metrics.duration ? String(metrics.duration).replace(/^00:/, '') : '',
      elevation: metrics.elevationGainM ? String(metrics.elevationGainM) : '',
    })
    setIsFormOpen(true)
  }, [])

  const closeManualForm = useCallback(() => {
    setIsFormOpen(false)
    setFormInitialValues(null)
  }, [])

  const saveActivity = useCallback(async (activityForm) => {
    setIsLoading(true)
    const isEditing = Boolean(activityForm.id)
    const response = await fetch('/api/activities', {
      method: isEditing ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: activityForm.id,
        type: activityForm.type,
        date: activityForm.date,
        distance: activityForm.distance,
        pace: activityForm.pace,
        hr: activityForm.hr,
        cadence: activityForm.cadence,
        duration: activityForm.duration,
        elevation: activityForm.elevation,
      }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Failed to save activity.' }))
      throw new Error(payload.error || 'Failed to save activity.')
    }

    await loadActivities()
    closeManualForm()
  }, [closeManualForm, loadActivities])

  const deleteActivity = useCallback(async (activityId) => {
    setIsLoading(true)
    const response = await fetch(`/api/activities?id=${encodeURIComponent(activityId)}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Failed to remove activity.' }))
      throw new Error(payload.error || 'Failed to remove activity.')
    }

    await loadActivities()
  }, [loadActivities])

  const value = useMemo(() => ({
    activities,
    stats,
    isLoading,
    isFormOpen,
    formInitialValues,
    openManualForm,
    openEditForm,
    openManualFormFromAnalysis,
    closeManualForm,
    saveActivity,
    deleteActivity,
  }), [activities, stats, isLoading, isFormOpen, formInitialValues, openManualForm, openEditForm, openManualFormFromAnalysis, closeManualForm, saveActivity, deleteActivity])

  return <ActivityLogContext.Provider value={value}>{children}</ActivityLogContext.Provider>
}

export const useActivityLog = () => useContext(ActivityLogContext)
