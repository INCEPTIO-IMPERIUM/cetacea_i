import { minutes, type CatalogExperiment } from '../../../data/dashboard'
import { L, type Localized } from '../../../i18n/language'
import { rankScores, scoreScaleDimensions } from '../scoring'
import type { AssessmentCategory, CategoryAnswers, CategoryResult, ChoiceQuestion, Question, ScaleQuestion, TextQuestion } from '../types'

/**
 * Category 06 — Strength Stories: a self-reflection worksheet. Rate how much each everyday
 * strength sounds like you, then tell the story of when you first saw one in yourself — the age
 * and the event. Naming a real moment is mastery evidence (Bandura, 1977) and makes the
 * strength easier to use on purpose.
 *
 * The worksheet shape (groups, self-ranking, "age first noticed", "the event") came from a
 * reflection sheet built on a commercial strengths inventory. Its theme and domain names are
 * trademarks, so every group and strength below is named and described by Who Am I?; none
 * reuses those names in English or Thai. Rights: ours, usable for any purpose.
 * Ratings are self-description, not a measured trait score; not validated.
 */

export const STORY_GROUPS = ['doing', 'moving', 'caring', 'thinking'] as const
export type StoryGroup = (typeof STORY_GROUPS)[number]

export const GROUP_COPY: Record<StoryGroup, { icon: string; name: Localized; hint: Localized; tone: string }> = {
  doing: { icon: '🛠️', name: L('ทำให้เสร็จ', 'Getting it done'), hint: L('ทำงานให้เดินหน้าและจบได้จริง', 'Moving work forward and finishing it.'), tone: 'bg-lilac' },
  moving: { icon: '📣', name: L('ชวนคนขยับ', 'Moving people'), hint: L('ทำให้คนอื่นอยากร่วมและลงมือ', 'Getting others on board and into action.'), tone: 'bg-peach' },
  caring: { icon: '🤝', name: L('ดูแลคนรอบตัว', 'Caring for people'), hint: L('ทำให้กลุ่มอยู่ด้วยกันได้ดีและเติบโต', 'Helping a group get along and grow.'), tone: 'bg-mint' },
  thinking: { icon: '🧭', name: L('คิดให้ทะลุ', 'Thinking it through'), hint: L('เข้าใจเรื่องยากและมองหาทางไปต่อ', 'Making sense of hard things and finding a way ahead.'), tone: 'bg-lemon-soft' },
}

export interface StoryStrength {
  key: string
  group: StoryGroup
  name: Localized
  /** First-person statement the person rates. */
  statement: Localized
}

const s = (key: string, group: StoryGroup, name: Localized, statement: Localized): StoryStrength => ({ key, group, name, statement })

