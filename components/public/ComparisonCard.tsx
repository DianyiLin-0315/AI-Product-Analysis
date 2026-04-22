import { ProductMeta, DimensionData } from '@/lib/types'

interface Props {
  product: ProductMeta
  dimensions: DimensionData[]
  visibleDimensionIds?: string[]
}

export function ComparisonCard({ product, dimensions, visibleDimensionIds }: Props) {
  const shown = visibleDimensionIds
    ? dimensions.filter(d => visibleDimensionIds.includes(d.dimension_id))
    : dimensions

  return (
    <div className="flex-1 min-w-0 bg-gray-900 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">{product.logo ?? '📦'}</span>
        <div>
          <p className="font-semibold text-white">{product.name}</p>
          <p className="text-xs text-gray-400">{product.category}</p>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {shown.map(d => (
          <div key={d.dimension_id}>
            <p className="text-xs text-blue-400 font-medium mb-1">{d.dimension_label}</p>
            <p className="text-sm text-gray-300">{d.conversation_summary}</p>
          </div>
        ))}
        {shown.length === 0 && (
          <p className="text-sm text-gray-500">暂无可对比的维度</p>
        )}
      </div>
    </div>
  )
}
