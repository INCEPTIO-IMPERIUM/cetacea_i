import { L, type Localized } from '../../../i18n/language'
import { rankScores, scoreScaleDimensions } from '../scoring'
import type { AssessmentCategory, CategoryAnswers, CategoryResult, ScaleQuestion } from '../types'

/**
 * Category 03 — Work Style Compass: IPIP Interpersonal Circumplex (IPIP-IPC), 32 items.
 * Markey, P. M., & Markey, C. N. (2009). A brief assessment of the interpersonal circumplex:
 * The IPIP-IPC. Assessment, 16(4), 352–361. Public domain — https://ipip.ori.org/newPermission.htm
 *
 * Items keep the original order and octant; every item scores straight into its octant
 * (no reverse keying). The Thai wording is a first draft that still needs back-translation.
 * Splitting the circle into four compass directions is our own reading, not part of the instrument.
 */

export const OCTANTS = ['PA', 'BC', 'DE', 'FG', 'HI', 'JK', 'LM', 'NO'] as const
export type Octant = (typeof OCTANTS)[number]

/** Angle of each octant on the circle: Warmth (LOV) is 0°, Dominance (DOM) is 90°. */
export const OCTANT_ANGLES: Record<Octant, number> = { LM: 0, NO: 45, PA: 90, BC: 135, DE: 180, FG: 225, HI: 270, JK: 315 }

interface IpcItem {
  n: number
  en: string
  th: string
  octant: Octant
}

export const IPIP_IPC_ITEMS: IpcItem[] = [
  { n: 1, en: 'Am quiet around strangers.', th: 'ฉันเงียบเมื่ออยู่กับคนแปลกหน้า', octant: 'FG' },
  { n: 2, en: 'Speak softly.', th: 'ฉันพูดเสียงเบา', octant: 'HI' },
  { n: 3, en: 'Tolerate a lot from others.', th: 'ฉันอดทนกับสิ่งที่คนอื่นทำได้มาก', octant: 'JK' },
  { n: 4, en: 'Am interested in people.', th: 'ฉันสนใจผู้คน', octant: 'LM' },
  { n: 5, en: 'Feel comfortable around people.', th: 'ฉันรู้สึกสบายใจเมื่ออยู่ท่ามกลางผู้คน', octant: 'NO' },
  { n: 6, en: 'Demand to be the center of interest.', th: 'ฉันต้องการเป็นศูนย์กลางความสนใจ', octant: 'PA' },
  { n: 7, en: 'Cut others to pieces.', th: 'ฉันวิจารณ์คนอื่นอย่างเชือดเฉือน', octant: 'BC' },
  { n: 8, en: 'Believe people should fend for themselves.', th: 'ฉันเชื่อว่าแต่ละคนควรดูแลตัวเอง', octant: 'DE' },
  { n: 9, en: 'Am a very private person.', th: 'ฉันเป็นคนเก็บเรื่องส่วนตัวมาก', octant: 'FG' },
  { n: 10, en: 'Let others finish what they are saying.', th: 'ฉันปล่อยให้คนอื่นพูดจนจบ', octant: 'HI' },
  { n: 11, en: 'Take things as they come.', th: 'ฉันรับสิ่งต่าง ๆ ตามที่มันเป็น', octant: 'JK' },
  { n: 12, en: 'Reassure others.', th: 'ฉันปลอบใจและให้กำลังใจคนอื่น', octant: 'LM' },
  { n: 13, en: 'Start conversations.', th: 'ฉันเป็นฝ่ายเริ่มบทสนทนา', octant: 'NO' },
  { n: 14, en: 'Do most of the talking.', th: 'ฉันเป็นคนพูดเสียส่วนใหญ่', octant: 'PA' },
  { n: 15, en: 'Contradict others.', th: 'ฉันแย้งคนอื่น', octant: 'BC' },
  { n: 16, en: "Don't fall for sob stories.", th: 'ฉันไม่ใจอ่อนกับเรื่องเล่าเรียกน้ำตา', octant: 'DE' },
  { n: 17, en: "Don't talk a lot.", th: 'ฉันไม่ค่อยพูด', octant: 'FG' },
  { n: 18, en: 'Seldom toot my own horn.', th: 'ฉันไม่ค่อยโอ้อวดตัวเอง', octant: 'HI' },
  { n: 19, en: 'Think of others first.', th: 'ฉันนึกถึงคนอื่นก่อน', octant: 'JK' },
  { n: 20, en: "Inquire about others' well-being.", th: 'ฉันถามไถ่ความเป็นอยู่ของคนอื่น', octant: 'LM' },
  { n: 21, en: 'Talk to a lot of different people at parties.', th: 'ในงานสังสรรค์ ฉันคุยกับคนหลากหลาย', octant: 'NO' },
  { n: 22, en: 'Speak loudly.', th: 'ฉันพูดเสียงดัง', octant: 'PA' },
  { n: 23, en: 'Snap at people.', th: 'ฉันตวาดใส่คนอื่น', octant: 'BC' },
  { n: 24, en: "Don't put a lot of thought into things.", th: 'ฉันไม่ค่อยคิดอะไรให้มาก', octant: 'DE' },
  { n: 25, en: 'Have little to say.', th: 'ฉันมีเรื่องจะพูดไม่มาก', octant: 'FG' },
  { n: 26, en: 'Dislike being the center of attention.', th: 'ฉันไม่ชอบเป็นจุดสนใจ', octant: 'HI' },
  { n: 27, en: 'Seldom stretch the truth.', th: 'ฉันแทบไม่เคยพูดเกินจริง', octant: 'JK' },
  { n: 28, en: 'Get along well with others.', th: 'ฉันเข้ากับคนอื่นได้ดี', octant: 'LM' },
  { n: 29, en: 'Love large parties.', th: 'ฉันชอบงานปาร์ตี้ใหญ่ ๆ', octant: 'NO' },
  { n: 30, en: 'Demand attention.', th: 'ฉันเรียกร้องความสนใจ', octant: 'PA' },
  { n: 31, en: 'Have a sharp tongue.', th: 'ฉันพูดจาเผ็ดร้อน', octant: 'BC' },
  { n: 32, en: "Am not interested in other people's problems.", th: 'ฉันไม่สนใจปัญหาของคนอื่น', octant: 'DE' },
]

