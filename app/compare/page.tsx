import { readProductMeta, readDimensionData } from '@/lib/products'
import { CompareView } from '@/components/public/CompareView'
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
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <a href="/" style={{ fontSize: '12px', color: '#ADADBC' }}>← 产品库</a>
          <h1 style={{ fontSize: '15px', fontWeight: '600', color: '#1C1C28' }}>产品对比</h1>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          border: '1px dashed #E4E4E8',
          borderRadius: '10px',
        }}>
          <p style={{ fontSize: '13px', color: '#ADADBC', marginBottom: '12px' }}>
            请从产品库选择 2–4 个产品进行对比
          </p>
          <a href="/" style={{ fontSize: '12px', color: '#5E5CE6' }}>← 返回产品库</a>
        </div>
      </main>
    )
  }

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      let meta: ProductMeta
      try { meta = await readProductMeta(slug) } catch { return null }
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

  const valid = entries.filter(
    (e): e is { meta: ProductMeta; dimensions: DimensionData[] } => e !== null
  )

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <a href="/" style={{ fontSize: '12px', color: '#ADADBC' }}>← 产品库</a>
        <h1 style={{ fontSize: '15px', fontWeight: '600', color: '#1C1C28' }}>产品对比</h1>
      </div>

      {valid.length >= 2 ? (
        <CompareView entries={valid} />
      ) : (
        <p style={{ fontSize: '12px', color: '#ADADBC' }}>
          部分产品不存在或无法加载，请返回重新选择。
        </p>
      )}
    </main>
  )
}
