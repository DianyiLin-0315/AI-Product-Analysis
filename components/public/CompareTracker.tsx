'use client'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export function CompareTracker({ productCount }: { productCount: number }) {
  const posthog = usePostHog()

  useEffect(() => {
    posthog.capture('compare_page_viewed', { product_count: productCount })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
