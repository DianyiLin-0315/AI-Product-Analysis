import { auth } from '@clerk/nextjs/server'
import { writeDimensionData, readProductMeta, writeProductMeta } from '@/lib/products'
import { makeInitialDimensions } from '@/lib/dimensions'
import { DimensionData } from '@/lib/types'

export async function POST(req: Request) {
  await auth.protect()

  const { slug, dimensionId, data } = await req.json() as {
    slug: string
    dimensionId: string
    data: DimensionData
  }

  await writeDimensionData(slug, dimensionId, data)

  // Sync dimension status to meta.json
  const meta = await readProductMeta(slug)
  meta.dimensions = meta.dimensions.map(d =>
    d.id === dimensionId ? { ...d, status: 'complete' } : d
  )
  await writeProductMeta(meta)

  return Response.json({ ok: true })
}

export async function PUT(req: Request) {
  await auth.protect()

  const { slug, name, category, logo } = await req.json() as {
    slug: string
    name: string
    category: string
    logo?: string
  }

  await writeProductMeta({
    slug,
    name,
    category,
    logo: logo ?? '📦',
    key_stats: {},
    created_at: new Date().toISOString(),
    dimensions: makeInitialDimensions(),
  })

  return Response.json({ ok: true })
}
