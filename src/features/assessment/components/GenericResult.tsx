import type { ResultViewProps } from './resultViewTypes'

/** Fallback result card: every score as a 0–100 bar, best first. Categories replace it with their own view. */
export function GenericResult({ result, onReview }: ResultViewProps) {
  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel p-5 sm:p-6" aria-live="polite">
      <div className="eyebrow">Your scores</div>
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
      {onReview && (
        <button type="button" onClick={onReview} className="mt-5 rounded-full border border-black/15 px-5 py-3 text-xs font-bold hover:bg-paper">
          Review my answers
        </button>
      )}
    </div>
  )
}
