import { auth } from '@clerk/nextjs/server'
import { randomUUID } from 'crypto'
import { readSources, writeSources } from '@/lib/sources'
import { Source } from '@/lib/types'

function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50000)
}

export async function GET(req: Request) {
  await auth.protect()
  const slug = new URL(req.url).searchParams.get('slug') ?? ''
  return Response.json(await readSources(slug))
}

export async function POST(req: Request) {
  await auth.protect()

  const contentType = req.headers.get('content-type') ?? ''
  let slug: string
  let source: Source

  if (contentType.includes('multipart/form-data')) {
    // File upload
    const form = await req.formData()
    slug = form.get('slug') as string
    const file = form.get('file') as File
    const content = await file.text()
    source = {
      id: randomUUID(),
      type: 'file',
      title: file.name,
      filename: file.name,
      content: content.slice(0, 50000),
      added_at: new Date().toISOString(),
    }
  } else {
    // URL fetch
    const body = await req.json() as { slug: string; url: string }
    slug = body.slug

    let text = ''
    let title = body.url
    try {
      const res = await fetch(body.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProductAnalysisBot/1.0)' },
      })
      const html = await res.text()
      // Try to extract <title>
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      if (titleMatch) title = titleMatch[1].trim().slice(0, 120)
      text = extractText(html)
    } catch {
      return Response.json({ error: 'Failed to fetch URL' }, { status: 400 })
    }

    source = {
      id: randomUUID(),
      type: 'url',
      title,
      url: body.url,
      content: text,
      added_at: new Date().toISOString(),
    }
  }

  const sources = await readSources(slug)
  sources.push(source)
  await writeSources(slug, sources)

  return Response.json(source)
}

export async function DELETE(req: Request) {
  await auth.protect()
  const { slug, id } = await req.json() as { slug: string; id: string }
  const sources = await readSources(slug)
  await writeSources(slug, sources.filter(s => s.id !== id))
  return Response.json({ ok: true })
}
