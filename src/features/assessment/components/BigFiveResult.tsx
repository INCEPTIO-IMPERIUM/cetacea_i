import { toBigFiveScores } from '../categories/bigFive'
import { PersonalityCompassResult } from './PersonalityCompassResult'
import { PersonalitySpectrumResult } from './PersonalitySpectrumResult'
import { ReviewButton } from './ReviewButton'
import type { ResultViewProps } from './resultViewTypes'

/** One set of IPIP answers gives two results: the Personality Compass (01) and the Big Five spectrum (02). */
export function BigFiveResult({ result, onReview }: ResultViewProps) {
  const scores = toBigFiveScores(result.scores)
  return (
    <div className="space-y-4">
      {scores && <PersonalityCompassResult scores={scores} />}
      <PersonalitySpectrumResult result={result} />
      {onReview && <ReviewButton onReview={onReview} />}
    </div>
  )
}
