import TrainingLoadCard from '../../../components/dashboard/TrainingLoadCard'
import ConsistencySection from '../../../components/dashboard/ConsistencySection'
import VO2MaxCard from '../../../components/dashboard/VO2MaxCard'
import AIInsights from '../../../components/dashboard/AIInsights'
import RecentActivity from '../../../components/dashboard/RecentActivity'
import { ProjectedTimeCard, PaceDevelopmentCard } from '../../../components/dashboard/Charts'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-y-hidden lg:overflow-x-visible">
      {/* Main scrollable area */}
      <main className="relative z-10 flex-1 p-3 sm:p-4 space-y-4 min-w-0 lg:overflow-y-auto">
        <ProjectedTimeCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <TrainingLoadCard />
          <VO2MaxCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <PaceDevelopmentCard />
          <ConsistencySection />
        </div>
      </main>

      {/* Right sidebar — AI + Activity */}
      <aside className="relative z-0 w-full p-3 sm:p-4 border-t border-[var(--border-color)] lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <AIInsights />
        <RecentActivity />
      </aside>
    </div>
  )
}
