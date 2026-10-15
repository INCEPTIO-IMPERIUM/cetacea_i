import { describe, expect, it } from 'vitest'
import { bigFive, scoreBigFive, toBigFiveScores, type BigFiveScores } from './bigFive'
import { COMPASS_SIDES, personalityCompass } from './personalityCompass'

const flat = (value: number): BigFiveScores => ({ extraversion: value, agreeableness: value, conscientiousness: value, emotionalStability: value, intellect: value })

describe('Personality Compass (derived from Big Five)', () => {
  it('a Big Five score of 50 reads as 50% balanced', () => {
    for (const reading of personalityCompass(flat(50))) {
      expect(reading.balanced).toBe(true)
      expect(reading.percent).toBe(50)
      expect(reading.text).toBe('สมดุล / ยืดหยุ่น 50%')
    }
  })

  it('a score of 80 leans 80% toward the 100% pole; 20 leans 80% toward the 0% pole', () => {
    const energyHigh = personalityCompass({ ...flat(50), extraversion: 80 })[0]
    expect(energyHigh.leansTo).toBe('high')
    expect(energyHigh.percent).toBe(80)
    expect(energyHigh.text).toBe('เอนไปทางเติมพลังจากผู้คน 80%')

    const energyLow = personalityCompass({ ...flat(50), extraversion: 20 })[0]
    expect(energyLow.leansTo).toBe('low')
    expect(energyLow.percent).toBe(80)
    expect(energyLow.text).toBe('เอนไปทางเติมพลังจากเวลาส่วนตัว 80%')
  })

  it('treats 45–55 as balanced and 44 / 56 as leaning', () => {
    const read = (value: number) => personalityCompass({ ...flat(50), conscientiousness: value })[3]
    expect(read(45).balanced).toBe(true)
    expect(read(55).balanced).toBe(true)
    expect(read(44).leansTo).toBe('low')
    expect(read(56).leansTo).toBe('high')
  })

  it('has no questions of its own — it moves with the Big Five answers', () => {
    const answers = Object.fromEntries(bigFive.questions.map((question) => [question.id, 50]))
    const before = personalityCompass(toBigFiveScores(scoreBigFive(answers).scores)!)
    // Agree fully with every positive Extraversion item.
    const after = personalityCompass(toBigFiveScores(scoreBigFive({ ...answers, ipip1: 100, ipip11: 100, ipip21: 100, ipip31: 100, ipip41: 100 }).scores)!)
    expect(before[0].position).toBe(50)
    expect(after[0].position).toBe(75)
    expect(after[0].leansTo).toBe('high')
  })

  it('maps each side to the dimension in the spec and uses no trademarked type vocabulary', () => {
    expect(COMPASS_SIDES.map((side) => side.from)).toEqual(['extraversion', 'intellect', 'agreeableness', 'conscientiousness', 'emotionalStability'])
    const text = JSON.stringify(COMPASS_SIDES)
    for (const word of ['MBTI', '16Personalities', 'Introvert', 'Extravert', 'Intuitive', 'Sensing', 'Thinking', 'Feeling', 'Judging', 'Perceiving', 'Prospecting', 'Assertive', 'Turbulent', 'Mind', 'Energy', 'Nature', 'Tactics', 'Identity']) {
      expect(text).not.toContain(word)
    }
  })
})
