import { describe, expect, it } from 'vitest'
import { toExperiment } from '../../../data/dashboard'
import { hasExperiment } from '../../../data/experimentText'
import { STORAGE_KEY, actions, parseStoredState } from '../../../store/whoAmIStore'
import { INTEREST_ITEMS, RIASEC_TYPES, type RiasecProfile } from './careerInterest'
import { CONFIDENCE_ITEMS, GROWTH_ACTIONS, QUADRANTS, scoreStrengths, strengths, strengthsMap } from './strengths'

const profile = (values: Partial<RiasecProfile>, base = 50): RiasecProfile => ({ R: base, I: base, A: base, S: base, E: base, C: base, ...values })

describe('Strengths & Potential (RIASEC self-efficacy)', () => {
  it('has 48 required items, 8 per type, none repeating a Category 04 activity', () => {
    expect(strengths.questions).toHaveLength(48)
    for (const type of RIASEC_TYPES) expect(CONFIDENCE_ITEMS.filter((item) => item.type === type)).toHaveLength(8)
    const interestTexts = new Set(INTEREST_ITEMS.flatMap((item) => [item.th, item.en.toLowerCase()]))
    for (const item of CONFIDENCE_ITEMS) {
      expect(interestTexts.has(item.th)).toBe(false)
      expect(interestTexts.has(item.en.toLowerCase())).toBe(false)
    }
    // Question ids must not collide with Category 04's either.
    expect(strengths.questions.every((question) => question.id.startsWith('efficacy'))).toBe(true)
  })

  it('records source and rights status on every item', () => {
    expect(strengths.questions.every((question) => question.source?.includes('Who Am I? original') && question.source.includes('rights'))).toBe(true)
  })

  it('scores confidence as the mean of 8 items per type', () => {
    const answers = Object.fromEntries(CONFIDENCE_ITEMS.map((item) => [`efficacy${item.code}`, item.type === 'S' ? 80 : 30]))
    expect(scoreStrengths(answers).scores).toEqual({ R: 30, I: 30, A: 30, S: 80, E: 30, C: 30 })
  })

  it('places each type in the right box against the person’s own averages', () => {
    // Interest mean 50: I, A high. Confidence mean 50: I, C high.
    const map = strengthsMap(profile({ I: 80, A: 80, C: 20, R: 20, S: 50, E: 50 }), profile({ I: 80, C: 80, A: 20, R: 20, S: 50, E: 50 }))
    const box = Object.fromEntries(map.map((placement) => [placement.type, placement.quadrant]))
    expect(box.I).toBe('love') // interested + confident
    expect(box.A).toBe('grow') // interested, not yet confident
    expect(box.C).toBe('able') // confident, less interested
    expect(box.R).toBe('explore') // neither yet
  })

  it('counts a score equal to the average as high', () => {
    // S and E sit exactly on both averages (50).
    const map = strengthsMap(profile({ I: 80, R: 20 }), profile({ I: 80, R: 20 }))
    expect(map.find((placement) => placement.type === 'S')?.quadrant).toBe('love')
    // A completely flat profile puts everything in "love" rather than calling anything low.
    expect(strengthsMap(profile({}), profile({})).every((placement) => placement.quadrant === 'love')).toBe(true)
  })

  it('never uses VIA, CliftonStrengths or Gallup vocabulary, or the word "weakness"', () => {
    const text = JSON.stringify({ CONFIDENCE_ITEMS, QUADRANTS, GROWTH_ACTIONS, copy: strengths.copy, summary: strengths.summary })
    for (const word of ['VIA', 'Clifton', 'Gallup', 'StrengthsFinder', 'Signature Strength', 'weakness', 'จุดอ่อน']) expect(text).not.toContain(word)
  })

  it('"add as an experiment" puts the Micro-Action on the dashboard list', () => {
    actions.addExperiment(toExperiment(GROWTH_ACTIONS.A, 'en'))
    const saved = parseStoredState(localStorage.getItem(STORAGE_KEY))
    const added = saved.experiments.find((experiment) => experiment.key === 'growth:A')
    expect(added).toMatchObject({ done: false, title: GROWTH_ACTIONS.A.title.en, tag: 'Strengths · Artistic' })
    expect(hasExperiment(saved.experiments, 'growth:A')).toBe(true)
  })
})
