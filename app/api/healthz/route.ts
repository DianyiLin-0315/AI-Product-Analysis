export async function GET() {
  return Response.json({
    status: 'ok',
    env: {
      hasClerkPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasPosthogKey: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
      nodeEnv: process.env.NODE_ENV,
    }
  })
}
