import { describe, expect, it } from 'vitest'
import { createDefaultState, getSuggestedCareer, parseStoredState } from './whoAmIStore'

const v1User = {
  version: 1,
  draft: { activity: 'design', interests: ['design', 'technology'], strength: 'visual', workValue: 'creativity', environment: 'collaborative', reflection: 'Build a small app' },
  assessment: {
    answers: { activity: 'design', interests: ['design', 'technology'], strength: 'visual', workValue: 'creativity', environment: 'collaborative', reflection: 'Build a small app' },
    ranked: [
      { id: 'product', score: 9.5 },
      { id: 'ux', score: 8.25 },
      { id: 'front', score: 1.25 },
      { id: 'learning', score: 0 },
      { id: 'coach', score: 0 },
    ],
    completedAt: '2026-10-14T08:00:00.000Z',
  },
  recommendedCareer: 'ux',
  ikigai: ['Design', 'Storytelling'],
  skills: [{ name: 'Public speaking', value: 35 }],
  experiments: [{ id: 'custom-1', title: 'Try it', description: '', duration: 'YOUR IDEA', tag: 'Self-discovery', icon: 'custom', tone: 'white', done: true }],
  reflections: [{ text: 'I enjoyed it', createdAt: '2026-10-14T08:42:31.000Z' }],
}

describe('v1 → v2 migration', () => {
  const migrated = parseStoredState(null, JSON.stringify(v1User))

  it('keeps every piece of dashboard data', () => {
    expect(migrated.version).toBe(2)
    expect(migrated.recommendedCareer).toBe('ux')
    expect(migrated.ikigai).toEqual(['Design', 'Storytelling'])
    expect(migrated.skills).toEqual(v1User.skills)
    expect(migrated.experiments).toEqual(v1User.experiments)
    expect(migrated.reflections).toEqual(v1User.reflections)
  })

  it('moves the old form into the quick category with its result', () => {
    const quick = migrated.assessment.quick
    expect(quick.answers.activity).toBe('design')
    expect(quick.answers.interests).toEqual(['design', 'technology'])
    expect(quick.answers.reflection).toBe('Build a small app')
    expect(quick.result?.ranking).toEqual(['product', 'ux', 'front', 'learning', 'coach'])
    expect(quick.result?.scores.product).toBe(100)
    expect(quick.result?.completedAt).toBe('2026-10-14T08:00:00.000Z')
    expect(getSuggestedCareer(migrated)).toBe('product')
  })

  it('migrates a v1 user who never started the form', () => {
    const fresh = parseStoredState(null, JSON.stringify({ ...v1User, draft: {}, assessment: null }))
    expect(fresh.assessment).toEqual({})
    expect(fresh.skills).toEqual(v1User.skills)
  })

  it('prefers v2 data when both keys exist', () => {
    const v2 = { ...createDefaultState(), ikigai: ['Freedom'] }
    expect(parseStoredState(JSON.stringify(v2), JSON.stringify(v1User)).ikigai).toEqual(['Freedom'])
  })
})

describe('parseStoredState robustness', () => {
  it('falls back to defaults on broken or foreign data', () => {
    expect(parseStoredState('{not json')).toEqual(createDefaultState())
    expect(parseStoredState(JSON.stringify({ version: 99 }))).toEqual(createDefaultState())
    expect(parseStoredState(null, null)).toEqual(createDefaultState())
  })

  it('drops malformed answers and results field by field', () => {
    const raw = JSON.stringify({
      ...createDefaultState(),
      assessment: {
        good: { answers: { a: 40, b: 'x', c: ['y'], bad: { nested: true } }, page: 2, result: null },
        broken: 'nope',
        badResult: { answers: {}, page: -3, result: { scores: 'x' } },
      },
    })
    const parsed = parseStoredState(raw)
    expect(parsed.assessment.good.answers).toEqual({ a: 40, b: 'x', c: ['y'] })
    expect(parsed.assessment.good.page).toBe(2)
    expect(parsed.assessment.broken).toBeUndefined()
    expect(parsed.assessment.badResult).toEqual({ answers: {}, page: 0, result: null })
  })
})
