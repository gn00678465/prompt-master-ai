import type React from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50', className)}>
      <div className="container mx-auto py-8 px-4">{children}</div>
    </div>
  )
}
