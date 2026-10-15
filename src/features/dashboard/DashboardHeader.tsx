import type { RefObject } from 'react'
import { Bell, Menu, NotebookPen, Search } from 'lucide-react'
import { L, useLang, useT, type Lang } from '../../i18n/language'
import { LanguageToggle } from '../../i18n/LanguageToggle'

interface DashboardHeaderProps {
  searchRef: RefObject<HTMLInputElement | null>
  onOpenMenu: () => void
  onSearch: (query: string) => void
  onReflect: () => void
  onNotifications: () => void
}

const dateLabel = (lang: Lang) =>
  (lang === 'th' ? 'พื้นที่ของคุณ · ' : 'YOUR SPACE · ') +
  new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date()).toUpperCase()

export function DashboardHeader({ searchRef, onOpenMenu, onSearch, onReflect, onNotifications }: DashboardHeaderProps) {
  const t = useT()
  const lang = useLang()
  const today = dateLabel(lang)

  return (
    <header className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-paper/90 backdrop-blur-xl border-b border-black/5">
      <div className="h-[76px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMenu}
            className="lg:hidden grid place-items-center w-10 h-10 rounded-xl bg-white border border-black/10"
            aria-label={t(L('เปิดเมนู', 'Open navigation'))}
            aria-controls="sidebar"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <div className="eyebrow mb-1">{today}</div>
            <div className="font-semibold text-sm sm:text-base truncate">{t(L('เป็นตัวเองมากขึ้นอีกนิด ทุกวัน', 'A little more you, every day.'))}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <label className="hidden md:flex items-center gap-2 rounded-full bg-white border border-black/10 px-3.5 py-2.5 w-[220px] focus-within:border-black/50 transition-colors">
            <Search size={24} className="text-muted" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              placeholder={t(L('ค้นหาอาชีพ ทักษะ...', 'Search careers, skills...'))}
              className="min-w-0 w-full outline-none bg-transparent text-xs"
              aria-label={t(L('ค้นหาอาชีพและทักษะ (กด Enter)', 'Search careers and skills (press Enter)'))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onSearch(event.currentTarget.value.trim().toLocaleLowerCase())
              }}
            />
            <kbd className="text-[9px] text-muted bg-paper border border-black/10 rounded px-1">/</kbd>
          </label>
          <button
            type="button"
            onClick={onReflect}
            className="hidden sm:flex items-center gap-2 rounded-full bg-ink text-white px-4 py-2.5 text-xs font-semibold hover:bg-black/80 transition"
          >
            <NotebookPen size={24} aria-hidden="true" /> {t(L('สะท้อนคิดสั้น ๆ', 'Quick reflection'))}
          </button>
          <button
            type="button"
            onClick={onNotifications}
            className="relative grid place-items-center w-10 h-10 rounded-full border border-black/10 bg-white hover:bg-lemon transition"
            aria-label={t(L('การแจ้งเตือน', 'Notifications'))}
          >
            <Bell size={24} aria-hidden="true" />
            <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-[#ef7657] border border-white" />
          </button>
        </div>
      </div>
    </header>
  )
}
