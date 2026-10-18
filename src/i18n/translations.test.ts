import { describe, expect, it } from 'vitest'
import { CAREER_IDS, careers, startingPoint } from '../data/careers'
import { defaultExperimentCatalog, ikigaiCards, selfDiscoveryStarter } from '../data/dashboard'
import { experimentText } from '../data/experimentText'
import { DOC_SECTIONS } from '../docs/docsContent'
import { bigFiveCopy } from '../features/assessment/categories/bigFive'
import { riasecCopy } from '../features/assessment/categories/careerInterest'
import { COMPASS_SIDES } from '../features/assessment/categories/personalityCompass'
import { GROWTH_ACTIONS, QUADRANTS } from '../features/assessment/categories/strengths'
import { DIRECTIONS } from '../features/assessment/categories/workStyle'
import { categories } from '../features/assessment/registry'
import { sectionNav } from '../features/dashboard/sections'
import { LANGS } from './language'

/** Walks any value and collects every { th, en } pair inside it. */
function collectPairs(value: unknown, path = '$', out: { path: string; th: unknown; en: unknown }[] = []) {
  if (Array.isArray(value)) value.forEach((item, index) => collectPairs(item, `${path}[${index}]`, out))
  else if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if ('th' in record && 'en' in record) out.push({ path, th: record.th, en: record.en })
    else for (const [key, child] of Object.entries(record)) if (typeof child !== 'function') collectPairs(child, `${path}.${key}`, out)
  }
  return out
}

describe('translations', () => {
  const sources = {
    categories,
    careers: CAREER_IDS.map((id) => careers[id]),
    startingPoint,
    ikigaiCards,
    experiments: [...defaultExperimentCatalog, selfDiscoveryStarter],
    bigFiveCopy,
    riasecCopy,
    COMPASS_SIDES,
    QUADRANTS,
    GROWTH_ACTIONS,
    DIRECTIONS,
    sectionNav,
    DOC_SECTIONS,
  }

  it('fills in both Thai and English for every piece of text', () => {
    const pairs = collectPairs(sources)
    expect(pairs.length).toBeGreaterThan(500)
    const missing = pairs.filter(({ th, en }) => typeof th !== 'string' || typeof en !== 'string' || (th === '' && en !== '') || (en === '' && th !== ''))
    expect(missing).toEqual([])
  })

  it('Thai text actually contains Thai where the English is a sentence', () => {
    const thaiScript = /[฀-๿]/
    const untranslated = collectPairs(sources).filter(({ th, en }) => typeof en === 'string' && en.split(' ').length >= 4 && typeof th === 'string' && !thaiScript.test(th))
    expect(untranslated).toEqual([])
  })

  it('built-in experiments follow the interface language after they are stored', () => {
    const stored = { id: 'x', key: 'career:ux', title: 'old', description: 'old', duration: 'old', tag: 'old', icon: 'career' as const, tone: 'white' as const, done: false }
    for (const lang of LANGS) expect(experimentText(stored, lang).title).toBe(careers.ux.starter.title[lang])
    // Your own ideas keep the title you typed.
    expect(experimentText({ ...stored, key: 'own', title: 'My idea' }, 'th').title).toBe('My idea')
    // Seeded experiments from before keys existed are matched by id.
    expect(experimentText({ ...stored, key: undefined, id: 'portfolio' }, 'th').title).toBe(defaultExperimentCatalog[0].title.th)
  })
})
