import { CalendarCheck2, Check, FlaskConical, GitBranch, MessagesSquare, PanelsTopLeft, Sparkles, Target, type LucideIcon } from 'lucide-react'
import type { Experiment, ExperimentIcon, ExperimentTone } from '../../data/dashboard'
import { actions } from '../../store/whoAmIStore'
import { useToast } from '../../components/toastContext'
import { InlineAddForm } from './InlineAddForm'
import { SectionHeading } from './SectionHeading'

const icons: Record<ExperimentIcon, LucideIcon> = {
  portfolio: PanelsTopLeft,
  interview: MessagesSquare,
  map: GitBranch,
  career: FlaskConical,
  custom: Sparkles,
}

const tones: Record<ExperimentTone, { card: string; icon: string; chip: string }> = {
  white: { card: 'bg-white', icon: 'bg-lemon', chip: 'bg-paper' },
  lilac: { card: 'bg-lilac/70', icon: 'bg-white', chip: 'bg-white/80' },
  mint: { card: 'bg-[#DDF1DB]', icon: 'bg-white', chip: 'bg-white/80' },
}

export function MicroActionsSection({ experiments }: { experiments: Experiment[] }) {
  const showToast = useToast()
  const total = experiments.length
  const done = experiments.filter((item) => item.done).length
  const remaining = total - done

  const message =
    done === 0
      ? 'Complete one experiment to start collecting real-world clues.'
      : done === total
        ? 'You did it! Review what each experiment taught you and choose what to try next.'
        : `Nice start. ${remaining} small ${remaining === 1 ? 'experiment remains' : 'experiments remain'} in your current list.`

  return (
    <section id="actions" className="pt-10 sm:pt-12 scroll-mt-24" aria-labelledby="actions-heading">
      <SectionHeading
        id="actions-heading"
        eyebrow="05 / Learn by trying"
        title="Small steps, real clues"
        description="Tiny, low-pressure experiments to test what feels right in real life."
        action={
          <InlineAddForm
            buttonLabel="Add an experiment"
            inputLabel="Experiment title"
            placeholder="What small thing will you try?"
            maxLength={90}
            onAdd={(title) => {
              actions.addExperiment({
                title,
                description: 'Keep it small enough to try this week. Afterward, note what gave you energy and what you learned.',
                duration: 'YOUR IDEA',
                tag: 'Self-discovery',
                icon: 'custom',
                tone: 'white',
              })
              showToast('Your experiment has been added.')
            }}
          />
        }
      />

      {total === 0 ? (
        <p className="rounded-[20px] border border-dashed border-black/20 p-6 text-sm text-muted">
          No experiments yet. Add one above, or pick a career on the roadmap and choose “Add a tiny experiment”.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {experiments.map((item) => {
            const Icon = icons[item.icon] ?? Sparkles
            const tone = tones[item.tone] ?? tones.white
            return (
              <article key={item.id} className={`task-item ${item.done ? 'done' : ''} rounded-[20px] ${tone.card} border border-black/15 p-5 flex flex-col min-h-[226px]`}>
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid place-items-center w-10 h-10 rounded-2xl ${tone.icon}`} aria-hidden="true">
                    <Icon size={24} />
                  </span>
                  <span className={`rounded-full ${tone.chip} px-2.5 py-1.5 text-[9px] font-bold text-muted`}>{item.duration}</span>
                </div>
                <h3 className="task-title font-bold mt-4">{item.title}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{item.description}</p>
                <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-muted flex items-center gap-1.5">
                    <Target size={24} aria-hidden="true" /> {item.tag}
                  </span>
                  <button
                    type="button"
                    aria-pressed={item.done}
                    onClick={() => {
                      actions.toggleExperiment(item.id)
                      showToast(item.done ? 'Experiment moved back to your list.' : 'Experiment completed — what did you notice?')
                    }}
                    className={`inline-flex items-center gap-2 rounded-full ${tone.chip === 'bg-paper' ? 'bg-paper' : 'bg-white'} px-3 py-2 text-[10px] font-bold hover:bg-lemon transition`}
                  >
                    <span className="task-check" aria-hidden="true">
                      <Check size={24} />
                    </span>
                    <span>{item.done ? 'Completed' : 'Mark done'}</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-4 rounded-[20px] border-[1.5px] border-ink shadow-panel bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-lemon grid place-items-center shrink-0" aria-hidden="true">
          <CalendarCheck2 size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">Your weekly experiment tracker</h3>
          <p className="text-[11px] text-muted mt-1">{message}</p>
          <div className="meter mt-3 max-w-[420px]" role="progressbar" aria-label="Experiments completed" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}>
            <span style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} />
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <div className="section-title font-extrabold text-2xl">
            <span>{done}</span>
            <span className="text-muted text-sm font-medium"> / {total}</span>
          </div>
          <div className="text-[10px] text-muted">experiments tried</div>
        </div>
      </div>
    </section>
  )
}
