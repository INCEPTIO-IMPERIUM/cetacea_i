import { L, type Localized } from '../../../i18n/language'
import { rankScores, scoreScaleDimensions } from '../scoring'
import type { AssessmentCategory, CategoryAnswers, CategoryResult, ScaleQuestion } from '../types'

/**
 * Category 02 — Personality Spectrum: IPIP 50-item Big-Five Factor Markers.
 * Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure.
 * Psychological Assessment, 4, 26–42. Public domain — https://ipip.ori.org/newPermission.htm
 *
 * Items keep the original IPIP order, English wording and keying. The Thai wording is a
 * first draft that still needs back-translation by a second translator.
 * There are no Thai norms on the 0–100 scale yet, so results are never shown as percentiles.
 */

export const BIG_FIVE_DIMENSIONS = ['extraversion', 'agreeableness', 'conscientiousness', 'emotionalStability', 'intellect'] as const
export type BigFiveDimension = (typeof BIG_FIVE_DIMENSIONS)[number]

/** Big Five scores (0–100) — the shape the Personality Compass (#2) reads. */
export type BigFiveScores = Record<BigFiveDimension, number>

interface IpipItem {
  /** Position in the IPIP 50-item list (1–50). */
  n: number
  en: string
  th: string
  dimension: BigFiveDimension
  keyed: '+' | '-'
}

const E: BigFiveDimension = 'extraversion'
const A: BigFiveDimension = 'agreeableness'
const C: BigFiveDimension = 'conscientiousness'
const ES: BigFiveDimension = 'emotionalStability'
const I: BigFiveDimension = 'intellect'

