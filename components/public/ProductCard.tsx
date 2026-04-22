import Link from 'next/link'
import { ProductMeta } from '@/lib/types'

export function ProductCard({ product }: { product: ProductMeta }) {
  const completed = product.dimensions.filter(d => d.status === 'complete').length
  const total = product.dimensions.length

  return (
    <Link
      href={`/products/${product.slug}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '6px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-subtle)',
        transition: 'border-color 0.1s',
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{product.logo ?? '📦'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.category}</p>
      </div>
      <span style={{
        fontSize: '11px',
        color: completed === total && total > 0 ? '#4ade80' : 'var(--text-muted)',
        flexShrink: 0,
      }}>
        {completed === total && total > 0 ? `${total} 维度 ✓` : `${completed}/${total}`}
      </span>
    </Link>
  )
}
