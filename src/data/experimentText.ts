import type { Lang } from '../i18n/language'
import { GROWTH_ACTIONS } from '../features/assessment/categories/strengths'
import { CAREER_IDS, careers } from './careers'
import { defaultExperimentCatalog, ownIdeaCatalog, selfDiscoveryStarter, type CatalogExperiment, type Experiment } from './dashboard'

/** Every built-in experiment, by catalog key. */
const catalog = new Map<string, CatalogExperiment>([
  ...defaultExperimentCatalog.map((entry) => [entry.key, entry] as const),
  [selfDiscoveryStarter.key, selfDiscoveryStarter],
  ...CAREER_IDS.map((id) => [careers[id].starter.key, careers[id].starter] as const),
  ...Object.values(GROWTH_ACTIONS).map((entry) => [entry.key, entry] as const),
])

const keyByTitle = new Map<string, string>([...catalog.values()].flatMap((entry) => [[entry.title.th, entry.key] as const, [entry.title.en, entry.key] as const]))

/**
 * Experiments saved before keys existed: seeded ones are matched by id, built-ins added later by
 * their title in either language. Anything else is the person's own idea and keeps its text.
 */
const keyFor = (experiment: Experiment) =>
  experiment.key ?? (catalog.has(`default:${experiment.id}`) ? `default:${experiment.id}` : keyByTitle.get(experiment.title))

export interface ExperimentText {
  title: string
  description: string
  duration: string
  tag: string
}

/** Text to show for an experiment: built-ins follow the interface language, your own ideas stay as written. */
export function experimentText(experiment: Experiment, lang: Lang): ExperimentText {
  const key = keyFor(experiment)
  const entry = key ? catalog.get(key) : undefined
  if (entry) return { title: entry.title[lang], description: entry.description[lang], duration: entry.duration[lang], tag: entry.tag[lang] }
  if (key === 'own') return { title: experiment.title, description: ownIdeaCatalog.description[lang], duration: ownIdeaCatalog.duration[lang], tag: ownIdeaCatalog.tag[lang] }
  return { title: experiment.title, description: experiment.description, duration: experiment.duration, tag: experiment.tag }
}

/** True once a built-in experiment has been added (in either language). */
export function hasExperiment(experiments: Experiment[], key: string): boolean {
  return experiments.some((experiment) => keyFor(experiment) === key)
}
