import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { buildAuthResponse, findUserByEmail, normalizeEmail } from '../auth-utils'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    const { name, email, password } = body
    const normalizedEmail = typeof email === 'string' ? normalizeEmail(email) : ''
    const trimmedName = typeof name === 'string' ? name.trim() : ''

    if (!trimmedName || !normalizedEmail || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existingUser = await findUserByEmail(payload, normalizedEmail)
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    await payload.create({
      collection: 'users',
      data: {
        name: trimmedName,
        email: normalizedEmail,
        password,
        role: 'user',
      },
      overrideAccess: true,
    })

    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: normalizedEmail,
        password,
      },
    })

    if (!loginResult.user || !loginResult.token) {
      return NextResponse.json(
        { error: 'Account created but login failed. Please try logging in.' },
        { status: 500 },
      )
    }

    return buildAuthResponse(loginResult.user, loginResult.token, 'User successfully registered')
  } catch (error) {
    console.error('Registration error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('E11000') || errorMessage.includes('duplicate')) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    if (errorMessage.includes('validation')) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error registering user. Please try again.' }, { status: 500 })
  }
}
