import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '../../../lib/supabase/server'

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`
}

function formatPace(paceSeconds) {
  const mins = Math.floor(paceSeconds / 60)
  const secs = paceSeconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function formatDateLabel(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function parsePaceToSeconds(pace) {
  const [mins, secs] = String(pace).split(':').map((v) => Number.parseInt(v, 10))
  if (Number.isNaN(mins) || Number.isNaN(secs)) return null
  return mins * 60 + secs
}

function parseDurationToSeconds(duration) {
  const parts = String(duration).split(':').map((v) => Number.parseInt(v, 10))
  if (parts.some((v) => Number.isNaN(v))) return null

  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

function toUiActivity(row) {
  const emojiByType = {
    'Easy Run': '🏃',
    'Tempo Run': '⚡',
    'Long Run': '🏔',
    'Recovery Run': '🌿',
    Interval: '🔥',
  }

  return {
    id: row.id,
    type: row.type,
    date: formatDateLabel(row.performed_at),
    performedAt: row.performed_at,
    distance: Number(row.distance_km).toFixed(1),
    pace: formatPace(row.pace_seconds),
    hr: row.avg_heart_rate,
    duration: formatDuration(row.duration_seconds),
    elevation: row.elevation_gain_m,
    emoji: emojiByType[row.type] || '🏃',
  }
}

function toStats(rows) {
  const totalRuns = rows.length
  const totalDistance = rows.reduce((acc, row) => acc + Number(row.distance_km), 0)
  const totalDuration = rows.reduce((acc, row) => acc + row.duration_seconds, 0)
  const avgPaceSeconds = totalRuns
    ? Math.round(rows.reduce((acc, row) => acc + row.pace_seconds, 0) / totalRuns)
    : 0

  const totalHours = Math.floor(totalDuration / 3600)
  const totalMinutes = Math.round((totalDuration % 3600) / 60)

  return [
    { label: 'Total Runs', value: String(totalRuns), unit: 'logged' },
    { label: 'Total Distance', value: totalDistance.toFixed(1), unit: 'km' },
    { label: 'Total Time', value: `${totalHours}h ${totalMinutes}m`, unit: 'total' },
    { label: 'Avg Pace', value: formatPace(avgPaceSeconds), unit: '/km' },
  ]
}

async function getAuthedClient() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null }
  }

  return { supabase, user }
}

function parseActivityPayload(payload) {
  const paceSeconds = parsePaceToSeconds(payload.pace)
  const durationSeconds = parseDurationToSeconds(payload.duration)
  const distanceKm = Number(payload.distance)
  const avgHeartRate = Number(payload.hr)
  const elevationGainM = Number(payload.elevation || 0)

  if (!payload.type || !payload.date || !paceSeconds || !durationSeconds) {
    return { error: 'Invalid activity payload.' }
  }

  if (distanceKm <= 0 || avgHeartRate <= 0 || elevationGainM < 0) {
    return { error: 'Invalid activity metrics.' }
  }

  return {
    values: {
      type: payload.type,
      performed_at: new Date(payload.date).toISOString(),
      distance_km: distanceKm,
      pace_seconds: paceSeconds,
      avg_heart_rate: avgHeartRate,
      duration_seconds: durationSeconds,
      elevation_gain_m: elevationGainM,
    },
  }
}

export async function GET(request) {
  const { supabase, user } = await getAuthedClient()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limit = Number.parseInt(new URL(request.url).searchParams.get('limit') || '50', 10)

  const { data, error } = await supabase
    .from('activities')
    .select('id, type, performed_at, distance_km, pace_seconds, avg_heart_rate, duration_seconds, elevation_gain_m')
    .is('deleted_at', null)
    .order('performed_at', { ascending: false })
    .limit(Number.isNaN(limit) ? 50 : Math.min(limit, 200))

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch activities.' }, { status: 500 })
  }

  const activities = data.map(toUiActivity)
  const stats = toStats(data)

  return NextResponse.json({ activities, stats })
}

export async function POST(request) {
  const { supabase, user } = await getAuthedClient()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await request.json()
  const parsed = parseActivityPayload(payload)
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({
      user_id: user.id,
      ...parsed.values,
      source: payload.source || 'manual',
    })
    .select('id, type, performed_at, distance_km, pace_seconds, avg_heart_rate, duration_seconds, elevation_gain_m')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to save activity.' }, { status: 500 })
  }

  return NextResponse.json({ activity: toUiActivity(data) }, { status: 201 })
}

export async function PATCH(request) {
  const { supabase, user } = await getAuthedClient()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await request.json()
  if (!payload?.id) {
    return NextResponse.json({ error: 'Activity id is required.' }, { status: 400 })
  }

  const parsed = parseActivityPayload(payload)
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('activities')
    .update(parsed.values)
    .eq('id', payload.id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .select('id, type, performed_at, distance_km, pace_seconds, avg_heart_rate, duration_seconds, elevation_gain_m')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Failed to update activity.' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Activity not found.' }, { status: 404 })
  }

  return NextResponse.json({ activity: toUiActivity(data) })
}

export async function DELETE(request) {
  const { supabase, user } = await getAuthedClient()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const requestUrl = new URL(request.url)
  const id = requestUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Activity id is required.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('activities')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .select('id')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Failed to remove activity.' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Activity not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