const questions: ScaleQuestion[] = IPIP_IPC_ITEMS.map((item) => ({
  id: `ipc${item.n}`,
  kind: 'scale',
  // English shows the original IPIP-IPC wording.
  prompt: { th: item.th, en: item.en },
  required: true,
  help: L('แตะบนเส้นเพื่อให้คะแนนข้อนี้', 'Tap the line to answer this one.'),
  dimension: item.octant,
  reverseKeyed: false,
  minLabel: L('ไม่ตรงกับฉันเลย', 'Not like me at all'),
  maxLabel: L('ตรงกับฉันมาก', 'Very much like me'),
  source: `IPIP-IPC (Markey & Markey, 2009) #${item.n} (${item.octant} ${OCTANT_ANGLES[item.octant]}°): "${item.en}"`,
}))

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/**
 * Largest vector length possible from 0–100 octant scores: four neighbouring octants at 100,
 * the rest at 0 (e.g. LM, NO, PA, BC → |(1, 1 + √2)| × 100 / 4 ≈ 65.3). Used to scale the axes to ±100.
 */
const MAX_RADIUS = Math.hypot(1, 1 + Math.SQRT2) * 25

/**
 * Standard circumplex projection (Wiggins, Phillips & Trapnell, 1989; Gurtman, 1994):
 * LOV = Σ octant · cos θ / 4, DOM = Σ octant · sin θ / 4. Because cos and sin sum to zero over
 * the eight angles, a general tendency to agree with every item cancels out.
 * Returns both axes scaled to −100 … 100.
 */
