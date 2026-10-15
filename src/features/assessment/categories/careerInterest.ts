import { L, type Localized } from '../../../i18n/language'
import { rankScores, scoreScaleDimensions } from '../scoring'
import type { AssessmentCategory, CategoryAnswers, CategoryResult, ScaleQuestion } from '../types'

/**
 * Category 04 — Career Interest Explorer: Holland's RIASEC types (Holland, 1997).
 *
 * The planned instrument, the AFPD RIASEC Markers (Armstrong, Allison & Rounds, 2008), turned out
 * to be copyrighted and free only for noncommercial use (Interest Item Pool, checked 2026-10-15:
 * https://jrounds.weebly.com/riasec-markers-scalesitems.html). As issue #5 prescribes for that case,
 * every activity below is written by Who Am I? from the RIASEC type definitions; none is copied or
 * paraphrased from the Markers or the O*NET Interest Profiler. We keep their design — eight
 * activity items per type, rated by how much the person would like to do it.
 * These items are not yet validated: check reliability on real Thai responses (Phase 6).
 */

export const RIASEC_TYPES = ['R', 'I', 'A', 'S', 'E', 'C'] as const
export type RiasecType = (typeof RIASEC_TYPES)[number]

/** Interest per type (0–100) — the profile the career matcher (#7) correlates with careers. */
export type RiasecProfile = Record<RiasecType, number>

interface InterestItem {
  /** Our own item code, e.g. "R1". */
  code: string
  type: RiasecType
  th: string
  /** English wording, shown in English mode and kept for back-translation. */
  en: string
}

