'use client'
import { DimensionData } from '@/lib/types'
import { SegmentModule } from './charts/SegmentModule'
import { RadarModule }   from './charts/RadarModule'
import { RankModule }    from './charts/RankModule'
import { PricingModule } from './charts/PricingModule'
import { GenericModule } from './charts/GenericModule'

interface Props { data: DimensionData | null }

export function ModulePreview({ data }: Props) {
  if (!data) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '1.5px dashed var(--border)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '16px', color: 'var(--text-muted)', opacity: 0.5 }}>◻</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5' }}>
          维度完成后<br />这里显示预览
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        height: '39px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 15px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {data.dimension_label}
        </span>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#28A745',
          flexShrink: 0,
        }} />
      </div>

      {/* Summary */}
      {data.conversation_summary && (
        <p style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: '1.55',
          padding: '10px 15px 0',
        }}>
          {data.conversation_summary}
        </p>
      )}

      {/* Chart body */}
      <div style={{ padding: '12px 15px 16px' }}>
        <ChartRouter
          dimensionId={data.dimension_id}
          structuredData={data.structured_data}
        />
      </div>
    </div>
  )
}

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
      return <RadarModule data={structuredData} />

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
