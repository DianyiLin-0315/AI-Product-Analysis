import { ProductMeta } from '@/lib/types'
import { ProductCard } from './ProductCard'

interface Props {
  category: string
  products: ProductMeta[]
}

export function CategoryGroup({ category, products }: Props) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 style={{
        fontSize: '10px',
        fontWeight: '600',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '8px',
      }}>
        {category}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {products.map(p => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  )
}
