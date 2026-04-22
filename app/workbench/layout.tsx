import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function WorkbenchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        height: '40px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/workbench" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
            工作台
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'var(--text-muted)' }}
            onMouseEnter={undefined}>
            产品库
          </Link>
          <UserButton appearance={{ elements: { avatarBox: { width: 24, height: 24 } } }} />
        </div>
      </header>
      <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>
    </div>
  )
}
