import { ProductMeta } from '@/lib/types'
import { ProductCard } from './ProductCard'

interface Props {
  category: string
  products: ProductMeta[]
}

export function CategoryGroup({ category, products }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {category}
      </h2>
      <div className="flex flex-col gap-2">
        {products.map(p => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  )
}
