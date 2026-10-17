import { describe, expect, it } from 'vitest'
import {
  categoryProgress,
  clampScale,
  firstMissingOnPage,
  isAnswered,
  keyedScaleValue,
  pageCount,
  questionsOnPage,
  rankScores,
  scoreScaleDimensions,
} from './scoring'
import type { AssessmentCategory, Question, ScaleQuestion } from './types'

const text = (value: string) => ({ th: value, en: value })

const scale = (id: string, dimension: string, reverseKeyed = false): ScaleQuestion => ({ id, kind: 'scale', prompt: text(id), required: true, dimension, reverseKeyed })

const sampleCategory = (questions: Question[], pageSize = 2): AssessmentCategory => ({
  id: 'sample',
  number: '99',
  title: text('Sample'),
  summary: text(''),
  estimatedMinutes: 1,
  pageSize,
  gridClassName: '',
  questions,
  copy: {
    eyebrow: text(''),
    title: text(''),
    description: text(''),
    progressEyebrow: text(''),
    progressTitle: text(''),
    progressHint: text(''),
    submitLabel: text(''),
    missingToast: text(''),
    submittedToast: text(''),
  },
  score: () => ({ scores: {}, ranking: [] }),
})

describe('scale keying (0–100)', () => {
  it('scores reverse-keyed items as 100 − x', () => {
    expect(keyedScaleValue(scale('a', 'x', true), 30)).toBe(70)
    expect(keyedScaleValue(scale('a', 'x', true), 0)).toBe(100)
    expect(keyedScaleValue(scale('a', 'x', false), 30)).toBe(30)
  })

  it('clamps and rounds out-of-range values before keying', () => {
    expect(clampScale(-5)).toBe(0)
    expect(clampScale(140)).toBe(100)
    expect(clampScale(49.6)).toBe(50)
    expect(keyedScaleValue(scale('a', 'x', true), 120)).toBe(0)
  })
})

describe('scoreScaleDimensions', () => {
  const questions = [scale('e1', 'E'), scale('e2', 'E', true), scale('c1', 'C'), scale('c2', 'C', true)]

  it('averages keyed values per dimension', () => {
    // E: 80 and (100 − 20) = 80 → 80. C: 40 and (100 − 100) = 0 → 20.
    expect(scoreScaleDimensions(questions, { e1: 80, e2: 20, c1: 40, c2: 100 })).toEqual({ E: 80, C: 20 })
  })

  it('gives 50 everywhere when every answer is the midpoint', () => {
    expect(scoreScaleDimensions(questions, { e1: 50, e2: 50, c1: 50, c2: 50 })).toEqual({ E: 50, C: 50 })
  })

  it('leaves out dimensions with no answers instead of inventing a score', () => {
    expect(scoreScaleDimensions(questions, { e1: 60 })).toEqual({ E: 60 })
  })

  it('ignores non-numeric answers', () => {
    expect(scoreScaleDimensions(questions, { e1: 'x', e2: 10 })).toEqual({ E: 90 })
  })
})

describe('isAnswered', () => {
  it('treats an untouched scale as unanswered — not as 50', () => {
    expect(isAnswered(scale('a', 'x'), undefined)).toBe(false)
    expect(isAnswered(scale('a', 'x'), 0)).toBe(true)
  })

  it('handles choices and text', () => {
    expect(isAnswered({ id: 'm', kind: 'multi', prompt: text(''), required: true, options: [] }, [])).toBe(false)
    expect(isAnswered({ id: 'm', kind: 'multi', prompt: text(''), required: true, options: [] }, ['a'])).toBe(true)
    expect(isAnswered({ id: 's', kind: 'single', prompt: text(''), required: true, options: [] }, '')).toBe(false)
    expect(isAnswered({ id: 't', kind: 'reflection', prompt: text(''), required: false, maxLength: 10 }, '   ')).toBe(false)
  })
})

describe('rankScores', () => {
  it('orders best first and keeps the given order on ties', () => {
    expect(rankScores({ a: 10, b: 30, c: 30, d: 5 })).toEqual(['b', 'c', 'a', 'd'])
  })
})

describe('paging and progress', () => {
  const questions: Question[] = [scale('q1', 'x'), scale('q2', 'x'), scale('q3', 'x'), { id: 'note', kind: 'reflection', prompt: text(''), required: false, maxLength: 10 }]
  const category = sampleCategory(questions, 2)

  it('splits questions into pages', () => {
    expect(pageCount(category)).toBe(2)
    expect(questionsOnPage(category, 1).map((q) => q.id)).toEqual(['q3', 'note'])
  })

  it('finds the first missing required question on a page', () => {
    expect(firstMissingOnPage(category, 0, { q1: 10 })?.id).toBe('q2')
    expect(firstMissingOnPage(category, 1, { q3: 10 })).toBeUndefined()
  })

  it('counts only required questions toward completion', () => {
    expect(categoryProgress(category, { q1: 1, q2: 2, q3: 3 })).toMatchObject({ required: 3, answeredRequired: 3, complete: true, total: 4 })
  })
})
