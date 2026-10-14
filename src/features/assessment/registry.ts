import { quickDiscovery } from './categories/quickDiscovery'
import type { AssessmentCategory } from './types'

/** Every category in display order. #2–#6 add theirs here. */
export const categories: AssessmentCategory[] = [quickDiscovery]

export function getCategory(id: string | null | undefined): AssessmentCategory | undefined {
  return categories.find((category) => category.id === id)
}