export const IPIP_50_ITEMS: IpipItem[] = [
  { n: 1, en: 'Am the life of the party.', th: 'ฉันเป็นคนสร้างสีสันให้วงสังสรรค์', dimension: E, keyed: '+' },
  { n: 2, en: 'Feel little concern for others.', th: 'ฉันไม่ค่อยห่วงใยคนอื่น', dimension: A, keyed: '-' },
  { n: 3, en: 'Am always prepared.', th: 'ฉันเตรียมพร้อมอยู่เสมอ', dimension: C, keyed: '+' },
  { n: 4, en: 'Get stressed out easily.', th: 'ฉันเครียดง่าย', dimension: ES, keyed: '-' },
  { n: 5, en: 'Have a rich vocabulary.', th: 'ฉันรู้คำศัพท์กว้างขวาง', dimension: I, keyed: '+' },
  { n: 6, en: "Don't talk a lot.", th: 'ฉันไม่ค่อยพูด', dimension: E, keyed: '-' },
  { n: 7, en: 'Am interested in people.', th: 'ฉันสนใจผู้คน', dimension: A, keyed: '+' },
  { n: 8, en: 'Leave my belongings around.', th: 'ฉันวางของใช้ทิ้งไว้เกะกะ', dimension: C, keyed: '-' },
  { n: 9, en: 'Am relaxed most of the time.', th: 'ส่วนใหญ่ฉันรู้สึกผ่อนคลาย', dimension: ES, keyed: '+' },
  { n: 10, en: 'Have difficulty understanding abstract ideas.', th: 'ฉันเข้าใจแนวคิดที่เป็นนามธรรมได้ยาก', dimension: I, keyed: '-' },
  { n: 11, en: 'Feel comfortable around people.', th: 'ฉันรู้สึกสบายใจเมื่ออยู่ท่ามกลางผู้คน', dimension: E, keyed: '+' },
  { n: 12, en: 'Insult people.', th: 'ฉันพูดจาดูถูกคนอื่น', dimension: A, keyed: '-' },
  { n: 13, en: 'Pay attention to details.', th: 'ฉันใส่ใจรายละเอียด', dimension: C, keyed: '+' },
  { n: 14, en: 'Worry about things.', th: 'ฉันกังวลเรื่องต่าง ๆ', dimension: ES, keyed: '-' },
  { n: 15, en: 'Have a vivid imagination.', th: 'ฉันมีจินตนาการที่ชัดเจนและมีชีวิตชีวา', dimension: I, keyed: '+' },
  { n: 16, en: 'Keep in the background.', th: 'ฉันมักอยู่เบื้องหลัง ไม่ค่อยออกหน้า', dimension: E, keyed: '-' },
  { n: 17, en: "Sympathize with others' feelings.", th: 'ฉันเห็นใจความรู้สึกของคนอื่น', dimension: A, keyed: '+' },
  { n: 18, en: 'Make a mess of things.', th: 'ฉันมักทำเรื่องต่าง ๆ ให้ยุ่งเหยิง', dimension: C, keyed: '-' },
  { n: 19, en: 'Seldom feel blue.', th: 'ฉันแทบไม่ค่อยรู้สึกเศร้าหรือหดหู่', dimension: ES, keyed: '+' },
  { n: 20, en: 'Am not interested in abstract ideas.', th: 'ฉันไม่สนใจแนวคิดที่เป็นนามธรรม', dimension: I, keyed: '-' },
  { n: 21, en: 'Start conversations.', th: 'ฉันเป็นฝ่ายเริ่มบทสนทนา', dimension: E, keyed: '+' },
  { n: 22, en: "Am not interested in other people's problems.", th: 'ฉันไม่สนใจปัญหาของคนอื่น', dimension: A, keyed: '-' },
  { n: 23, en: 'Get chores done right away.', th: 'ฉันทำงานจุกจิกให้เสร็จทันที', dimension: C, keyed: '+' },
  { n: 24, en: 'Am easily disturbed.', th: 'ฉันว้าวุ่นใจง่าย', dimension: ES, keyed: '-' },
  { n: 25, en: 'Have excellent ideas.', th: 'ฉันมีไอเดียดี ๆ', dimension: I, keyed: '+' },
  { n: 26, en: 'Have little to say.', th: 'ฉันมีเรื่องจะพูดไม่มาก', dimension: E, keyed: '-' },
  { n: 27, en: 'Have a soft heart.', th: 'ฉันเป็นคนใจอ่อน', dimension: A, keyed: '+' },
  { n: 28, en: 'Often forget to put things back in their proper place.', th: 'ฉันมักลืมเก็บของเข้าที่', dimension: C, keyed: '-' },
  { n: 29, en: 'Get upset easily.', th: 'ฉันอารมณ์เสียง่าย', dimension: ES, keyed: '-' },
  { n: 30, en: 'Do not have a good imagination.', th: 'ฉันไม่ค่อยมีจินตนาการ', dimension: I, keyed: '-' },
  { n: 31, en: 'Talk to a lot of different people at parties.', th: 'ในงานสังสรรค์ ฉันคุยกับคนหลากหลาย', dimension: E, keyed: '+' },
  { n: 32, en: 'Am not really interested in others.', th: 'ฉันไม่ได้สนใจคนอื่นมากนัก', dimension: A, keyed: '-' },
  { n: 33, en: 'Like order.', th: 'ฉันชอบความเป็นระเบียบ', dimension: C, keyed: '+' },
  { n: 34, en: 'Change my mood a lot.', th: 'อารมณ์ของฉันเปลี่ยนไปมาบ่อย', dimension: ES, keyed: '-' },
  { n: 35, en: 'Am quick to understand things.', th: 'ฉันเข้าใจสิ่งต่าง ๆ ได้เร็ว', dimension: I, keyed: '+' },
  { n: 36, en: "Don't like to draw attention to myself.", th: 'ฉันไม่ชอบทำให้ตัวเองเป็นจุดสนใจ', dimension: E, keyed: '-' },
  { n: 37, en: 'Take time out for others.', th: 'ฉันสละเวลาให้คนอื่น', dimension: A, keyed: '+' },
  { n: 38, en: 'Shirk my duties.', th: 'ฉันเลี่ยงหน้าที่ที่ควรทำ', dimension: C, keyed: '-' },
  { n: 39, en: 'Have frequent mood swings.', th: 'ฉันอารมณ์แปรปรวนบ่อย', dimension: ES, keyed: '-' },
  { n: 40, en: 'Use difficult words.', th: 'ฉันใช้คำศัพท์ยาก ๆ', dimension: I, keyed: '+' },
  { n: 41, en: "Don't mind being the center of attention.", th: 'ฉันไม่ลำบากใจเมื่อเป็นจุดสนใจ', dimension: E, keyed: '+' },
  { n: 42, en: "Feel others' emotions.", th: 'ฉันรับรู้อารมณ์ของคนอื่นได้', dimension: A, keyed: '+' },
  { n: 43, en: 'Follow a schedule.', th: 'ฉันทำตามตารางเวลา', dimension: C, keyed: '+' },
  { n: 44, en: 'Get irritated easily.', th: 'ฉันหงุดหงิดง่าย', dimension: ES, keyed: '-' },
  { n: 45, en: 'Spend time reflecting on things.', th: 'ฉันใช้เวลาครุ่นคิดทบทวนเรื่องต่าง ๆ', dimension: I, keyed: '+' },
  { n: 46, en: 'Am quiet around strangers.', th: 'ฉันเงียบเมื่ออยู่กับคนแปลกหน้า', dimension: E, keyed: '-' },
  { n: 47, en: 'Make people feel at ease.', th: 'ฉันทำให้คนอื่นรู้สึกสบายใจ', dimension: A, keyed: '+' },
  { n: 48, en: 'Am exacting in my work.', th: 'ฉันพิถีพิถันกับงานของตัวเอง', dimension: C, keyed: '+' },
  { n: 49, en: 'Often feel blue.', th: 'ฉันมักรู้สึกเศร้าหรือหดหู่', dimension: ES, keyed: '-' },
  { n: 50, en: 'Am full of ideas.', th: 'ฉันมีไอเดียเต็มไปหมด', dimension: I, keyed: '+' },
]

