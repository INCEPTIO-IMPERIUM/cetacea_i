import type { BigFiveDimension, BigFiveScores } from './bigFive'

/**
 * Category 01 — Personality Compass: five two-pole sides shown as a lean in %.
 * It has no questions of its own; every side is read straight from a Big Five score (#3),
 * because type-style dimensions measure four of the five Big Five factors and people do
 * not fall into distinct types (McCrae & Costa, 1989). Side names are our own.
 */

export interface CompassSide {
  id: string
  label: string
  from: BigFiveDimension
  /** The 0% end. */
  lowPole: string
  /** The 100% end. */
  highPole: string
  lowDescription: string
  highDescription: string
}

export const COMPASS_SIDES: CompassSide[] = [
  {
    id: 'recharge',
    label: 'แหล่งพลังงาน',
    from: 'extraversion',
    lowPole: 'เติมพลังจากเวลาส่วนตัว',
    highPole: 'เติมพลังจากผู้คน',
    lowDescription: 'ได้พลังกลับมาเมื่อมีเวลาเงียบ ๆ ของตัวเอง และมักคิดให้ชัดก่อนพูด',
    highDescription: 'ได้พลังจากการพบปะพูดคุย และมักคิดไปพูดไปกับคนอื่น',
  },
  {
    id: 'outlook',
    label: 'วิธีมองโลก',
    from: 'intellect',
    lowPole: 'เน้นสิ่งที่จับต้องได้',
    highPole: 'เน้นความคิดและความเป็นไปได้',
    lowDescription: 'สนใจข้อเท็จจริง ประสบการณ์ตรง และสิ่งที่นำไปใช้ได้ทันที',
    highDescription: 'สนใจภาพรวม ความเชื่อมโยง และสิ่งที่ยังไม่เคยมีใครลอง',
  },
  {
    id: 'decision',
    label: 'วิธีตัดสินใจ',
    from: 'agreeableness',
    lowPole: 'เน้นเหตุผลตรงไปตรงมา',
    highPole: 'เน้นความรู้สึกของผู้อื่น',
    lowDescription: 'ชั่งน้ำหนักจากหลักการและความสมเหตุสมผล แม้คำตอบอาจไม่ถูกใจทุกคน',
    highDescription: 'คำนึงว่าการตัดสินใจจะส่งผลต่อผู้คนอย่างไร และมองหาทางที่ทุกคนรับได้',
  },
  {
    id: 'organisation',
    label: 'วิธีจัดการงาน',
    from: 'conscientiousness',
    lowPole: 'ยืดหยุ่น ปรับตามสถานการณ์',
    highPole: 'วางแผนเป็นระบบ',
    lowDescription: 'เปิดทางเลือกไว้ ปรับแผนได้เร็ว และทำงานได้ดีเมื่อสถานการณ์เปลี่ยน',
    highDescription: 'ชอบรู้ว่าจะทำอะไรเมื่อไร วางลำดับงานชัด และปิดงานให้จบ',
  },
  {
    id: 'pressure',
    label: 'การรับมือแรงกดดัน',
    from: 'emotionalStability',
    lowPole: 'ไวต่อความกดดัน',
    highPole: 'มั่นคงสงบ',
    lowDescription: 'รับรู้แรงกดดันและอารมณ์ได้ไว ซึ่งช่วยให้เห็นสัญญาณปัญหาตั้งแต่เนิ่น ๆ',
    highDescription: 'ค่อนข้างนิ่งเมื่อเจอแรงกดดัน และกลับมาตั้งหลักได้เร็ว',
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
  /** Ready-to-show line, e.g. "เอนไปทางเติมพลังจากผู้คน 80%". */
  text: string
}

export function readSide(side: CompassSide, score: number): CompassReading {
  const position = Math.min(100, Math.max(0, Math.round(score)))
  const balanced = position >= BALANCED_MIN && position <= BALANCED_MAX
  const leansTo = balanced ? null : position > 50 ? 'high' : 'low'
  const percent = leansTo === 'low' ? 100 - position : Math.max(position, 100 - position)
  const text = balanced ? `สมดุล / ยืดหยุ่น ${percent}%` : `เอนไปทาง${leansTo === 'high' ? side.highPole : side.lowPole} ${percent}%`
  return { side, position, balanced, leansTo, percent, text }
}

/** Every compass side, read from the Big Five scores. */
export function personalityCompass(scores: BigFiveScores): CompassReading[] {
  return COMPASS_SIDES.map((side) => readSide(side, scores[side.from]))
}
