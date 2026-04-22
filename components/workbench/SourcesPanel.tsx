'use client'
import { useState, useRef } from 'react'
import { Source } from '@/lib/types'

interface Props {
  slug: string
  sources: Source[]
  onSourcesChange: (sources: Source[]) => void
}

export function SourcesPanel({ slug, sources, onSourcesChange }: Props) {
  const [urlInput, setUrlInput] = useState('')
  const [loadingUrl, setLoadingUrl] = useState(false)
  const [loadingFile, setLoadingFile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function addUrl() {
    const url = urlInput.trim()
    if (!url || loadingUrl) return
    setError(null)
    setLoadingUrl(true)
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, url }),
      })
      if (!res.ok) { setError('无法抓取该链接，请检查 URL 是否可访问'); return }
      const source = await res.json() as Source
      onSourcesChange([...sources, source])
      setUrlInput('')
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoadingUrl(false)
    }
  }

  async function addFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setLoadingFile(true)
    try {
      const form = new FormData()
      form.append('slug', slug)
      form.append('file', file)
      const res = await fetch('/api/sources', { method: 'POST', body: form })
      if (!res.ok) { setError('文件上传失败'); return }
      const source = await res.json() as Source
      onSourcesChange([...sources, source])
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoadingFile(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function deleteSource(id: string) {
    await fetch('/api/sources', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, id }),
    })
    onSourcesChange(sources.filter(s => s.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>

      {/* Header */}
      <div style={{
        height: '47px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        flexShrink: 0,
        gap: '8px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--accent)' }}>Sources</span>
        {sources.length > 0 && (
          <span style={{
            fontSize: '10px',
            fontWeight: '500',
            color: 'var(--accent)',
            background: 'var(--accent-subtle)',
            borderRadius: '10px',
            padding: '1px 7px',
          }}>
            {sources.length}
          </span>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: '20px', width: '60px', height: '2px', background: 'var(--accent)', borderRadius: '1px' }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* Add URL */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Add URL
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') void addUrl() }}
              placeholder="https://..."
              style={{
                flex: 1,
                height: '34px',
                padding: '0 10px',
                fontSize: '12px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                outline: 'none',
                background: 'var(--surface-2)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => void addUrl()}
              disabled={loadingUrl || !urlInput.trim()}
              style={{
                height: '34px',
                padding: '0 14px',
                fontSize: '12px',
                fontWeight: '500',
                borderRadius: '6px',
                background: loadingUrl || !urlInput.trim() ? 'var(--surface-3)' : 'var(--accent)',
                color: loadingUrl || !urlInput.trim() ? 'var(--text-muted)' : '#fff',
                cursor: loadingUrl || !urlInput.trim() ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                transition: 'background 0.1s',
              }}
            >
              {loadingUrl ? '抓取中…' : '添加'}
            </button>
          </div>
        </div>

        {/* Upload file */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Upload File
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={loadingFile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '34px',
              padding: '0 14px',
              fontSize: '12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: 'var(--surface-2)',
              color: loadingFile ? 'var(--text-muted)' : 'var(--text-secondary)',
              cursor: loadingFile ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.1s',
            }}
            onMouseEnter={e => { if (!loadingFile) e.currentTarget.style.borderColor = 'var(--text-muted)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <span style={{ fontSize: '14px' }}>📄</span>
            {loadingFile ? '处理中…' : '选择文件 (.txt .md .csv)'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,.text"
            onChange={addFile}
            style={{ display: 'none' }}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: '12px', color: 'var(--error)', marginBottom: '12px' }}>{error}</p>
        )}

        {/* Source list */}
        {sources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>还没有添加任何资料</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.6' }}>
              添加产品文档、官网链接或竞品资料<br />AI 分析时会自动参考
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sources.map(s => (
              <SourceCard key={s.id} source={s} onDelete={() => void deleteSource(s.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SourceCard({ source, onDelete }: { source: Source; onDelete: () => void }) {
  const excerpt = source.content.slice(0, 120).replace(/\s+/g, ' ').trim()

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '10px 12px',
      background: 'var(--surface-2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{ fontSize: '13px', flexShrink: 0 }}>{source.type === 'url' ? '🔗' : '📄'}</span>
          <p style={{
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {source.title}
          </p>
        </div>
        <button
          onClick={onDelete}
          style={{
            flexShrink: 0,
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0 2px',
            lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          ✕
        </button>
      </div>
      {excerpt && (
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
          {excerpt}…
        </p>
      )}
    </div>
  )
}
