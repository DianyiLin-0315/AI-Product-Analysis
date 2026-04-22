import { ProductMeta } from '@/lib/types'

export function ProductHero({ product }: { product: ProductMeta }) {
  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      paddingBottom: '24px',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <span style={{ fontSize: '36px', lineHeight: 1 }}>{product.logo ?? '📦'}</span>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {product.category}
          </p>
          {product.key_stats && Object.keys(product.key_stats).length > 0 && (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {Object.entries(product.key_stats).map(([k, v]) => (
                <div key={k} style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '5px',
                  padding: '4px 10px',
                }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>{k}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <a
          href={`/compare?products=${product.slug}`}
          style={{
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '5px',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            flexShrink: 0,
          }}
        >
          对比分析
        </a>
      </div>
    </div>
  )
}
