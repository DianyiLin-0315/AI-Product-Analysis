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
      } catch { /* ignore */ }
    }

    const apiMessages = [...messages, { role: 'user' as const, content: finalInput }]

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
      const displayText = assistantText
        .replace(/<dimension_data>[\s\S]*?<\/dimension_data>/g, '')
        .trim()
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: displayText },
      ])
    }

    setStreaming(false)

    const match = assistantText.match(/<dimension_data>([\s\S]*?)<\/dimension_data>/)
    if (match) {
      try {
        const parsed = JSON.parse(match[1].trim()) as {
          conversation_summary: string
          structured_data: Record<string, unknown>
        }
        onDimensionComplete(parsed.conversation_summary, parsed.structured_data)
      } catch { /* ignore */ }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
          {activeDimension.label}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>· {productName}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        {messages.length === 0 && (
          <div style={{ padding: '24px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              开始分析「{activeDimension.label}」——发送消息或粘贴链接。
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: m.role === 'user' ? 'var(--surface-2)' : 'transparent',
            }}
          >
            <div style={{
              fontSize: '11px',
              fontWeight: '500',
              color: m.role === 'user' ? 'var(--accent)' : 'var(--text-muted)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {m.role === 'user' ? '你' : 'AI'}
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-primary)',
              lineHeight: '1.65',
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {streaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI</div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>…</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '10px 12px',
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
      }}>
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
          style={{
            flex: 1,
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '7px 10px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            outline: 'none',
            opacity: streaming ? 0.5 : 1,
          }}
        />
        <button
          onClick={() => void send()}
          disabled={streaming || !input.trim()}
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            background: streaming || !input.trim() ? 'var(--surface-3)' : 'var(--accent)',
            color: streaming || !input.trim() ? 'var(--text-muted)' : '#fff',
            fontSize: '13px',
            fontWeight: '500',
            cursor: streaming || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          发送
        </button>
      </div>
    </div>
  )
}
