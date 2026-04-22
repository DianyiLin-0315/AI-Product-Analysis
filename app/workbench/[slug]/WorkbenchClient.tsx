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
      body: JSON.stringify({
        slug: meta.slug,
        dimensionId: activeDimensionId,
        data,
      }),
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
    <div className="flex h-[calc(100vh-57px)]">
      <aside className="w-52 border-r border-gray-800 overflow-y-auto shrink-0">
        <DimensionList
          dimensions={meta.dimensions}
          activeDimensionId={activeDimensionId}
          onSelect={setActiveDimensionId}
        />
      </aside>

      <main className="flex-1 overflow-hidden">
        {activeDimension ? (
          <ConversationPane
            productName={meta.name}
            activeDimension={activeDimension}
            onDimensionComplete={handleDimensionComplete}
          />
        ) : (
          <p className="p-4 text-gray-400 text-sm">暂无维度。</p>
        )}
      </main>

      <aside className="w-72 border-l border-gray-800 overflow-y-auto p-4 shrink-0">
        <ModulePreview data={lastCompletedData} />
      </aside>
    </div>
  )
}