export function circumplexAxes(octants: Record<Octant, number>): { dominance: number; warmth: number } {
  let x = 0
  let y = 0
  for (const octant of OCTANTS) {
    const angle = toRadians(OCTANT_ANGLES[octant])
    x += (octants[octant] * Math.cos(angle)) / 4
    y += (octants[octant] * Math.sin(angle)) / 4
  }
  // `|| 0` turns a rounded −0 (floating-point noise around the centre) into 0.
  return { dominance: Math.round((y / MAX_RADIUS) * 100) || 0, warmth: Math.round((x / MAX_RADIUS) * 100) || 0 }
}

export type Direction = 'navigator' | 'spark' | 'harbor' | 'cartographer'

/** Our own characters, one per quadrant. Dominance up, Warmth right. */
export const DIRECTIONS: Record<Direction, { compass: Localized; name: Localized; english: string; icon: string; quadrant: Localized; description: Localized }> = {
  navigator: {
    compass: L('เหนือ', 'North'),
    name: L('ผู้นำทาง', 'Navigator'),
    english: 'Navigator',
    icon: '🧭',
    quadrant: L('นำมากกว่า · ใส่ใจเป้าหมายมากกว่าความรู้สึก', 'Leads more · goals before feelings'),
    description: L('ขับเคลื่อนเป้าหมาย ตัดสินใจเร็ว และกล้ารับผิดชอบเมื่อทีมต้องการทิศทาง', 'Drives toward goals, decides quickly and takes charge when the team needs direction.'),
  },
  spark: {
    compass: L('ตะวันออก', 'East'),
    name: L('ผู้จุดประกาย', 'Spark'),
    english: 'Spark',
    icon: '✨',
    quadrant: L('นำมากกว่า · อบอุ่นมากกว่า', 'Leads more · warmer'),
    description: L('ชวนคนมาร่วมกัน สร้างพลังและไอเดีย และทำให้บรรยากาศมีชีวิตชีวา', 'Brings people together, sparks energy and ideas, and livens up the room.'),
  },
  harbor: {
    compass: L('ใต้', 'South'),
    name: L('ผู้ประสานใจ', 'Harbor'),
    english: 'Harbor',
    icon: '🤝',
    quadrant: L('ตามมากกว่า · อบอุ่นมากกว่า', 'Follows more · warmer'),
    description: L('สนับสนุนทีม รับฟัง และทำให้ทุกคนไปด้วยกันได้', 'Supports the team, listens, and helps everyone move forward together.'),
  },
  cartographer: {
    compass: L('ตะวันตก', 'West'),
    name: L('ผู้วาดแผนที่', 'Cartographer'),
    english: 'Cartographer',
    icon: '🗺️',
    quadrant: L('ตามมากกว่า · เน้นงานมากกว่าความสัมพันธ์', 'Follows more · task before relationships'),
    description: L('ละเอียด เป็นระบบ ใส่ใจความถูกต้อง และคิดให้รอบก่อนลงมือ', 'Thorough, systematic, careful about accuracy and thinks things through before acting.'),
  },
}

/** Within 10% of the full radius of an axis (or of the centre) the reading is shown as a blend. */
export const BLEND_THRESHOLD = 10

export interface WorkStyleReading {
  dominance: number
  warmth: number
  /** Distance from the centre, 0–100. */
  intensity: number
  /** One direction, two neighbours when the point sits near an axis, or all four near the centre. */
  directions: Direction[]
  blended: boolean
}

function quadrant(dominance: number, warmth: number): Direction {
  if (dominance >= 0) return warmth >= 0 ? 'spark' : 'navigator'
  return warmth >= 0 ? 'harbor' : 'cartographer'
}

