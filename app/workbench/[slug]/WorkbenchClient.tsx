'use client'
import { useState } from 'react'
import { ProductMeta, DimensionData, Message, PendingData } from '@/lib/types'
import { DimensionList } from '@/components/workbench/DimensionList'
import { ConversationPane } from '@/components/workbench/ConversationPane'
import { ModulePreview } from '@/components/workbench/ModulePreview'

export function WorkbenchClient({
  initialMeta,
  initialPreviewMap = {},
}: {
  initialMeta: ProductMeta
  initialPreviewMap?: Record<string, DimensionData>
}) {
  const [meta, setMeta] = useState(initialMeta)
  const [activeDimensionId, setActiveDimensionId] = useState(
    meta.dimensions[0]?.id ?? ''
  )

  // Per-dimension conversation history
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({})

  // Per-dimension pending confirm card state
  const [pendingMap, setPendingMap] = useState<Record<string, PendingData | null>>({})

  // Per-dimension preview data — seeded from server on mount
  const [previewMap, setPreviewMap] = useState<Record<string, DimensionData>>(initialPreviewMap)

  const activeDimension =
    meta.dimensions.find(d => d.id === activeDimensionId) ?? meta.dimensions[0]

  const activeMessages = messagesMap[activeDimensionId] ?? []
  const activePending = pendingMap[activeDimensionId] ?? null
  const activePreview = previewMap[activeDimensionId] ?? null

  function handleMessagesChange(msgs: Message[]) {
    setMessagesMap(prev => ({ ...prev, [activeDimensionId]: msgs }))
  }

  function handlePendingChange(data: PendingData | null) {
    setPendingMap(prev => ({ ...prev, [activeDimensionId]: data }))
  }

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

    setPreviewMap(prev => ({ ...prev, [activeDimensionId]: data }))
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--surface-1)',
    }}>
      {/* Left: Dimension list */}
      <aside style={{
        width: '252px',
        borderRight: '1px solid var(--border)',
        overflowY: 'hidden',
        flexShrink: 0,
        background: 'var(--sidebar)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <DimensionList
          dimensions={meta.dimensions}
          activeDimensionId={activeDimensionId}
          onSelect={setActiveDimensionId}
          productName={meta.name}
          productLogo={meta.logo ?? '📦'}
          productCategory={meta.category}
        />
      </aside>

      {/* Center: Conversation */}
      <main style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        {activeDimension ? (
          <ConversationPane
            productName={meta.name}
            activeDimension={activeDimension}
            messages={activeMessages}
            pendingData={activePending}
            onMessagesChange={handleMessagesChange}
            onPendingChange={handlePendingChange}
            onDimensionComplete={handleDimensionComplete}
          />
        ) : (
          <p style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>暂无维度。</p>
        )}
      </main>

      {/* Right: Preview */}
      <aside style={{
        width: '328px',
        borderLeft: '1px solid var(--border)',
        flexShrink: 0,
        background: 'var(--surface-2)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Preview header */}
        <div style={{
          height: '47px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '500',
            color: 'var(--text-muted)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}>
            Preview
          </span>
        </div>
        {/* Preview body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          <ModulePreview data={activePreview} />
        </div>
      </aside>
    </div>
  )
}
