import { describe, expect, it } from 'vitest'
import { CAREER_IDS, careers } from '../../data/careers'
import { createDefaultState } from '../../store/whoAmIStore'
import type { RiasecProfile } from './categories/careerInterest'
import { MATCH_WEIGHTS, matchCareers, profileCorrelation, recommendationsFor, type MatchInputs } from './matcher'

const profile = (values: Partial<RiasecProfile>, base = 20): RiasecProfile => ({ R: base, I: base, A: base, S: base, E: base, C: base, ...values })
const inputs = (overrides: Partial<MatchInputs>): MatchInputs => ({ interest: null, confidence: null, skills: [], bigFive: null, workStyle: null, ...overrides })

describe('career data', () => {
  it('has at least 15 careers covering every RIASEC type as a top interest, each with an O*NET-SOC code', () => {
    expect(CAREER_IDS.length).toBeGreaterThanOrEqual(15)
    const topTypes = new Set(CAREER_IDS.map((id) => Object.entries(careers[id].riasec).sort((a, b) => b[1] - a[1])[0][0]))
    expect([...topTypes].sort()).toEqual(['A', 'C', 'E', 'I', 'R', 'S'])
    for (const id of CAREER_IDS) {
      expect(careers[id].onet.code).toMatch(/^\d{2}-\d{4}\.\d{2}$/)
      expect(careers[id].starter.title).toBeTruthy()
    }
  })
})

describe('career matcher', () => {
  it('weights add up to 1', () => {
    expect(MATCH_WEIGHTS.interest + MATCH_WEIGHTS.confidence + MATCH_WEIGHTS.skills).toBeCloseTo(1)
  })

  it('profile correlation: identical shape → 1, opposite → −1, flat → null', () => {
    expect(profileCorrelation(profile({ A: 90, S: 80 }), profile({ A: 45, S: 40 }, 10))).toBeCloseTo(1)
    expect(profileCorrelation(profile({ R: 90 }), profile({ R: 0 }, 90))).toBeCloseTo(-1)
    expect(profileCorrelation(profile({}), profile({ A: 90 }))).toBeNull()
  })

  it('A and S highest → careers O*NET rates high on A/S come first; non-A/S careers come last', () => {
    const { matches } = matchCareers(inputs({ interest: profile({ A: 90, S: 90 }) }))
    for (const match of matches.slice(0, 3)) {
      const { A, S } = careers[match.id].riasec
      const others = Object.entries(careers[match.id].riasec).filter(([type]) => type !== 'A' && type !== 'S').map(([, value]) => value)
      expect(Math.max(A, S)).toBeGreaterThan(Math.max(...others))
    }
    // The bottom of the list is careers whose strongest O*NET interest is neither A nor S.
    for (const match of matches.slice(-3)) {
      const top = Object.entries(careers[match.id].riasec).sort((x, y) => y[1] - x[1])[0][0]
      expect(['A', 'S']).not.toContain(top)
    }
    expect(matches.slice(-3).map((match) => match.id)).toContain('electrician')
  })

  it('never drops a career from the full list', () => {
    expect(matchCareers(inputs({ interest: profile({ R: 100 }) })).matches).toHaveLength(CAREER_IDS.length)
    expect(matchCareers(inputs({ confidence: profile({ C: 100 }) })).matches).toHaveLength(CAREER_IDS.length)
  })

  it('gives every career at least two reasons drawn from real answers', () => {
    for (const given of [inputs({ interest: profile({ I: 90, A: 70 }) }), inputs({ confidence: profile({ E: 90 }) }), inputs({ interest: profile({ S: 90 }), confidence: profile({ S: 30, C: 80 }) })]) {
      for (const match of matchCareers(given).matches) expect(match.reasons.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('personality and work style describe the work but never change the ranking', () => {
    const base = inputs({ interest: profile({ I: 90, C: 70 }) })
    const withPersonality = inputs({
      ...base,
      bigFive: { extraversion: 95, agreeableness: 10, conscientiousness: 90, emotionalStability: 20, intellect: 5 },
      workStyle: { dominance: 70, warmth: -60, intensity: 92, directions: ['navigator'], blended: false },
    })
    const a = matchCareers(base).matches
    const b = matchCareers(withPersonality).matches
    expect(b.map((match) => [match.id, match.score])).toEqual(a.map((match) => [match.id, match.score]))
    expect(b[0].workingStyle.length).toBeGreaterThan(0)
    expect(a[0].workingStyle).toHaveLength(0)
  })

  it('tags interest fit with low confidence as a path to practise, not a rejection', () => {
    const { matches } = matchCareers(inputs({ interest: profile({ A: 95, I: 60 }), confidence: profile({ C: 90, R: 80 }) }))
    const graphic = matches.find((match) => match.id === 'graphic')
    expect(graphic?.tag).toBe('practice')
    expect(matches).toHaveLength(CAREER_IDS.length)
  })

  it('works with partial results and reports how confident it is', () => {
    expect(matchCareers(inputs({})).confidence).toBe('none')
    expect(matchCareers(inputs({})).matches).toHaveLength(0)
    expect(matchCareers(inputs({ confidence: profile({ E: 90 }) })).confidence).toBe('low')
    expect(matchCareers(inputs({ interest: profile({}, 50) })).confidence).toBe('low') // flat interests
    expect(matchCareers(inputs({ interest: profile({ A: 90 }) })).confidence).toBe('medium')
    expect(matchCareers(inputs({ interest: profile({ A: 90 }), confidence: profile({ A: 80 }) })).confidence).toBe('high')
  })

  it('uses dashboard skills when names match', () => {
    const skills = [{ name: 'Coding fundamentals', value: 95 }, { name: 'Problem solving', value: 90 }]
    const front = matchCareers(inputs({ interest: profile({ I: 70, C: 70 }), skills })).matches.find((match) => match.id === 'front')
    expect(front?.skillsFit).toBe(93)
    expect(front?.reasons.some((reason) => reason.en.includes('Coding fundamentals') && reason.th.includes('พื้นฐานการเขียนโค้ด'))).toBe(true)
    expect(front?.skillsToGrow).toEqual(['HTML / CSS'])
  })

  it('reads everything from the store; a fresh user gets no suggestions', () => {
    expect(recommendationsFor(createDefaultState()).matches).toHaveLength(0)
  })
})
