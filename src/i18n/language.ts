import { useCallback, useSyncExternalStore } from 'react'

/**
 * Interface language (Thai / English). Kept apart from the user's data store: it is a display
 * preference, saved on this device under its own key and mirrored to <html lang>.
 * Text lives next to the code that shows it as `{ th, en }` pairs; `t()` picks the current one.
 */

export type Lang = 'th' | 'en'
export const LANGS: Lang[] = ['th', 'en']

/** A piece of text in both languages. */
export type Localized = Record<Lang, string>

export const LANG_STORAGE_KEY = 'whoAmI:lang'

const isLang = (value: unknown): value is Lang => value === 'th' || value === 'en'

function readStoredLang(): Lang | null {
  try {
    const value = localStorage.getItem(LANG_STORAGE_KEY)
    return isLang(value) ? value : null
  } catch {
    return null // storage can be blocked
  }
}

/** Thai is the default — the product is made for Thai users first. */
let current: Lang = readStoredLang() ?? 'th'
const listeners = new Set<() => void>()

function applyToDocument(lang: Lang) {
  if (typeof document !== 'undefined') document.documentElement.lang = lang
}
applyToDocument(current)

export function getLang(): Lang {
  return current
}

export function setLang(lang: Lang) {
  if (lang === current) return
  current = lang
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    // Storage unavailable: the choice still holds for this session.
  }
  applyToDocument(lang)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Keep tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === LANG_STORAGE_KEY && isLang(event.newValue) && event.newValue !== current) {
      current = event.newValue
      applyToDocument(current)
      listeners.forEach((listener) => listener())
    }
  })
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang)
}

/** Picks the current language from a `{ th, en }` pair. */
export function translate(text: Localized, lang: Lang): string {
  return text[lang]
}

/** `const t = useT(); t({ th: 'สวัสดี', en: 'Hello' })` */
export function useT(): (text: Localized) => string {
  const lang = useLang()
  return useCallback((text: Localized) => text[lang], [lang])
}

/** Shorthand for building a pair in data files: `L('สวัสดี', 'Hello')`. */
export const L = (th: string, en: string): Localized => ({ th, en })
