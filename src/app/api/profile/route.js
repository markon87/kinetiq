import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '../../../lib/supabase/server'
import { getSupabaseAdminClient } from '../../../lib/supabase/admin'
import { validateImageFile } from '../../../lib/uploadValidation'

const PROFILE_PHOTO_BUCKET = 'profile-photos'
const MIME_EXTENSION = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

function parseNickname(value) {
  const nickname = String(value || '').trim()
  if (!nickname) return null
  if (nickname.length < 2) return { error: 'Nickname must have at least 2 characters.' }
  if (nickname.length > 40) return { error: 'Nickname must be at most 40 characters.' }
  return { nickname }
}

function parseOptionalAge(value) {
  if (value == null || String(value).trim() === '') return { age: null }
  const age = Number.parseInt(String(value), 10)
  if (Number.isNaN(age) || age < 13 || age > 100) {
    return { error: 'Age must be between 13 and 100.' }
  }
  return { age }
}

function parseOptionalSex(value) {
  if (value == null || String(value).trim() === '') return { sex: null }
  const sex = String(value).trim().toLowerCase()
  if (sex !== 'male' && sex !== 'female') {
    return { error: 'Sex must be male or female.' }
  }
  return { sex }
}

function parseOptionalWeight(value) {
  if (value == null || String(value).trim() === '') return { weightKg: null }
  const weightKg = Number.parseFloat(String(value))
  if (Number.isNaN(weightKg) || weightKg <= 0 || weightKg > 300) {
    return { error: 'Weight must be between 1 and 300 kg.' }
  }
  return { weightKg: Number(weightKg.toFixed(1)) }
}

async function getAuthedUser() {
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

async function ensureBucket(admin) {
  const { error } = await admin.storage.createBucket(PROFILE_PHOTO_BUCKET, {
    public: true,
  })

  if (error && !String(error.message || '').toLowerCase().includes('already')) {
    throw error
  }
}

async function uploadProfilePhoto(userId, imageFile) {
  const admin = getSupabaseAdminClient()
  await ensureBucket(admin)

  const extension = MIME_EXTENSION[imageFile.type] || 'jpg'
  const basePath = `${userId}/avatar`
  const removeTargets = [`${basePath}.png`, `${basePath}.jpg`, `${basePath}.webp`]
  await admin.storage.from(PROFILE_PHOTO_BUCKET).remove(removeTargets)

  const path = `${basePath}.${extension}`
  const { error: uploadError } = await admin.storage
    .from(PROFILE_PHOTO_BUCKET)
    .upload(path, imageFile, {
      upsert: true,
      contentType: imageFile.type,
      cacheControl: '3600',
    })

  if (uploadError) {
    throw uploadError
  }

  const {
    data: { publicUrl },
  } = admin.storage.from(PROFILE_PHOTO_BUCKET).getPublicUrl(path)

  return publicUrl
}

export async function GET() {
  const { supabase, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, age, sex, weight_kg')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 })
  }

  return NextResponse.json({
    nickname: data?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete',
    avatarUrl: data?.avatar_url || null,
    age: data?.age ?? null,
    sex: data?.sex ?? null,
    weightKg: data?.weight_kg ?? null,
  })
}

export async function PATCH(request) {
  const { supabase, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const nicknameInput = formData.get('nickname')
  const ageInput = formData.get('age')
  const sexInput = formData.get('sex')
  const weightInput = formData.get('weightKg')
  const image = formData.get('image')

  const update = {}

  if (nicknameInput != null) {
    const parsed = parseNickname(nicknameInput)
    if (parsed?.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    if (parsed?.nickname) {
      update.display_name = parsed.nickname
    }
  }

  if (ageInput != null) {
    const parsedAge = parseOptionalAge(ageInput)
    if (parsedAge.error) {
      return NextResponse.json({ error: parsedAge.error }, { status: 400 })
    }
    update.age = parsedAge.age
  }

  if (sexInput != null) {
    const parsedSex = parseOptionalSex(sexInput)
    if (parsedSex.error) {
      return NextResponse.json({ error: parsedSex.error }, { status: 400 })
    }
    update.sex = parsedSex.sex
  }

  if (weightInput != null) {
    const parsedWeight = parseOptionalWeight(weightInput)
    if (parsedWeight.error) {
      return NextResponse.json({ error: parsedWeight.error }, { status: 400 })
    }
    update.weight_kg = parsedWeight.weightKg
  }

  if (image && image.size > 0) {
    const validation = validateImageFile(image)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: validation.status })
    }

    try {
      const avatarUrl = await uploadProfilePhoto(user.id, image)
      update.avatar_url = avatarUrl
    } catch {
      return NextResponse.json({ error: 'Failed to upload profile photo.' }, { status: 500 })
    }
  }

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: 'No profile changes provided.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id)
    .select('display_name, avatar_url, age, sex, weight_kg')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }

  return NextResponse.json({
    nickname: data.display_name,
    avatarUrl: data.avatar_url || null,
    age: data.age ?? null,
    sex: data.sex ?? null,
    weightKg: data.weight_kg ?? null,
  })
}