export const STORY_STRENGTHS: StoryStrength[] = [
  s('finisher', 'doing', L('คนทำจนจบ', 'Sees it through'), L('ฉันเริ่มอะไรแล้วมักทำให้เสร็จ แม้จะเบื่อกลางทาง', 'Once I start something I usually finish it, even when it gets boring.')),
  s('planner', 'doing', L('คนวางแผนล่วงหน้า', 'Plans ahead'), L('ฉันชอบรู้ว่าต้องทำอะไรก่อนหลัง และเตรียมตัวไว้ก่อน', 'I like knowing what comes first and getting ready early.')),
  s('promise', 'doing', L('คนรักษาคำพูด', 'Keeps their word'), L('ถ้ารับปากใครไว้แล้ว ฉันจะทำให้ได้', 'If I promise someone something, I make it happen.')),
  s('fixer', 'doing', L('คนแก้ปัญหาเฉพาะหน้า', 'Unsticks things'), L('เมื่อมีอะไรติดขัด ฉันอยากลงมือแก้ทันที', 'When something gets stuck I want to sort it out straight away.')),
  s('checker', 'doing', L('คนตรวจทานก่อนส่ง', 'Double-checks'), L('ฉันตรวจงานซ้ำก่อนส่ง เพื่อไม่ให้มีจุดผิด', 'I check my work again before handing it in so nothing is wrong.')),

  s('kickoff', 'moving', L('คนจุดไฟเริ่ม', 'Gets things moving'), L('ฉันชอบเริ่มลงมือเลย มากกว่ารอให้ทุกอย่างพร้อม', 'I would rather start now than wait until everything is ready.')),
  s('speaker', 'moving', L('คนกล้าพูดในกลุ่ม', 'Speaks up'), L('ฉันกล้าพูดความเห็นในกลุ่ม แม้คนอื่นยังเงียบอยู่', 'I say what I think in a group, even when others stay quiet.')),
  s('onboard', 'moving', L('คนชวนให้มาร่วม', 'Brings people on board'), L('ฉันชวนคนอื่นให้มาร่วมไอเดียของฉันได้', 'I can get other people to join in with my ideas.')),
  s('vivid', 'moving', L('คนเล่าให้เห็นภาพ', 'Makes ideas vivid'), L('ฉันอธิบายเรื่องให้คนฟังเห็นภาพและจำได้', 'I can explain things so people picture them and remember.')),
  s('bar', 'moving', L('คนยกระดับงาน', 'Raises the bar'), L('ฉันชอบเอาสิ่งที่ดีอยู่แล้วมาทำให้ดีขึ้นอีก', 'I like taking something already good and making it even better.')),

  s('room', 'caring', L('คนอ่านบรรยากาศเก่ง', 'Reads the room'), L('ฉันรู้สึกได้ว่าคนรอบตัวกำลังรู้สึกอย่างไร', 'I can sense how the people around me are feeling.')),
  s('grower', 'caring', L('คนช่วยให้คนอื่นเก่งขึ้น', 'Helps others grow'), L('ฉันดีใจเมื่อได้ช่วยให้เพื่อนทำบางอย่างได้ดีขึ้น', 'I enjoy helping a friend get better at something.')),
  s('middle', 'caring', L('คนหาจุดที่ทุกคนรับได้', 'Finds common ground'), L('เมื่อกลุ่มเห็นไม่ตรงกัน ฉันหาทางที่ทุกคนรับได้', 'When a group disagrees I look for something everyone can accept.')),
  s('welcome', 'caring', L('คนชวนทุกคนเข้าวง', 'Brings everyone in'), L('ฉันสังเกตเห็นคนที่ถูกปล่อยไว้ข้างนอก และชวนเข้ามา', 'I notice who is being left out and invite them in.')),
  s('lift', 'caring', L('คนทำให้บรรยากาศดีขึ้น', 'Lifts the mood'), L('ฉันมักทำให้บรรยากาศในกลุ่มดีขึ้นเวลาทุกคนเหนื่อย', 'I tend to lift the mood when a group is worn out.')),

  s('why', 'thinking', L('คนหาเหตุผลจริง', 'Asks why'), L('ฉันอยากรู้สาเหตุจริงก่อนจะเชื่ออะไร', 'I want to know the real reason before I believe something.')),
  s('spark', 'thinking', L('คนคิดวิธีใหม่', 'Sparks new ways'), L('ฉันมักคิดวิธีใหม่ ๆ ที่คนอื่นยังไม่ได้ลอง', 'I often think of new ways that others have not tried.')),
  s('routes', 'thinking', L('คนเห็นหลายทางเลือก', 'Sees the routes'), L('เมื่อเจอปัญหา ฉันเห็นหลายทางและเลือกทางที่ดีที่สุดได้', 'Faced with a problem, I see several routes and can pick the best one.')),
  s('newthings', 'thinking', L('คนชอบเรียนเรื่องใหม่', 'Picks up new things'), L('ฉันสนุกกับการเรียนเรื่องที่ยังไม่รู้ แม้ไม่มีใครสั่ง', 'I enjoy learning something new even when nobody asks me to.')),
  s('ahead', 'thinking', L('คนวาดภาพวันข้างหน้า', 'Pictures what is next'), L('ฉันชอบคิดว่าอีกหลายปีข้างหน้า สิ่งต่าง ๆ จะเป็นอย่างไร', 'I like imagining how things will look years from now.')),
]

