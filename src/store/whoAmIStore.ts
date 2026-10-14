import { useSyncExternalStore } from 'react'
import { emptyAnswers, type DiscoveryAnswers, type RankedCareer } from '../data/assessment'
import { isCareerId, type CareerId } from '../data/careers'
import {
  defaultExperiments,
  defaultIkigai,
  defaultSkills,
  type Experiment,
  type Skill,
} from '../data/dashboard'

/**
 * Single source of truth for everything the user creates, shared by every page.
 * Persisted to localStorage on this device only — there is no backend or sync yet.
 */

export interface AssessmentResult {
  answers: DiscoveryAnswers
  ranked: RankedCareer[]
  completedAt: string
}

export interface Reflection {
  text: string
  createdAt: string
}

export interface WhoAmIState {
  version: 1
  /** Answers in progress, kept so a refresh never loses work. */
  draft: DiscoveryAnswers
  assessment: AssessmentResult | null
  recommendedCareer: CareerId | null
  ikigai: string[]
  skills: Skill[]
  experiments: Experiment[]
  reflections: Reflection[]
}

const STORAGE_KEY = 'whoAmI:v1'

function createDefaultState(): WhoAmIState {
  return {
    version: 1,
    draft: { ...emptyAnswers },
    assessment: null,
    recommendedCareer: null,
    ikigai: [...defaultIkigai],
    skills: defaultSkills.map((skill) => ({ ...skill })),
    experiments: defaultExperiments.map((experiment) => ({ ...experiment })),
    reflections: [],
  }
}

const arrayOr = <T>(value: unknown, fallback: T[]): T[] => (Array.isArray(value) ? (value as T[]) : fallback)

/** Accepts only data shaped like ours; anything else falls back to defaults field by field. */
function parseState(raw: string | null): WhoAmIState {
  const defaults = createDefaultState()
  if (!raw) return defaults
  try {
    const parsed = JSON.parse(raw) as Partial<WhoAmIState>
    if (parsed?.version !== 1) return defaults
    return {
      version: 1,
      draft: { ...emptyAnswers, ...(parsed.draft ?? {}), interests: arrayOr(parsed.draft?.interests, []) },
      assessment: parsed.assessment && Array.isArray(parsed.assessment.ranked) ? parsed.assessment : null,
      recommendedCareer: isCareerId(parsed.recommendedCareer) ? parsed.recommendedCareer : null,
      ikigai: arrayOr(parsed.ikigai, defaults.ikigai),
      skills: arrayOr(parsed.skills, defaults.skills),
      experiments: arrayOr(parsed.experiments, defaults.experiments),
      reflections: arrayOr(parsed.reflections, []),
    }
  } catch {
    return defaults
  }
}

function readStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // storage can be blocked (private mode, disabled site data)
  }
}

function writeStorage(value: WhoAmIState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Storage unavailable: state still works for this session.
  }
}

let state = parseState(readStorage())
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Keep tabs in sync: a change in another tab replaces our snapshot.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    state = parseState(event.newValue)
    emit()
  })
}

function update(recipe: (current: WhoAmIState) => WhoAmIState) {
  state = recipe(state)
  writeStorage(state)
  emit()
}

export function useWhoAmI(): WhoAmIState {
  return useSyncExternalStore(subscribe, () => state)
}

/* ---------- Actions ---------- */

export const actions = {
  setDraft(draft: DiscoveryAnswers) {
    update((s) => ({ ...s, draft }))
  },
  completeAssessment(answers: DiscoveryAnswers, ranked: RankedCareer[]) {
    update((s) => ({
      ...s,
      draft: answers,
      assessment: { answers, ranked, completedAt: new Date().toISOString() },
      recommendedCareer: ranked[0]?.id ?? s.recommendedCareer,
    }))
  },
  clearAssessment() {
    update((s) => ({ ...s, draft: { ...emptyAnswers }, assessment: null }))
  },
  setRecommendedCareer(id: CareerId) {
    update((s) => ({ ...s, recommendedCareer: id }))
  },

  toggleIkigai(value: string) {
    update((s) => ({
      ...s,
      ikigai: s.ikigai.includes(value) ? s.ikigai.filter((item) => item !== value) : [...s.ikigai, value],
    }))
  },
  clearIkigai() {
    update((s) => ({ ...s, ikigai: [] }))
  },

  setSkillValue(name: string, value: number) {
    update((s) => ({ ...s, skills: s.skills.map((skill) => (skill.name === name ? { ...skill, value } : skill)) }))
  },
  /** Returns false when a skill with the same name already exists. */
  addSkill(name: string): boolean {
    const exists = state.skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())
    if (exists) return false
    update((s) => ({ ...s, skills: [...s.skills, { name, value: 35 }] }))
    return true
  },

  toggleExperiment(id: string) {
    update((s) => ({
      ...s,
      experiments: s.experiments.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    }))
  },
  addExperiment(experiment: Omit<Experiment, 'id' | 'done'>) {
    const id = `${experiment.icon}-${Date.now()}`
    update((s) => ({ ...s, experiments: [{ ...experiment, id, done: false }, ...s.experiments] }))
  },

  addReflection(text: string) {
    update((s) => ({ ...s, reflections: [{ text, createdAt: new Date().toISOString() }, ...s.reflections] }))
  },
}
