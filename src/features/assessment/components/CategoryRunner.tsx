import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react'
import { useToast } from '../../../components/toastContext'
import { actions, getCategoryRecord, useWhoAmI } from '../../../store/whoAmIStore'
import { topCareer } from '../categories/quickDiscovery'
import { categoryProgress, firstMissingOnPage, isAnswered, pageCount, questionsOnPage } from '../scoring'
import type { AnswerValue, AssessmentCategory } from '../types'
import { QuestionField } from './QuestionField'
import { CategoryResultView } from './CategoryResultView'

interface CategoryRunnerProps {
  category: AssessmentCategory
  /** Zero-based page, owned by the URL so refresh and the back button keep the place. */
  page: number
  onPageChange: (page: number) => void
  onExit: () => void
}

export function CategoryRunner({ category, page, onPageChange, onExit }: CategoryRunnerProps) {
  const state = useWhoAmI()
  const record = getCategoryRecord(state, category.id)
  const showToast = useToast()
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [showResult, setShowResult] = useState(record.result !== null)
  const fieldRefs = useRef(new Map<string, HTMLElement>())
  const headingRef = useRef<HTMLHeadingElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const previousPage = useRef(page)

  const pages = pageCount(category)
  const isLastPage = page >= pages - 1
  const pageQuestions = questionsOnPage(category, page)
  const progress = categoryProgress(category, record.answers)
  const percent = progress.required ? Math.round((progress.answeredRequired / progress.required) * 100) : 100

  // Numbering counts the questions that carry a number on screen (text prompts are unnumbered).
  const numbered = category.questions.filter((question) => question.kind !== 'reflection' && question.kind !== 'shortText')

  // Remember the page so "continue" from the hub lands here.
  useEffect(() => {
    if (record.page !== page) actions.setPage(category.id, page)
  }, [category.id, page, record.page])

  // Moving between pages: start at the top and move focus to the heading for screen readers.
  useEffect(() => {
    if (previousPage.current === page) return
    previousPage.current = page
    window.scrollTo({ top: 0, behavior: 'instant' })
    headingRef.current?.focus({ preventScroll: true })
  }, [page])

  function setAnswer(questionId: string, value: AnswerValue) {
    actions.setAnswer(category.id, questionId, value)
    setTouched((current) => new Set(current).add(questionId))
  }

  function handleNext() {
    const missing = firstMissingOnPage(category, page, record.answers)
    if (missing) {
      setTouched((current) => {
        const next = new Set(current)
        pageQuestions.forEach((question) => next.add(question.id))
        return next
      })
      const field = fieldRefs.current.get(missing.id)
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      field?.querySelector<HTMLElement>('input, textarea, [role="slider"]')?.focus({ preventScroll: true })
      showToast(isLastPage ? category.copy.missingToast : 'Answer the highlighted questions to continue.')
      return
    }
    if (!isLastPage) {
      onPageChange(page + 1)
      return
    }
    const result = category.score(record.answers)
    actions.completeCategory(category.id, result, category.id === 'quick' ? topCareer(result.ranking) : undefined)
    setShowResult(true)
    showToast(category.copy.submittedToast)
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }

  function handleBack() {
    if (page > 0) onPageChange(page - 1)
    else onExit()
  }

  function handleClear() {
    actions.clearCategory(category.id)
    setTouched(new Set())
    setShowResult(false)
    if (page !== 0) onPageChange(0)
    showToast('Questionnaire answers cleared.')
  }

  return (
    <section className="pt-6 sm:pt-8" aria-labelledby="form-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">{category.copy.eyebrow}</div>
          <h2 id="form-heading" ref={headingRef} tabIndex={-1} className="section-title text-[27px] sm:text-[32px] font-extrabold mt-1 outline-none">
            {category.copy.title}
            <span className="text-[#8b76cf]">.</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl">{category.copy.description}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-3 py-2 text-[10px] font-bold">
          <Clock3 size={24} aria-hidden="true" /> About {category.estimatedMinutes} minutes
        </span>
      </div>

      <div className="rounded-[22px] overflow-hidden border-[1.5px] border-ink bg-white shadow-panel mb-4">
        <div className="h-2 bg-lilac" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={progress.required} aria-valuenow={progress.answeredRequired}>
          <div className="h-full bg-ink transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
        <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">{category.copy.progressEyebrow}</div>
            <h3 className="section-title text-xl sm:text-2xl font-extrabold mt-1">{category.copy.progressTitle}</h3>
            <p className="text-xs text-muted mt-1">
              {category.copy.progressHint}
              {pages > 1 && ` Page ${page + 1} of ${pages}.`}
            </p>
          </div>
          <div className="text-right min-w-[90px]">
            <div className="section-title text-2xl font-extrabold">
              {progress.answeredRequired} / {progress.required}
            </div>
            <div className="text-[10px] text-muted">answered</div>
          </div>
        </div>
      </div>

      <form
        key={page}
        className={`step-enter ${category.gridClassName}`}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          handleNext()
        }}
      >
        {pageQuestions.map((question) => {
          const index = numbered.indexOf(question)
          const value = record.answers[question.id]
          return (
            <QuestionField
              key={question.id}
              ref={(element) => {
                if (element) fieldRefs.current.set(question.id, element)
                else fieldRefs.current.delete(question.id)
              }}
              question={question}
              number={index >= 0 ? index + 1 : undefined}
              total={numbered.length}
              value={value}
              invalid={question.required && touched.has(question.id) && !isAnswered(question, value)}
              onChange={(next) => setAnswer(question.id, next)}
            />
          )
        })}

        <div className="xl:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button type="button" onClick={handleBack} className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink py-2">
              <ArrowLeft size={24} aria-hidden="true" /> {page > 0 ? 'Previous page' : 'All sections'}
            </button>
            <button type="button" onClick={handleClear} className="text-xs font-semibold text-muted underline underline-offset-4 hover:text-ink py-2">
              Clear answers
            </button>
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-xs font-bold shadow-[0_3px_0_rgba(23,23,23,.2)] hover:-translate-y-0.5 transition">
            {isLastPage ? category.copy.submitLabel : 'Next page'} <ArrowRight size={24} aria-hidden="true" />
          </button>
        </div>

        {isLastPage && showResult && record.result && (
          <div ref={resultRef} className="xl:col-span-2">
            <CategoryResultView
              key={record.result.completedAt}
              categoryId={category.id}
              result={record.result}
              answers={record.answers}
              onReview={() => {
                setShowResult(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        )}
      </form>
    </section>
  )
}