export const strengthByKey = new Map(STORY_STRENGTHS.map((strength) => [strength.key, strength]))

export const AGE_BANDS: { value: string; label: Localized }[] = [
  { value: 'under12', label: L('ก่อน 12 ปี', 'Before 12') },
  { value: '12-14', label: L('12–14 ปี', '12–14') },
  { value: '15-17', label: L('15–17 ปี', '15–17') },
  { value: '18-22', label: L('18–22 ปี', '18–22') },
  { value: '23plus', label: L('23 ปีขึ้นไป', '23 or older') },
  { value: 'unsure', label: L('จำไม่ได้', 'Not sure') },
]

/** How many stories the worksheet offers; the first is required. */
export const STORY_SLOTS = 3

/** Interleaved across the four groups so two strengths of the same group never sit side by side. */
const ratingOrder = Array.from({ length: 5 }, (_, round) => STORY_GROUPS.map((group) => STORY_STRENGTHS.filter((item) => item.group === group)[round])).flat()

const ratingQuestions: ScaleQuestion[] = ratingOrder.map((strength) => ({
  id: `like_${strength.key}`,
  kind: 'scale',
  prompt: strength.statement,
  required: true,
  help: L('แตะบนเส้นว่าข้อนี้เหมือนตัวคุณแค่ไหน', 'Tap the line to show how much this sounds like you.'),
  dimension: strength.key,
  reverseKeyed: false,
  minLabel: L('ไม่เหมือนฉันเลย', 'Not like me at all'),
  maxLabel: L('เหมือนฉันมาก', 'Very much like me'),
  source: `Who Am I? original strength statement "${strength.key}" (group ${strength.group}; rights: Who Am I?, any use): "${strength.statement.en}"`,
}))

const storyQuestions = (slot: number): Question[] => {
  const required = slot === 1
  const pick: ChoiceQuestion = {
    id: `story${slot}Pick`,
    kind: 'single',
    prompt: required
      ? L('เรื่องที่ 1: เลือกจุดแข็งที่คุณมีเรื่องเล่าชัดที่สุด', 'Story 1: pick the strength you have the clearest story for')
      : { th: `เรื่องที่ ${slot}: เลือกจุดแข็งอีกข้อ (ไม่บังคับ)`, en: `Story ${slot}: pick another strength (optional)` },
    required,
    help: L('เลือกจุดแข็ง 1 ข้อสำหรับเรื่องแรก', 'Pick one strength for your first story.'),
    className: 'xl:col-span-2',
    layout: 'grid grid-cols-1 sm:grid-cols-2 gap-2',
    wrapHeader: true,
    options: STORY_STRENGTHS.map((strength) => ({ value: strength.key, label: strength.name })),
    source: 'Who Am I? original worksheet prompt (rights: Who Am I?, any use)',
  }
  const age: ChoiceQuestion = {
    id: `story${slot}Age`,
    kind: 'single',
    prompt: { th: `เรื่องที่ ${slot}: คุณเห็นจุดแข็งนี้ในตัวเองครั้งแรกตอนอายุเท่าไร`, en: `Story ${slot}: how old were you when you first saw this in yourself?` },
    required: false,
    layout: 'grid grid-cols-2 sm:grid-cols-3 gap-2',
    wrapHeader: true,
    options: AGE_BANDS,
    source: 'Who Am I? original worksheet prompt (rights: Who Am I?, any use)',
  }
  const event: TextQuestion = {
    id: `story${slot}Event`,
    kind: 'reflection',
    prompt: { th: `เรื่องที่ ${slot}: เกิดอะไรขึ้นตอนนั้น`, en: `Story ${slot}: what happened?` },
    hint: L('เล่าสั้น ๆ ว่าคุณทำอะไร และรู้ได้อย่างไรว่านี่คือจุดแข็งของคุณ', 'Briefly: what did you do, and how did you know it was a strength?'),
    placeholder: L('เช่น ตอน ม.3 ฉันเป็นคนรวบรวมงานกลุ่มจนส่งทันเวลา…', 'e.g. In year 9 I pulled our group project together so we handed it in on time…'),
    help: L('เล่าเหตุการณ์สั้น ๆ อย่างน้อย 1 เรื่อง', 'Tell at least one short story.'),
    required,
    maxLength: 400,
    className: 'xl:col-span-2',
    source: 'Who Am I? original worksheet prompt (rights: Who Am I?, any use)',
  }
  return [pick, age, event]
}

