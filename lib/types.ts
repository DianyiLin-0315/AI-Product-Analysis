export type DimensionStatus = 'pending' | 'draft' | 'complete'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface PendingData {
  summary: string
  structuredData: Record<string, unknown>
}

export interface Source {
  id: string
  type: 'url' | 'file'
  title: string
  url?: string
  filename?: string
  content: string   // extracted plain text
  added_at: string  // ISO timestamp
}

export interface DimensionMeta {
  id: string
  label: string        // Chinese display label
  status: DimensionStatus
  isExtended: boolean  // true = AI-suggested beyond base set
}

export interface DimensionData {
  dimension_id: string
  dimension_label: string
  status: DimensionStatus
  conversation_summary: string
  structured_data: Record<string, unknown>
  last_updated: string // ISO timestamp
}

export interface ProductMeta {
  slug: string
  name: string
  category: string
  logo?: string        // emoji or URL
  key_stats?: Record<string, string>  // e.g. { mau: "3亿+" }
  created_at: string
  dimensions: DimensionMeta[]
}
