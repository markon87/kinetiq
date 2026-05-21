import { TrendingUp, AlertCircle, Target, Zap, Brain, ChevronRight, Clock, CheckCircle } from 'lucide-react'

const weeklyAnalysis = {
  summary: "Your aerobic base has strengthened considerably over the past 8 weeks. VO₂ Max increased by 1.8 ml/kg/min and resting heart rate dropped 6 bpm — both strong indicators of cardiovascular adaptation. Training load is within optimal range, though the 18% mileage spike last week warrants monitoring.",
  confidence: 94,
  generatedAt: 'Today, 6:04 AM',
  tags: ['Aerobic', 'Load Management', 'Recovery'],
}

const racePredictions = [
  { distance: '5K',           time: '21:48', change: '−0:26', confidence: 91, color: '#C6FF2E' },
  { distance: '10K',          time: '45:10', change: '−0:52', confidence: 88, color: '#C6FF2E' },
  { distance: 'Half Marathon', time: '1:41:30', change: '−2:25', confidence: 82, color: '#33D6FF' },
  { distance: 'Marathon',     time: '3:47:15', change: '−5:15', confidence: 71, color: '#FF7A1A' },
]

const patterns = [
  {
    type: 'success',
    icon: TrendingUp,
    color: '#C6FF2E',
    bg: '#1C2B18',
    border: '#2A4A1A',
    title: 'Aerobic Efficiency Improving',
    body: 'Your pace at zone 2 heart rate has dropped by 14 seconds/km over 8 weeks. This indicates excellent aerobic base development without overtraining.',
    confidence: 96,
  },
  {
    type: 'warning',
    icon: AlertCircle,
    color: '#FF7A1A',
    bg: '#2A1808',
    border: '#4A2A0A',
    title: 'Mileage Spike Detected',
    body: 'Last week\'s 18% volume increase exceeded the recommended 10% guideline. Your HRV dipped slightly in response. Maintain current volume this week before building again.',
    confidence: 89,
  },
  {
    type: 'info',
    icon: Target,
    color: '#33D6FF',
    bg: '#081828',
    border: '#0A2A40',
    title: 'Race Pace Ready for 10K PR',
    body: 'Based on your last 3 threshold sessions, your lactate threshold pace has improved to 4:18/km — sufficient for a sub-45 10K. Consider a race or time trial within 3 weeks.',
    confidence: 85,
  },
  {
    type: 'success',
    icon: Zap,
    color: '#C6FF2E',
    bg: '#1C2B18',
    border: '#2A4A1A',
    title: 'Stride Cadence Optimizing',
    body: 'Cadence has naturally increased from 168 to 174 spm over 12 weeks without deliberate focus. This is reducing ground contact time and improving running economy.',
    confidence: 78,
  },
]

const recommendations = [
  {
    priority: 'high',
    label: 'This Week',
    title: 'Hold mileage at ~57 km',
    detail: 'Allow last week\'s adaptation spike to consolidate. Focus on quality over quantity.',
    done: false,
  },
  {
    priority: 'high',
    label: 'Next 2 Weeks',
    title: 'Add one strides session',
    detail: 'Include 6×20s strides after an easy run twice per week to sharpen leg turnover.',
    done: false,
  },
  {
    priority: 'medium',
    label: 'This Week',
    title: 'Prioritize sleep before Saturday long run',
    detail: 'HRV data shows best performance follows 7.5+ hrs sleep. Aim to be in bed by 10 PM Friday.',
    done: false,
  },
  {
    priority: 'medium',
    label: 'Ongoing',
    title: 'Continue zone 2 emphasis',
    detail: 'Keep 75%+ of weekly volume at easy/zone 2 pace. Your aerobic system is responding well.',
    done: true,
  },
  {
    priority: 'low',
    label: 'In 3 Weeks',
    title: 'Schedule a 10K time trial or race',
    detail: 'Current fitness suggests a PR is within reach. A flat course on a cool morning would be ideal.',
    done: false,
  },
]

const recentActivity = [
  { action: 'Analyzed 3 new workouts',      time: '2h ago',    icon: Brain },
  { action: 'Updated race predictions',      time: '2h ago',    icon: Target },
  { action: 'Detected mileage spike pattern', time: '1 day ago', icon: AlertCircle },
  { action: 'Generated weekly summary',      time: '1 day ago', icon: Zap },
]

