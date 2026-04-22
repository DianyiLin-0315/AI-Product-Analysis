import { ProductMeta, DimensionData } from '@/lib/types'

interface Props {
  product: ProductMeta
  dimensions: DimensionData[]
  visibleDimensionIds?: string[]
}

export function ComparisonCard({ product, dimensions, visibleDimensionIds }: Props) {
  const shown = visibleDimensionIds
    ? dimensions.filter(d => visibleDimensionIds.includes(d.dimension_id))
    : dimensions

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '20px' }}>{product.logo ?? '📦'}</span>
        <div>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{product.name}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.category}</p>
        </div>
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {shown.map(d => (
          <div key={d.dimension_id}>
            <p style={{
              fontSize: '10px',
              color: 'var(--accent)',
              fontWeight: '600',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {d.dimension_label}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {d.conversation_summary}
            </p>
          </div>
        ))}
        {shown.length === 0 && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>暂无可对比的维度</p>
        )}
      </div>
    </div>
  )
}