const ITEMS_BY_TYPE: Record<RiasecType, { th: string; en: string }[]> = {
  R: [
    { th: 'ประกอบเฟอร์นิเจอร์หรือชั้นวางของจากชิ้นส่วนด้วยตัวเอง', en: 'Assemble furniture or shelving from parts yourself' },
    { th: 'ซ่อมจักรยานหรือมอเตอร์ไซค์', en: 'Repair a bicycle or motorbike' },
    { th: 'ปลูกและดูแลแปลงผักหรือสวน', en: 'Grow and look after a vegetable plot or garden' },
    { th: 'ใช้สว่านและเลื่อยทำโครงไม้', en: 'Use a drill and saw to build a wooden frame' },
    { th: 'ประกอบและตั้งค่าคอมพิวเตอร์ตั้งโต๊ะจากชิ้นส่วน', en: 'Build and set up a desktop computer from parts' },
    { th: 'ออกสำรวจพื้นที่ภาคสนามกลางแจ้ง', en: 'Do outdoor field survey work' },
    { th: 'ขึ้นรูปชิ้นงานด้วยเครื่องพิมพ์ 3 มิติ', en: 'Make parts with a 3D printer' },
    { th: 'เลี้ยงและดูแลสัตว์ในฟาร์ม', en: 'Raise and look after farm animals' },
  ],
  I: [
    { th: 'ตั้งสมมติฐานแล้วออกแบบการทดลองเพื่อทดสอบ', en: 'Form a hypothesis and design an experiment to test it' },
    { th: 'วิเคราะห์ข้อมูลเพื่อหารูปแบบที่ซ่อนอยู่', en: 'Analyse data to find hidden patterns' },
    { th: 'อ่านงานวิจัยเพื่อเข้าใจปัญหาอย่างลึกซึ้ง', en: 'Read research to understand a problem in depth' },
    { th: 'ไล่หาสาเหตุว่าทำไมโปรแกรมทำงานผิดพลาด', en: 'Track down why a program is failing' },
    { th: 'สังเกตปรากฏการณ์ธรรมชาติแล้วจดบันทึกอย่างเป็นระบบ', en: 'Observe natural phenomena and record them systematically' },
    { th: 'แก้โจทย์คณิตศาสตร์หรือตรรกะที่ซับซ้อน', en: 'Solve complex maths or logic problems' },
    { th: 'ศึกษาว่าเทคโนโลยีใหม่ทำงานอย่างไรในระดับหลักการ', en: 'Study how a new technology works from first principles' },
    { th: 'ตรวจสอบข้อเท็จจริงของข่าวหรือข้อมูลที่แชร์กัน', en: 'Fact-check news or information people share' },
  ],
  A: [
    { th: 'ออกแบบโลโก้และอัตลักษณ์ให้แบรนด์', en: 'Design a logo and identity for a brand' },
    { th: 'ถ่ายและตัดต่อวิดีโอเล่าเรื่อง', en: 'Shoot and edit a video that tells a story' },
    { th: 'เขียนเรื่องสั้น บทกวี หรือความเรียงเชิงสร้างสรรค์', en: 'Write short stories, poems or creative essays' },
    { th: 'ทำดนตรีหรือบีตด้วยโปรแกรมในคอมพิวเตอร์', en: 'Produce music or beats with software' },
    { th: 'ถ่ายภาพแนวศิลปะ', en: 'Take artistic photographs' },
    { th: 'ตกแต่งและจัดพื้นที่ให้สวยงามน่าอยู่', en: 'Style and decorate a space' },
    { th: 'ออกแบบเสื้อผ้าหรือเครื่องประดับ', en: 'Design clothes or accessories' },
    { th: 'สร้างตัวละครหรือโลกในจินตนาการสำหรับเกมหรือการ์ตูน', en: 'Create characters or imaginary worlds for games or comics' },
  ],
  S: [
    { th: 'ติวหรืออธิบายบทเรียนให้เพื่อนเข้าใจ', en: 'Tutor a friend or explain a lesson to them' },
    { th: 'รับฟังและให้กำลังใจคนที่กำลังมีเรื่องทุกข์ใจ', en: 'Listen to and support someone going through a hard time' },
    { th: 'จัดกิจกรรมเพื่อช่วยเหลือคนในชุมชน', en: 'Organise an activity that helps people in your community' },
    { th: 'ช่วยคนใหม่ให้ปรับตัวเข้ากับที่เรียนหรือที่ทำงาน', en: 'Help newcomers settle in at school or work' },
    { th: 'นำกิจกรรมกลุ่มให้ทุกคนได้มีส่วนร่วม', en: 'Lead a group activity so everyone takes part' },
    { th: 'ให้คำแนะนำเรื่องสุขภาพหรือการดูแลตัวเอง', en: 'Give advice on health or self-care' },
    { th: 'ไกล่เกลี่ยเมื่อเพื่อนหรือทีมขัดแย้งกัน', en: 'Mediate when friends or a team disagree' },
    { th: 'สอนทักษะใหม่ให้เด็ก เช่น ว่ายน้ำหรือวาดรูป', en: 'Teach children a new skill such as swimming or drawing' },
  ],
  E: [
    { th: 'นำเสนอไอเดียเพื่อโน้มน้าวให้คนอื่นเห็นด้วย', en: 'Pitch an idea to win people over' },
    { th: 'เริ่มธุรกิจเล็ก ๆ หรือขายของออนไลน์', en: 'Start a small business or sell online' },
    { th: 'ต่อรองราคาหรือเงื่อนไขของข้อตกลง', en: 'Negotiate a price or the terms of a deal' },
    { th: 'เป็นหัวหน้าทีมพาโปรเจกต์ไปให้ถึงเป้า', en: 'Lead a project team to its goal' },
    { th: 'วางแผนการตลาดเพื่อให้สินค้าเป็นที่รู้จัก', en: 'Plan marketing to make a product known' },
    { th: 'ลงสมัครเป็นตัวแทนหรือประธานกลุ่ม', en: 'Run for representative or club president' },
    { th: 'หาผู้สนับสนุนหรือระดมทุนให้โครงการ', en: 'Find sponsors or raise funds for a project' },
    { th: 'จัดอีเวนต์และคุมให้ทุกอย่างเดินหน้า', en: 'Run an event and keep everything moving' },
  ],
  C: [
    { th: 'จัดระเบียบไฟล์และโฟลเดอร์ให้หาง่าย', en: 'Organise files and folders so things are easy to find' },
    { th: 'บันทึกรายรับรายจ่ายลงตารางสเปรดชีต', en: 'Record income and spending in a spreadsheet' },
    { th: 'ตรวจเอกสารหาคำผิดและข้อมูลที่ไม่ตรงกัน', en: 'Proofread documents for errors and mismatches' },
    { th: 'วางขั้นตอนการทำงานให้ทุกคนทำตามได้เหมือนกัน', en: 'Set up a step-by-step procedure everyone can follow' },
    { th: 'กรอกและตรวจความถูกต้องของข้อมูลในฐานข้อมูล', en: 'Enter and check data in a database' },
    { th: 'วางงบประมาณและติดตามว่าใช้จ่ายตามแผน', en: 'Plan a budget and track spending against it' },
    { th: 'จัดตารางเวลาและนัดหมายให้ทีม', en: 'Schedule and book appointments for a team' },
    { th: 'ตรวจงานตามเช็กลิสต์ทีละข้อจนครบ', en: 'Check work against a checklist item by item' },
  ],
}

