'use client'

import { motion } from 'motion/react'
import { Clock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/utilities/ui'
import { useIsDark } from '../hooks/useIsDark'
import { formatTime } from '../utils'

interface TestHeaderProps {
  title: string
  currentQuestionIndex: number
  questionsCount: number
  answeredCount: number
  timeLeft: number | null
  isAuthenticated: boolean
  progress: number
}

export function TestHeader({
  title,
  currentQuestionIndex,
  questionsCount,
  answeredCount,
  timeLeft,
  isAuthenticated,
  progress,
}: TestHeaderProps) {
  const isDark = useIsDark()

  return (
    <div
      className={cn(
        'backdrop-blur-md border-b sticky top-0 z-10',
        isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200',
      )}
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-800')}>
              {title}
            </h1>
            <p className={cn(isDark ? 'text-gray-400' : 'text-gray-600')}>
              Question {currentQuestionIndex + 1} of {questionsCount}
              <span className={cn('ml-2', isDark ? 'text-gray-500' : 'text-gray-400')}>
                ({answeredCount} answered)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <span className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>
                Guest mode
              </span>
            )}
            {timeLeft !== null && (
              <motion.div
                className={cn(
                  'flex items-center text-lg font-semibold px-4 py-2 rounded-full',
                  timeLeft < 60
                    ? 'bg-red-500/10 text-red-500'
                    : isDark
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-blue-500/10 text-blue-600',
                )}
                animate={timeLeft < 60 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: timeLeft < 60 ? Infinity : 0 }}
              >
                <Clock className="mr-2 h-5 w-5" />
                {formatTime(timeLeft)}
              </motion.div>
            )}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}
