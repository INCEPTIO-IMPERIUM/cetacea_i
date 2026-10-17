import { minutes, type CatalogExperiment } from '../../../data/dashboard'
import { L, type Localized } from '../../../i18n/language'
import { rankScores, scoreScaleDimensions } from '../scoring'
import type { AssessmentCategory, CategoryAnswers, CategoryResult, ScaleQuestion } from '../types'
import { RIASEC_TYPES, riasecCopy, type RiasecProfile, type RiasecType } from './careerInterest'

/**
 * Category 05 — Strengths & Potential: confidence (self-efficacy; Bandura, 1977) in the six
 * RIASEC work areas, combined with the interests from Category 04 into a strengths map.
 *
 * The planned AFPD RIASEC Markers Form B carries the same restriction as Form A — copyrighted by
 * Armstrong, Allison & Rounds, free only for noncommercial use (Interest Item Pool, checked
 * 2026-10-15). As issue #6 prescribes, every item below is written by Who Am I? from the RIASEC
 * definitions and none repeats an activity from Category 04. Rights: ours, usable for any purpose.
 * Not yet validated: check reliability on real Thai responses (Phase 6).
 */

interface ConfidenceItem {
  code: string
  type: RiasecType
  th: string
  en: string
}

const ITEMS_BY_TYPE: Record<RiasecType, { th: string; en: string }[]> = {
  R: [
    { th: 'เปลี่ยนหลอดไฟหรือปลั๊กไฟอย่างปลอดภัย', en: 'Safely replace a light bulb fitting or a plug' },
    { th: 'ประกอบชุดโมเดลหรือหุ่นยนต์ตามคู่มือ', en: 'Build a model or robot kit from its instructions' },
    { th: 'ใช้เครื่องมือช่างพื้นฐาน เช่น ไขควงและประแจ ได้คล่อง', en: 'Use basic hand tools such as screwdrivers and spanners with ease' },
    { th: 'ทำอาหารจานหลักให้หลายคนกินได้', en: 'Cook a main dish for a group of people' },
    { th: 'ซ่อมของใช้ในบ้านที่ชำรุดให้กลับมาใช้ได้', en: 'Fix a broken household item so it works again' },
    { th: 'บังคับโดรนให้บินตามเส้นทางที่กำหนด', en: 'Fly a drone along a set route' },
    { th: 'ตั้งเต็นท์และเตรียมแคมป์กลางแจ้ง', en: 'Pitch a tent and set up an outdoor camp' },
    { th: 'เดินสายแลนหรือติดตั้งเราเตอร์ในบ้าน', en: 'Run network cables or install a home router' },
  ],
  I: [
    { th: 'อธิบายสาเหตุของปรากฏการณ์ทางวิทยาศาสตร์', en: 'Explain the cause of a scientific phenomenon' },
    { th: 'ใช้สถิติสรุปผลจากข้อมูล', en: 'Use statistics to draw conclusions from data' },
    { th: 'เขียนโปรแกรมแก้โจทย์ปัญหา', en: 'Write a program that solves a problem' },
    { th: 'ประเมินว่าแหล่งข้อมูลไหนน่าเชื่อถือ', en: 'Judge which sources of information are trustworthy' },
    { th: 'ออกแบบแบบสอบถามหรือวิธีเก็บข้อมูล', en: 'Design a survey or a way to collect data' },
    { th: 'ทำความเข้าใจบทความวิชาการภาษาอังกฤษ', en: 'Understand an academic article written in English' },
    { th: 'แยกปัญหาใหญ่เป็นส่วนย่อยแล้วแก้ทีละส่วน', en: 'Break a big problem into parts and solve them one at a time' },
    { th: 'คาดการณ์ผลการทดลองจากหลักการ', en: 'Predict the result of an experiment from first principles' },
  ],
  A: [
    { th: 'วาดภาพจากจินตนาการให้คนอื่นเข้าใจได้', en: 'Draw something from imagination that others can understand' },
    { th: 'เลือกสีและฟอนต์ให้งานดูกลมกลืน', en: 'Choose colours and fonts that work well together' },
    { th: 'เล่าเรื่องให้คนฟังติดตามจนจบ', en: 'Tell a story that keeps people listening to the end' },
    { th: 'เล่นดนตรีหรือร้องเพลงต่อหน้าคนอื่น', en: 'Play music or sing in front of others' },
    { th: 'คิดคอนเซปต์ใหม่สำหรับแคมเปญหรือโปรเจกต์', en: 'Come up with a fresh concept for a campaign or project' },
    { th: 'แสดงละครหรือสวมบทบาทได้สมจริง', en: 'Act or play a role convincingly' },
    { th: 'จัดองค์ประกอบภาพถ่ายหรือวิดีโอให้น่าดู', en: 'Frame a photo or video shot so it looks good' },
    { th: 'ออกแบบหน้าจอแอปหรือเว็บไซต์ให้ใช้งานง่าย', en: 'Design an app or website screen that is easy to use' },
  ],
  S: [
    { th: 'อธิบายเรื่องยากให้คนที่ไม่มีพื้นฐานเข้าใจ', en: 'Explain a hard topic to someone with no background' },
    { th: 'สังเกตได้ว่าเพื่อนกำลังไม่สบายใจ', en: 'Notice when a friend is upset' },
    { th: 'ทำให้คนแปลกหน้ารู้สึกเป็นกันเอง', en: 'Put a stranger at ease' },
    { th: 'ให้ฟีดแบ็กตรงไปตรงมาโดยไม่ทำร้ายใจ', en: 'Give honest feedback without hurting feelings' },
    { th: 'ดูแลคนป่วยหรือผู้สูงอายุในครอบครัว', en: 'Look after a sick or elderly family member' },
    { th: 'ทำงานกลุ่มให้ทุกคนได้แสดงความคิดเห็น', en: 'Run group work so everyone gets a say' },
    { th: 'ช่วยให้คนอื่นตั้งเป้าหมายและทำตามได้', en: 'Help someone set a goal and stick to it' },
    { th: 'พูดปลอบคนที่กำลังเสียใจ', en: 'Comfort someone who is grieving' },
  ],
  E: [
    { th: 'พูดต่อหน้าคนจำนวนมาก', en: 'Speak in front of a large audience' },
    { th: 'ขายสินค้าหรือไอเดียให้คนที่ยังลังเล', en: 'Sell a product or idea to someone who is undecided' },
    { th: 'ตัดสินใจเรื่องสำคัญภายใต้เวลาที่จำกัด', en: 'Make an important decision under time pressure' },
    { th: 'แบ่งงานและมอบหมายให้คนในทีม', en: 'Divide up work and delegate it to a team' },
    { th: 'ทำความรู้จักคนใหม่และสร้างเครือข่ายในงานต่าง ๆ', en: 'Meet new people and build a network at events' },
    { th: 'โน้มน้าวผู้ใหญ่ให้สนับสนุนโครงการ', en: 'Persuade senior people to back a project' },
    { th: 'ตั้งราคาสินค้าให้ได้กำไร', en: 'Price a product so it makes a profit' },
    { th: 'พาทีมผ่านช่วงที่มีปัญหา', en: 'Lead a team through a difficult stretch' },
  ],
  C: [
    { th: 'ทำงานที่มีรายละเอียดเยอะโดยไม่ผิดพลาด', en: 'Do detailed work without mistakes' },
    { th: 'ใช้สูตรในสเปรดชีตคำนวณข้อมูล', en: 'Use spreadsheet formulas to calculate data' },
    { th: 'จัดเก็บเอกสารตามระบบที่ตกลงกันไว้', en: 'File documents according to an agreed system' },
    { th: 'ทำตามขั้นตอนที่ซับซ้อนได้ครบถ้วน', en: 'Follow a complex procedure all the way through' },
    { th: 'ตรวจตัวเลขในใบเสร็จหรือรายงาน', en: 'Check the figures on receipts or reports' },
    { th: 'ทำรายงานสรุปให้เป็นรูปแบบเดียวกันทุกครั้ง', en: 'Produce summary reports in the same format every time' },
    { th: 'วางแผนตารางงานล่วงหน้าทั้งเดือน', en: "Plan a whole month's schedule in advance" },
    { th: 'ทำบัญชีรายรับรายจ่ายให้ตรงกันทุกบาท', en: 'Balance income and spending to the last baht' },
  ],
}

