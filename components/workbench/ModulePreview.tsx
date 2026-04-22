'use client'
import React from 'react'
import { DimensionData } from '@/lib/types'

function renderValue(v: unknown): React.ReactNode {
  if (Array.isArray(v)) {
    if (v.length === 0) return <span style={{ color: 'var(--text-muted)' }}>—</span>
    if (typeof v[0] === 'object' && v[0] !== null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          {v.map((item, i) => (
            <div key={i} style={{
              background: 'var(--surface-3)',
              borderRadius: '4px',
              padding: '6px 8px',
              fontSize: '11px',
            }}>
              {Object.entries(item as Record<string, unknown>).map(([ik, iv]) => (
                <div key={ik} style={{ lineHeight: '1.5' }}>
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

export function ModulePreview({ data }: { data: DimensionData | null }) {
  if (!data) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ fontSize: '20px', opacity: 0.3 }}>◻</div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5' }}>
          维度完成后<br />这里显示预览
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        预览
      </p>
      <div style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--accent)' }}>
            {data.dimension_label}
          </span>
        </div>
        <div style={{ padding: '10px 12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '10px' }}>
            {data.conversation_summary}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(data.structured_data).map(([k, v]) => (
              <div key={k} style={{
                background: 'var(--surface-3)',
                borderRadius: '5px',
                padding: '7px 9px',
              }}>
                <p style={{ fontSize: '10px', color: 'var(--accent)', marginBottom: '3px', fontWeight: '500' }}>{k}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {renderValue(v)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
