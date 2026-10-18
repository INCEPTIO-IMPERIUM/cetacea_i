import { describe, expect, it } from 'vitest'
import { CAREER_IDS } from '../data/careers'
import { MATCH_WEIGHTS } from '../features/assessment/matcher'
import { categories } from '../features/assessment/registry'
import { DOC_SECTIONS } from './docsContent'

const allText = (lang: 'th' | 'en') =>
  DOC_SECTIONS.flatMap((section) => [
    section.title[lang],
    ...section.blocks.flatMap((block) => {
      switch (block.type) {
        case 'p':
          return [block.text[lang]]
        case 'list':
          return block.items.map((item) => item[lang])
        case 'cards':
          return block.items.flatMap((item) => [item.title[lang], item.meta[lang], item.body[lang]])
        case 'faq':
          return block.items.flatMap((item) => [item.q[lang], item.a[lang]])
        default:
          return []
      }
    }),
  ]).join('\n')

describe('More details page content', () => {
  it('has unique section ids, so every link and the contents list land somewhere', () => {
    const ids = DOC_SECTIONS.map((section) => section.id)
    expect(new Set(ids).size).toBe(ids.length)
    // Links elsewhere in the app point at these.
    expect(ids).toEqual(expect.arrayContaining(['privacy', 'matching']))
  })

  it('quotes numbers that come from the code, in both languages', () => {
    const items = categories.reduce((sum, category) => sum + category.questions.length, 0)
    const minutes = categories.reduce((sum, category) => sum + category.estimatedMinutes, 0)
    for (const lang of ['th', 'en'] as const) {
      const text = allText(lang)
      expect(text).toContain(`${items}`)
      expect(text).toContain(`${minutes}`)
      expect(text).toContain(`${CAREER_IDS.length}`)
      expect(text).toContain(`${Math.round(MATCH_WEIGHTS.interest * 100)}%`)
      expect(text).toContain(`${Math.round(MATCH_WEIGHTS.confidence * 100)}%`)
      expect(text).toContain(`${Math.round(MATCH_WEIGHTS.skills * 100)}%`)
    }
  })

  it('does not claim things the app does not do', () => {
    const text = allText('en')
    expect(text).not.toMatch(/percentile (rank|score) of/i)
    expect(text).not.toMatch(/your data is (sent|uploaded|synced)/i)
    // Wording that would imply a diagnosis or a type system.
    for (const word of ['MBTI', '16Personalities', 'DISC', 'CliftonStrengths', 'VIA ']) expect(text).not.toContain(word)
  })

  it('credits O*NET exactly as its license asks', () => {
    const credit = DOC_SECTIONS.flatMap((section) => section.blocks).find((block) => block.type === 'credit')
    expect(credit?.type === 'credit' && credit.text).toContain('O*NET 31.0 Database')
    expect(credit?.type === 'credit' && credit.text).toContain('CC BY 4.0')
    expect(credit?.type === 'credit' && credit.text).toContain('O*NET® is a trademark of USDOL/ETA')
    expect(credit?.type === 'credit' && credit.text).toContain('has not approved, endorsed, or tested these modifications')
  })
})
