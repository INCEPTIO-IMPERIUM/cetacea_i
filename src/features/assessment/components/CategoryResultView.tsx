import { BigFiveResult } from './BigFiveResult'
import { CareerInterestResult } from './CareerInterestResult'
import { GenericResult } from './GenericResult'
import { QuickDiscoveryResult } from './QuickDiscoveryResult'
import type { ResultViewProps } from './resultViewTypes'
import { StrengthsResult } from './StrengthsResult'
import { WorkStyleResult } from './WorkStyleResult'

/** Result card per category id; categories without their own card get a plain score list. */
export function CategoryResultView({ categoryId, ...props }: ResultViewProps & { categoryId: string }) {
  switch (categoryId) {
    case 'quick':
      return <QuickDiscoveryResult {...props} />
    case 'bigFive':
      return <BigFiveResult {...props} />
    case 'workStyle':
      return <WorkStyleResult {...props} />
    case 'careerInterest':
      return <CareerInterestResult {...props} />
    case 'strengths':
      return <StrengthsResult {...props} />
    default:
      return <GenericResult {...props} />
  }
}
