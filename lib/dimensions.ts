import { DimensionMeta } from './types'

export const BASE_DIMENSIONS: Omit<DimensionMeta, 'status'>[] = [
  { id: 'user-segment',    label: '用户群体',  isExtended: false },
  { id: 'pricing',         label: '定价策略',  isExtended: false },
  { id: 'features',        label: '功能特性',  isExtended: false },
  { id: 'pain-points',     label: '场景痛点',  isExtended: false },
  { id: 'user-needs',      label: '需求洞察',  isExtended: false },
  { id: 'competitors',     label: '竞品分析',  isExtended: false },
  { id: 'business-model',  label: '商业模式',  isExtended: false },
]

export function makeInitialDimensions(): DimensionMeta[] {
  return BASE_DIMENSIONS.map(d => ({ ...d, status: 'pending' }))
}

export function dimensionLabelById(id: string, dimensions: DimensionMeta[]): string {
  return dimensions.find(d => d.id === id)?.label ?? id
}
