import { describe, expect, it } from 'vitest'
import { POST } from './route'

describe('POST /api/analyze-image', () => {
  it('returns 400 when image is missing', async () => {
    const request = {
      formData: async () => new FormData(),
    }

    const response = await POST(request)
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Image file is required.' })
  })

  it('returns 415 for unsupported file types', async () => {
    const formData = new FormData()
    formData.append('image', new File(['gif'], 'session.gif', { type: 'image/gif' }))

    const response = await POST({
      formData: async () => formData,
    })

    expect(response.status).toBe(415)
    await expect(response.json()).resolves.toEqual({ error: 'Unsupported file type. Use PNG, JPEG, or WEBP.' })
  })

  it('returns a mocked analysis payload for valid uploads', async () => {
    const formData = new FormData()
    formData.append('image', new File(['tempo'], 'tempo-session.png', { type: 'image/png' }))

    const response = await POST({
      formData: async () => formData,
    })

    expect(response.status).toBe(200)

    const payload = await response.json()
    expect(payload).toMatchObject({
      source: 'phase-1-mock',
      confidence: 88,
      workoutType: 'Tempo Run',
      file: {
        name: 'tempo-session.png',
        type: 'image/png',
      },
    })
    expect(payload.suggestedInsights).toHaveLength(3)
    expect(payload.generatedAt).toEqual(expect.any(String))
  })
})
