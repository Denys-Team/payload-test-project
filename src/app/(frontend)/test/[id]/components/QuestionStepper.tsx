'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { useIsDark } from '../hooks/useIsDark'
import type { Answer } from '@/store/testStore'

interface QuestionStepperProps {
  questionsCount: number
  currentQuestionIndex: number
  answers: Answer[]
  onGoToQuestion: (index: number) => void
}

export function QuestionStepper({
  questionsCount,
  currentQuestionIndex,
  answers,
  onGoToQuestion,
}: QuestionStepperProps) {
  const isDark = useIsDark()

  return (
    <div
      className={cn(
        'mb-8 p-4 rounded-2xl backdrop-blur-sm',
        isDark ? 'bg-gray-900/50' : 'bg-white/50',
      )}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: questionsCount }, (_, index) => {
          const step = index + 1
          const isActive = index === currentQuestionIndex
          const isCompleted = (answers[index]?.selectedOptions?.length ?? 0) > 0

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => onGoToQuestion(index)}
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                isActive &&
                  'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-2 ring-blue-400/50',
                !isActive &&
                  isCompleted &&
                  'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md',
                !isActive &&
                  !isCompleted &&
                  (isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'),
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              {isCompleted && !isActive ? (
                <Check className="h-4 w-4" />
              ) : isActive ? (
                <motion.div className="w-3 h-3 rounded-full bg-white" layoutId="activeDot" />
              ) : (
                step
              )}

              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
