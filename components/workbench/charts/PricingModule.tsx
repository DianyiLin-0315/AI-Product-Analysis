'use client'

interface Tier { name: string; price: string; features?: string[] }

interface Props { data: Record<string, unknown> }

function extractTiers(data: Record<string, unknown>): Tier[] | null {
  const TIER_KEYS = ['tiers', 'plans', 'pricing', 'packages', 'levels', 'options']
  for (const [k, v] of Object.entries(data)) {
    if (!TIER_KEYS.some(t => k.toLowerCase().includes(t))) continue
    if (!Array.isArray(v) || v.length === 0) continue
    const items = v as Record<string, unknown>[]
    if (typeof items[0] !== 'object' || items[0] === null) continue

    const keys = Object.keys(items[0] as object)
    const nameKey  = keys.find(k2 => ['name', 'tier', 'plan', 'level', 'type'].some(n => k2.toLowerCase().includes(n)))
    const priceKey = keys.find(k2 => ['price', 'cost', 'fee', 'amount', 'pricing'].some(n => k2.toLowerCase().includes(n)))

    if (nameKey && priceKey) {
      return items.map(item => {
        const rec = item as Record<string, unknown>
        const featKey = Object.keys(rec).find(k2 => ['feature', 'include', 'benefit', 'perk'].some(n => k2.toLowerCase().includes(n)))
        const feats = featKey
          ? Array.isArray(rec[featKey])
            ? (rec[featKey] as unknown[]).map(String)
            : [String(rec[featKey])]
          : []
        return { name: String(rec[nameKey]), price: String(rec[priceKey]), features: feats }
      })
    }
  }
  return null
}

export function PricingModule({ data }: Props) {
  const tiers = extractTiers(data)

  if (!tiers) {
    // Fallback: show top-level keys as pricing facts
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(data).map(([k, v]) => (
          <div key={k} style={{
            padding: '8px 10px',
            background: 'var(--surface-3)',
            borderRadius: '5px',
          }}>
            <p style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '500', marginBottom: '3px', textTransform: 'uppercase' }}>
              {k.replace(/_/g, ' ')}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {tiers.map((tier, i) => (
        <div key={i} style={{
          background: i === 0 ? 'var(--accent-subtle)' : 'var(--surface-3)',
          border: `1px solid ${i === 0 ? 'rgba(94,92,230,0.2)' : 'var(--border)'}`,
          borderRadius: '6px',
          padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tier.features?.length ? '6px' : 0 }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: i === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
              {tier.name}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>
              {tier.price}
            </span>
          </div>
          {tier.features && tier.features.length > 0 && (
            <ul style={{ margin: 0, padding: '0 0 0 12px' }}>
              {tier.features.slice(0, 4).map((f, j) => (
                <li key={j} style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
