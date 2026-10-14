export type IkigaiArea = 'love' | 'good' | 'world' | 'need'

export interface IkigaiCard {
  area: IkigaiArea
  title: string
  hint: string
  tone: string
  options: string[]
}

export const ikigaiCards: IkigaiCard[] = [
  { area: 'love', title: 'What you love', hint: 'Activities that make you lose track of time.', tone: 'bg-lemon-soft', options: ['Design', 'Storytelling', 'Technology', 'Teaching'] },
  { area: 'good', title: "What you're good at", hint: 'Strengths you already use or want to grow.', tone: 'bg-lilac', options: ['Problem solving', 'Explaining', 'Visual thinking', 'Organizing'] },
  { area: 'world', title: 'What matters to you', hint: 'Values you want your future to reflect.', tone: 'bg-mint', options: ['Freedom', 'Stability', 'Creativity', 'Helping people'] },
  { area: 'need', title: 'What the world needs', hint: 'Problems you would feel good helping solve.', tone: 'bg-peach', options: ['Better learning', 'Access to tech', 'Sustainability', 'Wellbeing'] },
]

export const defaultIkigai = ['Design', 'Technology', 'Teaching', 'Visual thinking']

export interface Skill {
  name: string
  value: number
}

export const defaultSkills: Skill[] = [
  { name: 'Visual thinking', value: 82 },
  { name: 'Communication', value: 74 },
  { name: 'Problem solving', value: 68 },
  { name: 'Research', value: 62 },
  { name: 'Coding fundamentals', value: 48 },
]

export type ExperimentIcon = 'portfolio' | 'interview' | 'map' | 'career' | 'custom'
export type ExperimentTone = 'white' | 'lilac' | 'mint'

export interface Experiment {
  id: string
  title: string
  description: string
  duration: string
  tag: string
  icon: ExperimentIcon
  tone: ExperimentTone
  done: boolean
}

export const defaultExperiments: Experiment[] = [
  {
    id: 'portfolio',
    title: 'Make a tiny portfolio section',
    description: 'Create one screen or sketch for something you wish existed. Notice which part you enjoy most.',
    duration: '25 MIN',
    tag: 'Design · Making',
    icon: 'portfolio',
    tone: 'white',
    done: false,
  },
  {
    id: 'interview',
    title: 'Talk to someone about their work',
    description: 'Ask what a normal day looks like, what is challenging, and what surprised them about the role.',
    duration: '15 MIN',
    tag: 'Curiosity · Listening',
    icon: 'interview',
    tone: 'lilac',
    done: false,
  },
  {
    id: 'learning-map',
    title: 'Map a learning journey',
    description: 'Choose a topic you care about and sketch how you would help a beginner understand it.',
    duration: '20 MIN',
    tag: 'Teaching · Systems',
    icon: 'map',
    tone: 'mint',
    done: false,
  },
]
