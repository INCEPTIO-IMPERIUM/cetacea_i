import { useSyncExternalStore } from 'react'
import { isCareerId, type CareerId } from '../data/careers'
import {
  defaultExperiments,
  defaultIkigai,
  defaultSkills,
  type Experiment,
  type Skill,
} from '../data/dashboard'
import type { AnswerValue, CategoryAnswers, CategoryResult, StoredCategoryResult } from '../features/assessment/types'

/**
 * Single source of truth for everything the user creates, shared by every page.
 * Persisted to localStorage on this device only — there is no backend or sync yet.
 */

export interface Reflection {
  text: string
  createdAt: string
}

/** Progress and result of one assessment category. */
export interface CategoryRecord {
  answers: CategoryAnswers
  /** Zero-based page the user was last on. */
  page: number
  result: StoredCategoryResult | null
}

export interface WhoAmIState {
  version: 2
  /** Keyed by category id. */
  assessment: Record<string, CategoryRecord>
  /** Category the user was last working in, for "continue where you left off". */
  lastCategory: string | null
  recommendedCareer: CareerId | null
  ikigai: string[]
  skills: Skill[]
  experiments: Experiment[]
  reflections: Reflection[]
}

export const STORAGE_KEY = 'whoAmI:v2'
export const LEGACY_STORAGE_KEY = 'whoAmI:v1'

export function createDefaultState(): WhoAmIState {
  return {
    version: 2,
    assessment: {},
    lastCategory: null,
    recommendedCareer: null,
    ikigai: [...defaultIkigai],
    skills: defaultSkills.map((skill) => ({ ...skill })),
    experiments: defaultExperiments.map((experiment) => ({ ...experiment })),
    reflections: [],
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const arrayOr = <T>(value: unknown, fallback: T[]): T[] => (Array.isArray(value) ? (value as T[]) : fallback)

function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)) || (Array.isArray(value) && value.every((item) => typeof item === 'string'))
}

function sanitizeAnswers(value: unknown): CategoryAnswers {
  if (!isRecord(value)) return {}
  return Object.fromEntries(Object.entries(value).filter(([, answer]) => isAnswerValue(answer))) as CategoryAnswers
}

function sanitizeResult(value: unknown): StoredCategoryResult | null {
  if (!isRecord(value) || !isRecord(value.scores) || !Array.isArray(value.ranking)) return null
  return {
    scores: Object.fromEntries(Object.entries(value.scores).filter(([, score]) => typeof score === 'number')) as Record<string, number>,
    ranking: value.ranking.filter((key): key is string => typeof key === 'string'),
    completedAt: typeof value.completedAt === 'string' ? value.completedAt : new Date(0).toISOString(),
  }
}

function sanitizeAssessment(value: unknown): Record<string, CategoryRecord> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, record]) => isRecord(record))
      .map(([id, record]) => {
        const r = record as Record<string, unknown>
        return [id, { answers: sanitizeAnswers(r.answers), page: typeof r.page === 'number' && r.page >= 0 ? Math.floor(r.page) : 0, result: sanitizeResult(r.result) }]
      }),
  )
}

/** Dashboard data has the same shape in v1 and v2. */
function sanitizeShared(parsed: Record<string, unknown>, defaults: WhoAmIState) {
  return {
    recommendedCareer: isCareerId(parsed.recommendedCareer) ? parsed.recommendedCareer : null,
    ikigai: arrayOr<string>(parsed.ikigai, defaults.ikigai),
    skills: arrayOr<Skill>(parsed.skills, defaults.skills),
    experiments: arrayOr<Experiment>(parsed.experiments, defaults.experiments),
    reflections: arrayOr<Reflection>(parsed.reflections, []),
  }
}

/**
 * v1 kept one five-question form as `draft` + `assessment.ranked`.
 * It is kept under the `quick` key (that form has since been retired, so nothing reads it);
 * dashboard data carries over untouched.
 */
