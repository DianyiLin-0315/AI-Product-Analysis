import { ProductMeta } from '@/lib/types'

export function ProductHero({ product }: { product: ProductMeta }) {
  return (
    <div className="rounded-xl p-6 mb-8"
      style={{ background: 'linear-gradient(135deg, rgba(240,136,62,0.1), rgba(210,168,255,0.1))' }}>
      <div className="flex items-center gap-4">
        <span className="text-4xl" aria-hidden="true">{product.logo ?? '📦'}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          <p className="text-gray-400">{product.category}</p>
          {product.key_stats && Object.keys(product.key_stats).length > 0 && (
            <div className="flex gap-4 mt-2 flex-wrap">
              {Object.entries(product.key_stats).map(([k, v]) => (
                <span key={k} className="text-sm text-gray-300">
                  <span className="text-gray-500">{k}：</span>{v}
                </span>
              ))}
            </div>
          )}
        </div>
        <a href={`/compare?products=${product.slug}`}
          className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 whitespace-nowrap">
          对比分析 →
        </a>
      </div>
    </div>
  )
}
