import { ProductMeta } from '@/lib/types'

export function ProductHero({ product }: { product: ProductMeta }) {
  return (
    <div style={{
      borderBottom: '1px solid #E4E4E8',
      paddingBottom: '28px',
      marginBottom: '28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        {/* Logo */}
        <span style={{ fontSize: '48px', lineHeight: 1, flexShrink: 0 }}>
          {product.logo ?? '📦'}
        </span>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1C1C28',
            marginBottom: '6px',
            lineHeight: 1.2,
          }}>
            {product.name}
          </h1>

          {/* Category pill */}
          <span style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '500',
            color: '#5E5CE6',
            background: '#EEEEF8',
            borderRadius: '4px',
            padding: '2px 8px',
            marginBottom: '16px',
          }}>
            {product.category}
          </span>

          {/* Key stats */}
          {product.key_stats && Object.keys(product.key_stats).length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(product.key_stats).map(([k, v]) => (
                <div key={k} style={{
                  background: '#F7F7F8',
                  border: '1px solid #E4E4E8',
                  borderRadius: '6px',
                  padding: '6px 12px',
                }}>
                  <span style={{ fontSize: '10px', color: '#ADADBC', display: 'block', marginBottom: '2px' }}>{k}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#1C1C28' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compare button */}
        <a
          href={`/compare?products=${product.slug}`}
          style={{
            fontSize: '12px',
            padding: '7px 14px',
            borderRadius: '6px',
            border: '1px solid #E4E4E8',
            color: '#6B6B7B',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          对比分析
        </a>
      </div>
    </div>
  )
}
