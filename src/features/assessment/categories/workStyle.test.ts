import { describe, expect, it } from 'vitest'
import { DIRECTIONS, IPIP_IPC_ITEMS, OCTANTS, circumplexAxes, readWorkStyle, scoreWorkStyle, workStyle, workStyleFromScores, type Octant } from './workStyle'

const octantScores = (values: Partial<Record<Octant, number>>, base = 50) => Object.fromEntries(OCTANTS.map((octant) => [octant, values[octant] ?? base])) as Record<Octant, number>

/** Answers every item with its octant's value. */
const answersFor = (values: Partial<Record<Octant, number>>, base = 50) =>
  Object.fromEntries(IPIP_IPC_ITEMS.map((item) => [`ipc${item.n}`, values[item.octant] ?? base]))

describe('Work Style Compass (IPIP-IPC)', () => {
  it('has 32 required items: 8 octants × 4, in the published order, none reverse-keyed', () => {
    expect(workStyle.questions).toHaveLength(32)
    expect(IPIP_IPC_ITEMS.map((item) => item.n)).toEqual(Array.from({ length: 32 }, (_, index) => index + 1))
    for (const octant of OCTANTS) expect(IPIP_IPC_ITEMS.filter((item) => item.octant === octant)).toHaveLength(4)
    // Published order cycles FG, HI, JK, LM, NO, PA, BC, DE.
    expect(IPIP_IPC_ITEMS.slice(0, 8).map((item) => item.octant)).toEqual(['FG', 'HI', 'JK', 'LM', 'NO', 'PA', 'BC', 'DE'])
    expect(workStyle.questions.every((question) => question.kind === 'scale' && question.required && !question.reverseKeyed && question.source)).toBe(true)
  })

  it('a flat profile sits at the centre — agreeing with everything cancels out', () => {
    expect(circumplexAxes(octantScores({}, 50))).toEqual({ dominance: 0, warmth: 0 })
    expect(circumplexAxes(octantScores({}, 90))).toEqual({ dominance: 0, warmth: 0 })
  })

  it('projects octants onto the axes: PA high → dominance, LM high → warmth', () => {
    const dominant = circumplexAxes(octantScores({ PA: 100, HI: 0 }))
    expect(dominant.dominance).toBeGreaterThan(30)
    expect(dominant.warmth).toBe(0)
    const warm = circumplexAxes(octantScores({ LM: 100, DE: 0 }))
    expect(warm.warmth).toBeGreaterThan(30)
    expect(warm.dominance).toBe(0)
    // Four neighbouring octants at 100, the rest at 0, reach the edge of the scale.
    const edge = circumplexAxes(octantScores({ LM: 100, NO: 100, PA: 100, BC: 100 }, 0))
    expect(Math.round(Math.hypot(edge.dominance, edge.warmth))).toBe(100)
  })

  it('high dominance + high warmth → Spark; each quadrant has its own character', () => {
    expect(readWorkStyle(60, 60).directions).toEqual(['spark'])
    expect(readWorkStyle(60, -60).directions).toEqual(['navigator'])
    expect(readWorkStyle(-60, 60).directions).toEqual(['harbor'])
    expect(readWorkStyle(-60, -60).directions).toEqual(['cartographer'])
    const fromAnswers = workStyleFromScores(scoreWorkStyle(answersFor({ NO: 100, PA: 90, LM: 90, FG: 10, HI: 10, DE: 10 })).scores)
    expect(fromAnswers?.directions).toEqual(['spark'])
  })

  it('near the centre → all four blended; near an axis → two neighbours', () => {
    expect(readWorkStyle(5, -4)).toMatchObject({ blended: true, directions: ['navigator', 'spark', 'harbor', 'cartographer'] })
    expect(workStyleFromScores(scoreWorkStyle(answersFor({}, 60)).scores)?.directions).toHaveLength(4)
    expect(readWorkStyle(50, 5).directions).toEqual(['navigator', 'spark'])
    expect(readWorkStyle(-5, 50).directions).toEqual(['spark', 'harbor'])
  })

  it('stores every score on 0–100 and ranks octants only', () => {
    const result = scoreWorkStyle(answersFor({ PA: 100 }))
    expect(Object.values(result.scores).every((score) => score >= 0 && score <= 100)).toBe(true)
    expect(result.ranking[0]).toBe('PA')
    expect(result.ranking).toHaveLength(8)
  })

  it('uses none of the DISC animal names or the DISC brand', () => {
    const text = JSON.stringify({ DIRECTIONS, IPIP_IPC_ITEMS, copy: workStyle.copy, summary: workStyle.summary })
    for (const word of ['Lion', 'Otter', 'Golden Retriever', 'Beaver', 'DISC']) expect(text).not.toContain(word)
  })
})
