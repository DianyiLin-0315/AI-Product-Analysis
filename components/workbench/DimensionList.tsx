'use client'
import { DimensionMeta, DimensionStatus } from '@/lib/types'

interface Props {
  dimensions: DimensionMeta[]
  activeDimensionId: string
  onSelect: (id: string) => void
}

const STATUS_DOT: Record<DimensionStatus, string> = {
  complete: '#4ade80',
  draft: '#f97316',
  pending: '#333333',
}

export function DimensionList({ dimensions, activeDimensionId, onSelect }: Props) {
  return (
    <div style={{ paddingTop: '8px', height: '100%' }}>
      <p style={{
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: '0 12px 6px',
        fontWeight: '500',
      }}>
        分析维度
      </p>

      {dimensions.map(d => {
        const isActive = d.id === activeDimensionId
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '6px 12px',
              fontSize: '13px',
              textAlign: 'left',
              background: isActive ? 'var(--accent-subtle)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
              transition: 'color 0.1s, background 0.1s',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.background = 'var(--surface-2)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: STATUS_DOT[d.status],
              flexShrink: 0,
            }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.label}
            </span>
            {d.isExtended && (
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>扩展</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
