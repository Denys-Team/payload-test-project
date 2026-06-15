import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Answer } from '@/store/testStore'

export interface Question {
  id: string
  question: string | DefaultTypedEditorState
  options: Array<{
    text: string | DefaultTypedEditorState
    isCorrect: boolean
  }>
  explanation?: string
  answerFeedback?: Array<{
    optionIndex: number
    correctAnswerFeedback?: DefaultTypedEditorState | null
    incorrectAnswerFeedback?: DefaultTypedEditorState | null
  }>
}

export interface Test {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  timeLimit?: number
  questions: Question[]
}

export interface TestPageClientProps {
  initialTest: Test
  initialQuestions: Question[]
}

export interface TestResult {
  score?: number
  correctAnswers?: number
  totalQuestions?: number
  isPassed?: boolean
  error?: string
}

export type AnswerWithQuestionId = Answer & { questionId: string }
