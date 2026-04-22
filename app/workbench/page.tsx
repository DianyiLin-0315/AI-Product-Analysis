import { listProducts } from '@/lib/products'
import Link from 'next/link'

export default async function WorkbenchHomePage() {
  const products = await listProducts()

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)' }}>我的产品</h1>
        <Link
          href="/workbench/new"
          style={{
            fontSize: '12px',
            fontWeight: '500',
            padding: '5px 12px',
            borderRadius: '5px',
            background: 'var(--accent)',
            color: '#fff',
          }}
        >
          + 新增产品
        </Link>
      </div>

      {products.length === 0 ? (
        <div style={{
          border: '1px dashed var(--border)',
          borderRadius: '8px',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            还没有产品
          </p>
          <Link
            href="/workbench/new"
            style={{
              fontSize: '12px',
              color: 'var(--accent)',
            }}
          >
            开始第一个分析 →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {products.map(p => {
            const completed = p.dimensions.filter(d => d.status === 'complete').length
            const total = p.dimensions.length
            return (
              <Link
                key={p.slug}
                href={`/workbench/${p.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'border-color 0.1s',
                }}
              >
                <span style={{ fontSize: '18px' }}>{p.logo ?? '📦'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '1px' }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.category}</p>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: completed === total ? '#4ade80' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {completed}/{total} 维度
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
