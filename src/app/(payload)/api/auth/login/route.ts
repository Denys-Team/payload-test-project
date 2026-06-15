import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { buildAuthResponse, ensureNormalizedEmail, findUserByEmail, normalizeEmail } from '../auth-utils'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    const { email, password } = body
    const normalizedEmail = typeof email === 'string' ? normalizeEmail(email) : ''

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existingUser = await findUserByEmail(payload, normalizedEmail)
    if (!existingUser) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    try {
      const loginEmail = await ensureNormalizedEmail(payload, existingUser)

      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email: loginEmail,
          password,
        },
      })

      if (!loginResult.user || !loginResult.token) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      return buildAuthResponse(loginResult.user, loginResult.token, 'Successfully logged in')
    } catch (loginError) {
      console.error('Login error:', loginError)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 })
  }
}
