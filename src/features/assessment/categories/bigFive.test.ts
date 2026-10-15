import { describe, expect, it } from 'vitest'
import { BIG_FIVE_DIMENSIONS, IPIP_50_ITEMS, bigFive, scoreBigFive, toBigFiveScores } from './bigFive'

const answerAll = (value: number) => Object.fromEntries(bigFive.questions.map((question) => [question.id, value]))

describe('Personality Spectrum (IPIP 50-item Big-Five Markers)', () => {
  it('has 50 required scale items, 10 per dimension, in the original IPIP order', () => {
    expect(bigFive.questions).toHaveLength(50)
    expect(IPIP_50_ITEMS.map((item) => item.n)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1))
    expect(bigFive.questions.every((question) => question.kind === 'scale' && question.required && question.source)).toBe(true)
    for (const dimension of BIG_FIVE_DIMENSIONS) {
      expect(IPIP_50_ITEMS.filter((item) => item.dimension === dimension)).toHaveLength(10)
    }
  })

  it('matches the IPIP scoring key: + / − items per dimension', () => {
    const key = {
      extraversion: { plus: [1, 11, 21, 31, 41], minus: [6, 16, 26, 36, 46] },
      agreeableness: { plus: [7, 17, 27, 37, 42, 47], minus: [2, 12, 22, 32] },
      conscientiousness: { plus: [3, 13, 23, 33, 43, 48], minus: [8, 18, 28, 38] },
      emotionalStability: { plus: [9, 19], minus: [4, 14, 24, 29, 34, 39, 44, 49] },
      intellect: { plus: [5, 15, 25, 35, 40, 45, 50], minus: [10, 20, 30] },
    }
    for (const dimension of BIG_FIVE_DIMENSIONS) {
      const items = IPIP_50_ITEMS.filter((item) => item.dimension === dimension)
      expect(items.filter((item) => item.keyed === '+').map((item) => item.n)).toEqual(key[dimension].plus)
      expect(items.filter((item) => item.keyed === '-').map((item) => item.n)).toEqual(key[dimension].minus)
    }
  })

  it('answering 50 everywhere gives 50 on every dimension', () => {
    expect(scoreBigFive(answerAll(50)).scores).toEqual({ extraversion: 50, agreeableness: 50, conscientiousness: 50, emotionalStability: 50, intellect: 50 })
  })

  it('reverse-keys − items as 100 − x', () => {
    // 100 on every item: each dimension = (plus·100 + minus·0) / 10.
    expect(scoreBigFive(answerAll(100)).scores).toEqual({ extraversion: 50, agreeableness: 60, conscientiousness: 60, emotionalStability: 20, intellect: 70 })
    // Agreeing only with "Get stressed out easily." (#4, −) and nothing else on Emotional Stability.
    const answers = { ...answerAll(0), ipip4: 100 }
    // ES: 2 plus items at 0 → 0, 7 minus items at 0 → 100, #4 at 100 → 0. Mean = 700 / 10 = 70.
    expect(scoreBigFive(answers).scores.emotionalStability).toBe(70)
  })

  it('exports scores in the shape the Personality Compass reads', () => {
    expect(toBigFiveScores(scoreBigFive(answerAll(50)).scores)).toEqual({ extraversion: 50, agreeableness: 50, conscientiousness: 50, emotionalStability: 50, intellect: 50 })
    expect(toBigFiveScores({ extraversion: 50 })).toBeNull()
  })
})