export function readWorkStyle(dominance: number, warmth: number): WorkStyleReading {
  const intensity = Math.min(100, Math.round(Math.hypot(dominance, warmth)))
  let directions: Direction[]
  if (intensity < BLEND_THRESHOLD) directions = ['navigator', 'spark', 'harbor', 'cartographer']
  else if (Math.abs(warmth) < BLEND_THRESHOLD) directions = dominance >= 0 ? ['navigator', 'spark'] : ['cartographer', 'harbor']
  else if (Math.abs(dominance) < BLEND_THRESHOLD) directions = warmth >= 0 ? ['spark', 'harbor'] : ['navigator', 'cartographer']
  else directions = [quadrant(dominance, warmth)]
  return { dominance, warmth, intensity, directions, blended: directions.length > 1 }
}

/** Reads a stored result back; null if the axes are missing. Axes are stored shifted to 0–100. */
export function workStyleFromScores(scores: Record<string, number> | undefined): WorkStyleReading | null {
  if (!scores || typeof scores.dominance !== 'number' || typeof scores.warmth !== 'number') return null
  return readWorkStyle(scores.dominance * 2 - 100, scores.warmth * 2 - 100)
}

/**
 * Octant means (0–100) plus both axes. The axes are stored shifted to 0–100 (50 = centre)
 * so every stored score keeps the 0–100 contract. Ranking lists octants only.
 */
export function scoreWorkStyle(answers: CategoryAnswers): CategoryResult {
  const means = scoreScaleDimensions(questions, answers)
  const octants = Object.fromEntries(OCTANTS.map((octant) => [octant, means[octant] ?? 0])) as Record<Octant, number>
  const { dominance, warmth } = circumplexAxes(octants)
  return {
    scores: { ...octants, dominance: Math.round((dominance + 100) / 2), warmth: Math.round((warmth + 100) / 2) },
    ranking: rankScores(octants),
  }
}

export const workStyle: AssessmentCategory = {
  id: 'workStyle',
  number: '03',
  title: L('เข็มทิศการทำงาน', 'Work Style Compass'),
  summary: L(
    'รูปแบบการทำงานกับผู้อื่นบนสองแกน คือการนำกับความอบอุ่น จาก 32 ข้อความสั้น ๆ แล้วแสดงเป็นทิศบนเข็มทิศ',
    'How you work with others on two axes — leading and warmth — from 32 short statements, shown as a direction on a compass.',
  ),
  estimatedMinutes: 6,
  pageSize: 8,
  gridClassName: 'grid grid-cols-1 xl:grid-cols-2 gap-4',
  questions,
  copy: {
    eyebrow: L('03 / เข็มทิศการทำงาน', '03 / Work Style Compass'),
    title: L('เวลาอยู่กับคนอื่น คุณเป็นแบบไหน', 'What are you like with other people'),
    description: L(
      'อ่านแต่ละข้อความแล้วแตะบนเส้นว่าตรงกับตัวคุณมากแค่ไหน นึกถึงตัวคุณตามปกติเวลาอยู่กับเพื่อน ทีม หรือคนที่เพิ่งรู้จัก ไม่มีคำตอบถูกหรือผิด',
      'Read each statement and tap the line to show how well it describes you — think of how you usually are with friends, a team or people you have just met. There are no right or wrong answers.',
    ),
    progressEyebrow: L('ตอบตามความรู้สึกแรก', 'Go with your first instinct'),
    progressTitle: L('บอกเราว่าคุณทำงานกับคนอื่นอย่างไร', 'Tell us how you work with others'),
    progressHint: L('ตอบให้ครบ 32 ข้อเพื่อดูทิศของคุณบนเข็มทิศ', 'Answer all 32 to see your direction on the compass.'),
    submitLabel: L('ดูเข็มทิศการทำงานของฉัน', 'See my work style compass'),
    missingToast: L('ยังมีข้อที่ไฮไลต์ไว้ที่ยังไม่ได้ตอบ', 'Some highlighted statements still need an answer.'),
    submittedToast: L('เข็มทิศการทำงานของคุณพร้อมแล้ว', 'Your work style compass is ready.'),
  },
  score: scoreWorkStyle,
}
