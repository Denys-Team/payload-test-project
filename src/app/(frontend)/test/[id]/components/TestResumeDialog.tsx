'use client'

import { motion } from 'motion/react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { useIsDark } from '../hooks/useIsDark'
import { formatTime } from '../utils'
interface TestResumeDialogProps {
  currentQuestionIndex: number
  timeLeft: number | null
  questionsCount: number
  onResume: () => void
  onRestart: () => void
}

export function TestResumeDialog({
  currentQuestionIndex,
  timeLeft,
  questionsCount,
  onResume,
  onRestart,
}: TestResumeDialogProps) {
  const isDark = useIsDark()

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className={cn(
            'w-full max-w-md backdrop-blur-sm',
            isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90',
          )}
        >
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-yellow-500/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </motion.div>
            <CardTitle className="text-2xl">Test in Progress</CardTitle>
            <p className={cn('mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
              You have an unfinished test. Would you like to continue where you left off?
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={cn('rounded-lg p-4 text-sm', isDark ? 'bg-gray-800/50' : 'bg-gray-50')}
            >
              <p>
                <strong>Progress:</strong> Question {currentQuestionIndex + 1} of {questionsCount}
              </p>
              {timeLeft != null && timeLeft > 0 && (
                <p>
                  <strong>Time remaining:</strong> {formatTime(timeLeft)}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <Button onClick={onRestart} variant="outline" className="flex-1">
                Start Over
              </Button>
              <Button
                onClick={onResume}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