const questions: ScaleQuestion[] = IPIP_50_ITEMS.map((item) => ({
  id: `ipip${item.n}`,
  kind: 'scale',
  // English shows the original IPIP wording.
  prompt: { th: item.th, en: item.en },
  required: true,
  help: L('แตะบนเส้นเพื่อให้คะแนนข้อนี้', 'Tap the line to answer this one.'),
  dimension: item.dimension,
  reverseKeyed: item.keyed === '-',
  minLabel: L('ไม่ตรงกับฉันเลย', 'Not like me at all'),
  maxLabel: L('ตรงกับฉันมาก', 'Very much like me'),
  source: `IPIP 50-item Big-Five Markers (Goldberg, 1992) #${item.n} (${item.keyed}${item.dimension}): "${item.en}"`,
}))

/** Thai labels and both ends of every dimension. Neither end is better. */
export const bigFiveCopy: Record<BigFiveDimension, { label: Localized; low: Localized; high: Localized }> = {
  extraversion: {
    label: L('การแสดงออกทางสังคม', 'Extraversion'),
    low: L('ชอบความสงบ คิดก่อนพูด และเติมพลังจากเวลาส่วนตัว', 'Enjoys quiet, thinks before speaking, recharges with time alone'),
    high: L('ชอบพบปะผู้คน พูดคุยง่าย และได้พลังจากการอยู่กับคนอื่น', 'Enjoys meeting people, chats easily, gains energy from others'),
  },
  agreeableness: {
    label: L('ความเป็นมิตรและการร่วมมือ', 'Agreeableness'),
    low: L('ตรงไปตรงมา กล้าโต้แย้ง และยืนหยัดในมุมมองของตัวเอง', 'Direct, willing to challenge, stands by their own view'),
    high: L('อบอุ่น ใส่ใจความรู้สึกคนอื่น และชอบหาทางที่ทุกคนไปด้วยกันได้', 'Warm, attentive to feelings, looks for a way everyone can go along with'),
  },
  conscientiousness: {
    label: L('ความมีระเบียบและวินัย', 'Conscientiousness'),
    low: L('ยืดหยุ่น ปรับตัวตามสถานการณ์ และไม่ติดกับแผน', 'Flexible, adapts to the moment, not tied to a plan'),
    high: L('วางแผน เป็นระบบ และทำสิ่งที่รับปากไว้ให้เสร็จ', 'Plans ahead, works systematically, finishes what they promise'),
  },
  emotionalStability: {
    label: L('ความมั่นคงทางอารมณ์', 'Emotional stability'),
    low: L('รับรู้อารมณ์และแรงกดดันได้ไว จึงมักเห็นความเสี่ยงก่อนคนอื่น', 'Quick to sense feelings and pressure, so often spots risks early'),
    high: L('สงบ หนักแน่น และไม่ค่อยหวั่นไหวกับแรงกดดัน', 'Calm, steady and rarely shaken by pressure'),
  },
  intellect: {
    label: L('ความคิดและจินตนาการ', 'Intellect / imagination'),
    low: L('ชอบสิ่งที่จับต้องได้ ใช้ได้จริง และวิธีที่พิสูจน์แล้ว', 'Prefers the concrete, the practical and proven methods'),
    high: L('ชอบความคิดใหม่ ๆ จินตนาการ และการคิดเชิงนามธรรม', 'Enjoys new ideas, imagination and abstract thinking'),
  },
}

