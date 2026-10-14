export const CAREER_IDS = ['ux', 'front', 'learning', 'product', 'coach'] as const

export type CareerId = (typeof CAREER_IDS)[number]
/** A node on the roadmap: one of the careers, or the user's own starting point. */
export type NodeId = CareerId | 'you'

export interface NodeInfo {
  name: string
  type: string
  match: string
  description: string
  skills: string[]
}

export interface Career extends NodeInfo {
  /** Short line shown in the accessible list and on the 3D card. */
  focus: string
  /** Why this path might fit — shown on the assessment result. */
  recommendation: string
}

export const careers: Record<CareerId, Career> = {
  ux: {
    name: 'UX Designer',
    focus: 'Design · Empathy',
    type: 'CAREER SNAPSHOT',
    match: 'GOOD TO EXPLORE',
    description:
      'Design helpful digital experiences by understanding what people need and turning insights into clear interfaces.',
    skills: ['User research', 'Wireframing', 'Empathy'],
    recommendation:
      'You seem curious about understanding people and shaping clearer experiences. Try a small design task before treating this as a fixed direction.',
  },
  front: {
    name: 'Frontend Developer',
    focus: 'Code · Craft',
    type: 'CAREER SNAPSHOT',
    match: 'POSSIBLE PATH',
    description:
      'Bring digital products to life by building the interfaces people use, combining logic, visual detail, and problem solving.',
    skills: ['HTML / CSS', 'JavaScript', 'Debugging'],
    recommendation:
      'You may enjoy building things, solving practical problems, and seeing your ideas work. A tiny coding experiment can help you test that interest.',
  },
  learning: {
    name: 'Learning Designer',
    focus: 'Teaching · Systems',
    type: 'CAREER SNAPSHOT',
    match: 'GOOD TO EXPLORE',
    description:
      'Create learning experiences that make complex topics easier to understand, practice, and remember.',
    skills: ['Learning design', 'Storytelling', 'Assessment'],
    recommendation:
      'You may enjoy making knowledge easier to understand and helping people learn. Try explaining one idea through a short lesson or guide.',
  },
  product: {
    name: 'Product Designer',
    focus: 'Strategy · Design',
    type: 'CAREER SNAPSHOT',
    match: 'POSSIBLE PATH',
    description:
      'Connect user needs, product goals, and visual systems to shape useful products from early ideas to polished experiences.',
    skills: ['Prototyping', 'Systems thinking', 'Collaboration'],
    recommendation:
      'You may enjoy connecting ideas, people, and practical decisions. A small product concept can help you explore that mix.',
  },
  coach: {
    name: 'Career Coach',
    focus: 'Listening · Guidance',
    type: 'CAREER SNAPSHOT',
    match: 'ANOTHER DIRECTION',
    description:
      'Help people make sense of their options, recognize their strengths, and turn goals into manageable next steps.',
    skills: ['Active listening', 'Questioning', 'Goal setting'],
    recommendation:
      'You may find meaning in listening, supporting, and helping people discover their next steps. Try a reflective interview or peer-support activity.',
  },
}

export const startingPoint: NodeInfo = {
  name: 'Your starting point',
  type: 'YOUR SNAPSHOT',
  match: 'START HERE',
  description:
    'You are a collection of interests, values, skills, and experiences that can change over time. Start with curiosity instead of pressure.',
  skills: ['Curiosity', 'Reflection', 'Experimenting'],
}

export function isCareerId(value: unknown): value is CareerId {
  return typeof value === 'string' && (CAREER_IDS as readonly string[]).includes(value)
}

export function getNodeInfo(id: NodeId): NodeInfo {
  return id === 'you' ? startingPoint : careers[id]
}
