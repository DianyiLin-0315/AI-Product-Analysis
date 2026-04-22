'use client'
import { DimensionData } from '@/lib/types'
import { SegmentModule } from '@/components/workbench/charts/SegmentModule'
import { RadarModule }   from '@/components/workbench/charts/RadarModule'
import { RankModule }    from '@/components/workbench/charts/RankModule'
import { PricingModule } from '@/components/workbench/charts/PricingModule'
import { GenericModule } from '@/components/workbench/charts/GenericModule'

function ChartRouter({
  dimensionId,
  structuredData,
}: {
  dimensionId: string
  structuredData: Record<string, unknown>
}) {
  switch (dimensionId) {
    case 'user-segment':
      return <SegmentModule data={structuredData} />
    case 'features':
    case 'competitors':
      return <RadarModule data={structuredData} />
    case 'pain-points':
    case 'user-needs':
      return <RankModule data={structuredData} />
    case 'pricing':
      return <PricingModule data={structuredData} />
    default:
      return <GenericModule data={structuredData} />
  }
}

export function DimensionModule({ data }: { data: DimensionData }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E4E4E8',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '12px',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #E4E4E8',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '1px',
          background: '#5E5CE6',
          flexShrink: 0,
        }} />
        <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1C1C28' }}>
          {data.dimension_label}
        </h3>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {data.conversation_summary && (
          <p style={{
            fontSize: '13px',
            color: '#6B6B7B',
            lineHeight: '1.7',
            marginBottom: '16px',
          }}>
            {data.conversation_summary}
          </p>
        )}
        <ChartRouter
          dimensionId={data.dimension_id}
          structuredData={data.structured_data}
        />
      </div>
    </div>
  )
}
