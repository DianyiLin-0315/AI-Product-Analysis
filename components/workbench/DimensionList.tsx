'use client'
import { DimensionMeta } from '@/lib/types'

interface Props {
  dimensions: DimensionMeta[]
  activeDimensionId: string
  onSelect: (id: string) => void
}

const STATUS_COLOR: Record<string, string> = {
  complete: 'text-green-400',
  draft: 'text-orange-400',
  pending: 'text-gray-500',
}

const STATUS_ICON: Record<string, string> = {
  complete: '✓',
  draft: '⟳',
  pending: '○',
}

export function DimensionList({ dimensions, activeDimensionId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-1 p-3 h-full">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">分析维度</p>
      {dimensions.map(d => (
        <button
          key={d.id}
          onClick={() => onSelect(d.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-left w-full transition-colors
            ${d.id === activeDimensionId
              ? 'bg-blue-900/40 border-l-2 border-blue-400 text-blue-300'
              : 'text-gray-400 hover:bg-gray-800'
            }`}
        >
          <span className={STATUS_COLOR[d.status] ?? 'text-gray-500'}>
            {STATUS_ICON[d.status] ?? '○'}
          </span>
          <span className="truncate">{d.label}</span>
          {d.isExtended && (
            <span className="text-xs text-gray-600 ml-auto shrink-0">扩展</span>
          )}
        </button>
      ))}
    </div>
  )
}
