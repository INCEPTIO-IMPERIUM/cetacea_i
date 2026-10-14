import type { CareerId } from './careers'

export type QuestionId = 'activity' | 'interests' | 'strength' | 'workValue' | 'environment'

export interface QuestionOption {
  value: string
  label: string
  /** Extra grid classes, e.g. to let the last option span a row. */
  className?: string
}

export interface Question {
  id: QuestionId
  kind: 'single' | 'multi'
  title: string
  help: string
  /** Grid classes for the option list. */
  layout: string
  /** Grid classes for the question card itself. */
  className?: string
  /** Let the header's hint chip drop below the title on narrow screens. */
  wrapHeader?: boolean
  options: QuestionOption[]
}

export interface DiscoveryAnswers {
  activity: string
  interests: string[]
  strength: string
  workValue: string
  environment: string
  reflection: string
}

export interface RankedCareer {
  id: CareerId
  score: number
}

export const emptyAnswers: DiscoveryAnswers = {
  activity: '',
  interests: [],
  strength: '',
  workValue: '',
  environment: '',
  reflection: '',
}

export const questions: Question[] = [
  {
    id: 'activity',
    kind: 'single',
    title: 'Which activities give you energy?',
    help: 'Please choose one option to continue.',
    layout: 'grid sm:grid-cols-2 gap-2',
    options: [
      { value: 'design', label: 'Making ideas visual or designing experiences' },
      { value: 'technology', label: 'Solving puzzles, coding, or understanding systems' },
      { value: 'teaching', label: 'Explaining ideas and helping others learn' },
      { value: 'planning', label: 'Organizing plans and making decisions' },
      { value: 'people', label: 'Listening to people and helping them work through challenges', className: 'sm:col-span-2' },
    ],
  },
  {
    id: 'interests',
    kind: 'multi',
    title: 'Which topics are you curious about?',
    help: 'Choose at least one topic — you can select several.',
    layout: 'grid sm:grid-cols-2 gap-2',
    options: [
      { value: 'design', label: 'Art, design & storytelling' },
      { value: 'technology', label: 'Technology & coding' },
      { value: 'teaching', label: 'Teaching & learning' },
      { value: 'research', label: 'Research & investigation' },
      { value: 'business', label: 'Business & strategy' },
      { value: 'wellbeing', label: 'People, wellbeing & community' },
    ],
  },
  {
    id: 'strength',
    kind: 'single',
    title: 'What do people often ask you for help with?',
    help: 'Please choose one option to continue.',
    layout: 'space-y-2',
    options: [
      { value: 'visual', label: 'Making things clearer, more visual, or easier to use' },
      { value: 'explain', label: 'Explaining difficult topics in a simple way' },
      { value: 'technical', label: 'Fixing technical problems or figuring out how things work' },
      { value: 'organize', label: 'Planning, coordinating, and keeping things on track' },
      { value: 'listen', label: 'Listening, encouraging, or supporting someone' },
    ],
  },
  {
    id: 'workValue',
    kind: 'single',
    title: 'What matters most in your future work?',
    help: 'Please choose one option to continue.',
    layout: 'space-y-2',
    options: [
      { value: 'autonomy', label: 'Freedom to make my own choices' },
      { value: 'stability', label: 'Stability and a clear sense of security' },
      { value: 'creativity', label: 'Room to create and try new ideas' },
      { value: 'helping', label: 'Making a positive difference for people' },
      { value: 'growth', label: 'Learning continuously and growing my skills' },
    ],
  },
  {
    id: 'environment',
    kind: 'single',
    title: 'Which work environment sounds most comfortable?',
    help: 'Please choose one option to continue.',
    layout: 'grid grid-cols-2 sm:grid-cols-5 gap-2',
    className: 'xl:col-span-2',
    wrapHeader: true,
    options: [
      { value: 'independent', label: 'Quiet, focused work' },
      { value: 'collaborative', label: 'Collaborating with a team' },
      { value: 'dynamic', label: 'Fast-moving and varied' },
      { value: 'structured', label: 'Clear plans and structure' },
      { value: 'people', label: 'Working directly with people', className: 'col-span-2 sm:col-span-1' },
    ],
  },
]

export function isAnswered(answers: DiscoveryAnswers, id: QuestionId): boolean {
  const value = answers[id]
  return Array.isArray(value) ? value.length > 0 : value !== ''
}

type ScoreMap = Record<string, CareerId[]>

const activityMap: ScoreMap = { design: ['ux', 'product'], technology: ['front', 'product'], teaching: ['learning', 'coach'], planning: ['product', 'front'], people: ['coach', 'learning'] }
const interestMap: ScoreMap = { design: ['ux', 'product'], technology: ['front', 'product'], teaching: ['learning', 'coach'], research: ['ux', 'learning'], business: ['product', 'front'], wellbeing: ['coach', 'learning'] }
const strengthMap: ScoreMap = { visual: ['ux', 'product'], explain: ['learning', 'coach'], technical: ['front'], organize: ['product', 'front'], listen: ['coach', 'learning'] }
const valueMap: ScoreMap = { autonomy: ['front', 'ux'], stability: ['front', 'learning'], creativity: ['ux', 'product'], helping: ['coach', 'learning'], growth: ['front', 'learning'] }
const environmentMap: ScoreMap = { independent: ['front', 'ux'], collaborative: ['product', 'ux'], dynamic: ['front', 'product'], structured: ['learning', 'product'], people: ['coach', 'learning'] }

/**
 * Weighted clue matching. Activity carries the most weight, then strength,
 * then each interest; values and environment nudge the order.
 * Returns every career, best first — the UI always shows alternatives.
 */
export function rankCareers(answers: DiscoveryAnswers): RankedCareer[] {
  const scores: Record<CareerId, number> = { ux: 0, front: 0, learning: 0, product: 0, coach: 0 }
  const add = (roles: CareerId[] | undefined, amount: number) => roles?.forEach((role) => (scores[role] += amount))

  add(activityMap[answers.activity], 3)
  answers.interests.forEach((value) => add(interestMap[value], 1.25))
  add(strengthMap[answers.strength], 2)
  add(valueMap[answers.workValue], 1)
  add(environmentMap[answers.environment], 1)

  return (Object.entries(scores) as [CareerId, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }))
}
