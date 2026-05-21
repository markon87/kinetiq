'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { Info } from 'lucide-react'
import { dashboardData } from '../../data/mockData'

const { projected10k } = dashboardData
const data = projected10k.chartData

const fmtPace = (v) => {
  if (v == null) return ''
  const mins = Math.floor(v)
  const secs = String(Math.round((v - mins) * 60)).padStart(2, '0')
  return `${mins}:${secs}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#151B23] border border-[#1E2530] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#6F7A88] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === 'actual' ? 'Actual' : 'Projected'}: {fmtPace(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function ProjectedTimeCard() {
  return (
    <div className="bg-[#151B23] border border-[#1E2530] rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[#6F7A88] uppercase tracking-widest">
            Projected 10K Time
          </span>
          <Info size={13} className="text-[#6F7A88]" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6F7A88]">
          Confidence:
          <span className="text-[#FF7A1A] font-semibold">{projected10k.confidence}</span>
          <div className="flex gap-0.5 ml-1">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1.5 w-5 rounded-full ${i <= 2 ? 'bg-[#FF7A1A]' : 'bg-[#1E2530]'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-end gap-8 mb-5">
        <div>
          <div className="text-xs text-[#6F7A88] mb-1">Current</div>
          <div className="text-4xl font-bold text-[#F5F7FA]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
            {projected10k.current}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#6F7A88] mb-1">Projected (8 weeks)</div>
          <div className="text-4xl font-bold text-[#C6FF2E]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
            {projected10k.projected}
          </div>
        </div>
        <div className="mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C2B18] border border-[#2A4A1A] text-[#C6FF2E] text-xs font-semibold">
            ↑ {projected10k.trend}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 32 }}>
            <defs>
              <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#C6FF2E" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#C6FF2E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#C6FF2E" stopOpacity={0.07} />
                <stop offset="95%" stopColor="#C6FF2E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6F7A88', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[42, 52]}
              tickFormatter={fmtPace}
              tick={{ fill: '#6F7A88', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x="Jun 12"
              stroke="#3A4A5A"
              strokeDasharray="4 4"
              label={{ value: 'Today', fill: '#6F7A88', fontSize: 11, dy: -8 }}
            />
            <Area
              type="monotone" dataKey="actual"
              stroke="#C6FF2E" strokeWidth={2}
              fill="url(#gradActual)" dot={false} connectNulls
            />
            <Area
              type="monotone" dataKey="projected"
              stroke="#C6FF2E" strokeWidth={2} strokeDasharray="5 5"
              fill="url(#gradProjected)" dot={false} connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 text-xs text-[#6F7A88]">
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 h-0.5 bg-[#C6FF2E] rounded" />
          Actual
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 border-t-2 border-dashed border-[#C6FF2E]" />
          Projected
        </span>
      </div>
    </div>
  )
}
