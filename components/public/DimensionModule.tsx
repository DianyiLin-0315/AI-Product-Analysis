import { DimensionData } from '@/lib/types'

export function DimensionModule({ data }: { data: DimensionData }) {
  return (
    <div className="rounded-lg bg-gray-900 p-5 mb-4">
      <h3 className="text-orange-400 text-sm font-semibold mb-3">{data.dimension_label}</h3>
      <p className="text-gray-300 text-sm mb-3">{data.conversation_summary}</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(data.structured_data).map(([k, v]) => (
          <div key={k} className="bg-gray-800 rounded p-2">
            <p className="text-xs text-blue-400 mb-1">{k}</p>
            <p className="text-xs text-gray-200">
              {Array.isArray(v) ? (v as unknown[]).map(String).join('、') : String(v)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
