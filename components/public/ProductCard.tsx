'use client'
import Link from 'next/link'
import { ProductMeta } from '@/lib/types'
import { useState } from 'react'

export function ProductCard({ product }: { product: ProductMeta }) {
  const completed = product.dimensions.filter(d => d.status === 'complete').length
  const total = product.dimensions.length
  const pct = total > 0 ? (completed / total) * 100 : 0
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '14px',
        borderRadius: '8px',
        background: hovered ? '#FAFAFF' : '#FFFFFF',
        border: `1px solid ${hovered ? '#5E5CE6' : '#E4E4E8'}`,
        transition: 'border-color 0.12s, background 0.12s',
        textDecoration: 'none',
        gap: '10px',
      }}
    >
      {/* Emoji */}
      <span style={{ fontSize: '28px', lineHeight: 1 }}>{product.logo ?? '📦'}</span>

      {/* Name + pill */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#1C1C28',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {product.name}
        </p>
        <span style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          fontSize: '10px',
          fontWeight: '500',
          color: '#5E5CE6',
          background: '#EEEEF8',
          borderRadius: '4px',
          padding: '2px 6px',
        }}>
          {product.category}
        </span>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>维度进度</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{completed}/{total}</span>
        </div>
        <div style={{ height: '3px', background: '#E4E4E8', borderRadius: '2px' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: '#28A745',
            borderRadius: '2px',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>
    </Link>
  )
}
