'use client'
import { useState, useRef, useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { DimensionMeta, Message, PendingData, Source } from '@/lib/types'

interface Props {
  productName: string
  activeDimension: DimensionMeta
  messages: Message[]
  pendingData: PendingData | null
  sources?: Source[]
  onMessagesChange: (msgs: Message[]) => void
  onPendingChange: (data: PendingData | null) => void
  onDimensionComplete: (summary: string, structuredData: Record<string, unknown>) => void
}

export function ConversationPane({
  productName,
  activeDimension,
  messages,
  pendingData,
  sources = [],
  onMessagesChange,
  onPendingChange,
  onDimensionComplete,
}: Props) {
  const posthog = usePostHog()
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pendingData])

  // Reset input and streaming state when switching dimensions
  useEffect(() => {
    setInput('')
    setStreaming(false)
  }, [activeDimension.id])

  async function send() {
    if (!input.trim() || streaming) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const nextMessages = [...messages, userMessage]

    // dimension_started: first message in this dimension
    if (messages.length === 0) {
      posthog.capture('dimension_started', {
        dimension_id: activeDimension.id,
        dimension_name: activeDimension.label,
      })
    }
    // dimension_message_sent: every message
    posthog.capture('dimension_message_sent', {
      dimension_id: activeDimension.id,
      message_round: messages.filter(m => m.role === 'user').length + 1,
    })

    onMessagesChange(nextMessages)
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
      body: JSON.stringify({ productName, activeDimension, messages: apiMessages, sources }),
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let assistantText = ''
    onMessagesChange([...nextMessages, { role: 'assistant', content: '' }])

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      assistantText += decoder.decode(value)
      const displayText = assistantText
        .replace(/<dimension_data>[\s\S]*?<\/dimension_data>/g, '')
        .trim()
      onMessagesChange([
        ...nextMessages,
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
        onPendingChange({
          summary: parsed.conversation_summary,
          structuredData: parsed.structured_data,
        })
      } catch { /* ignore */ }
    }
  }

  function handleConfirm() {
    if (!pendingData) return
    onDimensionComplete(pendingData.summary, pendingData.structuredData)
    onPendingChange(null)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  const isDisabled = streaming || !!pendingData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>

      {/* Header — tab style */}
      <div style={{
        position: 'relative',
        height: '47px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '16px',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: 'var(--accent)',
          lineHeight: 1,
        }}>
          {activeDimension.label}
        </span>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '16px',
          width: '60px',
          height: '2px',
          background: 'var(--accent)',
          borderRadius: '1px',
        }} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>

        {/* Empty state */}
        {messages.length === 0 && !pendingData && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '10px',
          }}>
            <span style={{ fontSize: '24px', color: 'var(--text-muted)', lineHeight: 1 }}>◈</span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              选择左侧维度，开始 AI 分析
            </p>
          </div>
        )}

        {/* Message list */}
        {messages.map((m, i) => (
          <div key={i} style={{ padding: '16px 20px 0' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              letterSpacing: '0.02em',
            }}>
              {m.role === 'user' ? 'You' : 'Lloyd AI'}
            </p>
            <p style={{
              fontSize: '13px',
              color: m.role === 'user' ? 'var(--text-primary)' : 'var(--text-secondary)',
              lineHeight: '1.65',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {m.content}
              {streaming && i === messages.length - 1 && m.role === 'assistant' && (
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '14px',
                  background: 'var(--accent)',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  opacity: 0.8,
                }} />
              )}
            </p>
          </div>
        ))}

        {/* Confirm card */}
        {pendingData && (
          <div style={{
            margin: '16px 20px 0',
            background: 'var(--accent-subtle)',
            border: '1px solid rgba(94,92,230,0.3)',
            borderRadius: '8px',
            padding: '13px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--accent)', marginBottom: '4px' }}>
                ✓&nbsp;&nbsp;已收集到足够信息
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {activeDimension.label}维度数据已整理，确认写入模块？
              </p>
            </div>
            <button
              onClick={handleConfirm}
              style={{
                flexShrink: 0,
                height: '28px',
                padding: '0 14px',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '500',
                borderRadius: '5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              确认写入
            </button>
          </div>
        )}

        <div ref={bottomRef} style={{ height: '20px' }} />
      </div>

      {/* Input area */}
      <div style={{ padding: '0 20px 20px', flexShrink: 0 }}>
        <div style={{
          position: 'relative',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          minHeight: '44px',
          paddingRight: '40px',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={pendingData ? '确认写入后继续分析…' : '继续分析，或粘贴产品资料…'}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '12px 15px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              resize: 'none',
              lineHeight: '1.5',
              opacity: isDisabled ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => void send()}
            disabled={isDisabled || !input.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: isDisabled || !input.trim() ? 'var(--surface-3)' : 'var(--accent)',
              color: isDisabled || !input.trim() ? 'var(--text-muted)' : '#fff',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isDisabled || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
