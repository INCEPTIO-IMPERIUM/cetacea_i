import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, Clock3, Compass, ListChecks, NotebookPen, Waypoints } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { useToast } from '../components/toastContext'
import { isAnswered, questions, rankCareers, type DiscoveryAnswers, type Question, type QuestionId } from '../data/assessment'
import { careers, type CareerId } from '../data/careers'
import { actions, useWhoAmI } from '../store/whoAmIStore'

export function AssessmentPage() {
  const { draft, assessment } = useWhoAmI()
  const showToast = useToast()
  const navigate = useNavigate()
  const [touched, setTouched] = useState<Set<QuestionId>>(() => new Set())
  const [showResult, setShowResult] = useState(assessment !== null)
  // Which suggested path the user is currently viewing; null = the top-ranked one.
  const [viewedCareer, setViewedCareer] = useState<CareerId | null>(null)
  const questionRefs = useRef<Partial<Record<QuestionId, HTMLFieldSetElement | null>>>({})
  const resultRef = useRef<HTMLDivElement>(null)

  const answeredCount = questions.filter((question) => isAnswered(draft, question.id)).length
  const percent = Math.round((answeredCount / questions.length) * 100)

  function updateDraft(next: DiscoveryAnswers, questionId?: QuestionId) {
    actions.setDraft(next)
    if (questionId) setTouched((current) => new Set(current).add(questionId))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(new Set(questions.map((question) => question.id)))
    const firstMissing = questions.find((question) => !isAnswered(draft, question.id))
    if (firstMissing) {
      const fieldset = questionRefs.current[firstMissing.id]
      fieldset?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      fieldset?.querySelector('input')?.focus({ preventScroll: true })
      showToast('Answer the highlighted questions to see your paths.')
      return
    }
    const answers = { ...draft, reflection: draft.reflection.trim() }
    actions.completeAssessment(answers, rankCareers(answers))
    setViewedCareer(null)
    setShowResult(true)
    showToast('Your answers are ready — explore the suggested paths.')
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }

  function handleReset() {
    actions.clearAssessment()
    setTouched(new Set())
    setShowResult(false)
    setViewedCareer(null)
    showToast('Questionnaire answers cleared.')
  }

  const topCareer = assessment?.ranked[0]?.id ?? 'ux'
  const currentCareer = viewedCareer ?? topCareer
  const alternatives = (assessment?.ranked ?? []).filter(({ id }) => id !== currentCareer).slice(0, 3)

  function viewOnRoadmap() {
    actions.setRecommendedCareer(currentCareer)
    navigate(`/dashboard?career=${currentCareer}#roadmap`)
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          <BrandMark variant="app" to="/dashboard" tagline="CAREER & SELF-DISCOVERY" ariaLabel="Back to Who Am I dashboard" />
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5 text-xs font-bold hover:bg-lemon transition">
            <ArrowLeft size={24} aria-hidden="true" />
            <span className="hidden sm:inline">Back to dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="pt-7 sm:pt-9 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-lilac px-3 py-2 text-[10px] font-bold">
            <ListChecks size={24} aria-hidden="true" /> YOUR DISCOVERY JOURNEY · STEP 1
          </div>
          <h1 className="section-title text-3xl sm:text-4xl font-extrabold mt-4">
            A little closer to <span className="text-accent">you.</span>
          </h1>
          <p className="text-sm text-muted mt-2 max-w-2xl">
            Take this short questionnaire at your own pace. Your choices are clues to explore, not a label or a final decision.
          </p>
        </div>

        <section className="pt-6 sm:pt-8" aria-labelledby="form-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="eyebrow">01 / Start with a few questions</div>
              <h2 id="form-heading" className="section-title text-[27px] sm:text-[32px] font-extrabold mt-1">
                Your discovery form<span className="text-[#8b76cf]">.</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl">
                A short guided questionnaire inspired by familiar form tools. There are no right or wrong answers — choose what feels true today.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-3 py-2 text-[10px] font-bold">
              <Clock3 size={24} aria-hidden="true" /> About 3 minutes
            </span>
          </div>

          <div className="rounded-[22px] overflow-hidden border-[1.5px] border-ink bg-white shadow-panel mb-4">
            <div
              className="h-2 bg-lilac"
              role="progressbar"
              aria-label="Questions answered"
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuenow={answeredCount}
            >
              <div className="h-full bg-ink transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
            <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="eyebrow">A little context goes a long way</div>
                <h3 className="section-title text-xl sm:text-2xl font-extrabold mt-1">Tell us how you like to explore.</h3>
                <p className="text-xs text-muted mt-1">Answer {questions.length} required questions to see a few career paths worth exploring.</p>
              </div>
              <div className="text-right min-w-[90px]">
                <div className="section-title text-2xl font-extrabold">{answeredCount} / {questions.length}</div>
                <div className="text-[10px] text-muted">answered</div>
              </div>
            </div>
          </div>

          <form className="grid grid-cols-1 xl:grid-cols-2 gap-4" noValidate onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                ref={(element) => {
                  questionRefs.current[question.id] = element
                }}
                question={question}
                number={index + 1}
                total={questions.length}
                answers={draft}
                invalid={touched.has(question.id) && !isAnswered(draft, question.id)}
                onChange={updateDraft}
              />
            ))}

            <div className="form-question xl:col-span-2 bg-[#F4EFFF]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold text-accent tracking-[.12em] uppercase">Optional reflection</div>
                  <label htmlFor="formReflection" className="font-bold text-sm block mt-2">
                    Is there a career, project, or problem you have always wanted to try?
                  </label>
                  <p className="text-[11px] text-muted mt-1">A phrase is enough. You can come back to this later.</p>
                </div>
                <span className="grid place-items-center w-10 h-10 rounded-2xl bg-white" aria-hidden="true">
                  <NotebookPen size={24} />
                </span>
              </div>
              <textarea
                id="formReflection"
                rows={3}
                maxLength={300}
                value={draft.reflection}
                onChange={(event) => updateDraft({ ...draft, reflection: event.target.value })}
                placeholder="I'd love to try building..., learning about..., or helping with..."
                className="w-full mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs outline-none focus:border-black resize-y"
              />
            </div>

            <div className="xl:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button type="button" onClick={handleReset} className="text-xs font-semibold text-muted underline underline-offset-4 hover:text-ink py-2">
                Clear answers
              </button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-xs font-bold shadow-[0_3px_0_rgba(23,23,23,.2)] hover:-translate-y-0.5 transition">
                Find paths worth exploring <ArrowRight size={24} aria-hidden="true" />
              </button>
            </div>

            {showResult && assessment && (
              <div ref={resultRef} className="xl:col-span-2 rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
                <div className="bg-lemon p-5 sm:p-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="eyebrow text-black/60">Your first set of clues</div>
                    <h3 className="section-title text-2xl font-extrabold mt-1">A path worth exploring: {careers[currentCareer].name}</h3>
                    <p className="text-xs text-black/65 mt-2 max-w-2xl">
                      {careers[currentCareer].recommendation} Your answers suggest possibilities to try, not a label or a final career decision.
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
                      {alternatives.map(({ id }) => (
                        <button key={id} type="button" className="pill" onClick={() => setViewedCareer(id)}>
                          {careers[id].name} <span aria-hidden="true">↗</span>
                        </button>
                      ))}
                    </div>
                    {assessment.answers.reflection && (
                      <p className="text-[11px] leading-relaxed text-muted mt-3">Your note: “{assessment.answers.reflection}”</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={viewOnRoadmap} className="rounded-full bg-ink text-white px-5 py-3 text-xs font-bold hover:bg-black/80">
                      View path on 3D roadmap <Waypoints size={24} className="inline ml-1" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResult(false)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="rounded-full border border-black/15 px-5 py-3 text-xs font-bold hover:bg-paper"
                    >
                      Review my answers
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </section>

        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-8 text-[10px] text-muted">
          <span>© 2026 Who Am I? · Built for curious minds.</span>
          <span>Explore gently. Grow at your own pace.</span>
        </footer>
      </main>
    </>
  )
}

interface QuestionCardProps {
  ref: (element: HTMLFieldSetElement | null) => void
  question: Question
  number: number
  total: number
  answers: DiscoveryAnswers
  invalid: boolean
  onChange: (next: DiscoveryAnswers, questionId: QuestionId) => void
}

function QuestionCard({ ref, question, number, total, answers, invalid, onChange }: QuestionCardProps) {
  const headingId = `q-${question.id}`
  const helpId = `${headingId}-help`
  const value = answers[question.id]

  function handleChange(optionValue: string, checked: boolean) {
    if (question.kind === 'multi') {
      const current = Array.isArray(value) ? value : []
      const next = checked ? [...current, optionValue] : current.filter((item) => item !== optionValue)
      onChange({ ...answers, [question.id]: next }, question.id)
    } else {
      onChange({ ...answers, [question.id]: optionValue }, question.id)
    }
  }

  return (
    <fieldset
      ref={ref}
      className={`form-question ${invalid ? 'invalid' : ''} ${question.className ?? ''}`}
      aria-labelledby={headingId}
      aria-describedby={invalid ? helpId : undefined}
      aria-invalid={invalid}
    >
      <div className={`flex ${question.wrapHeader ? 'flex-wrap' : ''} items-start justify-between gap-3`}>
        <div>
          <div className="text-[10px] font-bold text-accent tracking-[.12em] uppercase">Question {number} of {total}</div>
          <h3 id={headingId} className="font-bold text-sm mt-2">
            {question.title} <span className="text-[#bd4f42]" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </h3>
        </div>
        <span className="rounded-full bg-paper px-2.5 py-1.5 text-[9px] font-semibold text-muted">
          {question.kind === 'multi' ? 'Choose all that apply' : 'Choose one'}
        </span>
      </div>
      <div className={`${question.layout} mt-4`}>
        {question.options.map((option) => (
          <label key={option.value} className={`form-choice ${option.className ?? ''}`}>
            <input
              type={question.kind === 'multi' ? 'checkbox' : 'radio'}
              name={question.id}
              value={option.value}
              checked={Array.isArray(value) ? value.includes(option.value) : value === option.value}
              onChange={(event) => handleChange(option.value, event.target.checked)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {invalid && (
        <p id={helpId} className="text-danger text-[11px] mt-2.5">
          {question.help}
        </p>
      )}
    </fieldset>
  )
}
