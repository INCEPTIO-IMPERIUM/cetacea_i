import type { ComponentType } from 'react'
import type { CategoryAnswers, StoredCategoryResult } from '../types'

export interface ResultViewProps {
  result: StoredCategoryResult
  answers: CategoryAnswers
  /** Hides the result and returns to the questions; omitted on the summary page. */
  onReview?: () => void
}

export type ResultView = ComponentType<ResultViewProps>
