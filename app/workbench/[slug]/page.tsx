import { notFound } from 'next/navigation'
import { readProductMeta } from '@/lib/products'
import { WorkbenchClient } from './WorkbenchClient'

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
  return <WorkbenchClient initialMeta={meta} />
}