const questions: Question[] = [...ratingQuestions, ...Array.from({ length: STORY_SLOTS }, (_, index) => storyQuestions(index + 1)).flat()]

/** Rating per strength (0–100), ranked highest first; ties keep the list order. */
export function scoreStrengthStories(answers: CategoryAnswers): CategoryResult {
  const means = scoreScaleDimensions(ratingQuestions, answers)
  const scores = Object.fromEntries(STORY_STRENGTHS.filter((strength) => strength.key in means).map((strength) => [strength.key, means[strength.key]]))
  return { scores, ranking: rankScores(scores) }
}

/** Mean rating per group over the strengths that were rated; groups with none are left out. */
export function groupScores(scores: Record<string, number>): Partial<Record<StoryGroup, number>> {
  const out: Partial<Record<StoryGroup, number>> = {}
  for (const group of STORY_GROUPS) {
    const values = STORY_STRENGTHS.filter((strength) => strength.group === group && typeof scores[strength.key] === 'number').map((strength) => scores[strength.key])
    if (values.length) out[group] = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
  }
  return out
}

export interface StrengthStory {
  slot: number
  strength: StoryStrength
  age?: (typeof AGE_BANDS)[number]
  event: string
}

/** The stories the person told, in slot order; a slot without a picked strength is skipped. */
export function readStories(answers: CategoryAnswers): StrengthStory[] {
  const stories: StrengthStory[] = []
  for (let slot = 1; slot <= STORY_SLOTS; slot += 1) {
    const strength = strengthByKey.get(String(answers[`story${slot}Pick`] ?? ''))
    if (!strength) continue
    const age = AGE_BANDS.find((band) => band.value === answers[`story${slot}Age`])
    const event = typeof answers[`story${slot}Event`] === 'string' ? (answers[`story${slot}Event`] as string).trim() : ''
    stories.push({ slot, strength, age, event })
  }
  return stories
}

/** A small task per group that puts a top strength to use on purpose this week. */
const strengthAction = (group: StoryGroup, title: Localized, description: Localized, mins: number): CatalogExperiment => ({
  key: `story:${group}`,
  title,
  description,
  duration: minutes(mins),
  tag: L(`เรื่องเล่าจุดแข็ง · ${GROUP_COPY[group].name.th}`, `Strength Stories · ${GROUP_COPY[group].name.en}`),
  icon: 'custom',
  tone: 'lilac',
})

