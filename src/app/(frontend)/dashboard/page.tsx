import { headers } from 'next/headers'
import { getMeUser } from '@/utilities/getMeUser'
import { DashboardClient } from './DashboardClient'
import type { Stats, DashboardUser } from './types'

const emptyStats: Stats = {
  totalTests: 0,
  passedTests: 0,
  averageScore: 0,
  totalTimeSpent: 0,
  categoryStats: [],
  recentResults: [],
}

async function fetchUserStats(): Promise<Stats> {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') ?? 'http'
  const cookie = headersList.get('cookie') ?? ''

  const res = await fetch(`${protocol}://${host}/api/user/stats`, {
    headers: { cookie },
    cache: 'no-store',
  })

  return res.ok ? await res.json() : emptyStats
}

export default async function DashboardPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const stats = await fetchUserStats()

  return <DashboardClient initialStats={stats} initialUser={user as DashboardUser} />
}
