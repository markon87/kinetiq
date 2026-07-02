'use client'

import { useDashboardData } from '../../providers/DashboardDataProvider'

export default function RecentActivity() {
  const { dashboardData } = useDashboardData()
  const activities = dashboardData.recentActivities || []

  return (
    <section className="mt-6" aria-labelledby="recent-activity-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="recent-activity-heading" className="text-[11px] sm:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Recent Activity</h2>
        <button
          type="button"
          className="min-h-11 px-2 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-lime)] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
          aria-label="View all recent activities"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {activities.map((a) => (
          <article key={a.type + a.date} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-3.5 flex items-center gap-3" aria-label={`${a.type} on ${a.date}`}>
            <div className="w-9 h-9 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-base shrink-0">
              {a.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[13px] sm:text-sm font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {a.type}
              </div>
              <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                {a.date}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div
                className="text-sm font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}
              >
                {a.distance}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">{a.pace}</div>
            </div>
            <div className="text-right shrink-0 pl-2 border-l border-[var(--border-color)]">
              <div className="text-xs text-[var(--text-muted)]">{a.hr}</div>
            </div>
          </article>
        ))}

        {activities.length === 0 ? (
          <article className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 sm:p-3.5">
            <p className="text-xs text-[var(--text-secondary)]">
              No activities logged yet. Add your first activity to populate this feed.
            </p>
          </article>
        ) : null}
      </div>
    </section>
  )
}
