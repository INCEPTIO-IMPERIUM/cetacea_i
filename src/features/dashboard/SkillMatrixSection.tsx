import { ArrowUpRight, Orbit } from 'lucide-react'
import type { Skill } from '../../data/dashboard'
import { actions } from '../../store/whoAmIStore'
import { useToast } from '../../components/toastContext'
import { InlineAddForm } from './InlineAddForm'
import { SectionHeading } from './SectionHeading'

interface SkillMatrixSectionProps {
  skills: Skill[]
  /** Skill name to briefly highlight after a search hit. */
  highlighted: string | null
  onExplorePaths: () => void
}

export function SkillMatrixSection({ skills, highlighted, onExplorePaths }: SkillMatrixSectionProps) {
  const showToast = useToast()
  const topSkills = [...skills].sort((a, b) => b.value - a.value).slice(0, 3)

  return (
    <section id="skills" className="pt-10 sm:pt-12 scroll-mt-24" aria-labelledby="skills-heading">
      <SectionHeading
        id="skills-heading"
        eyebrow="03 / See your strengths"
        title="Your skill matrix"
        description="Skills are capabilities in progress, not labels that define you."
        action={
          <InlineAddForm
            buttonLabel="Add a skill"
            inputLabel="Skill name"
            placeholder="e.g. Public speaking"
            maxLength={40}
            onAdd={(name) => {
              if (!actions.addSkill(name)) {
                showToast('That skill is already in your matrix.')
                return false
              }
              showToast(`${name} added to your matrix.`)
            }}
          />
        }
      />
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,.85fr)] gap-4">
        <div className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h3 className="font-bold text-sm">Skills I'm exploring</h3>
              <p className="text-[11px] text-muted mt-1">Move the sliders to reflect how confident you feel today.</p>
            </div>
            <span className="rounded-full bg-paper px-3 py-1.5 text-[10px] font-bold">SELF-RATED</span>
          </div>
          <div className="space-y-5">
            {skills.map((skill) => {
              const inputId = `skill-${skill.name.replace(/\W+/g, '-').toLowerCase()}`
              return (
                <div
                  key={skill.name}
                  data-skill={skill.name}
                  className={`skill-row rounded-xl transition-colors ${highlighted === skill.name ? 'bg-lemon/60 -mx-2 px-2 py-1' : ''}`}
                >
                  <label htmlFor={inputId} className="text-xs font-semibold">{skill.name}</label>
                  <input
                    id={inputId}
                    className="w-full accent-ink"
                    type="range"
                    min={0}
                    max={100}
                    value={skill.value}
                    onChange={(event) => actions.setSkillValue(skill.name, Number(event.target.value))}
                  />
                  <output htmlFor={inputId} className="text-xs font-bold text-right">{skill.value}</output>
                </div>
              )
            })}
          </div>
          <div className="mt-7 border-t border-black/10 pt-4 flex items-center justify-between gap-4">
            <p className="text-[10px] leading-relaxed text-muted max-w-sm">
              Tip: confidence grows through practice. A lower number is simply a useful place to begin.
            </p>
            <button type="button" onClick={() => showToast('Skill matrix updated.')} className="shrink-0 text-[11px] font-bold underline underline-offset-4">
              Save matrix
            </button>
          </div>
        </div>

        <div className="rounded-[22px] bg-ink text-white p-5 sm:p-6 relative overflow-hidden min-h-[280px]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-lemon">
              <Orbit size={24} aria-hidden="true" />
              <span className="eyebrow text-lemon">Pattern finder</span>
            </div>
            <h3 className="section-title text-2xl font-extrabold mt-3 max-w-[280px]">Your skills can travel with you.</h3>
            <p className="text-xs text-white/60 leading-relaxed mt-3 max-w-[300px]">
              Many careers blend a few skills. See where your current strengths might connect.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {topSkills.map((skill) => (
                <span key={skill.name} className="rounded-full bg-white/10 border border-white/15 px-3 py-2 text-[11px]">
                  {skill.name} <span className="text-white/45">{skill.value}</span>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={onExplorePaths}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-lemon text-ink px-4 py-2.5 text-[11px] font-bold hover:translate-x-1 transition"
            >
              Explore matching paths <ArrowUpRight size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="absolute -right-8 -bottom-14 w-44 h-44 rounded-full border border-white/15" />
          <div className="absolute right-4 bottom-[-35px] w-28 h-28 rounded-full border border-white/15" />
          <div className="absolute right-12 bottom-12 w-3 h-3 rounded-full bg-lavender" />
          <div className="absolute right-24 bottom-20 w-2 h-2 rounded-full bg-lemon" />
        </div>
      </div>
    </section>
  )
}
