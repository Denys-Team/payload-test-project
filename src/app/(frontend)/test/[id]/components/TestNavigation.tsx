'use client'

import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { useIsDark } from '../hooks/useIsDark'

interface TestNavigationProps {
  currentQuestionIndex: number
  questionsCount: number
  selectedOptionsCount: number
  submitting: boolean
  onPrevious: () => void
  onNext: () => void
}

export function TestNavigation({
  currentQuestionIndex,
  questionsCount,
  selectedOptionsCount,
  submitting,
  onPrevious,
  onNext,
}: TestNavigationProps) {
  const isDark = useIsDark()
  const isLastQuestion = currentQuestionIndex === questionsCount - 1

  return (
    <div className="flex justify-between">
      <Button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        variant="outline"
        className={cn(isDark && 'border-gray-700 hover:bg-gray-800')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <Button
        onClick={onNext}
        disabled={selectedOptionsCount === 0 || submitting}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
      >
        {isLastQuestion ? (
          <>
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Finish Test
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </>
        ) : (
          <>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
