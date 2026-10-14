/**
 * Shared shape of every Discovery Assessment category.
 * A category supplies questions + a pure `score` function; the flow, storage
 * and UI around it are generic.
 */

/** A stored answer: choice value, list of choices, a 0–100 scale point, or free text. */
export type AnswerValue = string | string[] | number

/** Answers of one category, keyed by question id. */
export type CategoryAnswers = Record<string, AnswerValue>

interface QuestionBase {
  id: string
  prompt: string
  required: boolean
  /** Shown when a required question is left empty. */
  help?: string
  /** Extra grid classes for the question card. */
  className?: string
  /** Where the item comes from (instrument + item code) — keeps every item traceable. */
  source?: string
}

export interface ChoiceOption {
  value: string
  label: string
  className?: string
}

/** `single` and `multi` are plain choices; `scenario` is a situational single choice. */
export interface ChoiceQuestion extends QuestionBase {
  kind: 'single' | 'multi' | 'scenario'
  options: ChoiceOption[]
  /** Grid classes for the option list. */
  layout?: string
  /** Let the hint chip drop below the prompt on narrow screens. */
  wrapHeader?: boolean
}

/** Agreement on a 0–100 visual analogue scale. */
export interface ScaleQuestion extends QuestionBase {
  kind: 'scale'
  /** The dimension this item scores into. */
  dimension: string
  /** Scored as `100 − x`. */
  reverseKeyed: boolean
  minLabel?: string
  maxLabel?: string
}

export interface TextQuestion extends QuestionBase {
  kind: 'shortText' | 'reflection'
  maxLength: number
  placeholder?: string
  /** Small line under the prompt. */
  hint?: string
}

export type Question = ChoiceQuestion | ScaleQuestion | TextQuestion

/** Output of a category's scorer. Scores are 0–100; `ranking` lists score keys best first. */
export interface CategoryResult {
  scores: Record<string, number>
  ranking: string[]
}

export interface StoredCategoryResult extends CategoryResult {
  completedAt: string
}

/** Copy for the generic runner screen, so each category keeps its own voice. */
export interface CategoryCopy {
  eyebrow: string
  title: string
  description: string
  progressEyebrow: string
  progressTitle: string
  progressHint: string
  submitLabel: string
  /** Toast when required answers are missing on the last page. */
  missingToast: string
  /** Toast after the category is scored. */
  submittedToast: string
}

export interface AssessmentCategory {
  id: string
  /** Display order, e.g. "01". */
  number: string
  title: string
  summary: string
  estimatedMinutes: number
  /** Questions per screen. */
  pageSize: number
  /** Grid classes for the question list. */
  gridClassName: string
  questions: Question[]
  copy: CategoryCopy
  score: (answers: CategoryAnswers) => CategoryResult
}
