'use client'
import { useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import { ProductMeta, DimensionData } from '@/lib/types'
import { ComparisonCard } from './ComparisonCard'

interface Entry {
  meta: ProductMeta
  dimensions: DimensionData[]
}

interface Props {
  entries: Entry[]
}

export function CompareView({ entries }: Props) {
  const posthog = usePostHog()

  // Collect all unique dimension ids across all products
  const allDimIds = Array.from(
    new Set(entries.flatMap(e => e.dimensions.map(d => d.dimension_id)))
  )
  const allDimLabels = Object.fromEntries(
    entries.flatMap(e => e.dimensions.map(d => [d.dimension_id, d.dimension_label]))
  )

  const [selected, setSelected] = useState<Set<string>>(new Set(allDimIds))

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      posthog.capture('dimension_filter_applied', {
        selected_dimensions: [...next],
      })
      return next
    })
  }

  return (
    <div>
      {/* Dimension filter */}
      {allDimIds.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '11px', color: '#ADADBC', fontWeight: '500' }}>筛选维度：</span>
          {allDimIds.map(id => {
            const active = selected.has(id)
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${active ? '#5E5CE6' : '#E4E4E8'}`,
                  background: active ? '#EEEEF8' : '#FFFFFF',
                  color: active ? '#5E5CE6' : '#6B6B7B',
                  cursor: 'pointer',
                  fontWeight: active ? '500' : '400',
                  transition: 'all 0.1s',
                }}
              >
                {allDimLabels[id]}
              </button>
            )
          })}
        </div>
      )}

      {/* Comparison grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${entries.length}, minmax(280px, 1fr))`,
        gap: '1px',
        background: '#E4E4E8',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #E4E4E8',
      }}>
        {entries.map(({ meta, dimensions }) => (
          <ComparisonCard
            key={meta.slug}
            product={meta}
            dimensions={dimensions}
            visibleDimensionIds={[...selected]}
          />
        ))}
      </div>
    </div>
  )
}
