import { auth } from '@clerk/nextjs/server'
import { streamChat } from '@/lib/ai'
import { DimensionMeta, Source } from '@/lib/types'

export async function POST(req: Request) {
  await auth.protect()

  const { productName, activeDimension, messages, sources } = await req.json() as {
    productName: string
    activeDimension: DimensionMeta
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    sources?: Source[]
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const chunk of streamChat(productName, activeDimension, messages, sources ?? [])) {
          controller.enqueue(encoder.encode(chunk))
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