/** Items interleaved R, I, A, S, E, C, R, … so two items of the same type never sit next to each other. */
export const INTEREST_ITEMS: InterestItem[] = Array.from({ length: 8 }, (_, round) =>
  RIASEC_TYPES.map((type) => ({ code: `${type}${round + 1}`, type, ...ITEMS_BY_TYPE[type][round] })),
).flat()

const questions: ScaleQuestion[] = INTEREST_ITEMS.map((item) => ({
  id: `riasec${item.code}`,
  kind: 'scale',
  prompt: { th: item.th, en: item.en },
  required: true,
  help: L('แตะบนเส้นว่าคุณอยากทำกิจกรรมนี้แค่ไหน', 'Tap the line to show how much you would like to do this.'),
  dimension: item.type,
  reverseKeyed: false,
  minLabel: L('ไม่อยากทำเลย', 'Would not like it at all'),
  maxLabel: L('อยากทำมาก', 'Would love to'),
  source: `Who Am I? original RIASEC activity ${item.code} (Holland ${item.type}): "${item.en}"`,
}))

/** Copy per type: name, a plain description, and example activities / fields to explore. */
export const riasecCopy: Record<RiasecType, { name: Localized; english: string; description: Localized; examples: Localized }> = {
  R: {
    name: L('นักลงมือทำ', 'Doer'),
    english: 'Realistic',
    description: L('ชอบลงมือทำ สร้าง ซ่อม หรือใช้เครื่องมือ เห็นผลงานเป็นชิ้นเป็นอัน', 'Likes hands-on work — building, fixing or using tools — and seeing a tangible result.'),
    examples: L('งานช่างและวิศวกรรม เกษตรและสิ่งแวดล้อม ฮาร์ดแวร์และอิเล็กทรอนิกส์', 'Trades and engineering, farming and the environment, hardware and electronics'),
  },
  I: {
    name: L('นักสืบค้น', 'Thinker'),
    english: 'Investigative',
    description: L('ชอบตั้งคำถาม วิเคราะห์ ค้นคว้า และแก้ปัญหาที่ต้องใช้ความคิด', 'Likes asking questions, analysing, researching and solving problems that take real thought.'),
    examples: L('วิทยาศาสตร์และการวิจัย วิเคราะห์ข้อมูล การแพทย์และสุขภาพ เทคโนโลยี', 'Science and research, data analysis, medicine and health, technology'),
  },
  A: {
    name: L('นักสร้างสรรค์', 'Creator'),
    english: 'Artistic',
    description: L('ชอบสร้างสิ่งใหม่ ออกแบบ และแสดงออกในแบบของตัวเอง', 'Likes making new things, designing and expressing ideas in their own way.'),
    examples: L('ออกแบบกราฟิกและ UX สื่อและวิดีโอ ดนตรี การเขียน แฟชั่น', 'Graphic and UX design, media and video, music, writing, fashion'),
  },
  S: {
    name: L('นักช่วยเหลือ', 'Helper'),
    english: 'Social',
    description: L('ชอบสอน ดูแล รับฟัง และช่วยให้คนอื่นเติบโต', 'Likes teaching, caring, listening and helping others grow.'),
    examples: L('การศึกษาและการสอน การให้คำปรึกษา งานสุขภาพ งานชุมชน', 'Education and teaching, counselling, health care, community work'),
  },
  E: {
    name: L('นักริเริ่ม', 'Persuader'),
    english: 'Enterprising',
    description: L('ชอบริเริ่ม โน้มน้าว นำทีม และขับเคลื่อนโครงการให้เกิดขึ้น', 'Likes starting things, persuading, leading teams and making projects happen.'),
    examples: L('ธุรกิจและการเป็นผู้ประกอบการ การตลาดและการขาย การบริหารโครงการ', 'Business and entrepreneurship, marketing and sales, project management'),
  },
  C: {
    name: L('นักจัดระบบ', 'Organiser'),
    english: 'Conventional',
    description: L('ชอบจัดระบบ ดูแลข้อมูล และตรวจรายละเอียดให้ถูกต้อง', 'Likes organising, looking after data and getting the details right.'),
    examples: L('บัญชีและการเงิน งานปฏิบัติการ การจัดการข้อมูล งานประกันคุณภาพ', 'Accounting and finance, operations, data management, quality assurance'),
  },
}