/** Mean keyed score per dimension (0–100); dimensions are ranked highest first. */
export function scoreBigFive(answers: CategoryAnswers): CategoryResult {
  const dimensions = scoreScaleDimensions(questions, answers)
  // Keep the canonical dimension order so ties rank the same way every time.
  const scores = Object.fromEntries(BIG_FIVE_DIMENSIONS.filter((key) => key in dimensions).map((key) => [key, dimensions[key]]))
  return { scores, ranking: rankScores(scores) }
}

/** Reads a stored result back as Big Five scores; null until every dimension has a score. */
export function toBigFiveScores(scores: Record<string, number> | undefined): BigFiveScores | null {
  if (!scores || !BIG_FIVE_DIMENSIONS.every((key) => typeof scores[key] === 'number')) return null
  return Object.fromEntries(BIG_FIVE_DIMENSIONS.map((key) => [key, scores[key]])) as BigFiveScores
}

export const bigFive: AssessmentCategory = {
  id: 'bigFive',
  number: '02',
  title: L('สเปกตรัมบุคลิกภาพ', 'Personality Spectrum'),
  summary: L(
    'บุคลิกภาพ 5 มิติ (Big Five) จาก 50 ข้อความสั้น ๆ คำตอบชุดนี้ยังใช้คำนวณเข็มทิศบุคลิกภาพ (หมวด 01) ด้วย จึงไม่ต้องตอบซ้ำ',
    'Five personality dimensions (Big Five) from 50 short statements. The same answers also give your Personality Compass (section 01), so there is nothing to answer twice.',
  ),
  estimatedMinutes: 10,
  pageSize: 10,
  gridClassName: 'grid grid-cols-1 xl:grid-cols-2 gap-4',
  questions,
  copy: {
    eyebrow: L('02 / สเปกตรัมบุคลิกภาพ', '02 / Personality Spectrum'),
    title: L('ข้อความไหนตรงกับคุณ', 'Which statements sound like you'),
    description: L(
      'อ่านแต่ละข้อความแล้วแตะบนเส้นว่าตรงกับตัวคุณมากแค่ไหน ให้นึกถึงตัวคุณในตอนนี้ตามปกติ ไม่ใช่ตัวคุณที่อยากเป็น ไม่มีคำตอบถูกหรือผิด',
      'Read each statement and tap the line to show how well it describes you. Think of how you generally are now, not how you wish to be. There are no right or wrong answers.',
    ),
    progressEyebrow: L('ตอบตามความรู้สึกแรก', 'Go with your first instinct'),
    progressTitle: L('บอกเราว่าคุณเป็นคนแบบไหน', 'Tell us what you are like'),
    progressHint: L('ตอบให้ครบ 50 ข้อเพื่อดูผลทั้ง 5 มิติ', 'Answer all 50 to see your five dimensions.'),
    submitLabel: L('ดูผลบุคลิกภาพของฉัน', 'See my personality results'),
    missingToast: L('ยังมีข้อที่ไฮไลต์ไว้ที่ยังไม่ได้ตอบ', 'Some highlighted statements still need an answer.'),
    submittedToast: L('ผลของคุณพร้อมแล้ว', 'Your results are ready.'),
  },
  score: scoreBigFive,
}
