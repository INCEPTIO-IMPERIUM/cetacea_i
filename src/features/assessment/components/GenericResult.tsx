import { L, useT } from '../../../i18n/language'
import { ReviewButton } from './ReviewButton'
import type { ResultViewProps } from './resultViewTypes'

/** Fallback result card: every score as a 0–100 bar, best first. Categories replace it with their own view. */
export function GenericResult({ result, onReview }: ResultViewProps) {
  const t = useT()
  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel p-5 sm:p-6" aria-live="polite">
      <div className="eyebrow">{t(L('คะแนนของคุณ', 'Your scores'))}</div>
      <ul className="mt-4 space-y-3">
        {result.ranking.map((key) => (
          <li key={key} className="grid grid-cols-[minmax(110px,.6fr)_1fr_36px] items-center gap-3 text-xs">
            <span className="font-semibold">{key}</span>
            <span className="meter" aria-hidden="true">
              <span style={{ width: `${result.scores[key] ?? 0}%` }} />
            </span>
            <span className="font-bold text-right">{result.scores[key] ?? 0}</span>
          </li>
        ))}
      </ul>
      {onReview && <ReviewButton onReview={onReview} className="mt-5" />}
    </div>
  )
}
