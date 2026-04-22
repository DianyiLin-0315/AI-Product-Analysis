import { DimensionData } from '@/lib/types'

function renderValue(v: unknown): React.ReactNode {
  if (Array.isArray(v)) {
    if (v.length === 0) return <span style={{ color: 'var(--text-muted)' }}>—</span>
    if (typeof v[0] === 'object' && v[0] !== null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          {v.map((item, i) => (
            <div key={i} style={{
              background: 'var(--surface-3)',
              borderRadius: '5px',
              padding: '8px 10px',
            }}>
              {Object.entries(item as Record<string, unknown>).map(([ik, iv]) => (
                <div key={ik} style={{ fontSize: '12px', lineHeight: '1.6' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{ik}：</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {Array.isArray(iv) ? (iv as unknown[]).map(String).join('、') : String(iv)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    }
    return <span>{(v as unknown[]).map(String).join('、')}</span>
  }
  if (typeof v === 'object' && v !== null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
        {Object.entries(v as Record<string, unknown>).map(([ik, iv]) => (
          <div key={ik} style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <span style={{ color: 'var(--text-muted)' }}>{ik}：</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {Array.isArray(iv) ? (iv as unknown[]).map(String).join('、') : String(iv)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return <span>{String(v)}</span>
}

export function DimensionModule({ data }: { data: DimensionData }) {
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '12px',
    }}>
      {/* Card header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent)',
          flexShrink: 0,
        }} />
        <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent)' }}>
          {data.dimension_label}
        </h3>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px' }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.65',
          marginBottom: '12px',
        }}>
          {data.conversation_summary}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {Object.entries(data.structured_data).map(([k, v]) => (
            <div key={k} style={{
              background: 'var(--surface-3)',
              borderRadius: '5px',
              padding: '8px 10px',
            }}>
              <p style={{
                fontSize: '10px',
                color: 'var(--accent)',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {k}
              </p>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {renderValue(v)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
