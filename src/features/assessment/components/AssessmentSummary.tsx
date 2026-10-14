import { Link } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getCategoryRecord, useWhoAmI } from '../../../store/whoAmIStore'
import { categories } from '../registry'
import { CategoryResultView } from './CategoryResultView'

/** Results of every finished section. The career matcher (#7) builds the full summary on top of this. */
export function AssessmentSummary({ onBack }: { onBack: () => void }) {
  const state = useWhoAmI()
  const done = categories.filter((category) => getCategoryRecord(state, category.id).result)

  return (
    <section className="pt-6 sm:pt-8" aria-labelledby="summary-heading">
      <div className="mb-5">
        <div className="eyebrow">Your discovery summary</div>
        <h2 id="summary-heading" className="section-title text-[27px] sm:text-[32px] font-extrabold mt-1">
          What your answers suggest<span className="text-[#8b76cf]">.</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl">
          {done.length} of {categories.length} sections finished. These are clues to explore, not a label or a final decision.
        </p>
      </div>

      {done.length === 0 ? (
        <p className="rounded-[20px] border border-dashed border-black/20 p-6 text-sm text-muted">Finish a section to see its result here.</p>
      ) : (
        <div className="space-y-6">
          {done.map((category) => {
            const record = getCategoryRecord(state, category.id)
            return (
              <article key={category.id} aria-labelledby={`summary-${category.id}`}>
                <h3 id={`summary-${category.id}`} className="eyebrow mb-2">
                  Section {category.number} · {category.title}
                </h3>
                {record.result && <CategoryResultView categoryId={category.id} result={record.result} answers={record.answers} />}
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink py-2">
          <ArrowLeft size={24} aria-hidden="true" /> All sections
        </button>
        <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-xs font-bold hover:-translate-y-0.5 transition">
          Open my dashboard <ArrowRight size={24} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
