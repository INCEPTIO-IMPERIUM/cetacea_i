import { describe, expect, it } from 'vitest'
import { toExperiment } from '../../../data/dashboard'
import { hasExperiment } from '../../../data/experimentText'
import { STORAGE_KEY, actions, parseStoredState } from '../../../store/whoAmIStore'
import { pageCount, questionsOnPage } from '../scoring'
import { GROUP_COPY, STORY_ACTIONS, STORY_GROUPS, STORY_STRENGTHS, groupScores, readStories, scoreStrengthStories, strengthStories } from './strengthStories'

/** Names of a commercial strengths inventory's themes and domains (English and its Thai edition). None may appear as ours. */
const TRADEMARKED_EN = [
  'Achiever', 'Activator', 'Adaptability', 'Analytical', 'Arranger', 'Belief', 'Command', 'Communication', 'Competition', 'Connectedness',
  'Consistency', 'Context', 'Deliberative', 'Developer', 'Discipline', 'Empathy', 'Focus', 'Futuristic', 'Harmony', 'Ideation', 'Includer',
  'Individualization', 'Input', 'Intellection', 'Learner', 'Maximizer', 'Positivity', 'Relator', 'Responsibility', 'Restorative',
  'Self-Assurance', 'Significance', 'Strategic', 'Woo', 'Executing', 'Influencing', 'Relationship Building',
]
const TRADEMARKED_TH = [
  'นักจัดการ', 'นักปรับปรุงแก้ไข', 'ผู้บรรลุเป้าหมาย', 'ผู้มีเป้าหมายชัดเจน', 'ผู้มีความเชื่อ', 'ผู้มีความยุติธรรม', 'ผู้มีความรับผิดชอบ', 'ผู้มีความละเอียดรอบคอบ',
  'ผู้มีวินัย', 'นักแข่งขัน', 'นักบัญชาการ', 'นักริเริ่มทำงาน', 'นักสื่อสาร', 'ผู้เห็นความสำคัญ', 'ผู้ชนะใจ', 'ผู้มีความเชื่อมั่น', 'ผู้สรรหาความเป็นเลิศ',
  'นักพัฒนา', 'ผู้เข้าใจความแตกต่าง', 'ผู้เห็นความเชื่อมโยง', 'ผู้ไม่ทอดทิ้ง', 'ผู้มองโลกในแง่ดี', 'ผู้มีความเข้าอกเข้าใจ', 'ผู้มีความสามารถในการปรับตัว',
  'ผู้สร้างความกลมเกลียว', 'ผู้สร้างสัมพันธ์', 'นักกลยุทธ์', 'นักคิด', 'นักคิดสร้างสรรค์', 'นักวิเคราะห์', 'นักสะสม', 'ผู้ใฝ่รู้', 'ผู้คำนึงถึงอดีต', 'ผู้มองอนาคต',
  'การปฏิบัติ', 'การโน้มน้าว', 'การสร้างความสัมพันธ์', 'การคิดเชิงกลยุทธ์',
]

const ratings = (value: (key: string) => number) => Object.fromEntries(STORY_STRENGTHS.map((strength) => [`like_${strength.key}`, value(strength.key)]))

