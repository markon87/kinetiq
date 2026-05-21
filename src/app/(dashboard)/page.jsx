import TrainingLoadCard from '../../components/dashboard/TrainingLoadCard'
import RecoveryStatusCard from '../../components/dashboard/RecoveryStatusCard'
import ConsistencySection from '../../components/dashboard/ConsistencySection'
import AIInsights from '../../components/dashboard/AIInsights'
import RecentActivity from '../../components/dashboard/RecentActivity'
import { ProjectedTimeCard, PaceDevelopmentCard } from '../../components/dashboard/Charts'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main scrollable area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 min-w-0">
        <ProjectedTimeCard />

        <div className="grid grid-cols-3 gap-4">
          <TrainingLoadCard />
          <RecoveryStatusCard />
          <PaceDevelopmentCard />
        </div>

        <ConsistencySection />
      </main>

      {/* Right sidebar — AI + Activity */}
      <aside className="w-80 shrink-0 overflow-y-auto p-4 border-l border-[#1E2530]">
        <AIInsights />
        <RecentActivity />
      </aside>
    </div>
  )
}
