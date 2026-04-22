'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', category: '', logo: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const slug = form.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    await fetch('/api/dimension', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        name: form.name,
        category: form.category,
        logo: form.logo || '📦',
      }),
    })

    router.push(`/workbench/${slug}`)
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-xl font-bold mb-6">新增产品</h1>
      <form onSubmit={e => void handleSubmit(e)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">产品名称</label>
          <input
            required
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">产品类型</label>
          <input
            required
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            placeholder="如：社交平台、AI 工具、内容平台"
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">图标（Emoji，可选）</label>
          <input
            value={form.logo}
            onChange={e => setForm(p => ({ ...p, logo: e.target.value }))}
            placeholder="📦"
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-green-700 hover:bg-green-600 text-sm text-white disabled:opacity-40 transition-colors"
        >
          {loading ? '创建中…' : '开始分析'}
        </button>
      </form>
    </main>
  )
}
