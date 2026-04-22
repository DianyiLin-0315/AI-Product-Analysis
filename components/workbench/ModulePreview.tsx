'use client'
import { DimensionData } from '@/lib/types'

export function ModulePreview({ data }: { data: DimensionData | null }) {
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-gray-500 text-center">维度完成后<br />这里会显示预览</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">预览：{data.dimension_label}</p>
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-orange-400 text-sm font-medium mb-2">{data.dimension_label}</h4>
        <p className="text-gray-300 text-xs mb-3">{data.conversation_summary}</p>
        <div className="space-y-2">
          {Object.entries(data.structured_data).map(([k, v]) => (
            <div key={k} className="bg-gray-800 rounded p-2">
              <p className="text-xs text-blue-400 mb-0.5">{k}</p>
              <p className="text-xs text-gray-200">
                {Array.isArray(v) ? v.join('、') : String(v)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
