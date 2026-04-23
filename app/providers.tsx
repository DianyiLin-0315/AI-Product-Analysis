'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // 手动追踪，由 PostHogPageView 负责
    capture_pageleave: true,
  })
}

export function PostHogProviders({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}
