import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Compass, Waypoints } from 'lucide-react'
import { careers, isCareerId } from '../../../data/careers'
import { actions } from '../../../store/whoAmIStore'
import type { ResultViewProps } from './resultViewTypes'

/** The template's "first set of clues" card. */
export function QuickDiscoveryResult({ result, answers, onReview }: ResultViewProps) {
  const navigate = useNavigate()
  const ranked = result.ranking.filter(isCareerId)
  // Which suggested path the user is viewing; null = the top-ranked one.
  const [viewed, setViewed] = useState<string | null>(null)
  const current = viewed && isCareerId(viewed) ? viewed : (ranked[0] ?? 'ux')
  const alternatives = ranked.filter((id) => id !== current).slice(0, 3)
  const note = typeof answers.reflection === 'string' ? answers.reflection.trim() : ''

  function viewOnRoadmap() {
    actions.setRecommendedCareer(current)
    navigate(`/dashboard?career=${current}#roadmap`)
  }

  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-lemon p-5 sm:p-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="eyebrow text-black/60">Your first set of clues</div>
          <h3 className="section-title text-2xl font-extrabold mt-1">A path worth exploring: {careers[current].name}</h3>
          <p className="text-xs text-black/65 mt-2 max-w-2xl">
            {careers[current].recommendation} Your answers suggest possibilities to try, not a label or a final career decision.
          </p>
        </div>
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/70" aria-hidden="true">
          <Compass size={24} />
        </span>
      </div>
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
        <div>
          <div className="eyebrow mb-2">Other routes you could explore</div>
          <div className="flex flex-wrap gap-2">
            {alternatives.map((id) => (
              <button key={id} type="button" className="pill" onClick={() => setViewed(id)}>
                {careers[id].name} <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          {note && <p className="text-[11px] leading-relaxed text-muted mt-3">Your note: “{note}”</p>}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={viewOnRoadmap} className="rounded-full bg-ink text-white px-5 py-3 text-xs font-bold hover:bg-black/80">
            View path on 3D roadmap <Waypoints size={24} className="inline ml-1" aria-hidden="true" />
          </button>
          {onReview && (
            <button type="button" onClick={onReview} className="rounded-full border border-black/15 px-5 py-3 text-xs font-bold hover:bg-paper">
              Review my answers
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
