const activities = [
  {
    type: 'Easy Run',
    date: 'Yesterday',
    distance: '10.2 km',
    pace: '5:24 /km',
    hr: '138 bpm',
    emoji: '🏃',
  },
  {
    type: 'Tempo Run',
    date: 'Jun 7, 2024',
    distance: '8.1 km',
    pace: '4:28 /km',
    hr: '152 bpm',
    emoji: '🏃',
  },
]

export default function RecentActivity() {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest">Recent Activity</span>
        <button className="text-xs text-[#A8B0BD] hover:text-[#C6FF2E] transition-colors">View all</button>
      </div>

      <div className="space-y-2">
        {activities.map(a => (
          <div key={a.type + a.date} className="bg-[#151B23] border border-[#1E2530] rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#11161D] border border-[#1E2530] flex items-center justify-center text-base shrink-0">
              {a.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-semibold text-[#F5F7FA]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {a.type}
              </div>
              <div className="text-xs text-[#6F7A88] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                {a.date}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div
                className="text-sm font-bold text-[#F5F7FA]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}
              >
                {a.distance}
              </div>
              <div className="text-xs text-[#A8B0BD] mt-0.5">{a.pace}</div>
            </div>
            <div className="text-right shrink-0 pl-2 border-l border-[#1E2530]">
              <div className="text-xs text-[#6F7A88]">{a.hr}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
