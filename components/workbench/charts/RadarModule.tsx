'use client'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { extractScores } from './utils'

interface Props { data: Record<string, unknown> }

export function RadarModule({ data }: Props) {
  const scores = extractScores(data)
  if (!scores || scores.length < 3) return <FallbackText>暂无评分数据</FallbackText>

  const radarData = scores.map(s => ({ axis: s.name, value: s.value }))
  const avg = (scores.reduce((s, i) => s + i.value, 0) / scores.length).toFixed(1)
  const maxVal = Math.max(...scores.map(s => s.value))
  const domainMax = maxVal <= 10 ? 10 : 100

  return (
    <div>
      {/* Radar */}
      <div style={{ width: '100%', height: '180px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 12, right: 24, bottom: 12, left: 24 }}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'inherit' }}
            />
            <Radar
              dataKey="value"
              fill="rgba(94,92,230,0.18)"
              stroke="#5E5CE6"
              strokeWidth={1.5}
              dot={{ fill: '#5E5CE6', r: 3, strokeWidth: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Score table */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0 10px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <p style={{ fontSize: '10px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          评分明细
        </p>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>平均分</span>
          <span style={{ fontSize: '10px', fontWeight: '500', color: 'var(--text-primary)' }}>
            {avg} / {domainMax}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {scores.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '64px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.name}
            </span>
            <div style={{ flex: 1, height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
              <div style={{
                height: '100%',
                width: `${(s.value / domainMax) * 100}%`,
                background: 'rgba(94,92,230,0.65)',
                borderRadius: '2px',
              }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-primary)', width: '16px', textAlign: 'right', flexShrink: 0 }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FallbackText({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
      {children}
    </p>
  )
}
