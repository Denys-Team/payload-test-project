import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { User } from '../payload-types'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token && nullUserRedirect) {
    redirect(nullUserRedirect)
  }

  let user: User | null = null

  if (token) {
    try {
      const payload = await getPayload({ config: configPromise })
      const headersList = await headers()
      const { user: authUser } = await payload.auth({ headers: headersList })
      user = (authUser as User) ?? null
    } catch (error) {
      console.error('[getMeUser] Error:', error)
    }
  }

  if (validUserRedirect && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && !user) {
    redirect(nullUserRedirect)
  }

  return {
    token: token!,
    user: user!,
  }
}
