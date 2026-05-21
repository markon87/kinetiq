import { TrendingUp, AlertCircle, Target, Footprints, ChevronRight } from 'lucide-react'
import { dashboardData } from '../../data/mockData'

const typeStyles = {
  success: { Icon: TrendingUp, color: '#C6FF2E', bg: '#1C2B18', border: '#2A4A1A' },
  warning: { Icon: AlertCircle, color: '#FF7A1A', bg: '#2A1808', border: '#4A2A0A' },
  info:    { Icon: Target,      color: '#33D6FF', bg: '#081828', border: '#0A2A40' },
}

const insights = dashboardData.insights.map(i => ({ ...i, ...typeStyles[i.type] }))
const { weeklyFocus } = dashboardData

export default function AIInsights() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest">AI Insights</span>
        <button className="text-xs text-[#A8B0BD] hover:text-[#C6FF2E] transition-colors">View all</button>
      </div>

      <div className="space-y-2">
        {insights.map(({ Icon, title, description, confidence, color, bg, border }) => (
          <div key={title} className="bg-[#151B23] border border-[#1E2530] rounded-xl p-4">
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
                <p className="text-xs text-[#A8B0BD] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
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
        <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-4">
          <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-3">Weekly Focus</div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#11161D] border border-[#1E2530] flex items-center justify-center shrink-0">
              <Footprints size={16} className="text-[#A8B0BD]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {weeklyFocus.title}
              </div>
              <p className="text-xs text-[#A8B0BD] mt-0.5 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {weeklyFocus.description}
              </p>
            </div>
            <ChevronRight size={16} className="text-[#6F7A88] shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
