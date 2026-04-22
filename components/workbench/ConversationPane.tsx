'use client'
import { useState, useRef, useEffect } from 'react'
import { DimensionMeta } from '@/lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  productName: string
  activeDimension: DimensionMeta
  onDimensionComplete: (summary: string, structuredData: Record<string, unknown>) => void
}

export function ConversationPane({ productName, activeDimension, onDimensionComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset when dimension changes
  useEffect(() => {
    setMessages([])
    setInput('')
  }, [activeDimension.id])

  async function send() {
    if (!input.trim() || streaming) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setStreaming(true)

    // URL detection — fetch page content server-side
    let finalInput = userMessage.content
    const urlMatch = finalInput.match(/https?:\/\/\S+/)
    if (urlMatch) {
      try {
        const res = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlMatch[0] }),
        })
        const { text } = await res.json() as { text: string }
        finalInput = finalInput.replace(urlMatch[0], `[网页内容]: ${text}`)
      } catch { /* ignore URL fetch failure, proceed with original input */ }
    }

    const apiMessages = [
      ...messages,
      { role: 'user' as const, content: finalInput },
    ]

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, activeDimension, messages: apiMessages }),
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let assistantText = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      assistantText += decoder.decode(value)
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: assistantText },
      ])
    }

    setStreaming(false)

    // Detect dimension completion
    const match = assistantText.match(/<dimension_data>([\s\S]*?)<\/dimension_data>/)
    if (match) {
      try {
        const parsed = JSON.parse(match[1].trim()) as {
          conversation_summary: string
          structured_data: Record<string, unknown>
        }
        onDimensionComplete(parsed.conversation_summary, parsed.structured_data)
      } catch { /* malformed JSON from model — ignore */ }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm">
            正在分析「{activeDimension.label}」——发送消息开始。
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm rounded-lg p-3 max-w-[85%] whitespace-pre-wrap
              ${m.role === 'user'
                ? 'ml-auto bg-gray-800 text-white'
                : 'bg-gray-900 text-gray-200'
              }`}
          >
            {m.content}
          </div>
        ))}
        {streaming && (
          <div className="text-xs text-gray-500 animate-pulse">AI 正在思考…</div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-800 p-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
          disabled={streaming}
          placeholder="输入信息或粘贴链接…"
          className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none disabled:opacity-50"
        />
        <button
          onClick={() => void send()}
          disabled={streaming || !input.trim()}
          className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-sm text-white disabled:opacity-40 transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  )
}
