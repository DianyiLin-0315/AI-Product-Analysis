import Anthropic from '@anthropic-ai/sdk'
import { DimensionMeta } from './types'

const client = new Anthropic()

const DIMENSION_SCHEMA: Record<string, string> = {
  'user-segment': `structured_data 必须包含一个名为 "segments" 的数组，每项有 "name"（string）和 "percentage"（number，不带%符号），以便渲染饼图。示例：
{"segments": [{"name": "学生", "percentage": 35}, {"name": "专业人士", "percentage": 40}]}`,

  'features': `structured_data 必须包含一个名为 "features" 的数组，每项有 "name"（string）和 "score"（number，1-10 整数），以便渲染雷达图。示例：
{"features": [{"name": "智能问答", "score": 9}, {"name": "文档处理", "score": 8}]}`,

  'competitors': `structured_data 必须包含一个名为 "competitors" 的数组，每项有 "name"（string）和 "score"（number，1-10 整数，代表综合竞争力），以便渲染雷达图。示例：
{"competitors": [{"name": "产品A", "score": 8}, {"name": "产品B", "score": 6}]}`,

  'pain-points': `structured_data 必须包含一个名为 "pain_points" 的数组，每项有 "name"（string）和 "severity"（number，1-10，代表严重程度），以便渲染排名图。示例：
{"pain_points": [{"name": "功能缺失", "severity": 9}, {"name": "价格过高", "severity": 7}]}`,

  'user-needs': `structured_data 必须包含一个名为 "needs" 的数组，每项有 "name"（string）和 "priority"（number，1-10，代表优先级），以便渲染排名图。示例：
{"needs": [{"name": "快速导入", "priority": 9}, {"name": "协作分享", "priority": 7}]}`,

  'pricing': `structured_data 必须包含一个名为 "tiers" 的数组，每项有 "name"（string）、"price"（string）和可选的 "features"（string 数组），以便渲染定价卡片。示例：
{"tiers": [{"name": "免费版", "price": "$0", "features": ["基础功能"]}, {"name": "Pro", "price": "$20/月"}]}`,
}

export function buildSystemPrompt(productName: string, activeDimension: DimensionMeta): string {
  const schemaGuide = DIMENSION_SCHEMA[activeDimension.id] ?? ''

  return `你是一个产品分析助手，正在帮助分析产品「${productName}」的「${activeDimension.label}」维度。

你的任务：
1. 通过追问收集这个维度的关键信息
2. 用户可以直接描述、粘贴文字，或提供链接（链接由系统抓取）
3. 当你认为信息足够时，主动告知用户并提议生成该维度的结构化数据
4. 确认后输出 JSON 格式的结构化数据，格式为：
   <dimension_data>
   {
     "conversation_summary": "一句话概括这个维度的核心发现",
     "structured_data": { ... }
   }
   </dimension_data>
${schemaGuide ? `\n结构化数据格式要求（必须遵守，以便系统渲染图表）：\n${schemaGuide}\n` : ''}
保持对话简洁、专业，每次只问一个问题。`
}

export async function* streamChat(
  productName: string,
  activeDimension: DimensionMeta,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): AsyncGenerator<string> {
  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    stream: true,
    system: buildSystemPrompt(productName, activeDimension),
    messages,
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text
    }
  }
}
