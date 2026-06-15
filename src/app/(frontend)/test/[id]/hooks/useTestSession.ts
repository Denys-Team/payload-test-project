'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTestStore } from '@/store/testStore'
import type { Answer } from '@/store/testStore'
import type { Question, Test } from '../types'

interface UseTestSessionOptions {
  initialTest: Test
  initialQuestions: Question[]
  externalPaused: boolean
  onFinish: () => void
}

function getSavedOptions(answers: Answer[], index: number): number[] {
  return answers[index]?.selectedOptions ?? []
}

export function useTestSession({
  initialTest,
  initialQuestions,
  externalPaused,
  onFinish,
}: UseTestSessionOptions) {
  const testId = initialTest.id

  const {
    currentTest,
    startTest,
    setAnswer,
    setCurrentQuestionIndex,
    decrementTimeLeft,
    resetTest,
  } = useTestStore()

  const [test] = useState<Test>(initialTest)
  const [questions] = useState<Question[]>(initialQuestions)
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const testInitializedRef = useRef(false)

  const currentQuestionIndex = currentTest?.currentQuestionIndex ?? 0
  const timeLeft = currentTest?.timeLeft ?? null
  const answers = currentTest?.answers ?? []

  const restoreSelectedOptions = useCallback(
    (index: number) => {
      setSelectedOptions(getSavedOptions(answers, index))
    },
    [answers],
  )

  const goToQuestion = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(index)
      restoreSelectedOptions(index)
    },
    [setCurrentQuestionIndex, restoreSelectedOptions],
  )

  const handleResumeTest = useCallback(() => {
    setShowResumeDialog(false)
    const storeState = useTestStore.getState()
    const index = storeState.currentTest?.currentQuestionIndex ?? 0
    const savedAnswer = storeState.currentTest?.answers[index]
    if (savedAnswer) {
      setSelectedOptions(savedAnswer.selectedOptions)
    }
  }, [])

  const handleRestartTest = useCallback(() => {
    setShowResumeDialog(false)
    resetTest()
    startTest(testId, questions.length, test.timeLimit)
    setSelectedOptions([])
  }, [resetTest, startTest, testId, questions.length, test.timeLimit])

  const handleOptionChange = useCallback(
    (optionIndex: number) => {
      const currentQuestion = questions[currentQuestionIndex]
      if (!currentQuestion) return

      const newOptions = selectedOptions.includes(optionIndex) ? [] : [optionIndex]
      setSelectedOptions(newOptions)
      setAnswer(String(currentQuestion.id), newOptions)
    },
    [questions, currentQuestionIndex, selectedOptions, setAnswer],
  )

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1)
    } else {
      onFinish()
    }
  }, [currentQuestionIndex, questions.length, goToQuestion, onFinish])

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex, goToQuestion])

  const getAnswersWithQuestionIds = useCallback(() => {
    const storeAnswers = currentTest?.answers ?? []
    return storeAnswers.map((answer, index) => ({
      ...answer,
      questionId: questions[index]?.id || answer.questionId,
    }))
  }, [currentTest?.answers, questions])

  // Initialize test on mount (runs only once)
  useEffect(() => {
    if (testInitializedRef.current || questions.length === 0) return

    testInitializedRef.current = true
    const storeState = useTestStore.getState()

    const hasProgress =
      storeState.currentTest?.testId === testId &&
      storeState.currentTest.answers.some((a) => a.selectedOptions.length > 0)

    if (hasProgress) {
      setShowResumeDialog(true)
      const index = storeState.currentTest?.currentQuestionIndex ?? 0
      const savedAnswer = storeState.currentTest?.answers[index]
      if (savedAnswer) {
        setSelectedOptions(savedAnswer.selectedOptions)
      }
    } else if (!storeState.currentTest || storeState.currentTest.testId !== testId) {
      startTest(testId, questions.length, test.timeLimit)
    }
  }, [questions.length, testId, startTest, test.timeLimit])

  // Timer
  useEffect(() => {
    const paused = externalPaused || showResumeDialog
    if (test.timeLimit && timeLeft !== null && timeLeft > 0 && !paused) {
      const timer = setInterval(() => decrementTimeLeft(), 1000)
      return () => clearInterval(timer)
    }
  }, [test.timeLimit, timeLeft, decrementTimeLeft, externalPaused, showResumeDialog])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredCount = answers.filter((a) => a.selectedOptions.length > 0).length

  return {
    test,
    questions,
    currentQuestion,
    currentQuestionIndex,
    timeLeft,
    answers,
    selectedOptions,
    showResumeDialog,
    currentTest,
    progress,
    answeredCount,
    handleResumeTest,
    handleRestartTest,
    handleOptionChange,
    handleNextQuestion,
    handlePreviousQuestion,
    goToQuestion,
    getAnswersWithQuestionIds,
  }
}
