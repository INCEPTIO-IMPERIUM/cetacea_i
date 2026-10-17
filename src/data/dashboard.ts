import { L, type Lang, type Localized } from '../i18n/language'

export type IkigaiArea = 'love' | 'good' | 'world' | 'need'

/** `id` is what the store keeps (English, stable); `label` is what people see. */
export interface IkigaiOption {
  id: string
  label: Localized
}

export interface IkigaiCard {
  area: IkigaiArea
  title: Localized
  hint: Localized
  tone: string
  options: IkigaiOption[]
}

export const ikigaiCards: IkigaiCard[] = [
  {
    area: 'love',
    title: L('สิ่งที่คุณรัก', 'What you love'),
    hint: L('กิจกรรมที่ทำแล้วลืมเวลา', 'Activities that make you lose track of time.'),
    tone: 'bg-lemon-soft',
    options: [
      { id: 'Design', label: L('การออกแบบ', 'Design') },
      { id: 'Storytelling', label: L('การเล่าเรื่อง', 'Storytelling') },
      { id: 'Technology', label: L('เทคโนโลยี', 'Technology') },
      { id: 'Teaching', label: L('การสอน', 'Teaching') },
    ],
  },
  {
    area: 'good',
    title: L('สิ่งที่คุณถนัด', "What you're good at"),
    hint: L('จุดแข็งที่ใช้อยู่แล้วหรืออยากพัฒนา', 'Strengths you already use or want to grow.'),
    tone: 'bg-lilac',
    options: [
      { id: 'Problem solving', label: L('การแก้ปัญหา', 'Problem solving') },
      { id: 'Explaining', label: L('การอธิบาย', 'Explaining') },
      { id: 'Visual thinking', label: L('การคิดเป็นภาพ', 'Visual thinking') },
      { id: 'Organizing', label: L('การจัดระบบ', 'Organizing') },
    ],
  },
  {
    area: 'world',
    title: L('สิ่งที่สำคัญกับคุณ', 'What matters to you'),
    hint: L('คุณค่าที่อยากให้อนาคตสะท้อน', 'Values you want your future to reflect.'),
    tone: 'bg-mint',
    options: [
      { id: 'Freedom', label: L('อิสระ', 'Freedom') },
      { id: 'Stability', label: L('ความมั่นคง', 'Stability') },
      { id: 'Creativity', label: L('ความคิดสร้างสรรค์', 'Creativity') },
      { id: 'Helping people', label: L('การช่วยเหลือผู้คน', 'Helping people') },
    ],
  },
  {
    area: 'need',
    title: L('สิ่งที่โลกต้องการ', 'What the world needs'),
    hint: L('ปัญหาที่คุณอยากช่วยแก้', 'Problems you would feel good helping solve.'),
    tone: 'bg-peach',
    options: [
      { id: 'Better learning', label: L('การเรียนรู้ที่ดีขึ้น', 'Better learning') },
      { id: 'Access to tech', label: L('การเข้าถึงเทคโนโลยี', 'Access to tech') },
      { id: 'Sustainability', label: L('ความยั่งยืน', 'Sustainability') },
      { id: 'Wellbeing', label: L('สุขภาวะ', 'Wellbeing') },
    ],
  },
]

export interface Skill {
  name: string
  /** The person's own 0–100 rating; null until they rate it — never a made-up starting value. */
  value: number | null
}

/**
 * Display names for built-in skills. Skill names stay English in storage because the career
 * matcher matches them by name; skills people add themselves are shown exactly as typed.
 */
const skillNames: Record<string, Localized> = {
  'Visual thinking': L('การคิดเป็นภาพ', 'Visual thinking'),
  Communication: L('การสื่อสาร', 'Communication'),
  'Problem solving': L('การแก้ปัญหา', 'Problem solving'),
  Research: L('การค้นคว้าวิจัย', 'Research'),
  'Coding fundamentals': L('พื้นฐานการเขียนโค้ด', 'Coding fundamentals'),
  Wireframing: L('การทำไวร์เฟรม', 'Wireframing'),
  'HTML / CSS': L('HTML / CSS', 'HTML / CSS'),
  Storytelling: L('การเล่าเรื่อง', 'Storytelling'),
  'Assessment design': L('การออกแบบการประเมินผล', 'Assessment design'),
  Prototyping: L('การทำต้นแบบ', 'Prototyping'),
  'Active listening': L('การฟังอย่างตั้งใจ', 'Active listening'),
  'Goal setting': L('การตั้งเป้าหมาย', 'Goal setting'),
  Debugging: L('การหาและแก้บั๊ก', 'Debugging'),
  Statistics: L('สถิติ', 'Statistics'),
  Typography: L('การจัดตัวอักษร', 'Typography'),
  Layout: L('การจัดเลย์เอาต์', 'Layout'),
  CAD: L('CAD', 'CAD'),
  Physics: L('ฟิสิกส์', 'Physics'),
  Wiring: L('การเดินสายไฟ', 'Wiring'),
  Safety: L('ความปลอดภัย', 'Safety'),
  Cooking: L('การทำอาหาร', 'Cooking'),
  Teamwork: L('การทำงานเป็นทีม', 'Teamwork'),
  Planning: L('การวางแผน', 'Planning'),
  Care: L('การดูแลผู้อื่น', 'Care'),
  'Attention to detail': L('ความละเอียดรอบคอบ', 'Attention to detail'),
  Explaining: L('การอธิบาย', 'Explaining'),
  Strategy: L('การวางกลยุทธ์', 'Strategy'),
  Organizing: L('การจัดระบบ', 'Organizing'),
  Spreadsheets: L('สเปรดชีต', 'Spreadsheets'),
  Curiosity: L('ความอยากรู้', 'Curiosity'),
  Reflection: L('การทบทวนตัวเอง', 'Reflection'),
  Experimenting: L('การทดลองทำ', 'Experimenting'),
}

