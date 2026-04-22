import { listProducts } from '@/lib/products'
import { CategoryGroup } from '@/components/public/CategoryGroup'

export const revalidate = 60

export default async function LibraryPage() {
  const products = await listProducts()

  const groups = products.reduce<Record<string, typeof products>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            AI 产品分析库
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {products.length > 0 ? `${products.length} 个产品` : '暂无产品'}
          </p>
        </div>
        <a
          href="/workbench"
          style={{
            fontSize: '12px',
            padding: '5px 12px',
            borderRadius: '5px',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: '500',
          }}
        >
          进入工作台
        </a>
      </div>

      {Object.keys(groups).length === 0 ? (
        <div style={{
          border: '1px dashed var(--border)',
          borderRadius: '8px',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            还没有分析过的产品
          </p>
          <a href="/workbench" style={{ fontSize: '12px', color: 'var(--accent)' }}>
            前往工作台开始第一个 →
          </a>
        </div>
      ) : (
        Object.entries(groups).map(([cat, prods]) => (
          <CategoryGroup key={cat} category={cat} products={prods} />
        ))
      )}
    </main>
  )
}
