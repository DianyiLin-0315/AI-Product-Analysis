import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  await auth.protect()

  const { url } = await req.json() as { url: string }

  let text: string
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProductAnalysisBot/1.0)' },
    })
    const html = await res.text()
    text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000)
  } catch {
    return Response.json({ error: 'Failed to fetch URL' }, { status: 400 })
  }

  return Response.json({ text })
}
