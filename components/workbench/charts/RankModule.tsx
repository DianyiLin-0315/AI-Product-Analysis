'use client'
import { extractRankedItems } from './utils'

interface Props { data: Record<string, unknown> }

export function RankModule({ data }: Props) {
  const items = extractRankedItems(data)
  if (!items || items.length === 0) return <FallbackText>暂无排名数据</FallbackText>

  const maxVal = Math.max(...items.map(i => i.value), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.slice(0, 8).map((item, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'baseline' }}>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginRight: '8px',
            }}>
              {item.label}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-primary)', flexShrink: 0 }}>
              {item.value}
            </span>
          </div>
          <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
            <div style={{
              height: '100%',
              width: `${(item.value / maxVal) * 100}%`,
              background: `rgba(94,92,230,${0.85 - i * 0.08})`,
              borderRadius: '2px',
              minWidth: '6px',
            }} />
          </div>
        </div>
      ))}
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