/** A spread below this between the highest and lowest type reads as "not clear yet". */
export const FLAT_PROFILE_SPREAD = 15

/** Mean interest per type (0–100), ranked highest first; ties keep R-I-A-S-E-C order. */
export function scoreCareerInterest(answers: CategoryAnswers): CategoryResult {
  const means = scoreScaleDimensions(questions, answers)
  const scores = Object.fromEntries(RIASEC_TYPES.filter((type) => type in means).map((type) => [type, means[type]]))
  return { scores, ranking: rankScores(scores) }
}

/** Reads a stored result back as a six-value profile; null until every type has a score. */
export function toRiasecProfile(scores: Record<string, number> | undefined): RiasecProfile | null {
  if (!scores || !RIASEC_TYPES.every((type) => typeof scores[type] === 'number')) return null
  return Object.fromEntries(RIASEC_TYPES.map((type) => [type, scores[type]])) as RiasecProfile
}

export interface InterestReading {
  /** Three highest types, e.g. "IAS". Ties fall back to R-I-A-S-E-C order. */
  hollandCode: string
  top: RiasecType[]
  /** Highest minus lowest score. */
  spread: number
  /** True when the spread is under FLAT_PROFILE_SPREAD — show "not clear yet" instead of a code. */
  flat: boolean
}

export function readInterests(profile: RiasecProfile): InterestReading {
  const top = rankScores(profile).slice(0, 3) as RiasecType[]
  const values = RIASEC_TYPES.map((type) => profile[type])
  const spread = Math.max(...values) - Math.min(...values)
  return { hollandCode: top.join(''), top, spread, flat: spread < FLAT_PROFILE_SPREAD }
}

export const careerInterest: AssessmentCategory = {
  id: 'careerInterest',
  number: '04',
  title: L('สำรวจความสนใจด้านอาชีพ', 'Career Interest Explorer'),
  summary: L(
    'ความสนใจด้านอาชีพ 6 แบบตามแนวคิด Holland RIASEC จาก 48 กิจกรรม ผลนี้เป็นข้อมูลหลักในการแนะนำเส้นทางอาชีพ',
    'Your interest in six kinds of work (Holland RIASEC) from 48 activities. This is the main input for career suggestions.',
  ),
  estimatedMinutes: 8,
  pageSize: 12,
  gridClassName: 'grid grid-cols-1 xl:grid-cols-2 gap-4',
  questions,
  copy: {
    eyebrow: L('04 / สำรวจความสนใจด้านอาชีพ', '04 / Career Interest Explorer'),
    title: L('คุณอยากทำกิจกรรมไหน', 'Which activities would you enjoy'),
    description: L(
      'แต่ละข้อเป็นกิจกรรมหนึ่งอย่าง ให้แตะบนเส้นว่าคุณอยากทำมากแค่ไหน ไม่ต้องคิดว่าทำเป็นหรือไม่ หรือได้เงินเท่าไร ให้นึกแค่ว่าอยากลองทำหรือเปล่า',
      'Each item is one activity. Tap the line to show how much you would like to do it. Do not worry about whether you can do it or what it pays — just whether you would want to try.',
    ),
    progressEyebrow: L('ไม่ต้องเก่ง แค่สนใจก็พอ', 'Interest is enough — skill comes later'),
    progressTitle: L('บอกเราว่าอะไรดึงดูดคุณ', 'Tell us what draws you in'),
    progressHint: L('ตอบให้ครบ 48 ข้อเพื่อดูความสนใจทั้ง 6 แบบ', 'Answer all 48 to see your six interest types.'),
    submitLabel: L('ดูความสนใจของฉัน', 'See my interests'),
    missingToast: L('ยังมีข้อที่ไฮไลต์ไว้ที่ยังไม่ได้ตอบ', 'Some highlighted activities still need an answer.'),
    submittedToast: L('แผนที่ความสนใจของคุณพร้อมแล้ว', 'Your interest map is ready.'),
  },
  score: scoreCareerInterest,
}
