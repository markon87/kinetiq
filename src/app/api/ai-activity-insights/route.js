import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '../../../lib/supabase/server'

function getAiEnv() {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

  if (!apiKey) {
    return { configured: false, apiKey: null, model }
  }

  return { configured: true, apiKey, model }
}

function toActivitySummaryRows(rows) {
  return rows.map((row) => ({
    type: row.type,
    performedAt: row.performed_at,
    distanceKm: Number(row.distance_km),
    paceSeconds: Number(row.pace_seconds),
    avgHeartRate: Number(row.avg_heart_rate),
    cadenceSpm: row.cadence_spm == null ? null : Number(row.cadence_spm),
    elevationGainM: Number(row.elevation_gain_m || 0),
  }))
}

function confidenceLabel(score) {
  if (score >= 80) return 'High'
  if (score >= 60) return 'Moderate'
  return 'Low'
}

function normalizeAiPayload(payload) {
  const rawInsights = Array.isArray(payload?.insights) ? payload.insights.slice(0, 3) : []
  const insights = rawInsights.map((item, index) => {
    const allowedType = item?.type === 'success' || item?.type === 'warning' || item?.type === 'info'
      ? item.type
      : 'info'

    const score = Number(item?.confidenceScore)
    const confidenceScore = Number.isFinite(score)
      ? Math.max(0, Math.min(100, Math.round(score)))
      : 65

    return {
      type: allowedType,
      title: String(item?.title || `Insight ${index + 1}`).slice(0, 90),
      description: String(item?.description || 'No description provided.').slice(0, 320),
      confidenceScore,
      confidence: confidenceLabel(confidenceScore),
    }
  })

  const weeklyFocus = {
    title: String(payload?.weeklyFocus?.title || 'Stay consistent').slice(0, 80),
    description: String(payload?.weeklyFocus?.description || 'Keep training load progression controlled and log sessions regularly.').slice(0, 240),
  }

  const anomalies = Array.isArray(payload?.anomalies)
    ? payload.anomalies.map((item) => String(item).slice(0, 160)).slice(0, 6)
    : []

  return { insights, weeklyFocus, anomalies }
}

function fallbackInsightPayload() {
  return {
    insights: [
      {
        type: 'info',
        title: 'AI summary unavailable',
        description: 'Using your current deterministic dashboard insights until AI analysis is available.',
        confidenceScore: 55,
        confidence: 'Low',
      },
    ],
    weeklyFocus: {
      title: 'Maintain consistency',
      description: 'Log sessions regularly and keep progression smooth while AI analysis is offline.',
    },
    anomalies: [],
  }
}

export async function POST() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('age, sex, weight_kg')
    .eq('id', user.id)
    .maybeSingle()

  const { data: activities, error: activityError } = await supabase
    .from('activities')
    .select('type, performed_at, distance_km, pace_seconds, avg_heart_rate, cadence_spm, elevation_gain_m')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('performed_at', { ascending: false })
    .limit(60)

  if (activityError) {
    return NextResponse.json({ error: 'Failed to load activities for analysis.' }, { status: 500 })
  }

  const safeActivities = activities || []
  if (safeActivities.length < 3) {
    return NextResponse.json({ error: 'At least 3 activities are needed for AI analysis.' }, { status: 400 })
  }

  const aiEnv = getAiEnv()
  let normalized = fallbackInsightPayload()
  let overallConfidence = 55

  if (aiEnv.configured) {
    const summaryRows = toActivitySummaryRows(safeActivities)

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${aiEnv.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiEnv.model,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are an endurance running coach AI. Return strict JSON only with keys: insights (exactly 3), weeklyFocus, anomalies. Each insight must include type (success|warning|info), title, description, confidenceScore (0-100). Keep advice practical and concise.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              profile: {
                age: profile?.age ?? null,
                sex: profile?.sex ?? null,
                weightKg: profile?.weight_kg ?? null,
              },
              activities: summaryRows,
            }),
          },
        ],
        temperature: 0.2,
      }),
    })

    if (aiResponse.ok) {
      const aiPayload = await aiResponse.json()
      const content = aiPayload?.choices?.[0]?.message?.content

      if (content) {
        try {
          normalized = normalizeAiPayload(JSON.parse(content))
          if (normalized.insights.length) {
            overallConfidence = Math.round(
              normalized.insights.reduce((sum, item) => sum + item.confidenceScore, 0) / normalized.insights.length,
            )
          }
        } catch {
          normalized = fallbackInsightPayload()
          overallConfidence = 55
        }
      }
    }
  }

  const persistedPayload = {
    user_id: user.id,
    confidence: Math.max(0, Math.min(100, overallConfidence)),
    workout_type: 'Activity AI Summary',
    extracted_metrics: {
      source: 'activity-ai',
      model: aiEnv.configured ? aiEnv.model : 'unconfigured',
      generatedAt: new Date().toISOString(),
      insights: normalized.insights,
      weeklyFocus: normalized.weeklyFocus,
    },
    anomalies: normalized.anomalies,
    suggested_insights: normalized.insights.map((item) => item.description),
    file_meta: {
      source: 'activity-ai',
      activityCount: safeActivities.length,
    },
  }

  const { error: insertError } = await supabase
    .from('uploaded_analyses')
    .insert(persistedPayload)

  if (insertError) {
    return NextResponse.json({ error: 'Failed to persist AI insights.' }, { status: 500 })
  }

  return NextResponse.json({
    confidence: persistedPayload.confidence,
    insights: normalized.insights,
    weeklyFocus: normalized.weeklyFocus,
    anomalies: normalized.anomalies,
    source: 'activity-ai',
  })
}
