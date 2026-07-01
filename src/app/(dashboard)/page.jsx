import TrainingLoadCard from '../../components/dashboard/TrainingLoadCard'
import RecoveryStatusCard from '../../components/dashboard/RecoveryStatusCard'
import ConsistencySection from '../../components/dashboard/ConsistencySection'
import AIInsights from '../../components/dashboard/AIInsights'
import RecentActivity from '../../components/dashboard/RecentActivity'
import { ProjectedTimeCard, PaceDevelopmentCard } from '../../components/dashboard/Charts'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      {/* Main scrollable area */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 min-w-0">
        <ProjectedTimeCard />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <TrainingLoadCard />
          <RecoveryStatusCard />
          <PaceDevelopmentCard />
        </div>

        <ConsistencySection />
      </main>

      {/* Right sidebar — AI + Activity */}
      <aside className="w-full lg:w-80 shrink-0 overflow-y-auto p-3 sm:p-4 border-t lg:border-t-0 lg:border-l border-[var(--border-color)]">
        <AIInsights />
        <RecentActivity />
      </aside>
    </div>
  )
}
