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
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Sticky column header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#F7F7F8',
        borderBottom: '1px solid #E4E4E8',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>{product.logo ?? '📦'}</span>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1C1C28',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {product.name}
          </p>
          <p style={{ fontSize: '11px', color: '#ADADBC' }}>{product.category}</p>
        </div>
      </div>

      {/* Dimension rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {shown.map((d, i) => (
          <div
            key={d.dimension_id}
            style={{
              padding: '14px 16px',
              borderBottom: i < shown.length - 1 ? '1px solid #E4E4E8' : 'none',
            }}
          >
            <p style={{
              fontSize: '10px',
              fontWeight: '500',
              color: '#5E5CE6',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}>
              {d.dimension_label}
            </p>
            <p style={{ fontSize: '12px', color: '#6B6B7B', lineHeight: '1.65' }}>
              {d.conversation_summary}
            </p>
          </div>
        ))}
        {shown.length === 0 && (
          <p style={{ fontSize: '12px', color: '#ADADBC', padding: '16px' }}>暂无可对比的维度</p>
        )}
      </div>
    </div>
  )
}
