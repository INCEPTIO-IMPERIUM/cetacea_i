import { bigFive } from './categories/bigFive'
import { careerInterest } from './categories/careerInterest'
import { strengths } from './categories/strengths'
import { workStyle } from './categories/workStyle'
import type { AssessmentCategory } from './types'

/**
 * Every category in display order.
 * The Personality Compass (01) has no questions; it is shown from the Big Five answers.
 */
export const categories: AssessmentCategory[] = [bigFive, workStyle, careerInterest, strengths]

export function getCategory(id: string | null | undefined): AssessmentCategory | undefined {
  return categories.find((category) => category.id === id)
}
