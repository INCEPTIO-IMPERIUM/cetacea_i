import { LANGS, setLang, useLang } from './language'

const labels = { th: { short: 'TH', name: 'ภาษาไทย' }, en: { short: 'EN', name: 'English' } }

/** TH | EN switch shown in every page header. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const lang = useLang()
  return (
    <div role="group" aria-label={lang === 'th' ? 'เลือกภาษา' : 'Choose language'} className={`inline-flex items-center rounded-full border border-black/15 bg-white p-0.5 ${className}`}>
      {LANGS.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={lang === option}
          aria-label={labels[option].name}
          onClick={() => setLang(option)}
          className={`rounded-full px-2.5 py-1.5 text-ui font-bold transition ${lang === option ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
        >
          {labels[option].short}
        </button>
      ))}
    </div>
  )
}
