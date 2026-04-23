import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TopNav } from '@/components/TopNav'
import { PostHogProviders } from './providers'
import { PostHogPageView } from './PostHogPageView'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 产品分析库',
  description: 'AI-driven product analysis workbench',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="zh">
        <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <PostHogProviders>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <TopNav />
            {children}
          </PostHogProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
