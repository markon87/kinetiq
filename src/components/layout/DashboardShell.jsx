'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import UploadModal from '../upload/UploadModal'
import ActivityFormModal from '../activities/ActivityFormModal'
import { DashboardDataProvider } from '../../providers/DashboardDataProvider'

export default function DashboardShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <DashboardDataProvider>
      <div className="flex h-dvh overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
          {children}
        </div>
        <UploadModal />
        <ActivityFormModal />
      </div>
    </DashboardDataProvider>
  )
}
