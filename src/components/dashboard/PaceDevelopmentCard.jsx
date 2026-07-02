'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine
} from 'recharts'
import { Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDashboardData } from '../../providers/DashboardDataProvider'

const fmtPace = (v) => {
  if (v == null) return ''
  const mins = Math.floor(v)
  const secs = String(Math.round((v - mins) * 60)).padStart(2, '0')
  return `${mins}:${secs}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-[var(--text-muted)] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.stroke }}>{p.name}: {fmtPace(p.value)}</p>
      ))}
    </div>
  )
}

export default function PaceDevelopmentCard() {
  const { dashboardData } = useDashboardData()
  const allData = dashboardData.paceDevelopment.ranges
  const [range, setRange] = useState('6 Months')
  const rangeOptions = Object.keys(allData)
  const activeRange = rangeOptions.includes(range) ? range : rangeOptions[0]
  const data = allData[activeRange] || []
  const chartContainerRef = useRef(null)
  const [chartSize, setChartSize] = useState({ width: 0, height: 176 })

  useEffect(() => {
    const el = chartContainerRef.current
    if (!el) return undefined

    const updateSizeState = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setChartSize({ width: Math.floor(width), height: Math.floor(height) })
      }
    }

    updateSizeState()
    const observer = new ResizeObserver(updateSizeState)
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Pace Development</span>
          <Info size={13} className="text-[var(--text-muted)]" />
        </div>
        <select
          value={activeRange}
          onChange={e => setRange(e.target.value)}
          className="bg-[var(--border-color)] border border-[var(--border-strong)] text-[var(--text-secondary)] text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
        >
          {rangeOptions.map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      <div ref={chartContainerRef} className="h-44 min-h-[176px] min-w-0 flex-1">
        {chartSize.width > 0 ? (
          <LineChart width={chartSize.width} height={chartSize.height} data={data} margin={{ top: 5, right: 5, bottom: 0, left: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[3.8, 6.5]}
              tickFormatter={fmtPace}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={dashboardData.paceDevelopment.todayLabel}
              stroke="var(--chart-grid)" strokeDasharray="4 4"
              label={{ value: 'Today', fill: 'var(--text-muted)', fontSize: 10, dy: -6 }}
            />
            <Line name="Easy Pace"      type="monotone" dataKey="easy"      stroke="var(--accent-lime)" strokeWidth={2} dot={false} />
            <Line name="Threshold Pace" type="monotone" dataKey="threshold" stroke="var(--accent-orange)" strokeWidth={2} dot={false} />
            <Line name="Race Pace"      type="monotone" dataKey="race"      stroke="var(--accent-cyan)" strokeWidth={2} dot={false} />
          </LineChart>
        ) : null}
      </div>

      <div className="flex items-center gap-5 mt-3 text-xs text-[var(--text-muted)]">
        {[['var(--accent-lime)','Easy Pace'],['var(--accent-orange)','Threshold Pace'],['var(--accent-cyan)','Race Pace']].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded" style={{ backgroundColor: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
