import { GenericResult } from './GenericResult'
import { QuickDiscoveryResult } from './QuickDiscoveryResult'
import type { ResultViewProps } from './resultViewTypes'

/** Result card per category id; categories without their own card get a plain score list. */
export function CategoryResultView({ categoryId, ...props }: ResultViewProps & { categoryId: string }) {
  switch (categoryId) {
    case 'quick':
      return <QuickDiscoveryResult {...props} />
    default:
      return <GenericResult {...props} />
  }
}
