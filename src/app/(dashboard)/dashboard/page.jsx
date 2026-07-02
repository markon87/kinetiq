import TrainingLoadCard from '../../../components/dashboard/TrainingLoadCard'
import RecoveryStatusCard from '../../../components/dashboard/RecoveryStatusCard'
import ConsistencySection from '../../../components/dashboard/ConsistencySection'
import VO2MaxCard from '../../../components/dashboard/VO2MaxCard'
import AIInsights from '../../../components/dashboard/AIInsights'
import RecentActivity from '../../../components/dashboard/RecentActivity'
import { ProjectedTimeCard, PaceDevelopmentCard } from '../../../components/dashboard/Charts'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      {/* Main scrollable area */}
      <main className="flex-1 p-3 sm:p-4 space-y-4 min-w-0 lg:overflow-y-auto">
        <ProjectedTimeCard />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <TrainingLoadCard />
          <RecoveryStatusCard />
          <VO2MaxCard />
          <PaceDevelopmentCard />
        </div>

        <ConsistencySection />
      </main>

      {/* Right sidebar — AI + Activity */}
      <aside className="w-full p-3 sm:p-4 border-t border-[var(--border-color)] lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <AIInsights />
        <RecentActivity />
      </aside>
    </div>
  )
}
