import { L, type Localized } from '../i18n/language'
import { minutes, type CatalogExperiment } from './dashboard'

/**
 * Careers the matcher (#7) can suggest. Every career carries the six O*NET® interest scores
 * ("Occupational Interest", 0–100) of the O*NET-SOC occupation it is based on, as shown on
 * O*NET OnLine on 2026-10-15 (O*NET 31.0 Database). The first five ids predate the matcher
 * and stay stable because users have them stored.
 *
 * Credit: includes information from the O*NET 31.0 Database by the U.S. Department of Labor,
 * Employment and Training Administration (USDOL/ETA), used under the CC BY 4.0 license.
 * O*NET® is a trademark of USDOL/ETA. Who Am I? has modified all or some of this information
 * (selected occupations, plain-language names, descriptions, skills and starter tasks are ours).
 * USDOL/ETA has not approved, endorsed, or tested these modifications.
 */

export const CAREER_IDS = [
  'ux',
  'front',
  'learning',
  'product',
  'coach',
  'software',
  'data',
  'graphic',
  'writer',
  'mechanical',
  'electrician',
  'chef',
  'nurse',
  'teacher',
  'psychologist',
  'marketing',
  'marketResearch',
  'projectManager',
  'accountant',
] as const

export type CareerId = (typeof CAREER_IDS)[number]
/** A node on the roadmap: one of the careers, or the user's own starting point. */
export type NodeId = CareerId | 'you'

/** Interest per RIASEC type, 0–100. Same shape as the user's profile from Category 04. */
export type CareerRiasec = Record<'R' | 'I' | 'A' | 'S' | 'E' | 'C', number>

export interface NodeInfo {
  name: Localized
  type: Localized
  description: Localized
  /** Skill names in English — the ids the skill matrix uses; show them with `skillLabel`. */
  skills: string[]
}

export interface Career extends NodeInfo {
  /** Short name for the 3D card. */
  short: Localized
  /** Short line shown in the accessible list and on the 3D card. */
  focus: Localized
  /** Glyph drawn on the 3D card. */
  icon: string
  onet: { code: string; title: string }
  riasec: CareerRiasec
  /** A first small step to try this path. */
  starter: CatalogExperiment
}

const snapshot = { type: L('ภาพรวมอาชีพ', 'CAREER SNAPSHOT') }

const starter = (id: string, title: Localized, description: Localized, mins: number, tag: Localized): CatalogExperiment => ({
  key: `career:${id}`,
  title,
  description,
  duration: minutes(mins),
  tag,
  icon: 'career',
  tone: 'white',
})