const priorityColor = { high: '#FF7A1A', medium: '#FFB020', low: '#6F7A88' }

export default function InsightsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
            AI Insights
          </h2>
          <p className="text-sm text-[#6F7A88] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Pattern analysis and personalized recommendations
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C2B18] border border-[#2A4A1A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF2E] animate-pulse" />
          <span className="text-xs font-medium text-[#C6FF2E]">AI Active</span>
        </div>
      </div>

      {/* Weekly AI Analysis */}
      <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-1">Weekly AI Analysis</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6F7A88]">{weeklyAnalysis.generatedAt}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C2B18] border border-[#2A4A1A] text-[#C6FF2E] font-semibold">
                {weeklyAnalysis.confidence}% confidence
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {weeklyAnalysis.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#11161D] border border-[#1E2530] text-[#A8B0BD]">{t}</span>
            ))}
          </div>
        </div>
        <p className="text-sm text-[#A8B0BD] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          {weeklyAnalysis.summary}
        </p>
      </div>

      {/* Race predictions + recent activity */}
      <div className="grid grid-cols-[1fr_280px] gap-4">
        {/* Race predictions */}
        <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-4">AI Race Predictions</div>
          <div className="grid grid-cols-4 gap-4">
            {racePredictions.map(p => (
              <div key={p.distance} className="text-center p-4 rounded-xl bg-[#11161D] border border-[#1E2530]">
                <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-2">{p.distance}</div>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em', color: p.color }}>
                  {p.time}
                </div>
                <div className="text-xs font-semibold text-[#C6FF2E] mt-1.5">↑ {p.change}</div>
                <div className="mt-2 text-[10px] text-[#6F7A88]">{p.confidence}% conf.</div>
                <div className="mt-1.5 h-1 rounded-full bg-[#1E2530]">
                  <div className="h-full rounded-full" style={{ width: `${p.confidence}%`, backgroundColor: p.color, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI activity */}
        <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-4">Recent AI Activity</div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#11161D] border border-[#1E2530] flex items-center justify-center shrink-0">
                  <a.icon size={13} className="text-[#A8B0BD]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#F5F7FA]" style={{ fontFamily: "'Inter', sans-serif" }}>{a.action}</div>
                  <div className="text-[10px] text-[#6F7A88] mt-0.5 flex items-center gap-1">
                    <Clock size={9} />{a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detected patterns */}
      <div>
        <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-3">Detected Patterns</div>
        <div className="grid grid-cols-2 gap-3">
          {patterns.map(p => (
            <div key={p.title} className="bg-[#151B23] border border-[#1E2530] rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: p.bg, border: `1px solid ${p.border}` }}>
                  <p.icon size={16} style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold mb-1" style={{ color: p.color, fontFamily: "'Space Grotesk', sans-serif" }}>{p.title}</div>
                  <p className="text-xs text-[#A8B0BD] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{p.body}</p>
                  <div className="mt-2 text-[10px] font-medium" style={{ color: p.color }}>Confidence: {p.confidence}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5">
        <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-4">Recommendations</div>
        <div className="space-y-2">
          {recommendations.map((r, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-3.5 rounded-lg border transition-colors"
              style={{ backgroundColor: r.done ? 'transparent' : '#11161D', borderColor: r.done ? '#1E2530' : '#1E2530', opacity: r.done ? 0.5 : 1 }}
            >
              <div className="mt-0.5 shrink-0">
                {r.done
                  ? <CheckCircle size={16} className="text-[#C6FF2E]" />
                  : <div className="w-4 h-4 rounded-full border-2 border-[#1E2530]" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ color: priorityColor[r.priority], backgroundColor: '#11161D' }}
                  >
                    {r.priority}
                  </span>
                  <span className="text-[10px] text-[#6F7A88]">{r.label}</span>
                </div>
                <div className="text-sm font-semibold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.title}</div>
                <p className="text-xs text-[#6F7A88] mt-0.5 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{r.detail}</p>
              </div>
              <ChevronRight size={14} className="text-[#6F7A88] shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
