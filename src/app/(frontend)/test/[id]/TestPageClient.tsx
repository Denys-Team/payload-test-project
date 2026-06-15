'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTestStore } from '@/store/testStore'
import { TestAuroraLayout } from './components/TestAuroraLayout'
import { TestResumeDialog } from './components/TestResumeDialog'
import { TestResultScreen } from './components/TestResultScreen'
import { TestAuthModal } from './components/TestAuthModal'
import { TestHeader } from './components/TestHeader'
import { QuestionCard } from './components/QuestionCard'
import { QuestionStepper } from './components/QuestionStepper'
import { TestNavigation } from './components/TestNavigation'
import { useTestSession } from './hooks/useTestSession'
import { useTestSubmit } from './hooks/useTestSubmit'
import { useTestAuthModal } from './hooks/useTestAuthModal'
import type { TestPageClientProps } from './types'

export function TestPageClient({ initialTest, initialQuestions }: TestPageClientProps) {
  const { isAuthenticated, login, register } = useAuth()

  const submit = useTestSubmit({
    testId: initialTest.id,
    test: initialTest,
    questions: initialQuestions,
    getTimeLeft: () => useTestStore.getState().currentTest?.timeLeft ?? null,
  })

  const authModal = useTestAuthModal({
    login,
    register,
    onAuthenticatedSubmit: submit.submitTest,
  })

  const handleFinishRef = useRef<() => void>(() => {})

  const session = useTestSession({
    initialTest,
    initialQuestions,
    externalPaused: submit.showResult || authModal.showAuthModal,
    onFinish: () => handleFinishRef.current(),
  })

  handleFinishRef.current = () => {
    if (!isAuthenticated) {
      authModal.openAuthModal()
    } else {
      void submit.submitTest()
    }
  }

  // Auto-submit when time runs out
  useEffect(() => {
    if (
      session.timeLeft === 0 &&
      !submit.showResult &&
      !submit.submitting &&
      !authModal.showAuthModal &&
      !session.showResumeDialog
    ) {
      handleFinishRef.current()
    }
  }, [
    session.timeLeft,
    session.showResumeDialog,
    submit.showResult,
    submit.submitting,
    authModal.showAuthModal,
  ])

  if (session.showResumeDialog) {
    return (
      <TestAuroraLayout>
        <TestResumeDialog
          currentQuestionIndex={session.currentQuestionIndex}
          timeLeft={session.timeLeft}
          questionsCount={session.questions.length}
          onResume={session.handleResumeTest}
          onRestart={session.handleRestartTest}
        />
      </TestAuroraLayout>
    )
  }

  if (submit.showResult) {
    return (
      <TestAuroraLayout>
        <TestResultScreen result={submit.result} />
      </TestAuroraLayout>
    )
  }

  if (!session.currentQuestion) {
    return null
  }

  return (
    <>
      <TestAuthModal
        open={authModal.showAuthModal}
        authMode={authModal.authMode}
        authForm={authModal.authForm}
        authError={authModal.authError}
        authLoading={authModal.authLoading}
        showPassword={authModal.showPassword}
        showConfirmPassword={authModal.showConfirmPassword}
        onClose={authModal.close}
        onModeChange={authModal.setAuthMode}
        onFormChange={authModal.setAuthForm}
        onTogglePassword={() => authModal.setShowPassword((v) => !v)}
        onToggleConfirmPassword={() => authModal.setShowConfirmPassword((v) => !v)}
        onSubmit={authModal.handleAuthSubmit}
      />

      <TestAuroraLayout>
        <TestHeader
          title={session.test.title}
          currentQuestionIndex={session.currentQuestionIndex}
          questionsCount={session.questions.length}
          answeredCount={session.answeredCount}
          timeLeft={session.timeLeft}
          isAuthenticated={isAuthenticated}
          progress={session.progress}
        />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <QuestionCard
            test={session.test}
            question={session.currentQuestion}
            questionIndex={session.currentQuestionIndex}
            selectedOptions={session.selectedOptions}
            onOptionChange={session.handleOptionChange}
          />

          <QuestionStepper
            questionsCount={session.questions.length}
            currentQuestionIndex={session.currentQuestionIndex}
            answers={session.answers}
            onGoToQuestion={session.goToQuestion}
          />

          <TestNavigation
            currentQuestionIndex={session.currentQuestionIndex}
            questionsCount={session.questions.length}
            selectedOptionsCount={session.selectedOptions.length}
            submitting={submit.submitting}
            onPrevious={session.handlePreviousQuestion}
            onNext={session.handleNextQuestion}
          />
        </div>
      </TestAuroraLayout>
    </>
  )
}
