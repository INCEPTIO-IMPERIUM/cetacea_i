import { ArrowRight, Earth, HandHeart, Heart, Lightbulb, Sparkles, type LucideIcon } from 'lucide-react'
import { ikigaiCards, type IkigaiArea } from '../../data/dashboard'
import { actions } from '../../store/whoAmIStore'
import { useToast } from '../../components/toastContext'
import { SectionHeading } from './SectionHeading'

const areaIcons: Record<IkigaiArea, LucideIcon> = { love: Heart, good: Sparkles, world: HandHeart, need: Earth }

export function IkigaiSection({ selected }: { selected: string[] }) {
  const showToast = useToast()
  const count = selected.length

  return (
    <section id="ikigai" className="pt-10 sm:pt-12 scroll-mt-24" aria-labelledby="ikigai-heading">
      <SectionHeading
        id="ikigai-heading"
        eyebrow="02 / Know yourself"
        title="Your Ikigai ingredients"
        description="Choose what resonates right now. You can change your mind anytime."
        action={
          <button
            type="button"
            onClick={() => {
              actions.clearIkigai()
              showToast('Clues reset — start fresh.')
            }}
            className="text-[11px] font-semibold underline underline-offset-4 text-muted hover:text-ink"
          >
            Reset selections
          </button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {ikigaiCards.map((card, index) => {
          const Icon = areaIcons[card.area]
          return (
            <article key={card.area} className={`rounded-[20px] ${card.tone} border border-black/15 p-4 sm:p-5 min-h-[210px]`}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/70 border border-black/10 grid place-items-center" aria-hidden="true">
                  <Icon size={24} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[.12em] text-black/50">0{index + 1}</span>
              </div>
              <h3 className="font-bold text-sm mt-4">{card.title}</h3>
              <p className="text-[11px] leading-relaxed text-black/60 mt-1 mb-4">{card.hint}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={card.title}>
                {card.options.map((option) => (
                  <button key={option} type="button" className="pill" aria-pressed={selected.includes(option)} onClick={() => actions.toggleIkigai(option)}>
                    {option}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-8 h-8 rounded-xl bg-lemon" aria-hidden="true">
            <Lightbulb size={24} />
          </span>
          <div>
            <p className="text-xs font-bold">Your reflection, not a score</p>
            <p className="text-[11px] text-muted mt-0.5" aria-live="polite">
              {count
                ? `${count} ${count === 1 ? 'clue' : 'clues'} selected. Look for themes that show up in more than one area.`
                : 'Select a few ingredients to start spotting patterns.'}
            </p>
          </div>
        </div>
        {/* Changes already save as they happen; the button confirms that, as in the template. */}
        <button
          type="button"
          onClick={() => showToast(`${count} personal clues saved.`)}
          className="rounded-full bg-ink text-white px-4 py-2.5 text-[11px] font-bold hover:bg-black/80 transition"
        >
          Save my clues <ArrowRight size={24} className="inline ml-1" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
