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
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 })
  }

  return NextResponse.json({
    nickname: data?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete',
    avatarUrl: data?.avatar_url || null,
  })
}

export async function PATCH(request) {
  const { supabase, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const nicknameInput = formData.get('nickname')
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
    .select('display_name, avatar_url')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }

  return NextResponse.json({
    nickname: data.display_name,
    avatarUrl: data.avatar_url || null,
  })
}