/** Interleaved R, I, A, S, E, C so two items of the same type never sit next to each other. */
export const CONFIDENCE_ITEMS: ConfidenceItem[] = Array.from({ length: 8 }, (_, round) =>
  RIASEC_TYPES.map((type) => ({ code: `${type}${round + 1}`, type, ...ITEMS_BY_TYPE[type][round] })),
).flat()

const questions: ScaleQuestion[] = CONFIDENCE_ITEMS.map((item) => ({
  id: `efficacy${item.code}`,
  kind: 'scale',
  prompt: { th: item.th, en: item.en },
  required: true,
  help: L('แตะบนเส้นว่าคุณมั่นใจแค่ไหนว่าจะทำสิ่งนี้ได้ดี', 'Tap the line to show how confident you are that you would do this well.'),
  dimension: item.type,
  reverseKeyed: false,
  minLabel: L('ไม่มั่นใจเลย', 'Not confident at all'),
  maxLabel: L('มั่นใจมาก', 'Very confident'),
  source: `Who Am I? original RIASEC self-efficacy item ${item.code} (Holland ${item.type}; rights: Who Am I?, any use): "${item.en}"`,
}))

/** Mean confidence per type (0–100), ranked highest first; ties keep R-I-A-S-E-C order. */
export function scoreStrengths(answers: CategoryAnswers): CategoryResult {
  const means = scoreScaleDimensions(questions, answers)
  const scores = Object.fromEntries(RIASEC_TYPES.filter((type) => type in means).map((type) => [type, means[type]]))
  return { scores, ranking: rankScores(scores) }
}

