import { notFound } from 'next/navigation'
import { readProductMeta } from '@/lib/products'

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

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <aside className="w-52 border-r border-gray-800 overflow-y-auto">
        <p className="p-4 text-sm text-gray-400">
          {meta.name} — 维度列表（Task 9 接入）
        </p>
      </aside>
      <main className="flex-1 overflow-y-auto p-4">
        <p className="text-gray-400">对话区（Task 9 接入）</p>
      </main>
      <aside className="w-72 border-l border-gray-800 overflow-y-auto p-4">
        <p className="text-sm text-gray-400">模块预览（Task 10 接入）</p>
      </aside>
    </div>
  )
}
