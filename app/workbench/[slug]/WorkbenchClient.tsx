'use client'
import { useState, useEffect, useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { ProductMeta, DimensionData, Message, PendingData, Source } from '@/lib/types'
import { DimensionList } from '@/components/workbench/DimensionList'
import { ConversationPane } from '@/components/workbench/ConversationPane'
import { SourcesPanel } from '@/components/workbench/SourcesPanel'
import { ModulePreview } from '@/components/workbench/ModulePreview'

export function WorkbenchClient({
  initialMeta,
  initialPreviewMap = {},
  initialSources = [],
}: {
  initialMeta: ProductMeta
  initialPreviewMap?: Record<string, DimensionData>
  initialSources?: Source[]
}) {
  const posthog = usePostHog()
  const [meta, setMeta] = useState(initialMeta)
  const [activeDimensionId, setActiveDimensionId] = useState(
    meta.dimensions[0]?.id ?? ''
  )
  const [showSources, setShowSources] = useState(false)
  const [sources, setSources] = useState<Source[]>(initialSources)

  // Per-dimension conversation history
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({})

  // Per-dimension pending confirm card state
  const [pendingMap, setPendingMap] = useState<Record<string, PendingData | null>>({})

  // Per-dimension preview data — seeded from server on mount
  const [previewMap, setPreviewMap] = useState<Record<string, DimensionData>>(initialPreviewMap)

  // workbench_entered: fire once on mount
  useEffect(() => {
    const isNew = meta.dimensions.every(d => d.status === 'pending')
    posthog.capture('workbench_entered', {
      product_slug: meta.slug,
      is_new: isNew,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // dimension_switched + dimension_time_spent: track when active dimension changes
  const prevDimensionRef = useRef<string>(activeDimensionId)
  const enteredAtRef = useRef<number>(Date.now())

  useEffect(() => {
    const prev = prevDimensionRef.current
    const enteredAt = enteredAtRef.current
    if (prev && prev !== activeDimensionId) {
      const seconds = Math.round((Date.now() - enteredAt) / 1000)
      posthog.capture('dimension_time_spent', {
        product_slug: meta.slug,
        dimension_id: prev,
        seconds,
      })
      posthog.capture('dimension_switched', {
        product_slug: meta.slug,
        from_dimension: prev,
        to_dimension: activeDimensionId,
      })
    }
    prevDimensionRef.current = activeDimensionId
    enteredAtRef.current = Date.now()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDimensionId])

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

  function handleSelectDimension(id: string) {
    setShowSources(false)
    setActiveDimensionId(id)
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

    const updatedDimensions = meta.dimensions.map(d =>
      d.id === activeDimensionId ? { ...d, status: 'complete' as const } : d
    )

    posthog.capture('dimension_completed', {
      product_slug: meta.slug,
      dimension_id: activeDimensionId,
      total_rounds: (messagesMap[activeDimensionId] ?? []).filter(m => m.role === 'user').length,
    })

    if (updatedDimensions.every(d => d.status === 'complete')) {
      posthog.capture('all_dimensions_completed', {
        product_slug: meta.slug,
        product_name: meta.name,
        total_dimensions: updatedDimensions.length,
      })
    }

    setMeta(prev => ({ ...prev, dimensions: updatedDimensions }))
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
          activeDimensionId={showSources ? '' : activeDimensionId}
          onSelect={handleSelectDimension}
          productName={meta.name}
          productLogo={meta.logo ?? '📦'}
          productCategory={meta.category}
          sourcesCount={sources.length}
          sourcesActive={showSources}
          onSelectSources={() => setShowSources(true)}
        />
      </aside>

      {/* Center: Sources panel or Conversation */}
      <main style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        {showSources ? (
          <SourcesPanel
            slug={meta.slug}
            sources={sources}
            onSourcesChange={setSources}
          />
        ) : activeDimension ? (
          <ConversationPane
            productName={meta.name}
            activeDimension={activeDimension}
            messages={activeMessages}
            pendingData={activePending}
            sources={sources}
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          <ModulePreview data={activePreview} />
        </div>
      </aside>
    </div>
  )
}