export type Quadrant = 'love' | 'grow' | 'able' | 'explore'

/** Copy for the 2 × 2 map. Low scores are never called weaknesses. */
export const QUADRANTS: Record<Quadrant, { icon: string; title: Localized; hint: Localized }> = {
  love: { icon: '💪', title: L('จุดแข็งที่ชอบ', 'Strengths you enjoy'), hint: L('สนใจและมั่นใจ — ใช้ด้านนี้นำทางได้เลย', 'Interested and confident — let these lead the way.') },
  grow: { icon: '🌱', title: L('ศักยภาพที่ควรฝึก', 'Potential to grow'), hint: L('สนใจแต่ยังไม่มั่นใจ — ลองทำทีละขั้นเพื่อสร้างความมั่นใจ', 'Interested but not yet confident — build confidence one step at a time.') },
  able: { icon: '🧰', title: L('ทำได้ แต่อาจไม่ใช่สิ่งที่ชอบ', 'Can do, may not love'), hint: L('มั่นใจแต่ไม่ค่อยสนใจ — เป็นทักษะเสริมที่มีประโยชน์', 'Confident but less interested — a useful supporting skill.') },
  explore: { icon: '⬜', title: L('ยังไม่ได้สำรวจ', 'Not explored yet'), hint: L('ยังไม่สนใจและยังไม่มั่นใจ — อาจเพราะยังไม่เคยลอง', 'Neither yet — maybe because you have not tried it.') },
}

export interface StrengthsPlacement {
  type: RiasecType
  interest: number
  confidence: number
  quadrant: Quadrant
}

const mean = (profile: RiasecProfile) => RIASEC_TYPES.reduce((sum, type) => sum + profile[type], 0) / RIASEC_TYPES.length

/**
 * Places every type on the map by comparing it with the person's own average
 * (not norms). A score equal to the average counts as high.
 */
export function strengthsMap(interest: RiasecProfile, confidence: RiasecProfile): StrengthsPlacement[] {
  const interestMean = mean(interest)
  const confidenceMean = mean(confidence)
  return RIASEC_TYPES.map((type) => {
    const highInterest = interest[type] >= interestMean
    const highConfidence = confidence[type] >= confidenceMean
    const quadrant: Quadrant = highInterest ? (highConfidence ? 'love' : 'grow') : highConfidence ? 'able' : 'explore'
    return { type, interest: interest[type], confidence: confidence[type], quadrant }
  })
}

/**
 * A small, step-by-step task per type: mastery experience — succeeding at something — is the
 * strongest source of self-efficacy (Bandura, 1977).
 */
const growth = (type: RiasecType, title: Localized, description: Localized, mins: number): CatalogExperiment => ({
  key: `growth:${type}`,
  title,
  description,
  duration: minutes(mins),
  tag: L(`จุดแข็ง · ${riasecCopy[type].name.th}`, `Strengths · ${riasecCopy[type].english}`),
  icon: 'custom',
  tone: 'mint',
})

