'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/providers/Theme'

export function useIsDark(): boolean {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted && theme === 'dark'
}