export function migrateV1(parsed: Record<string, unknown>): WhoAmIState {
  const defaults = createDefaultState()
  const state: WhoAmIState = { ...defaults, ...sanitizeShared(parsed, defaults) }
  const draft = sanitizeAnswers(parsed.draft)
  const legacy = isRecord(parsed.assessment) ? parsed.assessment : null
  const ranked = legacy && Array.isArray(legacy.ranked) ? (legacy.ranked as unknown[]) : null

  let result: StoredCategoryResult | null = null
  if (ranked) {
    const entries = ranked.filter((item): item is { id: string; score: number } => isRecord(item) && typeof item.id === 'string' && typeof item.score === 'number')
    const top = Math.max(...entries.map((item) => item.score), 1)
    result = {
      scores: Object.fromEntries(entries.map((item) => [item.id, Math.round((item.score / top) * 100)])),
      ranking: entries.map((item) => item.id),
      completedAt: typeof legacy?.completedAt === 'string' ? legacy.completedAt : new Date(0).toISOString(),
    }
  }

  if (Object.keys(draft).length > 0 || result) {
    // A completed v1 assessment also stored its answers; prefer them over the draft.
    const answers = legacy && isRecord(legacy.answers) ? { ...draft, ...sanitizeAnswers(legacy.answers) } : draft
    state.assessment = { quick: { answers, page: 0, result } }
  }
  return state
}

/** Reads stored JSON (v2 first, then v1). Anything unrecognised falls back to defaults field by field. */
export function parseStoredState(rawV2: string | null, rawV1: string | null = null): WhoAmIState {
  const defaults = createDefaultState()
  const parse = (raw: string | null): Record<string, unknown> | null => {
    if (!raw) return null
    try {
      const value: unknown = JSON.parse(raw)
      return isRecord(value) ? value : null
    } catch {
      return null
    }
  }

  const v2 = parse(rawV2)
  if (v2?.version === 2) {
    return {
      ...defaults,
      ...sanitizeShared(v2, defaults),
      assessment: sanitizeAssessment(v2.assessment),
      lastCategory: typeof v2.lastCategory === 'string' ? v2.lastCategory : null,
    }
  }
  const v1 = parse(rawV1)
  if (v1?.version === 1) return migrateV1(v1)
  return defaults
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
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

// The v1 key is left in place after migrating, so a rollback to the old build still finds its data.
let state = parseStoredState(readStorage(STORAGE_KEY), readStorage(LEGACY_STORAGE_KEY))
// Persist a migration straight away so later loads read v2 rather than migrating again.
if (readStorage(STORAGE_KEY) === null && readStorage(LEGACY_STORAGE_KEY) !== null) writeStorage(state)
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
    state = parseStoredState(event.newValue)
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

/* ---------- Selectors ---------- */

const emptyRecord: CategoryRecord = { answers: {}, page: 0, result: null }

export function getCategoryRecord(current: WhoAmIState, categoryId: string): CategoryRecord {
  return current.assessment[categoryId] ?? emptyRecord
}


/* ---------- Actions ---------- */

function updateCategory(categoryId: string, recipe: (record: CategoryRecord) => CategoryRecord) {
  update((s) => ({
    ...s,
    lastCategory: categoryId,
    assessment: { ...s.assessment, [categoryId]: recipe(getCategoryRecord(s, categoryId)) },
  }))
}

export const actions = {
  setAnswer(categoryId: string, questionId: string, value: AnswerValue) {
    updateCategory(categoryId, (record) => ({ ...record, answers: { ...record.answers, [questionId]: value } }))
  },
  setPage(categoryId: string, page: number) {
    updateCategory(categoryId, (record) => ({ ...record, page: Math.max(0, Math.floor(page)) }))
  },
  /** Saves a scored category; `recommendedCareer` updates the dashboard's suggested path when given. */
  completeCategory(categoryId: string, result: CategoryResult, recommendedCareer?: CareerId | null) {
    update((s) => ({
      ...s,
      lastCategory: categoryId,
      recommendedCareer: recommendedCareer ?? s.recommendedCareer,
      assessment: {
        ...s.assessment,
        [categoryId]: { ...getCategoryRecord(s, categoryId), result: { ...result, completedAt: new Date().toISOString() } },
      },
    }))
  },
  clearCategory(categoryId: string) {
    update((s) => {
      const rest = { ...s.assessment }
      delete rest[categoryId]
      return { ...s, assessment: rest, lastCategory: s.lastCategory === categoryId ? null : s.lastCategory }
    })
  },
  /** Removes every answer and result (the user's right to delete their data). Dashboard data stays. */
  clearAllAssessments() {
    update((s) => ({ ...s, assessment: {}, lastCategory: null, recommendedCareer: null }))
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
