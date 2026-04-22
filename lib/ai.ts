import Anthropic from '@anthropic-ai/sdk'
import { DimensionMeta } from './types'

const client = new Anthropic()

export function buildSystemPrompt(productName: string, activeDimension: DimensionMeta): string {
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
