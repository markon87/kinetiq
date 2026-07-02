'use client'

import { useMemo, useState } from 'react'
import { Camera, Save } from 'lucide-react'
import { ACCEPTED_IMAGE_TYPES_ACCEPT_ATTR, ACCEPTED_IMAGE_TYPES_LABEL } from '../../../lib/uploadConfig'
import { useDashboardData } from '../../../providers/DashboardDataProvider'

export default function ProfilePage() {
  const { dashboardData, refreshDashboardData } = useDashboardData()
  const [nicknameDraft, setNicknameDraft] = useState('')
  const [nicknameTouched, setNicknameTouched] = useState(false)
  const [ageDraft, setAgeDraft] = useState('')
  const [ageTouched, setAgeTouched] = useState(false)
  const [sexDraft, setSexDraft] = useState('')
  const [sexTouched, setSexTouched] = useState(false)
  const [weightDraft, setWeightDraft] = useState('')
  const [weightTouched, setWeightTouched] = useState(false)
  const [persistedAvatarUrl, setPersistedAvatarUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const effectiveNickname = nicknameTouched ? nicknameDraft : (dashboardData.user.name || '')
  const effectiveAge = ageTouched ? ageDraft : (dashboardData.profile?.age != null ? String(dashboardData.profile.age) : '')
  const effectiveSex = sexTouched ? sexDraft : (dashboardData.profile?.sex || '')
  const effectiveWeight = weightTouched ? weightDraft : (dashboardData.profile?.weightKg != null ? String(dashboardData.profile.weightKg) : '')
  const effectiveAvatarUrl = persistedAvatarUrl ?? dashboardData.user.avatarUrl ?? null

  const avatarPreview = useMemo(() => previewUrl || effectiveAvatarUrl, [previewUrl, effectiveAvatarUrl])

  const onFileChange = (event) => {
    const nextFile = event.target.files?.[0] || null
    setSelectedFile(nextFile)
    setMessage('')
    setError('')

    if (!nextFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(nextFile)
    setPreviewUrl(objectUrl)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const trimmed = effectiveNickname.trim()
    if (trimmed.length < 2) {
      setError('Nickname must have at least 2 characters.')
      return
    }

    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append('nickname', trimmed)
      formData.append('age', effectiveAge)
      formData.append('sex', effectiveSex)
      formData.append('weightKg', effectiveWeight)
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Failed to update profile.' }))
        throw new Error(payload.error || 'Failed to update profile.')
      }

      const payload = await response.json()
      setPersistedAvatarUrl(payload.avatarUrl)
      setNicknameDraft(payload.nickname)
      setNicknameTouched(false)
      setAgeDraft(payload.age != null ? String(payload.age) : '')
      setAgeTouched(false)
      setSexDraft(payload.sex || '')
      setSexTouched(false)
      setWeightDraft(payload.weightKg != null ? String(payload.weightKg) : '')
      setWeightTouched(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      setMessage('Profile updated successfully.')
      await refreshDashboardData()
    } catch (submitError) {
      setError(submitError.message || 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          Profile
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Update your nickname and profile photo used across the dashboard greeting.
        </p>
      </div>

      <form onSubmit={onSubmit} className="max-w-2xl rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Profile preview"
              className="h-20 w-20 rounded-full object-cover border border-[var(--border-color)]"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[var(--accent-lime)] to-[var(--accent-cyan)] flex items-center justify-center text-2xl font-bold text-[var(--bg-main)]">
              {dashboardData.user.avatar}
            </div>
          )}

          <label className="min-h-11 inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors">
            <Camera size={16} />
            Upload Photo
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES_ACCEPT_ATTR}
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>

        <p className="text-xs text-[var(--text-muted)]">Accepted types: {ACCEPTED_IMAGE_TYPES_LABEL}</p>

        <label className="block text-xs text-[var(--text-muted)]">
          Nickname
          <input
            type="text"
            value={effectiveNickname}
            onChange={(event) => {
              setNicknameTouched(true)
              setNicknameDraft(event.target.value)
            }}
            maxLength={40}
            className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
          />
          <span className="mt-1 block text-[10px] text-[var(--text-muted)]">This name appears in the greeting message.</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block text-xs text-[var(--text-muted)]">
            Age
            <input
              type="number"
              min="13"
              max="100"
              value={effectiveAge}
              onChange={(event) => {
                setAgeTouched(true)
                setAgeDraft(event.target.value)
              }}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
          </label>

          <label className="block text-xs text-[var(--text-muted)]">
            Sex
            <select
              value={effectiveSex}
              onChange={(event) => {
                setSexTouched(true)
                setSexDraft(event.target.value)
              }}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label className="block text-xs text-[var(--text-muted)]">
            Weight (kg)
            <input
              type="number"
              min="1"
              step="0.1"
              value={effectiveWeight}
              onChange={(event) => {
                setWeightTouched(true)
                setWeightDraft(event.target.value)
              }}
              className="mt-1 w-full min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            />
          </label>
        </div>

        {message ? <p className="text-xs text-[var(--accent-lime)]">{message}</p> : null}
        {error ? <p className="text-xs text-[var(--status-danger)]">{error}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-lime)] px-4 py-2 text-sm font-semibold text-[var(--bg-main)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Save size={15} />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
