'use client'

import { LogIn, UserPlus, Eye, EyeOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AuthMode = 'login' | 'register'

interface AuthForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface TestAuthModalProps {
  open: boolean
  authMode: AuthMode
  authForm: AuthForm
  authError: string
  authLoading: boolean
  showPassword: boolean
  showConfirmPassword: boolean
  onClose: () => void
  onModeChange: (mode: AuthMode) => void
  onFormChange: (form: AuthForm) => void
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function TestAuthModal({
  open,
  authMode,
  authForm,
  authError,
  authLoading,
  showPassword,
  showConfirmPassword,
  onClose,
  onModeChange,
  onFormChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}: TestAuthModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {authMode === 'login' ? 'Log In to Save Results' : 'Register to Save Results'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Create an account to save your test results and track your progress
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={authForm.name}
                  onChange={(e) => onFormChange({ ...authForm, name: e.target.value })}
                  placeholder="Your name"
                  required
                  disabled={authLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => onFormChange({ ...authForm, email: e.target.value })}
                placeholder="your@email.com"
                required
                disabled={authLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={authForm.password}
                  onChange={(e) => onFormChange({ ...authForm, password: e.target.value })}
                  placeholder="Password (min 6 characters)"
                  required
                  minLength={6}
                  disabled={authLoading}
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={authForm.confirmPassword}
                    onChange={(e) =>
                      onFormChange({ ...authForm, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm your password"
                    required
                    disabled={authLoading}
                  />
                  <button
                    type="button"
                    onClick={onToggleConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {authError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              disabled={authLoading}
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : authMode === 'login' ? (
                <LogIn className="h-4 w-4 mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {authMode === 'login' ? 'Log In & Save Results' : 'Register & Save Results'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              {authMode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onModeChange('register')}
                    className="text-blue-600 hover:underline"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onModeChange('login')}
                    className="text-blue-600 hover:underline"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
