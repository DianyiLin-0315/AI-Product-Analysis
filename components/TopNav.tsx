'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function TopNav() {
  const pathname = usePathname()

  // Workbench has its own header — don't render here
  if (pathname.startsWith('/workbench')) return null

  const links = [
    { href: '/',          label: '产品库' },
    { href: '/workbench', label: '工作台' },
    { href: '/compare',   label: '对比'   },
  ]

  return (
    <header style={{
      height: '44px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'var(--surface-1)',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <Link href="/" style={{
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        letterSpacing: '-0.01em',
      }}>
        AI 产品分析库
      </Link>

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {links.map(({ href, label }) => {
          const active = href === '/'
            ? pathname === '/'
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '12px',
                fontWeight: active ? '500' : '400',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '5px',
                background: active ? 'var(--active)' : 'transparent',
                transition: 'background 0.1s, color 0.1s',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
