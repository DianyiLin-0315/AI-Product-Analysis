import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 产品分析库',
  description: 'AI-driven product analysis workbench',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="zh">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
