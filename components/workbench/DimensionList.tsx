'use client'
import Link from 'next/link'
import { DimensionMeta, DimensionStatus } from '@/lib/types'

interface Props {
  dimensions: DimensionMeta[]
  activeDimensionId: string
  onSelect: (id: string) => void
  productName: string
  productLogo: string
  productCategory: string
  onAddDimension?: () => void
  sourcesCount?: number
  sourcesActive?: boolean
  onSelectSources?: () => void
}

const STATUS_DOT: Record<DimensionStatus, string> = {
  complete: '#28A745',
  draft:    '#5E5CE6',
  pending:  '#ADADBC',
}

export function DimensionList({
  dimensions,
  activeDimensionId,
  onSelect,
  productName,
  productLogo,
  productCategory,
  onAddDimension,
  sourcesCount = 0,
  sourcesActive = false,
  onSelectSources,
}: Props) {
  const baseDimensions = dimensions.filter(d => !d.isExtended)
  const extendedDimensions = dimensions.filter(d => d.isExtended)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ① App Header */}
      <div style={{
        padding: '15px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}>
          ◈&nbsp;&nbsp;Product Analysis
        </span>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>

        {/* ② Back link */}
        <Link
          href="/"
          style={{
            display: 'block',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            padding: '12px 16px 0',
            lineHeight: '1',
          }}
        >
          ← Back to Products
        </Link>

        {/* ③ Product identity card */}
        <div style={{
          margin: '10px 16px 0',
          background: 'var(--active)',
          borderRadius: '6px',
          height: '52px',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>
            {productLogo}
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
            }}>
              {productName}
            </p>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
            }}>
              {productCategory}
            </p>
          </div>
        </div>

        {/* ④ SOURCES nav item */}
        <SectionLabel>Sources</SectionLabel>
        <button
          onClick={onSelectSources}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 'calc(100% - 16px)',
            marginLeft: '8px',
            height: '32px',
            paddingLeft: '8px',
            paddingRight: '8px',
            borderRadius: '5px',
            background: sourcesActive ? 'var(--active)' : 'transparent',
            borderLeft: `2px solid ${sourcesActive ? 'var(--accent)' : 'transparent'}`,
            textAlign: 'left',
            transition: 'background 0.1s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { if (!sourcesActive) e.currentTarget.style.background = 'var(--active)' }}
          onMouseLeave={e => { if (!sourcesActive) e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ fontSize: '13px', lineHeight: 1 }}>📎</span>
          <span style={{
            flex: 1,
            fontSize: '13px',
            color: sourcesActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: sourcesActive ? '500' : '400',
            lineHeight: 1,
          }}>
            All Sources
          </span>
          {sourcesCount > 0 && (
            <span style={{
              fontSize: '10px',
              fontWeight: '500',
              color: 'var(--accent)',
              background: 'var(--accent-subtle)',
              borderRadius: '10px',
              padding: '1px 6px',
              flexShrink: 0,
            }}>
              {sourcesCount}
            </span>
          )}
        </button>

        {/* ⑤ DIMENSIONS section */}
        <SectionLabel>Dimensions</SectionLabel>

        {baseDimensions.map(d => (
          <DimensionRow
            key={d.id}
            dimension={d}
            isActive={d.id === activeDimensionId}
            onSelect={onSelect}
          />
        ))}

        {/* EXTENDED section */}
        {extendedDimensions.length > 0 && (
          <>
            <SectionLabel>Extended</SectionLabel>
            {extendedDimensions.map(d => (
              <DimensionRow
                key={d.id}
                dimension={d}
                isActive={d.id === activeDimensionId}
                onSelect={onSelect}
              />
            ))}
          </>
        )}

        {/* + Add Dimension */}
        <button
          onClick={onAddDimension}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '12px 16px 0',
            height: '28px',
            width: 'calc(100% - 32px)',
            border: '1px solid var(--border)',
            borderRadius: '5px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'border-color 0.1s, color 0.1s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--text-muted)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          + Add Dimension
        </button>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px',
      fontWeight: '500',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      padding: '14px 16px 4px',
    }}>
      {children}
    </p>
  )
}

function DimensionRow({
  dimension,
  isActive,
  onSelect,
}: {
  dimension: DimensionMeta
  isActive: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      onClick={() => onSelect(dimension.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: 'calc(100% - 16px)',
        marginLeft: '8px',
        height: '32px',
        paddingLeft: '8px',
        paddingRight: '8px',
        borderRadius: '5px',
        background: isActive ? 'var(--active)' : 'transparent',
        borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
        textAlign: 'left',
        transition: 'background 0.1s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!isActive) e.currentTarget.style.background = 'var(--active)'
      }}
      onMouseLeave={e => {
        if (!isActive) e.currentTarget.style.background = 'transparent'
      }}
    >
      <span style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: STATUS_DOT[dimension.status],
        flexShrink: 0,
      }} />
      <span style={{
        flex: 1,
        fontSize: '13px',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontWeight: isActive ? '500' : '400',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}>
        {dimension.label}
      </span>
    </button>
  )
}
