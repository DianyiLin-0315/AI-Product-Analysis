'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { extractSegments, extractDistribution, extractScalarStat, CHART_COLORS } from './utils'

interface Props { data: Record<string, unknown> }

export function SegmentModule({ data }: Props) {
  const segments  = extractSegments(data)
  const distrib   = extractDistribution(data)
  const statistic = extractScalarStat(data)

  if (!segments) return <FallbackText>暂无用户群体占比数据</FallbackText>

  const maxDist = distrib ? Math.max(...distrib.map(d => d.value), 1) : 1

  return (
    <div>
      {/* Donut chart + center stat */}
      <div style={{ position: 'relative', width: '100%', height: '140px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {segments.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay */}
        {statistic && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {statistic.value}
            </p>
            <p style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {statistic.label}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px', height: '8px',
              borderRadius: '2px',
              background: CHART_COLORS[i % CHART_COLORS.length],
              flexShrink: 0,
            }} />
            <span style={{ flex: 1, fontSize: '11px', color: 'var(--text-secondary)' }}>
              {seg.name}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-primary)', flexShrink: 0 }}>
              {seg.value}%
            </span>
          </div>
        ))}
      </div>

      {/* Geographic / channel distribution */}
      {distrib && distrib.length > 0 && (
        <>
          <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0 10px' }} />
          <p style={{
            fontSize: '10px', fontWeight: '500', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px',
          }}>
            分布
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {distrib.slice(0, 5).map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.value}%</span>
                </div>
                <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%',
                    width: `${(item.value / maxDist) * 100}%`,
                    background: 'rgba(94,92,230,0.7)',
                    borderRadius: '2px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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
