import { NotebookPen } from 'lucide-react'
import type { AnswerValue, ChoiceQuestion, Question, ScaleQuestion, TextQuestion } from '../types'
import { VasInput } from './VasInput'

interface QuestionFieldProps {
  ref?: (element: HTMLElement | null) => void
  question: Question
  /** Position among numbered (non-text) questions, e.g. 3 of 5. */
  number?: number
  total?: number
  value: AnswerValue | undefined
  invalid: boolean
  onChange: (value: AnswerValue) => void
}

const chipText: Record<Question['kind'], string> = {
  single: 'Choose one',
  scenario: 'Choose one',
  multi: 'Choose all that apply',
  scale: 'Tap anywhere on the line',
  shortText: 'Optional',
  reflection: 'Optional',
}

const isTextQuestion = (question: Question): question is TextQuestion => question.kind === 'shortText' || question.kind === 'reflection'

export function QuestionField(props: QuestionFieldProps) {
  const { question } = props
  return isTextQuestion(question) ? <TextField {...props} question={question} /> : <FieldsetQuestion {...props} question={question} />
}

function FieldsetQuestion({ ref, question, number, total, value, invalid, onChange }: QuestionFieldProps & { question: ChoiceQuestion | ScaleQuestion }) {
  const headingId = `q-${question.id}`
  const helpId = `${headingId}-help`

  return (
    <fieldset
      ref={ref}
      className={`form-question ${invalid ? 'invalid' : ''} ${question.className ?? ''}`}
      aria-labelledby={headingId}
      aria-describedby={invalid ? helpId : undefined}
      aria-invalid={invalid}
      data-question-id={question.id}
    >
      <div className={`flex ${question.kind !== 'scale' && question.wrapHeader ? 'flex-wrap' : ''} items-start justify-between gap-3`}>
        <div>
          {number !== undefined && total !== undefined && (
            <div className="text-[10px] font-bold text-accent tracking-[.12em] uppercase">Question {number} of {total}</div>
          )}
          <h3 id={headingId} className="font-bold text-sm mt-2">
            {question.prompt}
            {question.required && (
              <>
                {' '}
                <span className="text-[#bd4f42]" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </>
            )}
          </h3>
        </div>
        <span className="rounded-full bg-paper px-2.5 py-1.5 text-[9px] font-semibold text-muted">{chipText[question.kind]}</span>
      </div>

      {question.kind === 'scale' ? (
        <div className="mt-5">
          <VasInput
            value={typeof value === 'number' ? value : undefined}
            onChange={onChange}
            labelledBy={headingId}
            describedBy={invalid ? helpId : undefined}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
            invalid={invalid}
          />
        </div>
      ) : (
        <div className={`${question.layout ?? 'space-y-2'} mt-4`}>
          {question.options.map((option) => (
            <label key={option.value} className={`form-choice ${option.className ?? ''}`}>
              <input
                type={question.kind === 'multi' ? 'checkbox' : 'radio'}
                name={question.id}
                value={option.value}
                checked={Array.isArray(value) ? value.includes(option.value) : value === option.value}
                onChange={(event) => {
                  if (question.kind !== 'multi') return onChange(option.value)
                  const current = Array.isArray(value) ? value : []
                  onChange(event.target.checked ? [...current, option.value] : current.filter((item) => item !== option.value))
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {invalid && (
        <p id={helpId} className="text-danger text-[11px] mt-2.5">
          {question.help ?? 'Please answer this question to continue.'}
        </p>
      )}
    </fieldset>
  )
}

function TextField({ ref, question, value, invalid, onChange }: QuestionFieldProps & { question: TextQuestion }) {
  const inputId = `q-${question.id}`
  const text = typeof value === 'string' ? value : ''

  return (
    <div ref={ref} className={`form-question bg-[#F4EFFF] ${invalid ? 'invalid' : ''} ${question.className ?? ''}`} data-question-id={question.id}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold text-accent tracking-[.12em] uppercase">
            {question.required ? 'Reflection' : 'Optional reflection'}
          </div>
          <label htmlFor={inputId} className="font-bold text-sm block mt-2">
            {question.prompt}
          </label>
          {question.hint && <p className="text-[11px] text-muted mt-1">{question.hint}</p>}
        </div>
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-white" aria-hidden="true">
          <NotebookPen size={24} />
        </span>
      </div>
      {question.kind === 'reflection' ? (
        <textarea
          id={inputId}
          rows={3}
          maxLength={question.maxLength}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder}
          className="w-full mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs outline-none focus:border-black resize-y"
        />
      ) : (
        <input
          id={inputId}
          maxLength={question.maxLength}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder}
          className="w-full mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs outline-none focus:border-black"
        />
      )}
      {invalid && <p className="text-danger text-[11px] mt-2.5">{question.help ?? 'Please answer this question to continue.'}</p>}
    </div>
  )
}
