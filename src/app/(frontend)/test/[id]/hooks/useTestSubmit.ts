'use client'

import { useState, useCallback } from 'react'
import { flushSync } from 'react-dom'
import { useTestStore } from '@/store/testStore'
import type { AnswerWithQuestionId, Question, Test, TestResult } from '../types'

interface UseTestSubmitOptions {
  testId: string
  test: Test
  questions: Question[]
  getTimeLeft: () => number | null
}

export function useTestSubmit({ testId, test, questions, getTimeLeft }: UseTestSubmitOptions) {
  const { finishTest, resetTest } = useTestStore()

  const [submitting, setSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const submitWithAnswers = useCallback(
    async (answersToSubmit: AnswerWithQuestionId[]) => {
      setSubmitting(true)
      try {
        const authToken = localStorage.getItem('authToken')

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }

        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`
        }

        const response = await fetch('/api/test-results', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            testId,
            answers: answersToSubmit.map((answer) => ({
              questionId: String(answer.questionId),
              selectedOptions: answer.selectedOptions || [],
              timeSpent: answer.timeSpent || 0,
            })),
            timeSpent: test.timeLimit ? test.timeLimit * 60 - (getTimeLeft() ?? 0) : 0,
          }),
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const responseData: TestResult = await response.json()

        if (!responseData || (responseData.error && responseData.score === undefined)) {
          throw new Error(responseData.error || 'Invalid response from server')
        }

        flushSync(() => {
          setResult(responseData)
          setShowResult(true)
        })

        resetTest()
      } catch (error) {
        console.error('Error submitting test:', error)
        alert(`Error submitting test: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setSubmitting(false)
      }
    },
    [testId, test.timeLimit, getTimeLeft, resetTest],
  )

  const submitTest = useCallback(async () => {
    const storeAnswers = finishTest()
    const answersWithIds = storeAnswers.map((answer, index) => ({
      ...answer,
      questionId: questions[index]?.id || answer.questionId,
    }))
    await submitWithAnswers(answersWithIds)
  }, [finishTest, questions, submitWithAnswers])

  return {
    submitting,
    showResult,
    result,
    submitTest,
    submitWithAnswers,
  }
}
