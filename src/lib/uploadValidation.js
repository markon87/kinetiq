import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE_BYTES } from './uploadConfig'

function hasFileShape(file) {
  return !!file && typeof file === 'object' && 'type' in file && 'size' in file
}

export function validateImageFile(file) {
  if (!hasFileShape(file)) {
    return { valid: false, error: 'Image file is required.', status: 400 }
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file type. Use PNG, JPEG, or WEBP.',
      status: 415,
    }
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large. Max allowed size is ${Math.floor(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024))}MB.`,
      status: 413,
    }
  }

  return { valid: true }
}
