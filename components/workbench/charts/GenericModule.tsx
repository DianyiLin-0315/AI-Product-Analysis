'use client'
import React from 'react'

function renderValue(v: unknown): React.ReactNode {
  if (Array.isArray(v)) {
    if (v.length === 0) return <span style={{ color: 'var(--text-muted)' }}>—</span>
    if (typeof v[0] === 'object' && v[0] !== null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          {(v as Record<string, unknown>[]).map((item, i) => (
            <div key={i} style={{
              background: 'var(--surface-3)',
              borderRadius: '4px',
              padding: '5px 8px',
            }}>
              {Object.entries(item).map(([ik, iv]) => (
                <div key={ik} style={{ fontSize: '11px', lineHeight: '1.5' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
        {Object.entries(v as Record<string, unknown>).map(([ik, iv]) => (
          <div key={ik} style={{ fontSize: '11px', lineHeight: '1.5' }}>
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

export function GenericModule({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data)
  if (entries.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {entries.map(([k, v]) => (
        <div key={k} style={{
          background: 'var(--surface-3)',
          borderRadius: '5px',
          padding: '7px 10px',
        }}>
          <p style={{
            fontSize: '10px',
            color: 'var(--accent)',
            fontWeight: '500',
            marginBottom: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {k.replace(/_/g, ' ')}
          </p>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {renderValue(v)}
          </div>
        </div>
      ))}
    </div>
  )
}