export function skillLabel(name: string, lang: Lang): string {
  return skillNames[name]?.[lang] ?? name
}

export type ExperimentIcon = 'portfolio' | 'interview' | 'map' | 'career' | 'custom'
export type ExperimentTone = 'white' | 'lilac' | 'mint'

export interface Experiment {
  id: string
  /**
   * Catalog key for built-in experiments (e.g. "career:ux", "growth:A"), so their text follows
   * the interface language. The stored text is the fallback, and the only text for user ideas.
   */
  key?: string
  title: string
  description: string
  duration: string
  tag: string
  icon: ExperimentIcon
  tone: ExperimentTone
  done: boolean
}

/** A built-in experiment in both languages; `toExperiment` turns it into stored data. */
export interface CatalogExperiment {
  key: string
  title: Localized
  description: Localized
  duration: Localized
  tag: Localized
  icon: ExperimentIcon
  tone: ExperimentTone
}

export function toExperiment(entry: CatalogExperiment, lang: Lang): Omit<Experiment, 'id' | 'done'> {
  return {
    key: entry.key,
    title: entry.title[lang],
    description: entry.description[lang],
    duration: entry.duration[lang],
    tag: entry.tag[lang],
    icon: entry.icon,
    tone: entry.tone,
  }
}

/** Duration chip text, e.g. minutes(25) → "25 นาที" / "25 MIN". */
export const minutes = (count: number): Localized => L(`${count} นาที`, `${count} MIN`)

/**
 * Experiments the old template seeded for every new user. Nobody is seeded with them any more;
 * they stay in the catalog only so anyone who kept one still sees it in their language.
 * Stored ids match the part of the key after "default:".
 */
export const defaultExperimentCatalog: CatalogExperiment[] = [
  {
    key: 'default:portfolio',
    title: L('ทำพอร์ตโฟลิโอเล็ก ๆ หนึ่งส่วน', 'Make a tiny portfolio section'),
    description: L('สร้างหน้าจอหรือภาพร่างหนึ่งชิ้นของสิ่งที่คุณอยากให้มีอยู่จริง แล้วสังเกตว่าส่วนไหนที่สนุกที่สุด', 'Create one screen or sketch for something you wish existed. Notice which part you enjoy most.'),
    duration: minutes(25),
    tag: L('ออกแบบ · ลงมือทำ', 'Design · Making'),
    icon: 'portfolio',
    tone: 'white',
  },
  {
    key: 'default:interview',
    title: L('คุยกับใครสักคนเรื่องงานของเขา', 'Talk to someone about their work'),
    description: L('ถามว่าวันปกติเป็นอย่างไร อะไรท้าทาย และอะไรทำให้เขาประหลาดใจเกี่ยวกับงานนี้', 'Ask what a normal day looks like, what is challenging, and what surprised them about the role.'),
    duration: minutes(15),
    tag: L('ความอยากรู้ · การฟัง', 'Curiosity · Listening'),
    icon: 'interview',
    tone: 'lilac',
  },
  {
    key: 'default:learning-map',
    title: L('วาดเส้นทางการเรียนรู้', 'Map a learning journey'),
    description: L('เลือกหัวข้อที่คุณใส่ใจ แล้วร่างว่าจะช่วยให้มือใหม่เข้าใจเรื่องนี้อย่างไร', 'Choose a topic you care about and sketch how you would help a beginner understand it.'),
    duration: minutes(20),
    tag: L('การสอน · ระบบ', 'Teaching · Systems'),
    icon: 'map',
    tone: 'mint',
  },
]

/** "Add a tiny experiment" on the roadmap's starting-point node. */
export const selfDiscoveryStarter: CatalogExperiment = {
  key: 'starter:you',
  title: L('ลองทำกิจกรรมค้นหาตัวเองสั้น ๆ', 'Try a self-discovery mini-task'),
  description: L(
    'ลองดูแหล่งเรียนรู้สำหรับมือใหม่ 1 อย่าง หรือร่างภาพคร่าว ๆ เกี่ยวกับสิ่งที่คุณสงสัย แล้วจดว่าอะไรน่าสนใจ',
    'Explore one beginner resource or make a rough sketch about something you are curious about. Write down what feels interesting.',
  ),
  duration: minutes(20),
  tag: L('ทดลองเส้นทางอาชีพ', 'Career experiment'),
  icon: 'career',
  tone: 'white',
}

/** Text for an experiment you just wrote yourself (key "own"); only the title is yours. */
export const ownIdeaCatalog = {
  description: L('ทำให้เล็กพอจะลองได้ในสัปดาห์นี้ แล้วจดว่าอะไรให้พลังและคุณได้เรียนรู้อะไร', 'Keep it small enough to try this week. Afterward, note what gave you energy and what you learned.'),
  duration: L('ไอเดียของคุณ', 'YOUR IDEA'),
  tag: L('ค้นหาตัวเอง', 'Self-discovery'),
}
