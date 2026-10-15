import { CAREER_IDS, isCareerId, type CareerId } from '../../../data/careers'
import { rankScores } from '../scoring'
import type { AssessmentCategory, CategoryAnswers, CategoryResult, Question } from '../types'

/**
 * The template's original five-question form, kept as a quick starting point until
 * the evidence-based categories (#2–#6) and the career matcher (#7) replace it.
 * Its weights are hand-tuned heuristics, not a validated instrument.
 */

const questions: Question[] = [
  {
    id: 'activity',
    kind: 'single',
    prompt: 'Which activities give you energy?',
    required: true,
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
    prompt: 'Which topics are you curious about?',
    required: true,
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
    prompt: 'What do people often ask you for help with?',
    required: true,
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
    prompt: 'What matters most in your future work?',
    required: true,
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
    prompt: 'Which work environment sounds most comfortable?',
    required: true,
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
  {
    id: 'reflection',
    kind: 'reflection',
    prompt: 'Is there a career, project, or problem you have always wanted to try?',
    hint: 'A phrase is enough. You can come back to this later.',
    required: false,
    maxLength: 300,
    placeholder: "I'd love to try building..., learning about..., or helping with...",
    className: 'xl:col-span-2',
  },
]

type ScoreMap = Record<string, CareerId[]>

const activityMap: ScoreMap = { design: ['ux', 'product'], technology: ['front', 'product'], teaching: ['learning', 'coach'], planning: ['product', 'front'], people: ['coach', 'learning'] }
const interestMap: ScoreMap = { design: ['ux', 'product'], technology: ['front', 'product'], teaching: ['learning', 'coach'], research: ['ux', 'learning'], business: ['product', 'front'], wellbeing: ['coach', 'learning'] }
const strengthMap: ScoreMap = { visual: ['ux', 'product'], explain: ['learning', 'coach'], technical: ['front'], organize: ['product', 'front'], listen: ['coach', 'learning'] }
const valueMap: ScoreMap = { autonomy: ['front', 'ux'], stability: ['front', 'learning'], creativity: ['ux', 'product'], helping: ['coach', 'learning'], growth: ['front', 'learning'] }
const environmentMap: ScoreMap = { independent: ['front', 'ux'], collaborative: ['product', 'ux'], dynamic: ['front', 'product'], structured: ['learning', 'product'], people: ['coach', 'learning'] }

const text = (value: unknown) => (typeof value === 'string' ? value : '')

/**
 * Weighted clue matching: activity 3, strength 2, each interest 1.25, value 1, environment 1.
 * Returns raw weights per career (unchanged from the template).
 */
export function rawCareerScores(answers: CategoryAnswers): Record<CareerId, number> {
  const scores: Record<CareerId, number> = { ux: 0, front: 0, learning: 0, product: 0, coach: 0 }
  const add = (roles: CareerId[] | undefined, amount: number) => roles?.forEach((role) => (scores[role] += amount))
  add(activityMap[text(answers.activity)], 3)
  const interests = Array.isArray(answers.interests) ? answers.interests : []
  interests.forEach((value) => add(interestMap[value], 1.25))
  add(strengthMap[text(answers.strength)], 2)
  add(valueMap[text(answers.workValue)], 1)
  add(environmentMap[text(answers.environment)], 1)
  return scores
}

/** Scores relative to the best match (best = 100); every career stays in the ranking. */
export function scoreQuickDiscovery(answers: CategoryAnswers): CategoryResult {
  const raw = rawCareerScores(answers)
  const top = Math.max(...Object.values(raw), 1)
  const scores = Object.fromEntries(CAREER_IDS.map((id) => [id, Math.round((raw[id] / top) * 100)]))
  // Rank on raw weights so rounding can never reorder close careers.
  const ranking = rankScores(raw)
  return { scores, ranking }
}

export function topCareer(ranking: string[]): CareerId | null {
  const first = ranking[0]
  return isCareerId(first) ? first : null
}

export const quickDiscovery: AssessmentCategory = {
  id: 'quick',
  // 00 keeps 01 free for the Personality Compass.
  number: '00',
  title: 'Quick discovery',
  summary: 'Five short questions about what gives you energy, what you are curious about, and how you like to work.',
  estimatedMinutes: 3,
  pageSize: questions.length,
  gridClassName: 'grid grid-cols-1 xl:grid-cols-2 gap-4',
  questions,
  copy: {
    eyebrow: '00 / Start with a few questions',
    title: 'Your discovery form',
    description: 'A short guided questionnaire inspired by familiar form tools. There are no right or wrong answers — choose what feels true today.',
    progressEyebrow: 'A little context goes a long way',
    progressTitle: 'Tell us how you like to explore.',
    progressHint: 'Answer 5 required questions to see a few career paths worth exploring.',
    submitLabel: 'Find paths worth exploring',
    missingToast: 'Answer the highlighted questions to see your paths.',
    submittedToast: 'Your answers are ready — explore the suggested paths.',
  },
  score: scoreQuickDiscovery,
}
