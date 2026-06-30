const DEFAULT_ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const DEFAULT_MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024

function parseAcceptedTypes(value) {
  if (!value) return DEFAULT_ACCEPTED_IMAGE_TYPES

  const parsed = value
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)

  return parsed.length ? parsed : DEFAULT_ACCEPTED_IMAGE_TYPES
}

function parseMaxUploadSizeBytes(value) {
  const parsed = Number.parseInt(value ?? '', 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_MAX_UPLOAD_SIZE_BYTES
  }

  return parsed
}

export const ACCEPTED_IMAGE_TYPES = parseAcceptedTypes(process.env.NEXT_PUBLIC_UPLOAD_ACCEPTED_TYPES)
export const MAX_UPLOAD_SIZE_BYTES = parseMaxUploadSizeBytes(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE_BYTES)

export const ACCEPTED_IMAGE_TYPES_ACCEPT_ATTR = ACCEPTED_IMAGE_TYPES.join(',')
export const ACCEPTED_IMAGE_TYPES_LABEL = ACCEPTED_IMAGE_TYPES
  .map((type) => type.replace('image/', '').toUpperCase())
  .join(', ')
