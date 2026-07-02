import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '../../../lib/supabase/server'

const typeStyles = {
  success: { label: 'Positive signal' },
  warning: { label: 'Watch signal' },
  info: { label: 'Info signal' },
}

function parseDisplayName(profile, user) {
  return profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Athlete'
}

function toInitials(name) {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A'
}

function formatDateLabel(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatPace(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00 /km'
  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs} /km`
}

function toRecentActivity(row) {
  return {
    id: row.id,
    type: row.type,
    date: formatDateLabel(row.performed_at),
    distance: `${Number(row.distance_km).toFixed(1)} km`,
    pace: formatPace(row.pace_seconds),
    hr: `${row.avg_heart_rate} bpm`,
    emoji: row.type === 'Tempo Run' ? '⚡' : row.type === 'Long Run' ? '🏔' : row.type === 'Recovery Run' ? '🌿' : row.type === 'Interval' ? '🔥' : '🏃',
  }
}

function formatTimeFromSeconds(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds || 0))
  const mins = Math.floor(safe / 60)
  const secs = String(safe % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function formatShortDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatMonthLabel(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
  })
}

function to10kSecondsFromActivity(row) {
  return Number(row.pace_seconds) * 10
}

function toMinutesDecimal(seconds) {
  return Number((seconds / 60).toFixed(2))
}

function buildProjected10kSeries(activities) {
  if (!activities.length) {
    return {
      current: '48:20',
      projected: '46:55',
      confidence: 'Low',
      trend: 'Collecting baseline',
      trendDirection: 'flat',
      todayLabel: formatShortDate(new Date().toISOString()),
      chartData: [
        { date: 'May 1', actual: 49.5 },
        { date: 'May 15', actual: 48.9 },
        { date: 'May 29', actual: 48.4 },
        { date: 'Jun 12', actual: 48.33, projected: 48.33 },
        { date: 'Jun 26', projected: 47.8 },
        { date: 'Jul 10', projected: 47.2 },
        { date: 'Jul 24', projected: 46.92 },
      ],
    }
  }

  const ordered = [...activities].sort((a, b) => new Date(a.performed_at) - new Date(b.performed_at))
  const recentActual = ordered.slice(-6)
  const actualSeries = recentActual.map((row) => ({
    date: formatShortDate(row.performed_at),
    actualSeconds: to10kSecondsFromActivity(row),
  }))

  const currentSeconds = actualSeries[actualSeries.length - 1].actualSeconds
  const baselineSeconds = actualSeries[0].actualSeconds
  const recentDelta = baselineSeconds - currentSeconds
  const projectedGain = Math.max(20, Math.round(recentDelta * 0.9))
  const projectedSeconds = Math.max(Math.round(currentSeconds * 0.9), currentSeconds - projectedGain)

  const confidence = activities.length >= 12 ? 'High' : activities.length >= 6 ? 'Moderate' : 'Low'
  const trendDirection = recentDelta > 20 ? 'up' : recentDelta < -20 ? 'down' : 'flat'
  const trend = trendDirection === 'up'
    ? 'Improving steadily'
    : trendDirection === 'down'
      ? 'Recent slowdown'
      : 'Holding baseline'

  const projectedPoints = [2, 4, 6].map((weeksAhead, index) => {
    const ratio = (index + 1) / 3
    const value = Math.round(currentSeconds - ((currentSeconds - projectedSeconds) * ratio))
    const date = new Date()
    date.setDate(date.getDate() + (weeksAhead * 7))
    return {
      date: formatShortDate(date.toISOString()),
      projectedSeconds: value,
    }
  })

  const todayLabel = formatShortDate(new Date().toISOString())
  const chartData = [
    ...actualSeries.map((point) => ({ date: point.date, actual: toMinutesDecimal(point.actualSeconds) })),
    { date: todayLabel, projected: toMinutesDecimal(currentSeconds) },
    ...projectedPoints.map((point) => ({ date: point.date, projected: toMinutesDecimal(point.projectedSeconds) })),
  ]

  return {
    current: formatTimeFromSeconds(currentSeconds),
    projected: formatTimeFromSeconds(projectedSeconds),
    confidence,
    trend,
    trendDirection,
    todayLabel,
    chartData,
  }
}

function monthKey(dateValue) {
  const date = new Date(dateValue)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function monthStartFromKey(key) {
  const [year, month] = key.split('-').map((value) => Number(value))
  return new Date(Date.UTC(year, month - 1, 1))
}

function getLastMonthKeys(count) {
  const keys = []
  const now = new Date()
  const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  for (let index = count - 1; index >= 0; index -= 1) {
    const cursor = new Date(currentMonth)
    cursor.setUTCMonth(cursor.getUTCMonth() - index)
    keys.push(monthKey(cursor.toISOString()))
  }

  return keys
}

function average(values) {
  if (!values.length) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function classifyBucket(type) {
  if (type === 'Easy Run' || type === 'Recovery Run') return 'easy'
  if (type === 'Tempo Run') return 'threshold'
  if (type === 'Interval' || type === 'Long Run') return 'race'
  return 'easy'
}

function fillSeriesGaps(series, fallback) {
  let last = fallback
  return series.map((value) => {
    if (value != null) {
      last = value
      return Number(value.toFixed(2))
    }
    return Number(last.toFixed(2))
  })
}

function buildPaceDevelopmentSeries(activities) {
  if (!activities.length) {
    return {
      todayLabel: formatMonthLabel(new Date().toISOString()),
      ranges: {
        '3 Months': [
          { month: 'Apr', easy: 5.5, threshold: 4.9, race: 4.5 },
          { month: 'May', easy: 5.3, threshold: 4.85, race: 4.4 },
          { month: 'Jun', easy: 5.2, threshold: 4.8, race: 4.28 },
        ],
        '6 Months': [
          { month: 'Jan', easy: 5.8, threshold: 5.1, race: 4.7 },
          { month: 'Feb', easy: 5.7, threshold: 5.0, race: 4.6 },
          { month: 'Mar', easy: 5.6, threshold: 4.95, race: 4.55 },
          { month: 'Apr', easy: 5.5, threshold: 4.9, race: 4.5 },
          { month: 'May', easy: 5.3, threshold: 4.85, race: 4.4 },
          { month: 'Jun', easy: 5.2, threshold: 4.8, race: 4.28 },
        ],
        '12 Months': [
          { month: 'Jul', easy: 6.1, threshold: 5.35, race: 4.95 },
          { month: 'Aug', easy: 6.0, threshold: 5.3, race: 4.9 },
          { month: 'Sep', easy: 5.95, threshold: 5.25, race: 4.85 },
          { month: 'Oct', easy: 5.9, threshold: 5.2, race: 4.8 },
          { month: 'Nov', easy: 5.85, threshold: 5.15, race: 4.75 },
          { month: 'Dec', easy: 5.8, threshold: 5.1, race: 4.7 },
          { month: 'Jan', easy: 5.8, threshold: 5.1, race: 4.7 },
          { month: 'Feb', easy: 5.7, threshold: 5.0, race: 4.6 },
          { month: 'Mar', easy: 5.6, threshold: 4.95, race: 4.55 },
          { month: 'Apr', easy: 5.5, threshold: 4.9, race: 4.5 },
          { month: 'May', easy: 5.3, threshold: 4.85, race: 4.4 },
          { month: 'Jun', easy: 5.2, threshold: 4.8, race: 4.28 },
        ],
      },
    }
  }

  const grouped = new Map()
  for (const activity of activities) {
    const key = monthKey(activity.performed_at)
    const bucket = classifyBucket(activity.type)
    const monthBuckets = grouped.get(key) || { easy: [], threshold: [], race: [] }
    monthBuckets[bucket].push(Number(activity.pace_seconds) / 60)
    grouped.set(key, monthBuckets)
  }

  const keys12 = getLastMonthKeys(12)
  const easyDefaults = []
  const thresholdDefaults = []
  const raceDefaults = []
  for (const key of keys12) {
    const monthBuckets = grouped.get(key)
    if (!monthBuckets) continue
    if (monthBuckets.easy.length) easyDefaults.push(...monthBuckets.easy)
    if (monthBuckets.threshold.length) thresholdDefaults.push(...monthBuckets.threshold)
    if (monthBuckets.race.length) raceDefaults.push(...monthBuckets.race)
  }

  const defaultEasy = average(easyDefaults) ?? 5.6
  const defaultThreshold = average(thresholdDefaults) ?? Math.max(4.4, defaultEasy - 0.55)
  const defaultRace = average(raceDefaults) ?? Math.max(3.9, defaultThreshold - 0.45)

  const easySeries = []
  const thresholdSeries = []
  const raceSeries = []

  for (const key of keys12) {
    const monthBuckets = grouped.get(key) || { easy: [], threshold: [], race: [] }
    easySeries.push(average(monthBuckets.easy))
    thresholdSeries.push(average(monthBuckets.threshold))
    raceSeries.push(average(monthBuckets.race))
  }

  const easyFilled = fillSeriesGaps(easySeries, defaultEasy)
  const thresholdFilled = fillSeriesGaps(thresholdSeries, defaultThreshold)
  const raceFilled = fillSeriesGaps(raceSeries, defaultRace)

  const points12 = keys12.map((key, index) => {
    const monthDate = monthStartFromKey(key)
    return {
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      easy: easyFilled[index],
      threshold: thresholdFilled[index],
      race: raceFilled[index],
    }
  })

  return {
    todayLabel: formatMonthLabel(new Date().toISOString()),
    ranges: {
      '3 Months': points12.slice(-3),
      '6 Months': points12.slice(-6),
      '12 Months': points12,
    },
  }
}

function formatSignedPercent(delta) {
  const rounded = Math.round(delta)
  if (rounded > 0) return `↑ ${rounded}%`
  if (rounded < 0) return `↓ ${Math.abs(rounded)}%`
  return '→ 0%'
}

function formatSignedPaceDelta(deltaSeconds) {
  const safe = Math.round(Math.abs(deltaSeconds || 0))
  const mins = Math.floor(safe / 60)
  const secs = String(safe % 60).padStart(2, '0')
  const value = `${mins}:${secs}`
  if (deltaSeconds < 0) return `↓ ${value}`
  if (deltaSeconds > 0) return `↑ ${value}`
  return `→ ${value}`
}

function formatSignedIntDelta(delta) {
  const rounded = Math.round(delta)
  if (rounded > 0) return `↑ ${rounded}`
  if (rounded < 0) return `↓ ${Math.abs(rounded)}`
  return '→ 0'
}

function dayKey(dateValue) {
  const date = new Date(dateValue)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

function formatShortDateNoYear(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function activitiesInRange(activities, start, end) {
  return activities.filter((item) => {
    const ts = new Date(item.performed_at).getTime()
    return ts >= start && ts < end
  })
}

function averagePaceSeconds(activities) {
  if (!activities.length) return 0
  const sum = activities.reduce((acc, item) => acc + Number(item.pace_seconds), 0)
  return Math.round(sum / activities.length)
}

function sumDistance(activities) {
  return activities.reduce((acc, item) => acc + Number(item.distance_km), 0)
}

function sumElevation(activities) {
  return activities.reduce((acc, item) => acc + Number(item.elevation_gain_m || 0), 0)
}

function averageHr(activities) {
  if (!activities.length) return 0
  return Math.round(activities.reduce((acc, item) => acc + Number(item.avg_heart_rate), 0) / activities.length)
}

function activityDayLoad(item) {
  return Number(item.distance_km) * Number(item.avg_heart_rate)
}

function buildConsistencyData(activities) {
  const now = new Date()
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  const dayMs = 24 * 60 * 60 * 1000

  const dayLoads = new Map()
  for (const activity of activities) {
    const key = dayKey(activity.performed_at)
    dayLoads.set(key, (dayLoads.get(key) || 0) + activityDayLoad(activity))
  }

  const rawLoads = []
  for (let index = 48; index >= 0; index -= 1) {
    const ts = end - ((index + 1) * dayMs)
    const key = dayKey(ts)
    rawLoads.push(dayLoads.get(key) || 0)
  }

  const maxLoad = Math.max(...rawLoads, 1)
  const gridFlat = rawLoads.map((load) => {
    if (load <= 0) return 'low'
    const ratio = load / maxLoad
    if (ratio >= 0.62) return 'high'
    if (ratio >= 0.3) return 'med'
    return 'low'
  })

  const grid = []
  for (let row = 0; row < 7; row += 1) {
    grid.push(gridFlat.slice(row * 7, (row + 1) * 7))
  }

  const activeDays = rawLoads.filter((load) => load > 0).length
  const percentage = Math.round((activeDays / rawLoads.length) * 100)

  const weekMs = 7 * dayMs
  const currentWeek = activitiesInRange(activities, end - weekMs, end)
  const previousWeek = activitiesInRange(activities, end - (2 * weekMs), end - weekMs)

  const currentDistance = sumDistance(currentWeek)
  const previousDistance = sumDistance(previousWeek)
  const mileageDelta = previousDistance > 0 ? ((currentDistance - previousDistance) / previousDistance) * 100 : 0

  const currentAvgPace = averagePaceSeconds(currentWeek)
  const previousAvgPace = averagePaceSeconds(previousWeek)
  const paceDelta = previousAvgPace > 0 ? currentAvgPace - previousAvgPace : 0

  const currentAvgHr = averageHr(currentWeek)
  const previousAvgHr = averageHr(previousWeek)
  const hrDelta = previousAvgHr > 0 ? currentAvgHr - previousAvgHr : 0

  const currentElevation = sumElevation(currentWeek)
  const previousElevation = sumElevation(previousWeek)
  const elevationDelta = previousElevation > 0 ? ((currentElevation - previousElevation) / previousElevation) * 100 : 0

  const longRun = [...currentWeek].sort((a, b) => Number(b.distance_km) - Number(a.distance_km))[0]

  return {
    percentage,
    grid,
    stats: [
      {
        label: 'Weekly Mileage',
        value: currentDistance.toFixed(1),
        unit: 'km',
        change: formatSignedPercent(mileageDelta),
      },
      {
        label: 'Long Run',
        value: longRun ? Number(longRun.distance_km).toFixed(1) : '0.0',
        unit: 'km',
        note: longRun ? formatShortDateNoYear(longRun.performed_at) : 'No run yet',
      },
      {
        label: 'Avg Pace',
        value: formatTimeFromSeconds(currentAvgPace),
        unit: '/km',
        change: formatSignedPaceDelta(paceDelta),
      },
      {
        label: 'Avg HR',
        value: String(currentAvgHr || 0),
        unit: 'bpm',
        change: formatSignedIntDelta(hrDelta),
      },
      {
        label: 'Elevation Gain',
        value: String(Math.round(currentElevation)),
        unit: 'm',
        change: formatSignedPercent(elevationDelta),
      },
    ],
  }
}

function computeLoad(activities) {
  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const currentWindowStart = now - weekMs
  const previousWindowStart = now - (2 * weekMs)

  const currentWeekLoad = activities
    .filter((item) => new Date(item.performed_at).getTime() >= currentWindowStart)
    .reduce((acc, item) => acc + Number(item.distance_km) * Number(item.avg_heart_rate), 0)

  const previousWeekLoad = activities
    .filter((item) => {
      const ts = new Date(item.performed_at).getTime()
      return ts >= previousWindowStart && ts < currentWindowStart
    })
    .reduce((acc, item) => acc + Number(item.distance_km) * Number(item.avg_heart_rate), 0)

  const normalized = Math.max(0, Math.min(1000, Math.round(currentWeekLoad / 12)))

  let trend = 'stable'
  if (previousWeekLoad > 0) {
    const ratio = currentWeekLoad / previousWeekLoad
    if (ratio >= 1.15) trend = 'up'
    if (ratio <= 0.85) trend = 'down'
  }

  return {
    currentWeekLoad,
    normalized,
    trend,
  }
}

function computeRecovery(loadData) {
  const gaugePercent = Math.max(0.25, Math.min(0.95, 1 - loadData.normalized / 1200))

  if (gaugePercent >= 0.72) {
    return {
      status: 'Recovered',
      gaugePercent,
      mileageIncrease: 6,
      warning: 'Your recent load looks balanced. Maintain current progression.',
    }
  }

  if (gaugePercent >= 0.52) {
    return {
      status: 'Moderate Fatigue',
      gaugePercent,
      mileageIncrease: 12,
      warning: 'Keep quality sessions, but avoid large mileage jumps this week.',
    }
  }

  return {
    status: 'High Fatigue',
    gaugePercent,
    mileageIncrease: 18,
    warning: 'Reduce intensity for 2-3 days and prioritize sleep before hard sessions.',
  }
}

function computeReadiness(recovery, loadTrend) {
  const base = Math.round(recovery.gaugePercent * 100)
  const trendAdjustment = loadTrend === 'down' ? 6 : loadTrend === 'up' ? -6 : 0
  const score = Math.max(45, Math.min(95, base + trendAdjustment))

  let label = 'Good'
  if (score >= 85) label = 'Excellent'
  else if (score >= 70) label = 'Good'
  else if (score >= 55) label = 'Caution'
  else label = 'Low'

  return { score, label }
}

function fallbackInsights() {
  return [
    {
      type: 'success',
      title: 'Baseline Ready',
      description: 'Your dashboard is now connected to persisted activity data.',
      confidence: 'High',
      label: typeStyles.success.label,
    },
    {
      type: 'info',
      title: 'Keep Logging Sessions',
      description: 'The more activities you record, the more accurate these insights become.',
      confidence: 'Moderate',
      label: typeStyles.info.label,
    },
  ]
}

export async function GET() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [{ data: profile }, { data: activities }, { data: latestAnalyses }] = await Promise.all([
    supabase.from('profiles').select('display_name, avatar_url').eq('id', user.id).maybeSingle(),
    supabase
      .from('activities')
      .select('id, type, performed_at, distance_km, pace_seconds, avg_heart_rate, elevation_gain_m')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('performed_at', { ascending: false })
      .limit(60),
    supabase
      .from('uploaded_analyses')
      .select('confidence, suggested_insights')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const name = parseDisplayName(profile, user)
  const avatar = toInitials(name)
  const safeActivities = activities || []

  const loadData = computeLoad(safeActivities)
  const recovery = computeRecovery(loadData)
  const readiness = computeReadiness(recovery, loadData.trend)
  const projected10k = buildProjected10kSeries(safeActivities)
  const paceDevelopment = buildPaceDevelopmentSeries(safeActivities)
  const consistency = buildConsistencyData(safeActivities)

  const insights = [...fallbackInsights()]
  const analysis = latestAnalyses?.[0]
  const analysisInsight = analysis?.suggested_insights?.[0]

  if (analysisInsight) {
    insights.unshift({
      type: 'info',
      title: 'Latest Analysis',
      description: analysisInsight,
      confidence: `${analysis.confidence}%`,
      label: typeStyles.info.label,
    })
  }

  return NextResponse.json({
    user: {
      name,
      avatar,
      avatarUrl: profile?.avatar_url || null,
      plan: 'Premium',
      aerobicTrend: loadData.trend === 'up' ? 'improved' : loadData.trend === 'down' ? 'flattened' : 'stable',
    },
    readiness,
    trainingLoad: {
      value: loadData.normalized,
      optimalMin: 600,
      optimalMax: 800,
      max: 1000,
    },
    recovery,
    insights: insights.slice(0, 3),
    weeklyFocus: {
      title: recovery.status === 'Recovered' ? 'Build aerobic volume' : 'Prioritize recovery quality',
      description:
        recovery.status === 'Recovered'
          ? 'Add one controlled quality block and keep easy days easy.'
          : 'Keep effort mostly easy and protect sleep consistency this week.',
    },
    recentActivities: safeActivities.slice(0, 5).map(toRecentActivity),
    projected10k,
    paceDevelopment,
    consistency,
  })
}
