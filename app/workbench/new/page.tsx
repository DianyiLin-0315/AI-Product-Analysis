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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: '500',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
  }

  return (
    <main style={{ maxWidth: '440px', margin: '0 auto', padding: '48px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
          新增产品分析
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          创建后可立即开始逐维度对话分析
        </p>
      </div>

      <form onSubmit={e => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>产品名称</label>
          <input
            required
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="如：Notion、微信、Figma"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>产品类型</label>
          <input
            required
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            placeholder="如：AI 工具、社交平台、SaaS"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>图标（Emoji，可选）</label>
          <input
            value={form.logo}
            onChange={e => setForm(p => ({ ...p, logo: e.target.value }))}
            placeholder="📦"
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '4px',
            padding: '9px 0',
            borderRadius: '6px',
            background: loading ? 'var(--surface-3)' : 'var(--accent)',
            color: loading ? 'var(--text-muted)' : '#fff',
            fontSize: '13px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? '创建中…' : '开始分析'}
        </button>
      </form>
    </main>
  )
}
