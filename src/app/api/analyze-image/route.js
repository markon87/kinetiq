import { NextResponse } from 'next/server'
import { validateImageFile } from '../../../lib/uploadValidation'

function mapWorkoutTypeFromName(name = '') {
  const lower = name.toLowerCase()

  if (lower.includes('tempo')) return 'Tempo Run'
  if (lower.includes('long')) return 'Long Run'
  if (lower.includes('interval')) return 'Interval Session'
  if (lower.includes('easy')) return 'Easy Run'
  return 'Run Session'
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image')

    const validation = validateImageFile(image)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: validation.status })
    }

    const workoutType = mapWorkoutTypeFromName(image.name)
    const now = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

    // Phase 1 response is mocked with a stable shape so UI can be wired before model integration.
    const payload = {
      source: 'phase-1-mock',
      generatedAt: now,
      confidence: 88,
      workoutType,
      extractedMetrics: {
        distanceKm: 10.2,
        duration: '00:55:05',
        pace: '5:24 /km',
        avgHeartRate: 138,
        elevationGainM: 42,
      },
      anomalies: ['Minor pace fade in last 2km.'],
      suggestedInsights: [
        'Aerobic control is strong at current easy-run intensity.',
        'Cadence consistency looks improved compared to recent sessions.',
        'Keep recovery volume steady for 48h before your next quality workout.',
      ],
      file: {
        name: image.name,
        size: image.size,
        type: image.type,
      },
    }

    return NextResponse.json(payload)
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error during screenshot analysis.' },
      { status: 500 }
    )
  }
}
