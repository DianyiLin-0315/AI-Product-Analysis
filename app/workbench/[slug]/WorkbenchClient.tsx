'use client'
import { useState } from 'react'
import { ProductMeta, DimensionData } from '@/lib/types'
import { DimensionList } from '@/components/workbench/DimensionList'
import { ConversationPane } from '@/components/workbench/ConversationPane'
import { ModulePreview } from '@/components/workbench/ModulePreview'

export function WorkbenchClient({ initialMeta }: { initialMeta: ProductMeta }) {
  const [meta, setMeta] = useState(initialMeta)
  const [activeDimensionId, setActiveDimensionId] = useState(
    meta.dimensions[0]?.id ?? ''
  )
  const [lastCompletedData, setLastCompletedData] = useState<DimensionData | null>(null)

  const activeDimension =
    meta.dimensions.find(d => d.id === activeDimensionId) ?? meta.dimensions[0]

  async function handleDimensionComplete(
    summary: string,
    structuredData: Record<string, unknown>
  ) {
    const data: DimensionData = {
      dimension_id: activeDimensionId,
      dimension_label: activeDimension.label,
      status: 'complete',
      conversation_summary: summary,
      structured_data: structuredData,
      last_updated: new Date().toISOString(),
    }

    await fetch('/api/dimension', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: meta.slug, dimensionId: activeDimensionId, data }),
    })

    setMeta(prev => ({
      ...prev,
      dimensions: prev.dimensions.map(d =>
        d.id === activeDimensionId ? { ...d, status: 'complete' } : d
      ),
    }))

    setLastCompletedData(data)
  }

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 40px)',
      background: 'var(--bg)',
    }}>
      {/* Left: Dimension list */}
      <aside style={{
        width: '180px',
        borderRight: '1px solid var(--border-subtle)',
        overflowY: 'auto',
        flexShrink: 0,
        background: 'var(--surface-1)',
      }}>
        <DimensionList
          dimensions={meta.dimensions}
          activeDimensionId={activeDimensionId}
          onSelect={setActiveDimensionId}
        />
      </aside>

      {/* Center: Conversation */}
      <main style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        {activeDimension ? (
          <ConversationPane
            productName={meta.name}
            activeDimension={activeDimension}
            onDimensionComplete={handleDimensionComplete}
          />
        ) : (
          <p style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>暂无维度。</p>
        )}
      </main>

      {/* Right: Preview */}
      <aside style={{
        width: '260px',
        borderLeft: '1px solid var(--border-subtle)',
        overflowY: 'auto',
        padding: '12px',
        flexShrink: 0,
        background: 'var(--surface-1)',
      }}>
        <ModulePreview data={lastCompletedData} />
      </aside>
    </div>
  )
}
