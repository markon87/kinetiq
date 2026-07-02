'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const defaultDashboardData = {
  user: {
    name: 'Athlete',
    avatar: 'A',
    plan: 'Premium',
    aerobicTrend: 'stable',
  },
  readiness: {
    score: 78,
    label: 'Good',
  },
  trainingLoad: {
    value: 650,
    optimalMin: 600,
    optimalMax: 800,
    max: 1000,
  },
  recovery: {
    status: 'Moderate Fatigue',
    gaugePercent: 0.6,
    mileageIncrease: 10,
    warning: 'Keep load progression conservative and prioritize sleep quality.',
  },
  insights: [
    {
      type: 'success',
      title: 'Data Sync Active',
      description: 'Dashboard values are now sourced from your Supabase account.',
      confidence: 'High',
      label: 'Positive signal',
    },
  ],
  weeklyFocus: {
    title: 'Stay Consistent',
    description: 'Log your sessions regularly to improve insight quality.',
  },
  recentActivities: [],
  projected10k: {
    current: '48:20',
    projected: '46:55',
    confidence: 'Moderate',
    trend: 'Improving steadily',
    trendDirection: 'up',
    todayLabel: 'Jun 12',
    chartData: [
      { date: 'May 1', actual: 49.5 },
      { date: 'May 15', actual: 48.7 },
      { date: 'May 29', actual: 48.3 },
      { date: 'Jun 12', actual: 48.33, projected: 48.33 },
      { date: 'Jun 26', projected: 47.5 },
      { date: 'Jul 10', projected: 46.8 },
      { date: 'Jul 24', projected: 45.83 },
    ],
  },
  paceDevelopment: {
    todayLabel: 'Jun',
    ranges: {
      '3 Months': [
        { month: 'Apr', easy: 5.5, threshold: 4.9, race: 4.5 },
        { month: 'May', easy: 5.3, threshold: 4.85, race: 4.4 },
        { month: 'Jun', easy: 5.2, threshold: 4.8, race: 4.28 },
      ],
      '6 Months': [
        { month: 'Feb', easy: 5.9, threshold: 5.1, race: 4.7 },
        { month: 'Mar', easy: 5.7, threshold: 5.0, race: 4.6 },
        { month: 'Apr', easy: 5.5, threshold: 4.9, race: 4.5 },
        { month: 'May', easy: 5.3, threshold: 4.85, race: 4.4 },
        { month: 'Jun', easy: 5.2, threshold: 4.8, race: 4.28 },
        { month: 'Jul', easy: 5.15, threshold: 4.75, race: 4.2 },
      ],
      '12 Months': [
        { month: 'Oct', easy: 6.2, threshold: 5.4, race: 5.0 },
        { month: 'Nov', easy: 6.0, threshold: 5.3, race: 4.9 },
        { month: 'Dec', easy: 5.8, threshold: 5.2, race: 4.8 },
        { month: 'Jan', easy: 5.7, threshold: 5.15, race: 4.75 },
        { month: 'Feb', easy: 5.9, threshold: 5.1, race: 4.7 },
        { month: 'Mar', easy: 5.7, threshold: 5.0, race: 4.6 },
        { month: 'Apr', easy: 5.5, threshold: 4.9, race: 4.5 },
        { month: 'May', easy: 5.3, threshold: 4.85, race: 4.4 },
        { month: 'Jun', easy: 5.2, threshold: 4.8, race: 4.28 },
        { month: 'Jul', easy: 5.15, threshold: 4.75, race: 4.2 },
        { month: 'Aug', easy: 5.1, threshold: 4.7, race: 4.1 },
        { month: 'Sep', easy: 5.0, threshold: 4.6, race: 4.0 },
      ],
    },
  },
}

const DashboardDataContext = createContext({
  dashboardData: defaultDashboardData,
  isLoading: true,
})

export function DashboardDataProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(defaultDashboardData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadSummary() {
      setIsLoading(true)

      try {
        const response = await fetch('/api/dashboard-summary', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Failed to load dashboard summary (${response.status})`)
        }

        const payload = await response.json()

        if (!ignore) {
          setDashboardData((current) => ({
            ...current,
            ...payload,
          }))
        }
      } catch {
        if (!ignore) {
          setDashboardData(defaultDashboardData)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadSummary()

    return () => {
      ignore = true
    }
  }, [])

  const value = useMemo(() => ({ dashboardData, isLoading }), [dashboardData, isLoading])

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
}

export function useDashboardData() {
  return useContext(DashboardDataContext)
}