export const GROWTH_ACTIONS: Record<RiasecType, CatalogExperiment> = {
  R: growth(
    'R',
    L('ซ่อมหรือประกอบของชิ้นเล็ก 1 ชิ้น', 'Fix or assemble one small thing'),
    L('ทำตามคลิปสอนทีละขั้นจนเสร็จ แล้วจดว่าขั้นไหนยากที่สุดและผ่านมาได้อย่างไร', 'Follow a how-to video step by step to the end, then note which step was hardest and how you got through it.'),
    30,
  ),
  I: growth(
    'I',
    L('ตอบคำถามที่สงสัยด้วยข้อมูล', 'Answer a question with evidence'),
    L('เลือกคำถาม 1 ข้อ หาแหล่งข้อมูลที่น่าเชื่อถือ 3 แหล่ง แล้วสรุปคำตอบสั้น ๆ ด้วยคำพูดของตัวเอง', 'Pick one question, find three trustworthy sources, and sum up the answer briefly in your own words.'),
    30,
  ),
  A: growth(
    'A',
    L('สร้างงานชิ้นเล็กในเวลาจำกัด', 'Make something small against the clock'),
    L('วาด เขียน หรือถ่ายงาน 1 ชิ้นภายใน 20 นาที ไม่ต้องสมบูรณ์ แล้วเก็บไว้ดูความก้าวหน้า', 'Draw, write or shoot one piece in 20 minutes — it does not need to be perfect — and keep it to see your progress.'),
    20,
  ),
  S: growth(
    'S',
    L('อธิบายเรื่องหนึ่งให้ใครสักคน', 'Explain something to someone'),
    L('สอนเรื่องที่คุณรู้ให้เพื่อนหรือคนในบ้าน 10 นาที แล้วถามว่าส่วนไหนช่วยให้เข้าใจมากที่สุด', 'Teach a friend or family member something you know for 10 minutes, then ask which part helped most.'),
    15,
  ),
  E: growth(
    'E',
    L('เสนอไอเดียสั้น ๆ 1 นาที', 'Pitch an idea in one minute'),
    L('เตรียมไอเดียเล็ก ๆ หนึ่งเรื่อง ลองเสนอให้เพื่อนหรือครอบครัวฟัง แล้วขอความเห็น 1 ข้อ', 'Prepare one small idea, pitch it to a friend or family member, and ask for one piece of feedback.'),
    15,
  ),
  C: growth(
    'C',
    L('จัดระบบสิ่งหนึ่งให้เป็นระเบียบ', 'Bring order to one thing'),
    L('เลือกโฟลเดอร์หรือลิ้นชัก 1 ที่ จัดตามระบบที่คุณตั้งเอง แล้วลองใช้ระบบนั้นต่อ 1 สัปดาห์', 'Pick one folder or drawer, organise it with a system of your own, and keep using it for a week.'),
    20,
  ),
}

export const strengths: AssessmentCategory = {
  id: 'strengths',
  number: '05',
  title: L('จุดแข็งและศักยภาพ', 'Strengths & Potential'),
  summary: L(
    'ความมั่นใจว่าทำได้ดีใน 6 ด้านงาน จาก 48 ข้อ แล้วรวมกับความสนใจในหมวด 04 เป็นแผนที่จุดแข็งและศักยภาพ',
    'How confident you feel in six kinds of work, from 48 items — combined with your interests from section 04 into a map of strengths and potential.',
  ),
  estimatedMinutes: 8,
  pageSize: 12,
  gridClassName: 'grid grid-cols-1 xl:grid-cols-2 gap-4',
  questions,
  copy: {
    eyebrow: L('05 / จุดแข็งและศักยภาพ', '05 / Strengths & Potential'),
    title: L('คุณมั่นใจว่าทำอะไรได้ดี', 'What are you confident you do well'),
    description: L(
      'แต่ละข้อเป็นสิ่งที่อาจต้องทำในงาน ให้แตะบนเส้นว่าคุณมั่นใจแค่ไหนว่าจะทำได้ดี ถ้ายังไม่เคยทำ ให้ตอบตามที่คิดว่าจะทำได้ถ้าได้ลอง ไม่ต้องคิดว่าชอบหรือไม่',
      'Each item is something a job might ask of you. Tap the line to show how confident you are that you would do it well. If you have never tried it, answer how you think you would do. Do not think about whether you like it.',
    ),
    progressEyebrow: L('ความมั่นใจเติบโตได้', 'Confidence can grow'),
    progressTitle: L('บอกเราว่าคุณมั่นใจด้านไหน', 'Tell us where you feel confident'),
    progressHint: L('ตอบให้ครบ 48 ข้อเพื่อดูแผนที่จุดแข็งของคุณ', 'Answer all 48 to see your strengths map.'),
    submitLabel: L('ดูแผนที่จุดแข็งของฉัน', 'See my strengths map'),
    missingToast: L('ยังมีข้อที่ไฮไลต์ไว้ที่ยังไม่ได้ตอบ', 'Some highlighted items still need an answer.'),
    submittedToast: L('แผนที่จุดแข็งของคุณพร้อมแล้ว', 'Your strengths map is ready.'),
  },
  score: scoreStrengths,
}
