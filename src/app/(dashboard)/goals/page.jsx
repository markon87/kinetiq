import { Flag, CheckCircle, Clock, TrendingUp, Calendar, Target, Plus, ChevronRight } from 'lucide-react'

const activeGoals = [
  {
    id: 1,
    category: 'Race',
    title: 'Sub-45:00 10K',
    detail: 'City 10K Race · July 12, 2026',
    progress: 74,
    current: '45:10',
    target: '44:59',
    unit: '',
    daysLeft: 52,
    color: '#C6FF2E',
    bg: '#1C2B18',
    border: '#2A4A1A',
    status: 'On track',
    statusColor: '#C6FF2E',
    milestones: [
      { label: 'Sub-47:00',  done: true },
      { label: 'Sub-46:00',  done: true },
      { label: 'Sub-45:30',  done: false },
      { label: 'Sub-45:00',  done: false },
    ],
  },
  {
    id: 2,
    category: 'Volume',
    title: '65 km / week',
    detail: 'Sustained weekly mileage · End of Q3',
    progress: 88,
    current: '57 km',
    target: '65 km',
    unit: 'avg/wk',
    daysLeft: 103,
    color: '#33D6FF',
    bg: '#081828',
    border: '#0A2A40',
    status: 'On track',
    statusColor: '#33D6FF',
    milestones: [
      { label: '50 km/wk',   done: true },
      { label: '55 km/wk',   done: true },
      { label: '60 km/wk',   done: false },
      { label: '65 km/wk',   done: false },
    ],
  },
  {
    id: 3,
    category: 'Race',
    title: 'Sub-1:40 Half Marathon',
    detail: 'Autumn Half · October 4, 2026',
    progress: 58,
    current: '1:41:30',
    target: '1:39:59',
    unit: '',
    daysLeft: 136,
    color: '#FF7A1A',
    bg: '#2A1808',
    border: '#4A2A0A',
    status: 'At risk',
    statusColor: '#FF7A1A',
    milestones: [
      { label: 'Sub-1:45',   done: true },
      { label: 'Sub-1:43',   done: false },
      { label: 'Sub-1:41',   done: false },
      { label: 'Sub-1:40',   done: false },
    ],
  },
  {
    id: 4,
    category: 'Annual',
    title: '2,000 km this year',
    detail: 'Annual distance goal · Dec 31, 2026',
    progress: 44,
    current: '876 km',
    target: '2,000 km',
    unit: '',
    daysLeft: 224,
    color: '#C6FF2E',
    bg: '#1C2B18',
    border: '#2A4A1A',
    status: 'Slightly behind',
    statusColor: '#FFB020',
    milestones: [
      { label: '500 km',     done: true },
      { label: '1,000 km',   done: false },
      { label: '1,500 km',   done: false },
      { label: '2,000 km',   done: false },
    ],
  },
]

const completedGoals = [
  { title: 'First Half Marathon',      completedOn: 'Apr 6, 2026',  category: 'Race',   icon: Flag },
  { title: '100 km in a calendar month', completedOn: 'Mar 31, 2026', category: 'Volume', icon: TrendingUp },
  { title: 'Sub-25:00 5K',             completedOn: 'Feb 15, 2026', category: 'Race',   icon: Flag },
  { title: 'Run 3× per week for 12 wks', completedOn: 'Jan 19, 2026', category: 'Habit',  icon: Calendar },
]

const upcomingCheckpoints = [
  { goal: 'Sub-45:00 10K', checkpoint: 'Sub-45:30 time trial', date: 'Jun 7, 2026', daysOut: 17 },
  { goal: '65 km / week',  checkpoint: 'Hit 60 km avg for 2 consecutive weeks', date: 'Jun 28, 2026', daysOut: 38 },
  { goal: '2,000 km year', checkpoint: 'Reach 1,000 km total', date: 'Jul 5, 2026',  daysOut: 45 },
]

const categoryColor = {
  Race: '#C6FF2E',
  Volume: '#33D6FF',
  Annual: '#C6FF2E',
  Habit: '#FF7A1A',
}

