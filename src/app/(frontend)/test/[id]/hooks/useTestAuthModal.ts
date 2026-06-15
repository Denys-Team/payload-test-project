'use client'

import { useState, useCallback } from 'react'

type AuthMode = 'login' | 'register'

interface AuthForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface UseTestAuthModalOptions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  onAuthenticatedSubmit: () => Promise<void>
}

const emptyForm: AuthForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function useTestAuthModal({
  login,
  register,
  onAuthenticatedSubmit,
}: UseTestAuthModalOptions) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('register')
  const [authForm, setAuthForm] = useState<AuthForm>(emptyForm)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const openAuthModal = useCallback(() => {
    setShowAuthModal(true)
  }, [])

  const close = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  const handleAuthSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setAuthError('')

      if (authMode === 'register') {
        if (!authForm.name.trim()) {
          setAuthError('Name is required')
          return
        }
        if (authForm.name.trim().length < 2) {
          setAuthError('Name must be at least 2 characters')
          return
        }
        if (!authForm.email.trim()) {
          setAuthError('Email is required')
          return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email)) {
          setAuthError('Enter a valid email address')
          return
        }
        if (authForm.password.length < 6) {
          setAuthError('Password must be at least 6 characters')
          return
        }
        if (authForm.password !== authForm.confirmPassword) {
          setAuthError('Passwords do not match')
          return
        }
      }

      setAuthLoading(true)

      try {
        const authResult =
          authMode === 'login'
            ? await login(authForm.email, authForm.password)
            : await register(authForm.name.trim(), authForm.email.trim(), authForm.password)

        if (authResult.success) {
          setShowAuthModal(false)
          setAuthForm(emptyForm)
          await onAuthenticatedSubmit()
        } else {
          setAuthError(authResult.error || 'Authentication failed')
        }
      } catch {
        setAuthError('An error occurred')
      } finally {
        setAuthLoading(false)
      }
    },
    [authMode, authForm, login, register, onAuthenticatedSubmit],
  )

  return {
    showAuthModal,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    authError,
    authLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    openAuthModal,
    close,
    handleAuthSubmit,
  }
}
