'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { Info } from 'lucide-react'
import { useState } from 'react'

const allData = {
  '6 Months': [
    { month: 'Feb', easy: 5.9,  threshold: 5.1,  race: 4.7  },
    { month: 'Mar', easy: 5.7,  threshold: 5.0,  race: 4.6  },
    { month: 'Apr', easy: 5.5,  threshold: 4.9,  race: 4.5  },
    { month: 'May', easy: 5.3,  threshold: 4.85, race: 4.4  },
    { month: 'Jun', easy: 5.2,  threshold: 4.8,  race: 4.28 },
    { month: 'Jul', easy: 5.15, threshold: 4.75, race: 4.2  },
    { month: 'Aug', easy: 5.1,  threshold: 4.7,  race: 4.1  },
    { month: 'Sep', easy: 5.0,  threshold: 4.6,  race: 4.0  },
  ],
  '3 Months': [
    { month: 'Apr', easy: 5.5,  threshold: 4.9,  race: 4.5  },
    { month: 'May', easy: 5.3,  threshold: 4.85, race: 4.4  },
    { month: 'Jun', easy: 5.2,  threshold: 4.8,  race: 4.28 },
  ],
  '12 Months': [
    { month: 'Oct', easy: 6.2,  threshold: 5.4,  race: 5.0  },
    { month: 'Nov', easy: 6.0,  threshold: 5.3,  race: 4.9  },
    { month: 'Dec', easy: 5.8,  threshold: 5.2,  race: 4.8  },
    { month: 'Jan', easy: 5.7,  threshold: 5.15, race: 4.75 },
    { month: 'Feb', easy: 5.9,  threshold: 5.1,  race: 4.7  },
    { month: 'Mar', easy: 5.7,  threshold: 5.0,  race: 4.6  },
    { month: 'Apr', easy: 5.5,  threshold: 4.9,  race: 4.5  },
    { month: 'May', easy: 5.3,  threshold: 4.85, race: 4.4  },
    { month: 'Jun', easy: 5.2,  threshold: 4.8,  race: 4.28 },
    { month: 'Jul', easy: 5.15, threshold: 4.75, race: 4.2  },
    { month: 'Aug', easy: 5.1,  threshold: 4.7,  race: 4.1  },
    { month: 'Sep', easy: 5.0,  threshold: 4.6,  race: 4.0  },
  ],
}

const fmtPace = (v) => {
  if (v == null) return ''
  const mins = Math.floor(v)
  const secs = String(Math.round((v - mins) * 60)).padStart(2, '0')
  return `${mins}:${secs}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#151B23] border border-[#1E2530] rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-[#6F7A88] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.stroke }}>{p.name}: {fmtPace(p.value)}</p>
      ))}
    </div>
  )
}

export default function PaceDevelopmentCard() {
  const [range, setRange] = useState('6 Months')
  const data = allData[range]

  return (
    <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest">Pace Development</span>
          <Info size={13} className="text-[#6F7A88]" />
        </div>
        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          className="bg-[#1E2530] border border-[#2A3040] text-[#A8B0BD] text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
        >
          {Object.keys(allData).map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      <div className="h-44 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6F7A88', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[3.8, 6.5]}
              tickFormatter={fmtPace}
              tick={{ fill: '#6F7A88', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x="Jun"
              stroke="#3A4A5A" strokeDasharray="4 4"
              label={{ value: 'Today', fill: '#6F7A88', fontSize: 10, dy: -6 }}
            />
            <Line name="Easy Pace"      type="monotone" dataKey="easy"      stroke="#C6FF2E" strokeWidth={2} dot={false} />
            <Line name="Threshold Pace" type="monotone" dataKey="threshold" stroke="#FF7A1A" strokeWidth={2} dot={false} />
            <Line name="Race Pace"      type="monotone" dataKey="race"      stroke="#33D6FF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 mt-3 text-xs text-[#6F7A88]">
        {[['#C6FF2E','Easy Pace'],['#FF7A1A','Threshold Pace'],['#33D6FF','Race Pace']].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded" style={{ backgroundColor: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
