'use client'

import { cn } from '@/utilities/ui'
import { useIsDark } from '../hooks/useIsDark'

interface TestAuroraLayoutProps {
  children: React.ReactNode
}

export function TestAuroraLayout({ children }: TestAuroraLayoutProps) {
  const isDark = useIsDark()

  const bgClass = cn(
    'fixed inset-0 -z-10 transition-colors duration-500',
    isDark
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950'
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100',
  )

  const blobClass = (position: string, lightColor: string, darkColor: string) =>
    cn('absolute rounded-full blur-[120px]', position, isDark ? darkColor : lightColor)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className={bgClass}>
        <div
          className={blobClass(
            'top-0 -left-40 w-[600px] h-[600px] animate-aurora-1',
            'bg-blue-400/30',
            'bg-blue-600/20',
          )}
        />
        <div
          className={cn(
            'absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[100px] animate-aurora-2',
            isDark ? 'bg-purple-600/15' : 'bg-purple-400/25',
          )}
        />
        <div
          className={blobClass(
            'bottom-0 left-1/3 w-[700px] h-[400px] animate-aurora-3',
            'bg-indigo-300/30',
            'bg-indigo-600/15',
          )}
        />
        <div
          className={cn(
            'absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-aurora-4',
            isDark ? 'bg-cyan-600/10' : 'bg-cyan-300/25',
          )}
        />
      </div>
      {children}
    </div>
  )
}
