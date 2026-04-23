import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isWorkbench = createRouteMatcher(['/workbench(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isWorkbench(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
