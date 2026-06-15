'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useIsDark } from '../hooks/useIsDark'
import type { TestResult } from '../types'

interface TestResultScreenProps {
  result: TestResult | null
}

export function TestResultScreen({ result }: TestResultScreenProps) {
  const router = useRouter()
  const { ensureServerSession } = useAuth()
  const isDark = useIsDark()

  const goToDashboard = async () => {
    const hasSession = await ensureServerSession()
    if (!hasSession) {
      router.push('/login')
      return
    }
    router.refresh()
    router.push('/dashboard')
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className={cn(
              'animate-spin rounded-full h-32 w-32 border-4 mx-auto mb-4',
              isDark ? 'border-blue-500 border-t-transparent' : 'border-blue-600 border-t-transparent',
            )}
          />
          <p className={cn('text-xl', isDark ? 'text-gray-300' : 'text-gray-600')}>
            Processing results...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className={cn(
            'w-full max-w-2xl backdrop-blur-sm',
            isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90',
          )}
        >
          <CardHeader className="text-center">
            <motion.div
              className={cn(
                'mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4',
                result.isPassed
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                  : 'bg-gradient-to-br from-red-500/20 to-rose-500/20',
              )}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {result.isPassed ? (
                <CheckCircle className="h-10 w-10 text-green-500" />
              ) : (
                <XCircle className="h-10 w-10 text-red-500" />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle
                className={cn(
                  'text-3xl font-bold',
                  result.isPassed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent',
                )}
              >
                {result.isPassed ? 'Congratulations!' : 'Try Again'}
              </CardTitle>
              <p className={cn('mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                {result.isPassed
                  ? 'You have successfully passed the test!'
                  : 'Unfortunately, you did not pass the test. Please try again!'}
              </p>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div
                className={cn(
                  'text-center p-6 rounded-xl',
                  isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50',
                )}
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {result.score !== undefined ? `${result.score}%` : 'N/A'}
                </p>
                <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Total Score
                </p>
              </div>
              <div
                className={cn(
                  'text-center p-6 rounded-xl',
                  isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50',
                )}
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {result.correctAnswers !== undefined && result.totalQuestions !== undefined
                    ? `${result.correctAnswers}/${result.totalQuestions}`
                    : 'N/A'}
                </p>
                <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Correct Answers
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button
                onClick={() => void goToDashboard()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