export const careers: Record<CareerId, Career> = {
  ux: {
    ...snapshot,
    name: L('นักออกแบบ UX', 'UX Designer'),
    short: L('นักออกแบบ UX', 'UX Designer'),
    focus: L('ออกแบบ · เข้าใจคน', 'Design · Empathy'),
    icon: '+',
    description: L(
      'ออกแบบประสบการณ์ดิจิทัลที่ช่วยผู้คนได้จริง โดยเข้าใจว่าผู้ใช้ต้องการอะไร แล้วเปลี่ยนสิ่งที่ค้นพบเป็นหน้าจอที่ชัดเจน',
      'Design helpful digital experiences by understanding what people need and turning insights into clear interfaces.',
    ),
    skills: ['Research', 'Visual thinking', 'Wireframing'],
    onet: { code: '15-1255.00', title: 'Web and Digital Interface Designers' },
    riasec: { R: 27, I: 65, A: 58, S: 20, E: 36, C: 57 },
    starter: starter(
      'ux',
      L('ออกแบบหน้าจอที่สับสนใหม่ 1 หน้า', 'Redesign one confusing screen'),
      L('เลือกหน้าจอแอปที่คุณหงุดหงิด ร่างแบบที่ชัดเจนกว่า แล้วถามใครสักคนว่าชอบแบบไหน', 'Pick an app screen that annoys you, sketch a clearer version, and ask one person which they prefer.'),
      30,
      L('อาชีพ · UX', 'Career · UX'),
    ),
  },
  front: {
    ...snapshot,
    name: L('นักพัฒนา Frontend', 'Frontend Developer'),
    short: L('Frontend Dev', 'Frontend Dev'),
    focus: L('โค้ด · งานฝีมือ', 'Code · Craft'),
    icon: '‹›',
    description: L(
      'ทำให้ผลิตภัณฑ์ดิจิทัลมีชีวิตด้วยการสร้างหน้าจอที่ผู้คนใช้ ผสมตรรกะ รายละเอียดด้านภาพ และการแก้ปัญหา',
      'Bring digital products to life by building the interfaces people use, combining logic, visual detail, and problem solving.',
    ),
    skills: ['Coding fundamentals', 'Problem solving', 'HTML / CSS'],
    onet: { code: '15-1254.00', title: 'Web Developers' },
    riasec: { R: 33, I: 67, A: 36, S: 20, E: 33, C: 67 },
    starter: starter(
      'front',
      L('สร้างเว็บไซต์หนึ่งหน้า', 'Build a one-page site'),
      L('ทำตามบทเรียน HTML/CSS สำหรับมือใหม่ แล้วเผยแพร่เว็บหนึ่งหน้าเกี่ยวกับสิ่งที่คุณชอบ', 'Follow a beginner HTML/CSS tutorial and publish a single page about something you like.'),
      45,
      L('อาชีพ · Frontend', 'Career · Frontend'),
    ),
  },
  learning: {
    ...snapshot,
    name: L('นักออกแบบการเรียนรู้', 'Learning Designer'),
    short: L('นักออกแบบการเรียนรู้', 'Learning Designer'),
    focus: L('การสอน · ระบบ', 'Teaching · Systems'),
    icon: '▣',
    description: L(
      'สร้างประสบการณ์การเรียนรู้ที่ทำให้เรื่องยากเข้าใจ ฝึก และจดจำได้ง่ายขึ้น',
      'Create learning experiences that make complex topics easier to understand, practice, and remember.',
    ),
    skills: ['Communication', 'Storytelling', 'Assessment design'],
    onet: { code: '25-9031.00', title: 'Instructional Coordinators' },
    riasec: { R: 10, I: 51, A: 43, S: 86, E: 54, C: 50 },
    starter: starter(
      'learning',
      L('ทำบทเรียน 5 นาที', 'Make a five-minute lesson'),
      L('เลือกเรื่องที่คุณรู้ดี แล้วทำเป็นบทเรียนสั้น ๆ พร้อมคำถามฝึก 1 ข้อ', 'Choose one idea you know well and turn it into a short lesson with one practice question.'),
      30,
      L('อาชีพ · การเรียนรู้', 'Career · Learning'),
    ),
  },
  product: {
    ...snapshot,
    name: L('นักออกแบบผลิตภัณฑ์', 'Product Designer'),
    short: L('นักออกแบบผลิตภัณฑ์', 'Product Designer'),
    focus: L('กลยุทธ์ · ออกแบบ', 'Strategy · Design'),
    icon: '◇',
    description: L(
      'ออกแบบผลิตภัณฑ์ที่ใช้ได้จริงตั้งแต่ไอเดียแรกจนถึงงานสำเร็จ โดยสมดุลความต้องการของผู้ใช้ หน้าตา และวิธีผลิต',
      'Shape useful products from early ideas to polished designs, balancing what people need, how it looks, and how it can be made.',
    ),
    skills: ['Visual thinking', 'Prototyping', 'Problem solving'],
    onet: { code: '27-1021.00', title: 'Commercial and Industrial Designers' },
    riasec: { R: 60, I: 51, A: 76, S: 14, E: 45, C: 41 },
    starter: starter(
      'product',
      L('ร่างของใช้ประจำวันให้ดีขึ้น', 'Sketch a better everyday object'),
      L('เลือกของในบ้านที่ใช้ไม่สะดวก แล้วร่างวิธีปรับปรุง 3 แบบ', 'Pick something at home that is awkward to use and sketch three ways to improve it.'),
      25,
      L('อาชีพ · ผลิตภัณฑ์', 'Career · Product'),
    ),
  },
  coach: {
    ...snapshot,
    name: L('โค้ชอาชีพ', 'Career Coach'),
    short: L('โค้ชอาชีพ', 'Career Coach'),
    focus: L('การฟัง · การแนะแนว', 'Listening · Guidance'),
    icon: '●',
    description: L(
      'ช่วยให้ผู้คนเข้าใจทางเลือกของตัวเอง มองเห็นจุดแข็ง และเปลี่ยนเป้าหมายเป็นก้าวเล็ก ๆ ที่ทำได้จริง',
      'Help people make sense of their options, recognize their strengths, and turn goals into manageable next steps.',
    ),
    skills: ['Communication', 'Active listening', 'Goal setting'],
    onet: { code: '21-1012.00', title: 'Educational, Guidance, and Career Counselors and Advisors' },
    riasec: { R: 0, I: 38, A: 36, S: 100, E: 49, C: 52 },
    starter: starter(
      'coach',
      L('ชวนคุยเรื่องเป้าหมาย', 'Hold a goal-setting chat'),
      L('ถามเพื่อนเรื่องเป้าหมายหนึ่งอย่าง ช่วยเขาหาก้าวแรกเล็ก ๆ แล้วสังเกตว่าการเป็นผู้แนะแนวรู้สึกอย่างไร', 'Ask a friend about one goal, help them name a first small step, and notice how it felt to guide.'),
      20,
      L('อาชีพ · โค้ช', 'Career · Coaching'),
    ),
  },
  software: {
    ...snapshot,
    name: L('นักพัฒนาซอฟต์แวร์', 'Software Developer'),
    short: L('นักพัฒนาซอฟต์แวร์', 'Software Dev'),
    focus: L('ตรรกะ · การสร้าง', 'Logic · Building'),
    icon: '{}',
    description: L(
      'ออกแบบและสร้างซอฟต์แวร์ที่แก้ปัญหาจริง ตั้งแต่เครื่องมือเล็ก ๆ ไปจนถึงระบบใหญ่ที่คนจำนวนมากใช้',
      'Design and build software that solves real problems, from small tools to large systems used by many people.',
    ),
    skills: ['Coding fundamentals', 'Problem solving', 'Debugging'],
    onet: { code: '15-1252.00', title: 'Software Developers' },
    riasec: { R: 44, I: 84, A: 23, S: 14, E: 15, C: 77 },
    starter: starter(
      'software',
      L('ทำงานจุกจิก 1 อย่างให้อัตโนมัติ', 'Automate one small chore'),
      L('เขียนสคริปต์เล็ก ๆ (หรือสูตรสเปรดชีต) ที่ช่วยประหยัดเวลางานซ้ำ ๆ ของคุณ', 'Write a tiny script (or a spreadsheet formula) that saves you a few minutes of repetitive work.'),
      40,
      L('อาชีพ · ซอฟต์แวร์', 'Career · Software'),
    ),
  },
  data: {
    ...snapshot,
    name: L('นักวิทยาศาสตร์ข้อมูล', 'Data Scientist'),
    short: L('Data Scientist', 'Data Scientist'),
    focus: L('ข้อมูล · ความเข้าใจ', 'Data · Insight'),
    icon: '∑',
    description: L(
      'ค้นหารูปแบบในข้อมูลแล้วเปลี่ยนเป็นคำตอบ การคาดการณ์ และการตัดสินใจที่คนอื่นนำไปใช้ได้',
      'Find patterns in data and turn them into answers, predictions and decisions that others can act on.',
    ),
    skills: ['Research', 'Problem solving', 'Statistics'],
    onet: { code: '15-2051.00', title: 'Data Scientists' },
    riasec: { R: 20, I: 100, A: 27, S: 11, E: 12, C: 73 },
    starter: starter(
      'data',
      L('ตอบคำถามด้วยข้อมูล', 'Answer a question with data'),
      L('เลือกชุดข้อมูลสาธารณะที่คุณสนใจ ทำกราฟ 1 รูป แล้วเขียน 1 ประโยคว่ามันบอกอะไร', 'Pick a public dataset you care about, make one chart, and write one sentence about what it shows.'),
      40,
      L('อาชีพ · ข้อมูล', 'Career · Data'),
    ),
  },
  graphic: {
    ...snapshot,
    name: L('นักออกแบบกราฟิก', 'Graphic Designer'),
    short: L('นักออกแบบกราฟิก', 'Graphic Designer'),
    focus: L('ภาพ · แบรนด์', 'Visuals · Brand'),
    icon: '✎',
    description: L('สื่อสารไอเดียด้วยภาพผ่านเลย์เอาต์ ภาพประกอบ ตัวอักษร และอัตลักษณ์แบรนด์', 'Communicate ideas visually through layouts, illustrations, typography and brand identities.'),
    skills: ['Visual thinking', 'Typography', 'Layout'],
    onet: { code: '27-1024.00', title: 'Graphic Designers' },
    riasec: { R: 40, I: 31, A: 100, S: 19, E: 41, C: 49 },
    starter: starter(
      'graphic',
      L('ออกแบบโปสเตอร์ใน 1 ชั่วโมง', 'Design a poster in an hour'),
      L('ทำโปสเตอร์สำหรับงานจริงหรือในจินตนาการ โดยใช้แค่ 2 ฟอนต์และ 3 สี', 'Make a poster for a real or imaginary event using only two fonts and three colours.'),
      60,
      L('อาชีพ · กราฟิก', 'Career · Graphic design'),
    ),
  },
  writer: {
    ...snapshot,
    name: L('นักเขียน', 'Writer'),
    short: L('นักเขียน', 'Writer'),
    focus: L('ถ้อยคำ · เรื่องราว', 'Words · Story'),
    icon: '¶',
    description: L('สร้างเรื่องราว บทความ บท หรือข้อความที่ให้ข้อมูล โน้มน้าว หรือสัมผัสใจผู้คน', 'Create stories, articles, scripts or copy that inform, persuade or move people.'),
    skills: ['Storytelling', 'Communication', 'Research'],
    onet: { code: '27-3043.00', title: 'Writers and Authors' },
    riasec: { R: 0, I: 38, A: 95, S: 31, E: 63, C: 39 },
    starter: starter(
      'writer',
      L('เขียนแล้วแชร์ 300 คำ', 'Write and share 300 words'),
      L('เขียนงานสั้น ๆ เกี่ยวกับสิ่งที่คุณสังเกตเห็นสัปดาห์นี้ แล้วให้ผู้อ่าน 1 คนช่วยติชม', 'Write a short piece about something you noticed this week and share it with one reader for feedback.'),
      30,
      L('อาชีพ · การเขียน', 'Career · Writing'),
    ),
  },
  mechanical: {
    ...snapshot,
    name: L('วิศวกรเครื่องกล', 'Mechanical Engineer'),
    short: L('วิศวกรเครื่องกล', 'Mech. Engineer'),
    focus: L('เครื่องจักร · ออกแบบ', 'Machines · Design'),
    icon: '⚙',
    description: L(
      'ออกแบบ ทดสอบ และปรับปรุงเครื่องจักรและระบบกลไก ตั้งแต่อุปกรณ์เล็ก ๆ ไปจนถึงยานพาหนะและโรงงาน',
      'Design, test and improve machines and mechanical systems, from small devices to vehicles and factories.',
    ),
    skills: ['Problem solving', 'CAD', 'Physics'],
    onet: { code: '17-2141.00', title: 'Mechanical Engineers' },
    riasec: { R: 90, I: 69, A: 17, S: 4, E: 16, C: 64 },
    starter: starter(
      'mechanical',
      L('แกะและอธิบายอุปกรณ์ 1 ชิ้น', 'Take apart and explain a gadget'),
      L('แกะอุปกรณ์เก่าอย่างปลอดภัย ระบุชิ้นส่วนหลัก แล้วอธิบายว่าทำงานร่วมกันอย่างไร', 'Open an old device safely, identify its main parts, and explain how they work together.'),
      40,
      L('อาชีพ · วิศวกรรม', 'Career · Engineering'),
    ),
  },
  electrician: {
    ...snapshot,
    name: L('ช่างไฟฟ้า', 'Electrician'),
    short: L('ช่างไฟฟ้า', 'Electrician'),
    focus: L('ลงมือทำ · ระบบ', 'Hands-on · Systems'),
    icon: 'ϟ',
    description: L('ติดตั้ง ดูแล และซ่อมระบบไฟฟ้าในบ้าน อาคาร และอุปกรณ์อย่างปลอดภัยและได้มาตรฐาน', 'Install, maintain and repair electrical systems in homes, buildings and equipment, safely and to standard.'),
    skills: ['Wiring', 'Safety', 'Problem solving'],
    onet: { code: '47-2111.00', title: 'Electricians' },
    riasec: { R: 100, I: 28, A: 4, S: 5, E: 14, C: 52 },
    starter: starter(
      'electrician',
      L('ต่อวงจรไฟฟ้าอย่างง่าย', 'Build a simple circuit kit'),
      L('ประกอบวงจรแบตเตอรี่กับหลอด LED สำหรับมือใหม่ แล้วอธิบายว่ากระแสไหลอย่างไร', 'Assemble a beginner battery-and-LED circuit and explain how the current flows.'),
      30,
      L('อาชีพ · ไฟฟ้า', 'Career · Electrical'),
    ),
  },
  chef: {
    ...snapshot,
    name: L('เชฟ', 'Chef'),
    short: L('เชฟ', 'Chef'),
    focus: L('อาหาร · งานฝีมือ', 'Food · Craft'),
    icon: '◒',
    description: L(
      'วางเมนู ทำอาหาร และนำทีมในครัว โดยสมดุลความคิดสร้างสรรค์กับความเร็ว ต้นทุน และความปลอดภัยของอาหาร',
      'Plan menus, cook and lead a kitchen team, balancing creativity with speed, cost and food safety.',
    ),
    skills: ['Cooking', 'Teamwork', 'Planning'],
    onet: { code: '35-1011.00', title: 'Chefs and Head Cooks' },
    riasec: { R: 64, I: 11, A: 29, S: 33, E: 69, C: 56 },
    starter: starter(
      'chef',
      L('ทำอาหารให้คนอื่นกิน', 'Cook a dish for others'),
      L('วางแผน คิดต้นทุน และทำอาหาร 1 จานให้เพื่อนหรือครอบครัว แล้วถามว่าจะปรับอะไร', 'Plan, cost and cook one dish for friends or family, then ask what they would change.'),
      60,
      L('อาชีพ · อาหาร', 'Career · Culinary'),
    ),
  },
  nurse: {
    ...snapshot,
    name: L('พยาบาลวิชาชีพ', 'Registered Nurse'),
    short: L('พยาบาล', 'Nurse'),
    focus: L('การดูแล · สุขภาพ', 'Care · Health'),
    icon: '✚',
    description: L('ดูแลผู้ป่วย ติดตามอาการ และทำงานร่วมกับแพทย์และครอบครัวเพื่อช่วยให้ผู้คนหายดี', 'Care for patients, monitor their health and work with doctors and families to help people recover.'),
    skills: ['Communication', 'Care', 'Attention to detail'],
    onet: { code: '29-1141.00', title: 'Registered Nurses' },
    riasec: { R: 41, I: 62, A: 6, S: 76, E: 23, C: 63 },
    starter: starter(
      'nurse',
      L('เรียนปฐมพยาบาลเบื้องต้น', 'Learn basic first aid'),
      L('ดูบทเรียนปฐมพยาบาลจากแหล่งทางการ แล้วฝึกทักษะ 1 อย่าง เช่น ท่าพักฟื้น', 'Watch an official first-aid lesson and practise one skill, such as the recovery position.'),
      30,
      L('อาชีพ · สุขภาพ', 'Career · Health'),
    ),
  },
  teacher: {
    ...snapshot,
    name: L('ครูมัธยม', 'Secondary School Teacher'),
    short: L('ครู', 'Teacher'),
    focus: L('การสอน · การเติบโต', 'Teaching · Growth'),
    icon: '✐',
    description: L('ช่วยให้วัยรุ่นเรียนรู้วิชา สร้างความมั่นใจ และเติบโตเป็นคน ทั้งในและนอกห้องเรียน', 'Help teenagers learn a subject, build confidence and grow as people, in and beyond the classroom.'),
    skills: ['Communication', 'Explaining', 'Planning'],
    onet: { code: '25-2031.00', title: 'Secondary School Teachers, Except Special and Career/Technical Education' },
    riasec: { R: 29, I: 37, A: 46, S: 100, E: 32, C: 44 },
    starter: starter(
      'teacher',
      L('สอน 1 หัวข้อ', 'Teach one concept'),
      L('อธิบายเรื่องที่คุณรู้ให้น้องหรือรุ่นน้องฟัง แล้วเช็กว่าเขาเข้าใจอะไรบ้าง', 'Explain a topic you know to a younger student or sibling, then check what they understood.'),
      20,
      L('อาชีพ · การสอน', 'Career · Teaching'),
    ),
  },
  psychologist: {
    ...snapshot,
    name: L('นักจิตวิทยาการปรึกษา', 'Counselling Psychologist'),
    short: L('นักจิตวิทยา', 'Psychologist'),
    focus: L('จิตใจ · การสนับสนุน', 'Mind · Support'),
    icon: '◎',
    description: L(
      'เข้าใจว่าผู้คนคิดและรู้สึกอย่างไร และช่วยให้รับมือกับความท้าทายด้วยวิธีที่มีหลักฐานรองรับ',
      'Understand how people think and feel, and help them cope with challenges through evidence-based support.',
    ),
    skills: ['Research', 'Active listening', 'Communication'],
    onet: { code: '19-3033.00', title: 'Clinical and Counseling Psychologists' },
    riasec: { R: 1, I: 76, A: 34, S: 93, E: 28, C: 42 },
    starter: starter(
      'psychologist',
      L('อ่านงานวิจัยเกี่ยวกับคน 1 เรื่อง', 'Read one study about people'),
      L('อ่านสรุปงานวิจัยจิตวิทยาที่คุณสนใจ แล้วอธิบายข้อค้นพบด้วยคำพูดของตัวเอง', 'Read a summary of a psychology study that interests you and explain its finding in your own words.'),
      30,
      L('อาชีพ · จิตวิทยา', 'Career · Psychology'),
    ),
  },
  marketing: {
    ...snapshot,
    name: L('ผู้จัดการฝ่ายการตลาด', 'Marketing Manager'),
    short: L('ผู้จัดการการตลาด', 'Marketing Mgr'),
    focus: L('ไอเดีย · การโน้มน้าว', 'Ideas · Influence'),
    icon: '➚',
    description: L('ตัดสินใจว่าจะนำสินค้าไปถึงคนที่ใช่อย่างไร นำแคมเปญ และทำให้แบรนด์เติบโต', 'Decide how to bring products to the right people, lead campaigns and grow a brand.'),
    skills: ['Communication', 'Storytelling', 'Strategy'],
    onet: { code: '11-2021.00', title: 'Marketing Managers' },
    riasec: { R: 0, I: 32, A: 24, S: 30, E: 100, C: 62 },
    starter: starter(
      'marketing',
      L('วางแผนแคมเปญเล็ก ๆ', 'Plan a tiny campaign'),
      L('เลือกสินค้าที่คุณชอบ แล้ววางแผนโพสต์โซเชียล 3 โพสต์ที่จะทำให้เพื่อนอยากลอง', 'Pick a product you love and plan three social posts that would make a friend want to try it.'),
      30,
      L('อาชีพ · การตลาด', 'Career · Marketing'),
    ),
  },
  marketResearch: {
    ...snapshot,
    name: L('นักวิเคราะห์วิจัยตลาด', 'Market Research Analyst'),
    short: L('นักวิเคราะห์ตลาด', 'Market Analyst'),
    focus: L('ความเข้าใจ · ธุรกิจ', 'Insight · Business'),
    icon: '◔',
    description: L(
      'ศึกษาตลาดและลูกค้าด้วยแบบสำรวจและข้อมูล เพื่อช่วยองค์กรตัดสินใจว่าจะนำเสนออะไรและอย่างไร',
      'Study markets and customers with surveys and data to help organisations decide what to offer and how.',
    ),
    skills: ['Research', 'Statistics', 'Communication'],
    onet: { code: '13-1161.00', title: 'Market Research Analysts and Marketing Specialists' },
    riasec: { R: 1, I: 60, A: 26, S: 25, E: 75, C: 60 },
    starter: starter(
      'marketResearch',
      L('ทำแบบสำรวจกับคน 5 คน', 'Run a five-person survey'),
      L('เขียนคำถาม 3 ข้อเกี่ยวกับสินค้าหนึ่งอย่าง ถามคน 5 คน แล้วสรุปรูปแบบที่เห็น', 'Write three questions about a product, ask five people, and summarise the pattern you see.'),
      40,
      L('อาชีพ · วิจัย', 'Career · Research'),
    ),
  },
  projectManager: {
    ...snapshot,
    name: L('ผู้จัดการโครงการ', 'Project Manager'),
    short: L('ผู้จัดการโครงการ', 'Project Manager'),
    focus: L('แผน · ผู้คน', 'Plans · People'),
    icon: '▤',
    description: L('วางแผนโครงการ ประสานคนและทรัพยากร และดูแลให้งานเสร็จตามเวลาและงบประมาณ', 'Plan projects, coordinate people and resources, and keep work on time and on budget.'),
    skills: ['Planning', 'Communication', 'Organizing'],
    onet: { code: '13-1082.00', title: 'Project Management Specialists' },
    riasec: { R: 8, I: 29, A: 10, S: 39, E: 88, C: 76 },
    starter: starter(
      'projectManager',
      L('วางแผนงานเล็ก ๆ 1 งาน', 'Plan a small event'),
      L('เขียนแผนหนึ่งหน้าสำหรับงานรวมตัวเล็ก ๆ ระบุงาน ผู้รับผิดชอบ วันที่ และงบประมาณ', 'Write a one-page plan for a small get-together: tasks, owners, dates and budget.'),
      30,
      L('อาชีพ · บริหารโครงการ', 'Career · Project management'),
    ),
  },
  accountant: {
    ...snapshot,
    name: L('นักบัญชี', 'Accountant'),
    short: L('นักบัญชี', 'Accountant'),
    focus: L('ตัวเลข · ความแม่นยำ', 'Numbers · Accuracy'),
    icon: '¤',
    description: L(
      'ดูแลบันทึกทางการเงินให้ถูกต้อง วิเคราะห์การเงิน และช่วยให้คนและองค์กรตัดสินใจได้อย่างรอบคอบ',
      'Keep financial records accurate, analyse money flows and help people and organisations make sound decisions.',
    ),
    skills: ['Organizing', 'Attention to detail', 'Spreadsheets'],
    onet: { code: '13-2011.00', title: 'Accountants and Auditors' },
    riasec: { R: 2, I: 43, A: 1, S: 19, E: 48, C: 100 },
    starter: starter(
      'accountant',
      L('บันทึกรายจ่าย 1 สัปดาห์', 'Track a week of spending'),
      L('ทำสเปรดชีตง่าย ๆ บันทึกรายจ่ายหนึ่งสัปดาห์ แล้วหารูปแบบ 1 อย่าง', 'Set up a simple spreadsheet, log your spending for a week, and find one pattern.'),
      30,
      L('อาชีพ · การเงิน', 'Career · Finance'),
    ),
  },
}

export const startingPoint: NodeInfo = {
  name: L('จุดเริ่มต้นของคุณ', 'Your starting point'),
  type: L('ภาพรวมของคุณ', 'YOUR SNAPSHOT'),
  description: L(
    'คุณคือส่วนผสมของความสนใจ คุณค่า ทักษะ และประสบการณ์ที่เปลี่ยนแปลงได้เสมอ เริ่มต้นด้วยความอยากรู้แทนความกดดัน',
    'You are a collection of interests, values, skills, and experiences that can change over time. Start with curiosity instead of pressure.',
  ),
  skills: ['Curiosity', 'Reflection', 'Experimenting'],
}

export function isCareerId(value: unknown): value is CareerId {
  return typeof value === 'string' && (CAREER_IDS as readonly string[]).includes(value)
}

export function getNodeInfo(id: NodeId): NodeInfo {
  return id === 'you' ? startingPoint : careers[id]
}
