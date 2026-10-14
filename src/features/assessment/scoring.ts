import type { AnswerValue, AssessmentCategory, CategoryAnswers, Question, ScaleQuestion } from './types'

export const SCALE_MIN = 0
export const SCALE_MAX = 100

export function clampScale(value: number): number {
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, Math.round(value)))
}

export function isAnswered(question: Question, value: AnswerValue | undefined): boolean {
  switch (question.kind) {
    case 'scale':
      return typeof value === 'number' && Number.isFinite(value)
    case 'multi':
      return Array.isArray(value) && value.length > 0
    case 'single':
    case 'scenario':
      return typeof value === 'string' && value !== ''
    case 'shortText':
    case 'reflection':
      return typeof value === 'string' && value.trim() !== ''
  }
}

/** A scale answer after keying: reverse-keyed items count as `100 − x`. */
export function keyedScaleValue(question: ScaleQuestion, value: number): number {
  const clamped = clampScale(value)
  return question.reverseKeyed ? SCALE_MAX - clamped : clamped
}

/**
 * Mean keyed score (0–100, rounded) per dimension over the answered scale items.
 * Dimensions with no answered items are left out rather than reported as 0 or 50.
 */
export function scoreScaleDimensions(questions: Question[], answers: CategoryAnswers): Record<string, number> {
  const totals = new Map<string, { sum: number; count: number }>()
  for (const question of questions) {
    if (question.kind !== 'scale') continue
    const value = answers[question.id]
    if (typeof value !== 'number') continue
    const entry = totals.get(question.dimension) ?? { sum: 0, count: 0 }
    entry.sum += keyedScaleValue(question, value)
    entry.count += 1
    totals.set(question.dimension, entry)
  }
  return Object.fromEntries([...totals].map(([dimension, { sum, count }]) => [dimension, Math.round(sum / count)]))
}

/** Score keys ordered best first; ties keep the order the keys were given in. */
export function rankScores(scores: Record<string, number>): string[] {
  return Object.keys(scores)
    .map((key, index) => ({ key, index, score: scores[key] }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ key }) => key)
}

export interface CategoryProgress {
  answered: number
  required: number
  answeredRequired: number
  total: number
  complete: boolean
}

export function categoryProgress(category: AssessmentCategory, answers: CategoryAnswers): CategoryProgress {
  let answered = 0
  let required = 0
  let answeredRequired = 0
  for (const question of category.questions) {
    const done = isAnswered(question, answers[question.id])
    if (done) answered += 1
    if (question.required) {
      required += 1
      if (done) answeredRequired += 1
    }
  }
  return { answered, required, answeredRequired, total: category.questions.length, complete: answeredRequired === required }
}

export function pageCount(category: AssessmentCategory): number {
  return Math.max(1, Math.ceil(category.questions.length / category.pageSize))
}

export function questionsOnPage(category: AssessmentCategory, page: number): Question[] {
  const start = page * category.pageSize
  return category.questions.slice(start, start + category.pageSize)
}

/** First required question on the page that is still empty, if any. */
export function firstMissingOnPage(category: AssessmentCategory, page: number, answers: CategoryAnswers): Question | undefined {
  return questionsOnPage(category, page).find((question) => question.required && !isAnswered(question, answers[question.id]))
}
