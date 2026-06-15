import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import type { Payload } from 'payload'
import type { User } from '@/payload-types'

const JWT_SECRET = process.env.PAYLOAD_SECRET || 'fallback-secret'

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function findUserByEmail(payload: Payload, email: string) {
  const trimmed = email.trim()
  const lower = trimmed.toLowerCase()

  const result = await payload.find({
    collection: 'users',
    where: {
      or: [{ email: { equals: lower } }, { email: { equals: trimmed } }],
    },
    limit: 1,
  })

  return result.docs[0] ?? null
}

/** Payload login always lowercases email for lookup — normalize stored email first */
export async function ensureNormalizedEmail(payload: Payload, user: User): Promise<string> {
  const normalized = normalizeEmail(String(user.email))

  if (user.email !== normalized) {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { email: normalized },
      overrideAccess: true,
    })
  }

  return normalized
}

export function createCustomAuthToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  )
}

export function buildAuthResponse(
  user: User,
  payloadToken: string,
  message: string,
): NextResponse {
  const { password: _, ...userWithoutPassword } = user

  const response = NextResponse.json({
    message,
    user: userWithoutPassword,
    token: createCustomAuthToken(user),
  })

  response.cookies.set('payload-token', payloadToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}
