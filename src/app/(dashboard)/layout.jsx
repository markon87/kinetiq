'use client'

import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'
import UploadModal from '../../components/upload/UploadModal'
import ActivityFormModal from '../../components/activities/ActivityFormModal'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        {children}
      </div>
      <UploadModal />
      <ActivityFormModal />
    </div>
  )
}
