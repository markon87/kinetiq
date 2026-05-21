import Sidebar from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        {children}
      </div>
    </div>
  )
}
