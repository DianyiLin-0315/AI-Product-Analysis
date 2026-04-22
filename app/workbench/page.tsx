import { listProducts } from '@/lib/products'
import Link from 'next/link'

export default async function WorkbenchHomePage() {
  const products = await listProducts()
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">我的产品</h1>
        <Link
          href="/workbench/new"
          className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-sm text-white"
        >
          + 新增产品
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-400">还没有产品。点击「新增产品」开始分析。</p>
      ) : (
        <div className="space-y-2">
          {products.map(p => (
            <Link
              key={p.slug}
              href={`/workbench/${p.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl" aria-hidden="true">{p.logo ?? '📦'}</span>
              <div>
                <p className="font-medium text-white">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
