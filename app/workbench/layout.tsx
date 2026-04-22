import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function WorkbenchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <Link href="/workbench" className="font-semibold text-white hover:text-gray-300">
          工作台
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            产品库 →
          </Link>
          <UserButton />
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
