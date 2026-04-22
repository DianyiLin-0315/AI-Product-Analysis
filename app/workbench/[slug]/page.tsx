import { notFound } from 'next/navigation'
import { readProductMeta, readDimensionData } from '@/lib/products'
import { readSources } from '@/lib/sources'
import { WorkbenchClient } from './WorkbenchClient'
import { DimensionData } from '@/lib/types'

export default async function WorkbenchProductPage({
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

  // Pre-load all completed dimension data so the preview pane is populated on mount
  const initialPreviewMap: Record<string, DimensionData> = {}
  await Promise.all(
    meta.dimensions
      .filter(d => d.status === 'complete')
      .map(async d => {
        try {
          initialPreviewMap[d.id] = await readDimensionData(slug, d.id)
        } catch { /* dimension file missing — skip */ }
      })
  )

  const initialSources = await readSources(slug)

  return (
    <WorkbenchClient
      initialMeta={meta}
      initialPreviewMap={initialPreviewMap}
      initialSources={initialSources}
    />
  )
}
