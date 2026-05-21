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
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs">
      <p className="text-[var(--text-muted)] mb-1">{label}</p>
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
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
            Projected 10K Time
          </span>
          <Info size={13} className="text-[var(--text-muted)]" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          Confidence:
          <span className="text-[var(--accent-orange)] font-semibold">{projected10k.confidence}</span>
          <div className="flex gap-0.5 ml-1">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1.5 w-5 rounded-full ${i <= 2 ? 'bg-[var(--accent-orange)]' : 'bg-[var(--border-color)]'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-end gap-8 mb-5">
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-1">Current</div>
          <div className="text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
            {projected10k.current}
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-1">Projected (8 weeks)</div>
          <div className="text-4xl font-bold text-[var(--accent-lime)]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
            {projected10k.projected}
          </div>
        </div>
        <div className="mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-lime-tint)] border border-[var(--border-lime-tint)] text-[var(--accent-lime)] text-xs font-semibold">
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
                <stop offset="5%"  stopColor="var(--accent-lime)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--accent-lime)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--accent-lime)" stopOpacity={0.07} />
                <stop offset="95%" stopColor="var(--accent-lime)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[42, 52]}
              tickFormatter={fmtPace}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x="Jun 12"
              stroke="var(--chart-grid)"
              strokeDasharray="4 4"
              label={{ value: 'Today', fill: 'var(--text-muted)', fontSize: 11, dy: -8 }}
            />
            <Area
              type="monotone" dataKey="actual"
              stroke="var(--accent-lime)" strokeWidth={2}
              fill="url(#gradActual)" dot={false} connectNulls
            />
            <Area
              type="monotone" dataKey="projected"
              stroke="var(--accent-lime)" strokeWidth={2} strokeDasharray="5 5"
              fill="url(#gradProjected)" dot={false} connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 h-0.5 bg-[var(--accent-lime)] rounded" />
          Actual
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-5 border-t-2 border-dashed border-[var(--accent-lime)]" />
          Projected
        </span>
      </div>
    </div>
  )
}
