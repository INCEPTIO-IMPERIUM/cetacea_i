import { describe, expect, it } from 'vitest'
import { rawCareerScores, scoreQuickDiscovery, topCareer } from './quickDiscovery'

describe('quick discovery scoring (template heuristic)', () => {
  const answers = { activity: 'design', interests: ['design', 'technology'], strength: 'visual', workValue: 'creativity', environment: 'collaborative' }

  it('keeps the template weights: design-leaning answers put Product Designer first', () => {
    // Worked by hand: product = 3 + 1.25 + 1.25 + 2 + 1 + 1 = 9.5, ux = 3 + 1.25 + 2 + 1 + 1 = 8.25.
    const raw = rawCareerScores(answers)
    expect(raw.product).toBe(9.5)
    expect(raw.ux).toBe(8.25)
    const result = scoreQuickDiscovery(answers)
    expect(result.ranking[0]).toBe('product')
    expect(result.ranking[1]).toBe('ux')
    expect(result.scores.product).toBe(100)
    expect(topCareer(result.ranking)).toBe('product')
  })

  it('never drops a career from the ranking', () => {
    expect(scoreQuickDiscovery(answers).ranking).toHaveLength(5)
    expect(scoreQuickDiscovery({}).ranking).toHaveLength(5)
  })
})