export const STORY_ACTIONS: Record<StoryGroup, CatalogExperiment> = {
  doing: strengthAction(
    'doing',
    L('ปิดงานค้าง 1 ชิ้นให้จบ', 'Close one open task'),
    L('เลือกงานค้างที่เล็กที่สุด 1 ชิ้น ทำให้เสร็จวันนี้ แล้วจดว่าจุดแข็งข้อไหนของคุณช่วยให้จบได้', 'Pick the smallest open task, finish it today, and note which of your strengths got it done.'),
    25,
  ),
  moving: strengthAction(
    'moving',
    L('ชวนคน 1 คนมาทำเรื่องเล็ก ๆ ด้วยกัน', 'Invite one person into something small'),
    L('เสนอกิจกรรมหรือไอเดียสั้น ๆ ให้เพื่อน 1 คน ชวนให้ลองทำด้วยกัน แล้วสังเกตว่าอะไรทำให้เขาตอบตกลง', 'Suggest a short activity or idea to one friend, invite them to try it with you, and notice what made them say yes.'),
    20,
  ),
  caring: strengthAction(
    'caring',
    L('ทำให้ใครสักคนรู้สึกดีขึ้นโดยตั้งใจ', 'Make someone’s day a little better on purpose'),
    L('เลือกคน 1 คนที่ดูเหนื่อยหรือถูกลืม ทักทาย ช่วย หรือชวนเข้ากลุ่ม แล้วจดว่าเขาตอบสนองอย่างไร', 'Pick one person who seems tired or left out — check in, help, or bring them into the group — and note how they responded.'),
    15,
  ),
  thinking: strengthAction(
    'thinking',
    L('เขียนทางเลือก 3 ทางให้ปัญหาหนึ่งเรื่อง', 'Write three routes for one problem'),
    L('เลือกปัญหาที่ค้างอยู่ 1 เรื่อง เขียนทางแก้ 3 ทางพร้อมข้อดีข้อเสีย แล้วลองทำทางที่ดีที่สุดภายในสัปดาห์นี้', 'Pick one problem you are stuck on, write three ways to solve it with pros and cons, and try the best one this week.'),
    20,
  ),
}

export const strengthStories: AssessmentCategory = {
  id: 'strengthStories',
  number: '06',
  title: L('เรื่องเล่าจุดแข็ง', 'Strength Stories'),
  summary: L(
    `ให้คะแนนว่าจุดแข็ง ${STORY_STRENGTHS.length} ข้อเหมือนตัวคุณแค่ไหน แล้วเล่าเหตุการณ์ที่คุณเห็นจุดแข็งนั้นในตัวเองครั้งแรก`,
    `Rate how much ${STORY_STRENGTHS.length} everyday strengths sound like you, then tell the story of when you first saw one in yourself.`,
  ),
  estimatedMinutes: 10,
  pageSize: 10,
  gridClassName: 'grid grid-cols-1 xl:grid-cols-2 gap-4',
  questions,
  copy: {
    eyebrow: L('06 / เรื่องเล่าจุดแข็ง', '06 / Strength Stories'),
    title: L('จุดแข็งของคุณมีเรื่องเล่า', 'Your strengths have stories'),
    description: L(
      'ช่วงแรก ให้แตะบนเส้นว่าแต่ละข้อเหมือนตัวคุณแค่ไหน ช่วงท้าย เลือกจุดแข็งที่คุณนึกเหตุการณ์จริงออก แล้วเล่าว่าเห็นมันครั้งแรกตอนอายุเท่าไรและเกิดอะไรขึ้น',
      'First, tap the line to show how much each strength sounds like you. Then pick a strength you can remember a real moment for, and tell us how old you were and what happened.',
    ),
    progressEyebrow: L('ทุกจุดแข็งมีจุดเริ่มต้น', 'Every strength started somewhere'),
    progressTitle: L('ค้นหาจุดแข็งจากเรื่องจริงของคุณ', 'Find your strengths in your own story'),
    progressHint: L(`ให้คะแนน ${STORY_STRENGTHS.length} ข้อ และเล่าอย่างน้อย 1 เรื่อง`, `Rate all ${STORY_STRENGTHS.length} and tell at least one story.`),
    submitLabel: L('ดูเรื่องเล่าจุดแข็งของฉัน', 'See my strength stories'),
    missingToast: L('ยังมีข้อที่ไฮไลต์ไว้ที่ยังไม่ได้ตอบ', 'Some highlighted items still need an answer.'),
    submittedToast: L('เรื่องเล่าจุดแข็งของคุณพร้อมแล้ว', 'Your strength stories are ready.'),
  },
  score: scoreStrengthStories,
}
