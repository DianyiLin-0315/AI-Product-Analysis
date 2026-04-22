import { readProductMeta, readDimensionData } from '@/lib/products'
import { ComparisonCard } from '@/components/public/ComparisonCard'
import { DimensionData, ProductMeta } from '@/lib/types'

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ products?: string }>
}) {
  const { products: productsParam } = await searchParams
  const slugs = (productsParam ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 4)

  if (slugs.length < 2) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-4">产品对比</h1>
        <p className="text-gray-400">请从产品库选择 2-4 个产品进行对比。</p>
      </main>
    )
  }

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      let meta: ProductMeta
      try {
        meta = await readProductMeta(slug)
      } catch {
        return null
      }
      const completedDims = meta.dimensions.filter(d => d.status === 'complete')
      const dimData: DimensionData[] = (
        await Promise.all(
          completedDims.map(async d => {
            try { return await readDimensionData(slug, d.id) } catch { return null }
          })
        )
      ).filter((d): d is DimensionData => d !== null)
      return { meta, dimensions: dimData }
    })
  )

  const valid = entries.filter((e): e is { meta: ProductMeta; dimensions: DimensionData[] } => e !== null)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">产品对比</h1>
      <div className="flex gap-4">
        {valid.map(({ meta, dimensions }) => (
          <ComparisonCard key={meta.slug} product={meta} dimensions={dimensions} />
        ))}
      </div>
      {valid.length < 2 && (
        <p className="text-gray-400 mt-4">部分产品不存在或无法加载，请返回重新选择。</p>
      )}
    </main>
  )
}
