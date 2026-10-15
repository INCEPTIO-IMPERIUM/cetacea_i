import { describe, expect, it } from 'vitest'
import { FLAT_PROFILE_SPREAD, INTEREST_ITEMS, RIASEC_TYPES, careerInterest, readInterests, scoreCareerInterest, toRiasecProfile, type RiasecProfile, type RiasecType } from './careerInterest'

const answersFor = (values: Partial<Record<RiasecType, number>>, base = 50) =>
  Object.fromEntries(INTEREST_ITEMS.map((item) => [`riasec${item.code}`, values[item.type] ?? base]))

const profile = (values: Partial<RiasecProfile>, base = 50): RiasecProfile => ({ R: base, I: base, A: base, S: base, E: base, C: base, ...values })

describe('Career Interest Explorer (RIASEC)', () => {
  it('has 48 required activity items, 8 per type, with a code and source on every item', () => {
    expect(careerInterest.questions).toHaveLength(48)
    for (const type of RIASEC_TYPES) expect(INTEREST_ITEMS.filter((item) => item.type === type)).toHaveLength(8)
    expect(new Set(INTEREST_ITEMS.map((item) => item.code)).size).toBe(48)
    expect(careerInterest.questions.every((question) => question.kind === 'scale' && question.required && !question.reverseKeyed && question.source)).toBe(true)
  })

  it('never puts two items of the same type next to each other', () => {
    for (let index = 1; index < INTEREST_ITEMS.length; index++) {
      expect(INTEREST_ITEMS[index].type).not.toBe(INTEREST_ITEMS[index - 1].type)
    }
  })

  it('scores each type as the mean of its 8 items', () => {
    const answers = answersFor({ I: 90, A: 70 }, 20)
    answers.riasecS1 = 100 // one S item at 100, the other seven at 20 → (100 + 140) / 8 = 30
    expect(scoreCareerInterest(answers).scores).toEqual({ R: 20, I: 90, A: 70, S: 30, E: 20, C: 20 })
  })

  it('Holland code = the three highest types', () => {
    const reading = readInterests(profile({ I: 90, A: 80, S: 70, E: 30 }, 20))
    expect(reading.hollandCode).toBe('IAS')
    expect(reading.flat).toBe(false)
  })

  it('breaks ties in R-I-A-S-E-C order', () => {
    expect(readInterests(profile({ C: 80, S: 80, I: 80, R: 10 }, 20)).hollandCode).toBe('ISC')
    expect(readInterests(profile({ E: 90, A: 60, C: 60, S: 60 }, 10)).hollandCode).toBe('EAS')
  })

  it(`a spread under ${FLAT_PROFILE_SPREAD} points is a flat profile; exactly ${FLAT_PROFILE_SPREAD} is not`, () => {
    expect(readInterests(profile({ I: 60, C: 46 }, 50))).toMatchObject({ spread: 14, flat: true })
    expect(readInterests(profile({ I: 60, C: 45 }, 50))).toMatchObject({ spread: 15, flat: false })
    expect(readInterests(profile({}, 50)).flat).toBe(true)
  })

  it('exports the six-value profile for the career matcher', () => {
    expect(toRiasecProfile(scoreCareerInterest(answersFor({ R: 10, E: 90 })).scores)).toEqual({ R: 10, I: 50, A: 50, S: 50, E: 90, C: 50 })
    expect(toRiasecProfile({ R: 10 })).toBeNull()
  })
})
