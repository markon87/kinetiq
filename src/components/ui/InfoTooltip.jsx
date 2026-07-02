'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Info } from 'lucide-react'

export default function InfoTooltip({ text, iconClassName = 'text-[var(--text-muted)]', panelClassName = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const tooltipId = useId()
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const tooltipWidth = tooltipRef.current?.offsetWidth || 224
    const tooltipHeight = tooltipRef.current?.offsetHeight || 88
    const gap = 10
    const viewportPadding = 8

    const spaceRight = window.innerWidth - rect.right
    const spaceLeft = rect.left

    let left = spaceRight >= tooltipWidth || spaceRight >= spaceLeft
      ? rect.right + gap
      : rect.left - tooltipWidth - gap

    let top = rect.bottom + gap
    if (top + tooltipHeight > window.innerHeight - viewportPadding) {
      top = rect.top - tooltipHeight - gap
    }

    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipWidth - viewportPadding))
    top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltipHeight - viewportPadding))

    const sidebar = document.querySelector('aside[aria-label="Sidebar"]')
    if (sidebar) {
      const sidebarRect = sidebar.getBoundingClientRect()
      const overlapsSidebar = left + tooltipWidth > sidebarRect.left
        && left < sidebarRect.right
        && top + tooltipHeight > sidebarRect.top
        && top < sidebarRect.bottom

      if (overlapsSidebar) {
        const alternateLeft = rect.left - tooltipWidth - gap
        left = Math.max(viewportPadding, Math.min(alternateLeft, window.innerWidth - tooltipWidth - viewportPadding))
      }
    }

    setPosition({ top, left })
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    updatePosition()

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleReposition = () => updatePosition()

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [isOpen, updatePosition])

  return (
    <span
      ref={containerRef}
      className="relative inline-flex"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false)
        }
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        aria-label="Show card description"
        aria-expanded={isOpen}
        aria-controls={tooltipId}
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)]/60"
      >
        <Info size={13} className={iconClassName} />
      </button>

      {isOpen && typeof document !== 'undefined'
        ? createPortal(
          <span
            id={tooltipId}
            ref={tooltipRef}
            role="tooltip"
            className={`fixed z-[200] w-56 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-[11px] leading-relaxed text-[var(--text-secondary)] shadow-lg ${panelClassName}`}
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
          >
            {text}
          </span>,
          document.body,
        )
        : null}
    </span>
  )
}