export default function GoalsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
            Goals
          </h2>
          <p className="text-sm text-[#6F7A88] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Targets, milestones, and long-term progress
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C6FF2E] text-[#0B0F14] text-sm font-bold hover:bg-[#D4FF5A] transition-colors">
          <Plus size={14} />
          New Goal
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Goals',     value: '4',   sub: '1 at risk' },
          { label: 'Completed (2026)', value: '4',   sub: '↑ 2 vs last year' },
          { label: 'Nearest Deadline', value: '52d', sub: 'City 10K · Jul 12' },
          { label: 'On-Track Rate',    value: '75%',  sub: '3 of 4 goals' },
        ].map(s => (
          <div key={s.label} className="bg-[#151B23] border border-[#1E2530] rounded-xl p-4">
            <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-2xl font-bold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>{s.value}</div>
            <div className="text-xs text-[#6F7A88] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Active goals */}
      <div>
        <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-3">Active Goals</div>
        <div className="grid grid-cols-2 gap-4">
          {activeGoals.map(g => (
            <div key={g.id} className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5">
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: categoryColor[g.category] ?? '#A8B0BD', backgroundColor: '#11161D', border: `1px solid #1E2530` }}
                    >
                      {g.category}
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ color: g.statusColor, backgroundColor: g.bg, border: `1px solid ${g.border}` }}
                    >
                      {g.status}
                    </span>
                  </div>
                  <div className="text-base font-bold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{g.title}</div>
                  <div className="text-xs text-[#6F7A88] mt-0.5 flex items-center gap-1">
                    <Calendar size={10} />{g.detail}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#6F7A88]">
                  <Clock size={11} />{g.daysLeft}d left
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold" style={{ color: g.color }}>{g.progress}%</span>
                  <span className="text-[#6F7A88]">{g.current} → {g.target}</span>
                </div>
                <div className="h-2 rounded-full bg-[#1E2530]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${g.progress}%`, backgroundColor: g.color }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="flex items-center gap-2 flex-wrap mt-3">
                {g.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    {m.done
                      ? <CheckCircle size={12} className="shrink-0" style={{ color: g.color }} />
                      : <div className="w-3 h-3 rounded-full border-2 border-[#1E2530] shrink-0" />
                    }
                    <span className="text-[10px]" style={{ color: m.done ? g.color : '#6F7A88' }}>{m.label}</span>
                    {i < g.milestones.length - 1 && <ChevronRight size={10} className="text-[#1E2530]" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming checkpoints + completed */}
      <div className="grid grid-cols-[1fr_340px] gap-4">
        {/* Upcoming checkpoints */}
        <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-4">Upcoming Checkpoints</div>
          <div className="space-y-3">
            {upcomingCheckpoints.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3.5 rounded-lg bg-[#11161D] border border-[#1E2530]">
                <div className="w-10 h-10 rounded-xl bg-[#151B23] border border-[#1E2530] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#C6FF2E]">{c.daysOut}d</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{c.checkpoint}</div>
                  <div className="text-[10px] text-[#6F7A88] mt-0.5">{c.goal} · {c.date}</div>
                </div>
                <Target size={13} className="text-[#6F7A88] shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Completed goals */}
        <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest mb-4">Completed in 2026</div>
          <div className="space-y-3">
            {completedGoals.map((g, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#11161D] border border-[#1E2530]">
                <div className="w-8 h-8 rounded-full bg-[#1C2B18] border border-[#2A4A1A] flex items-center justify-center shrink-0">
                  <g.icon size={14} className="text-[#C6FF2E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#F5F7FA]">{g.title}</div>
                  <div className="text-[10px] text-[#6F7A88] mt-0.5 flex items-center gap-1">
                    <span
                      className="font-semibold"
                      style={{ color: categoryColor[g.category] ?? '#A8B0BD' }}
                    >
                      {g.category}
                    </span>
                    · {g.completedOn}
                  </div>
                </div>
                <CheckCircle size={14} className="text-[#C6FF2E] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
