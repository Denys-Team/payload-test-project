'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { useIsDark } from '../hooks/useIsDark'
import type { Question, Test } from '../types'

interface QuestionCardProps {
  test: Test
  question: Question
  questionIndex: number
  selectedOptions: number[]
  onOptionChange: (optionIndex: number) => void
}

export function QuestionCard({
  test,
  question,
  questionIndex,
  selectedOptions,
  onOptionChange,
}: QuestionCardProps) {
  const isDark = useIsDark()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={cn(
            'mb-8 backdrop-blur-sm',
            isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90',
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className={cn(isDark && 'border-gray-600 text-gray-300')}>
                {test.category}
              </Badge>
              <Badge variant="outline" className={cn(isDark && 'border-gray-600 text-gray-300')}>
                {test.difficulty}
              </Badge>
            </div>
            <div className={cn('text-xl leading-relaxed', isDark && 'text-white')}>
              {typeof question.question === 'string' ? (
                <CardTitle>{question.question}</CardTitle>
              ) : (
                <RichText data={question.question} enableGutter={false} />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOptions.includes(index)

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer group',
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg shadow-blue-500/10'
                      : isDark
                        ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  )}
                  onClick={() => onOptionChange(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5',
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : isDark
                          ? 'border-gray-600 group-hover:border-gray-500'
                          : 'border-gray-300 group-hover:border-gray-400',
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                        className="w-3 h-3 rounded-full bg-white"
                      />
                    )}
                  </div>
                  <div className={cn('flex-1', isDark ? 'text-gray-200' : 'text-gray-700')}>
                    {typeof option.text === 'string' ? (
                      <span>{option.text}</span>
                    ) : (
                      <RichText data={option.text} enableGutter={false} enableProse={false} />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
