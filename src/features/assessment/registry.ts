import { bigFive } from './categories/bigFive'
import { quickDiscovery } from './categories/quickDiscovery'
import type { AssessmentCategory } from './types'

/**
 * Every category in display order. #4–#6 add theirs here.
 * The Personality Compass (01) has no questions; it is shown from the Big Five answers.
 */
export const categories: AssessmentCategory[] = [quickDiscovery, bigFive]

export function getCategory(id: string | null | undefined): AssessmentCategory | undefined {
  return categories.find((category) => category.id === id)
}
