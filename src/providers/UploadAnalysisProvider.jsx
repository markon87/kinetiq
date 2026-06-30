'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ANALYSIS_STORAGE_KEY = 'kinetiq-latest-analysis'

function getStoredAnalysisResult() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = localStorage.getItem(ANALYSIS_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(ANALYSIS_STORAGE_KEY)
    return null
  }
}

const UploadAnalysisContext = createContext({
  isModalOpen: false,
  isAnalyzing: false,
  analysisResult: null,
  analysisError: null,
  openModal: () => {},
  closeModal: () => {},
  analyzeImage: async () => {},
})

export function UploadAnalysisProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(getStoredAnalysisResult)
  const [analysisError, setAnalysisError] = useState(null)

  const openModal = useCallback(() => {
    setAnalysisError(null)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    if (!isAnalyzing) {
      setIsModalOpen(false)
    }
  }, [isAnalyzing])

  const analyzeImage = useCallback(async (file) => {
    setAnalysisError(null)
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Analysis failed')
      }

      setAnalysisResult(payload)
      localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(payload))
      setIsModalOpen(false)
      return payload
    } catch (error) {
      setAnalysisError(error.message || 'Failed to analyze image')
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      isModalOpen,
      isAnalyzing,
      analysisResult,
      analysisError,
      openModal,
      closeModal,
      analyzeImage,
    }),
    [isModalOpen, isAnalyzing, analysisResult, analysisError, openModal, closeModal, analyzeImage]
  )

  return <UploadAnalysisContext.Provider value={value}>{children}</UploadAnalysisContext.Provider>
}

export const useUploadAnalysis = () => useContext(UploadAnalysisContext)
