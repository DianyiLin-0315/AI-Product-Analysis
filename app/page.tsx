import { listProducts } from '@/lib/products'
import { CategoryGroup } from '@/components/public/CategoryGroup'
import Link from 'next/link'

export const revalidate = 60

export default async function LibraryPage() {
  const products = await listProducts()

  const groups = products.reduce<Record<string, typeof products>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">AI 产品分析库</h1>
      {Object.keys(groups).length === 0 ? (
        <p className="text-gray-400">
          还没有分析过的产品。
          <Link href="/workbench" className="text-blue-400 underline ml-1">前往工作台</Link>
          开始第一个。
        </p>
      ) : (
        Object.entries(groups).map(([cat, prods]) => (
          <CategoryGroup key={cat} category={cat} products={prods} />
        ))
      )}
    </main>
  )
}
