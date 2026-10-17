import { L, useT } from '../../../i18n/language'

/** "Review my answers" — hides a result and returns to the questions. */
export function ReviewButton({ onReview, className = '' }: { onReview: () => void; className?: string }) {
  const t = useT()
  return (
    <button type="button" onClick={onReview} className={`rounded-full border border-black/15 px-5 py-3 text-ui font-bold hover:bg-paper ${className}`}>
      {t(L('ทบทวนคำตอบของฉัน', 'Review my answers'))}
    </button>
  )
}
