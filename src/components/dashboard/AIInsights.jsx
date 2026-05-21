import { TrendingUp, AlertCircle, Target, Footprints, ChevronRight } from 'lucide-react'
import { dashboardData } from '../../data/mockData'

const typeStyles = {
  success: { Icon: TrendingUp, color: 'var(--accent-lime)', bg: 'var(--bg-lime-tint)', border: 'var(--border-lime-tint)' },
  warning: { Icon: AlertCircle, color: 'var(--accent-orange)', bg: 'var(--bg-orange-tint)', border: 'var(--border-orange-tint)' },
  info:    { Icon: Target,      color: 'var(--accent-cyan)', bg: 'var(--bg-cyan-tint)', border: 'var(--border-cyan-tint)' },
}

const insights = dashboardData.insights.map(i => ({ ...i, ...typeStyles[i.type] }))
const { weeklyFocus } = dashboardData

export default function AIInsights() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">AI Insights</span>
        <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-lime)] transition-colors">View all</button>
      </div>

      <div className="space-y-2">
        {insights.map(({ Icon, title, description, confidence, color, bg, border }) => (
          <div key={title} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
            <div className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-1" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {title}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {description}
                </p>
                <div className="text-xs mt-2 font-medium" style={{ color }}>
                  Confidence: {confidence}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Weekly Focus */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">Weekly Focus</div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
              <Footprints size={16} className="text-[var(--text-secondary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {weeklyFocus.title}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {weeklyFocus.description}
              </p>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