describe('Strength Stories (reflection worksheet)', () => {
  it('has 20 strengths, 5 per group, with unique keys', () => {
    expect(STORY_STRENGTHS).toHaveLength(20)
    for (const group of STORY_GROUPS) expect(STORY_STRENGTHS.filter((strength) => strength.group === group)).toHaveLength(5)
    expect(new Set(STORY_STRENGTHS.map((strength) => strength.key)).size).toBe(20)
  })

  it('puts the ratings on the first two pages and the three stories on the last', () => {
    expect(pageCount(strengthStories)).toBe(3)
    expect([0, 1].flatMap((page) => questionsOnPage(strengthStories, page)).every((question) => question.kind === 'scale')).toBe(true)
    expect(questionsOnPage(strengthStories, 2).map((question) => question.id)).toEqual([
      'story1Pick', 'story1Age', 'story1Event', 'story2Pick', 'story2Age', 'story2Event', 'story3Pick', 'story3Age', 'story3Event',
    ])
    // Only the first story is required: its strength and its event.
    expect(strengthStories.questions.filter((question) => question.id.startsWith('story') && question.required).map((question) => question.id)).toEqual(['story1Pick', 'story1Event'])
  })

  it('never places two strengths of the same group side by side', () => {
    const groups = strengthStories.questions.flatMap((question) => (question.kind === 'scale' ? [STORY_STRENGTHS.find((strength) => strength.key === question.dimension)?.group] : []))
    groups.slice(1).forEach((group, index) => expect(group).not.toBe(groups[index]))
  })

  it('records source and rights status on every item', () => {
    expect(strengthStories.questions.every((question) => question.source?.includes('Who Am I? original') && question.source.includes('rights'))).toBe(true)
  })

  it('uses none of the trademarked theme or domain names, in English or Thai', () => {
    const names = [...STORY_STRENGTHS.map((strength) => strength.name), ...STORY_GROUPS.map((group) => GROUP_COPY[group].name)]
    for (const name of names) {
      for (const word of TRADEMARKED_EN) expect(name.en.toLowerCase().split(/[^a-z-]+/)).not.toContain(word.toLowerCase())
      for (const word of TRADEMARKED_EN.filter((word) => word.includes(' '))) expect(name.en).not.toContain(word)
      for (const word of TRADEMARKED_TH) expect(name.th).not.toBe(word)
    }
    const text = JSON.stringify({ STORY_STRENGTHS, GROUP_COPY, STORY_ACTIONS, copy: strengthStories.copy, summary: strengthStories.summary })
    for (const word of ['Clifton', 'Gallup', 'StrengthsFinder', 'weakness', 'จุดอ่อน']) expect(text).not.toContain(word)
  })

  it('scores each strength from its rating and ranks the highest first', () => {
    const result = scoreStrengthStories(ratings((key) => (key === 'spark' ? 90 : key === 'room' ? 70 : 40)))
    expect(result.scores.spark).toBe(90)
    expect(result.ranking.slice(0, 2)).toEqual(['spark', 'room'])
    // Ties keep the list order.
    expect(result.ranking[2]).toBe('finisher')
  })

  it('averages each group over the strengths that were rated', () => {
    const scores = scoreStrengthStories(ratings((key) => (STORY_STRENGTHS.find((strength) => strength.key === key)?.group === 'caring' ? 80 : 20))).scores
    expect(groupScores(scores)).toEqual({ doing: 20, moving: 20, caring: 80, thinking: 20 })
    expect(groupScores({ finisher: 60 })).toEqual({ doing: 60 })
  })

  it('reads the stories told and skips slots without a strength', () => {
    const stories = readStories({ story1Pick: 'planner', story1Age: '15-17', story1Event: '  planned the class trip  ', story2Age: '12-14', story3Pick: 'nope', story3Event: 'x' })
    expect(stories).toHaveLength(1)
    expect(stories[0]).toMatchObject({ slot: 1, event: 'planned the class trip' })
    expect(stories[0].strength.key).toBe('planner')
    expect(stories[0].age?.value).toBe('15-17')
  })

  it('"add as an experiment" puts the Micro-Action on the dashboard list', () => {
    actions.addExperiment(toExperiment(STORY_ACTIONS.thinking, 'en'))
    const saved = parseStoredState(localStorage.getItem(STORAGE_KEY))
    expect(saved.experiments.find((experiment) => experiment.key === 'story:thinking')).toMatchObject({ done: false, tag: 'Strength Stories · Thinking it through' })
    expect(hasExperiment(saved.experiments, 'story:thinking')).toBe(true)
  })
})
