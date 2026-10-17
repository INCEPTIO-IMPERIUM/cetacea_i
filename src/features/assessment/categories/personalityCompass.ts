import { L, type Localized } from '../../../i18n/language'
import type { BigFiveDimension, BigFiveScores } from './bigFive'

/**
 * Category 01 — Personality Compass: five two-pole sides shown as a lean in %.
 * It has no questions of its own; every side is read straight from a Big Five score (#3),
 * because type-style dimensions measure four of the five Big Five factors and people do
 * not fall into distinct types (McCrae & Costa, 1989). Side names are our own.
 */

export interface CompassSide {
  id: string
  label: Localized
  from: BigFiveDimension
  /** The 0% end. */
  lowPole: Localized
  /** The 100% end. */
  highPole: Localized
  lowDescription: Localized
  highDescription: Localized
}

export const COMPASS_SIDES: CompassSide[] = [
  {
    id: 'recharge',
    label: L('แหล่งพลังงาน', 'Where energy comes from'),
    from: 'extraversion',
    lowPole: L('เติมพลังจากเวลาส่วนตัว', 'Recharges with time alone'),
    highPole: L('เติมพลังจากผู้คน', 'Recharges with people'),
    lowDescription: L('ได้พลังกลับมาเมื่อมีเวลาเงียบ ๆ ของตัวเอง และมักคิดให้ชัดก่อนพูด', 'Gets energy back from quiet time alone and usually thinks things through before speaking.'),
    highDescription: L('ได้พลังจากการพบปะพูดคุย และมักคิดไปพูดไปกับคนอื่น', 'Gets energy from meeting and talking with people, often thinking out loud with others.'),
  },
  {
    id: 'outlook',
    label: L('วิธีมองโลก', 'How you see things'),
    from: 'intellect',
    lowPole: L('เน้นสิ่งที่จับต้องได้', 'Focus on the concrete'),
    highPole: L('เน้นความคิดและความเป็นไปได้', 'Focus on ideas and possibilities'),
    lowDescription: L('สนใจข้อเท็จจริง ประสบการณ์ตรง และสิ่งที่นำไปใช้ได้ทันที', 'Pays attention to facts, direct experience and what can be used right away.'),
    highDescription: L('สนใจภาพรวม ความเชื่อมโยง และสิ่งที่ยังไม่เคยมีใครลอง', 'Drawn to the big picture, connections and things nobody has tried yet.'),
  },
  {
    id: 'decision',
    label: L('วิธีตัดสินใจ', 'How you decide'),
    from: 'agreeableness',
    lowPole: L('เน้นเหตุผลตรงไปตรงมา', 'Straightforward reasoning'),
    highPole: L('เน้นความรู้สึกของผู้อื่น', "Others' feelings"),
    lowDescription: L('ชั่งน้ำหนักจากหลักการและความสมเหตุสมผล แม้คำตอบอาจไม่ถูกใจทุกคน', 'Weighs principles and logic, even when the answer will not please everyone.'),
    highDescription: L('คำนึงว่าการตัดสินใจจะส่งผลต่อผู้คนอย่างไร และมองหาทางที่ทุกคนรับได้', 'Considers how a decision affects people and looks for an outcome everyone can accept.'),
  },
  {
    id: 'organisation',
    label: L('วิธีจัดการงาน', 'How you organise work'),
    from: 'conscientiousness',
    lowPole: L('ยืดหยุ่น ปรับตามสถานการณ์', 'Flexible, goes with the flow'),
    highPole: L('วางแผนเป็นระบบ', 'Planned and systematic'),
    lowDescription: L('เปิดทางเลือกไว้ ปรับแผนได้เร็ว และทำงานได้ดีเมื่อสถานการณ์เปลี่ยน', 'Keeps options open, adjusts plans quickly and works well when things change.'),
    highDescription: L('ชอบรู้ว่าจะทำอะไรเมื่อไร วางลำดับงานชัด และปิดงานให้จบ', 'Likes knowing what happens when, sets clear priorities and sees work through to the end.'),
  },
  {
    id: 'pressure',
    label: L('การรับมือแรงกดดัน', 'Handling pressure'),
    from: 'emotionalStability',
    lowPole: L('ไวต่อความกดดัน', 'Sensitive to pressure'),
    highPole: L('มั่นคงสงบ', 'Steady and calm'),
    lowDescription: L('รับรู้แรงกดดันและอารมณ์ได้ไว ซึ่งช่วยให้เห็นสัญญาณปัญหาตั้งแต่เนิ่น ๆ', 'Picks up on pressure and emotions quickly, which helps spot early signs of trouble.'),
    highDescription: L('ค่อนข้างนิ่งเมื่อเจอแรงกดดัน และกลับมาตั้งหลักได้เร็ว', 'Stays fairly composed under pressure and regains balance quickly.'),
  },
]

/** Scores from 45 to 55 read as balanced rather than leaning either way. */
export const BALANCED_MIN = 45
export const BALANCED_MAX = 55

export interface CompassReading {
  side: CompassSide
  /** Position on the line, 0 (low pole) – 100 (high pole). */
  position: number
  balanced: boolean
  /** The pole the reading leans to; null when balanced. */
  leansTo: 'low' | 'high' | null
  /** Strength toward the nearer pole, 50–100. */
  percent: number
  /** Ready-to-show line, e.g. th "เอนไปทางเติมพลังจากผู้คน 80%", en "Leans toward recharges with people 80%". */
  text: Localized
}

export function readSide(side: CompassSide, score: number): CompassReading {
  const position = Math.min(100, Math.max(0, Math.round(score)))
  const balanced = position >= BALANCED_MIN && position <= BALANCED_MAX
  const leansTo = balanced ? null : position > 50 ? 'high' : 'low'
  const percent = leansTo === 'low' ? 100 - position : Math.max(position, 100 - position)
  const pole = leansTo === 'high' ? side.highPole : side.lowPole
  const text: Localized = balanced
    ? { th: `สมดุล / ยืดหยุ่น ${percent}%`, en: `Balanced / flexible ${percent}%` }
    : { th: `เอนไปทาง${pole.th} ${percent}%`, en: `Leans toward ${pole.en.charAt(0).toLowerCase()}${pole.en.slice(1)} ${percent}%` }
  return { side, position, balanced, leansTo, percent, text }
}

/** Every compass side, read from the Big Five scores. */
export function personalityCompass(scores: BigFiveScores): CompassReading[] {
  return COMPASS_SIDES.map((side) => readSide(side, scores[side.from]))
}
