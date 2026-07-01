'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ImagePlus, Upload, X, Loader2 } from 'lucide-react'
import { useUploadAnalysis } from '../../providers/UploadAnalysisProvider'
import { useActivityLog } from '../../providers/ActivityLogProvider'
import {
  ACCEPTED_IMAGE_TYPES_ACCEPT_ATTR,
  ACCEPTED_IMAGE_TYPES_LABEL,
  MAX_UPLOAD_SIZE_BYTES,
} from '../../lib/uploadConfig'
import { validateImageFile } from '../../lib/uploadValidation'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadModal() {
  const { isModalOpen, isAnalyzing, analysisError, closeModal, analyzeImage } = useUploadAnalysis()
  const { openManualFormFromAnalysis } = useActivityLog()
  const [selectedFile, setSelectedFile] = useState(null)
  const [localError, setLocalError] = useState(null)
  const inputRef = useRef(null)

  const combinedError = localError || analysisError

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null
    return URL.createObjectURL(selectedFile)
  }, [selectedFile])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const updateFile = (file) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setSelectedFile(null)
      setLocalError(validation.error)
      return
    }

    setLocalError(null)
    setSelectedFile(file)
  }

  const onDrop = (event) => {
    event.preventDefault()
    if (isAnalyzing) return

    const file = event.dataTransfer?.files?.[0]
    updateFile(file)
  }

  const onAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return

    try {
      const payload = await analyzeImage(selectedFile)
      openManualFormFromAnalysis(payload)
      setSelectedFile(null)
      setLocalError(null)
    } catch {
      // Error state is handled by provider.
    }
  }

  const onModalClose = () => {
    if (isAnalyzing) return
    setSelectedFile(null)
    setLocalError(null)
    closeModal()
  }

  if (!isModalOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onModalClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Upload Workout Screenshot
            </h3>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">Phase 1 analyzer (mocked output)</p>
          </div>
          <button
            type="button"
            onClick={onModalClose}
            disabled={isAnalyzing}
            className="min-h-11 min-w-11 rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
            aria-label="Close upload modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
            className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 text-center"
          >
            {previewUrl ? (
              <div className="space-y-3">
                <Image
                  src={previewUrl}
                  alt="Selected upload"
                  width={640}
                  height={360}
                  unoptimized
                  className="mx-auto max-h-56 w-auto rounded-lg border border-[var(--border-color)]"
                />
                <div className="text-xs text-[var(--text-secondary)]">
                  {selectedFile.name} ({formatBytes(selectedFile.size)})
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bg-lime-tint)] text-[var(--accent-lime)]">
                  <ImagePlus size={18} />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Drop image here or pick from your files</p>
                <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                  {ACCEPTED_IMAGE_TYPES_LABEL} up to {Math.floor(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024))}MB
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES_ACCEPT_ATTR}
              className="hidden"
              onChange={(event) => updateFile(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isAnalyzing}
              className="min-h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[11px] sm:text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
            >
              Choose File
            </button>
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="min-h-11 inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-lime)] px-3 py-2 text-[11px] sm:text-xs font-semibold text-[var(--bg-main)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
            >
              {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Screenshot'}
            </button>
          </div>

          {combinedError ? <p className="text-xs text-[var(--status-danger)]">{combinedError}</p> : null}
        </div>
      </div>
    </div>
  )
}
