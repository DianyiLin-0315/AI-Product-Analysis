'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'

const PAGE_NAME: Record<string, string> = {
  '/': 'library',
  '/compare': 'compare',
}

function resolvePageName(pathname: string): string {
  if (PAGE_NAME[pathname]) return PAGE_NAME[pathname]
  if (pathname.startsWith('/workbench')) return 'workbench'
  if (pathname.startsWith('/products')) return 'product_detail'
  return pathname
}

export function PostHogPageView() {
  const pathname = usePathname()
  const posthog = usePostHog()

  useEffect(() => {
    if (!pathname || !posthog) return
    posthog.capture('page_viewed', {
      page: resolvePageName(pathname),
      $current_url: window.location.href,
    })
  }, [pathname, posthog])

  return null
}
