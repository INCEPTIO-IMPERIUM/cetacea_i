import { bigFive } from './categories/bigFive'
import { careerInterest } from './categories/careerInterest'
import { quickDiscovery } from './categories/quickDiscovery'
import { workStyle } from './categories/workStyle'
import type { AssessmentCategory } from './types'

/**
 * Every category in display order. #6 adds its own here.
 * The Personality Compass (01) has no questions; it is shown from the Big Five answers.
 */
export const categories: AssessmentCategory[] = [quickDiscovery, bigFive, workStyle, careerInterest]

export function getCategory(id: string | null | undefined): AssessmentCategory | undefined {
  return categories.find((category) => category.id === id)
}
