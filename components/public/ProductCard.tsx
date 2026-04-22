import Link from 'next/link'
import { ProductMeta } from '@/lib/types'

export function ProductCard({ product }: { product: ProductMeta }) {
  const completed = product.dimensions.filter(d => d.status === 'complete').length
  const total = product.dimensions.length
  const allDone = completed === total

  return (
    <Link href={`/products/${product.slug}`}
      className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
      <span className="text-2xl">{product.logo ?? '📦'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{product.name}</p>
        <p className="text-xs text-gray-400">{product.category}</p>
      </div>
      <span className={`text-xs whitespace-nowrap ${allDone ? 'text-green-400' : 'text-orange-400'}`}>
        {allDone ? `${total} 维度 ✓` : `${completed}/${total} 维度`}
      </span>
    </Link>
  )
}
