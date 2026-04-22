import { notFound } from 'next/navigation'
import { readProductMeta, readDimensionData } from '@/lib/products'
import { ProductHero } from '@/components/public/ProductHero'
import { DimensionModule } from '@/components/public/DimensionModule'
import { DimensionData } from '@/lib/types'

export const revalidate = 60

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let meta
  try {
    meta = await readProductMeta(slug)
  } catch {
    notFound()
  }

  const completedDimensions = meta.dimensions.filter(d => d.status === 'complete')
  const dimensionData: DimensionData[] = (
    await Promise.all(
      completedDimensions.map(async d => {
        try { return await readDimensionData(slug, d.id) } catch { return null }
      })
    )
  ).filter((d): d is DimensionData => d !== null)

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
      <ProductHero product={meta} />
      {dimensionData.map(d => <DimensionModule key={d.dimension_id} data={d} />)}
      {dimensionData.length === 0 && (
        <p style={{ fontSize: '13px', color: '#ADADBC' }}>该产品还没有完成任何维度的分析。</p>
      )}
    </main>
  )
}
