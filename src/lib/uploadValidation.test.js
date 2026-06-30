import { describe, expect, it } from 'vitest'
import { validateImageFile } from './uploadValidation'
import { MAX_UPLOAD_SIZE_BYTES } from './uploadConfig'

describe('validateImageFile', () => {
  it('rejects missing files', () => {
    expect(validateImageFile(null)).toEqual({
      valid: false,
      error: 'Image file is required.',
      status: 400,
    })
  })

  it('rejects unsupported file types', () => {
    expect(validateImageFile({ type: 'image/gif', size: 1024 })).toEqual({
      valid: false,
      error: 'Unsupported file type. Use PNG, JPEG, or WEBP.',
      status: 415,
    })
  })

  it('rejects files larger than the configured maximum', () => {
    expect(validateImageFile({ type: 'image/png', size: MAX_UPLOAD_SIZE_BYTES + 1 })).toEqual({
      valid: false,
      error: `File too large. Max allowed size is ${Math.floor(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024))}MB.`,
      status: 413,
    })
  })

  it('accepts supported file types within the size limit', () => {
    expect(validateImageFile({ type: 'image/webp', size: MAX_UPLOAD_SIZE_BYTES })).toEqual({
      valid: true,
    })
  })
})
