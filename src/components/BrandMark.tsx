import { Link } from 'react-router'
import { L, useT } from '../i18n/language'

interface BrandMarkProps {
  to?: string
  tagline?: string
  ariaLabel?: string
  /** `landing` is the larger mark on the home page; `app` is the compact one in the form and dashboard. */
  variant?: 'landing' | 'app'
}

/** Logo tile + wordmark used in every page header. */
export function BrandMark({ to = '/', tagline: taglineProp, ariaLabel: ariaLabelProp, variant = 'landing' }: BrandMarkProps) {
  const t = useT()
  const tagline = taglineProp ?? t(L('เข็มทิศส่วนตัวของคุณ', 'YOUR PERSONAL COMPASS'))
  const ariaLabel = ariaLabelProp ?? t(L('หน้าแรก Who Am I', 'Who Am I home'))
  if (variant === 'app') {
    return (
      <Link to={to} className="flex items-center gap-3" aria-label={ariaLabel}>
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-lemon border-[1.5px] border-ink shadow-[0_3px_0_#171717]">
          <svg width="27" height="27" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 7c-7.4 0-12 5.3-12 13.1v5.2c0 3.9 2.6 6.2 6.2 6.2h11.6c3.6 0 6.2-2.3 6.2-6.2v-5.2C32 12.3 27.4 7 20 7Z" fill="#FFF66B" stroke="#171717" strokeWidth="1.8" />
            <path d="M16 3c-2.8-2.5-5 .2-2.2 3.4M23 6c-.3-3.2 3.1-5.2 4.8-2.2" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M14.5 19h.1m10.8 0h.1" stroke="#171717" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M15.5 23.5c2.7 3.2 6.8 3.2 9.2 0" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <span>
          <span className="block section-title text-[19px] font-extrabold leading-tight">Who Am I?</span>
          {/* Hidden on phones rather than shrunk below the 14px floor. */}
          <span className="hidden sm:block text-ui text-muted tracking-wide">{tagline}</span>
        </span>
      </Link>
    )
  }

  return (
    <Link to={to} className="flex items-center gap-3 shrink-0" aria-label={ariaLabel}>
      <span className="grid place-items-center w-11 h-11 rounded-2xl bg-lemon border-[1.5px] border-ink shadow-[0_3px_0_#171717]">
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M20 8C12.7 8 8 13.1 8 20.8v5c0 3.9 2.7 6.2 6.2 6.2h11.6c3.5 0 6.2-2.3 6.2-6.2v-5C32 13.1 27.3 8 20 8Z" fill="#FFF66B" stroke="#171717" strokeWidth="1.8" />
          <path d="M16 5c-3-3-5 0-2 3M23 7c0-4 4-5 5-2" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14.5 20h.1m10.8 0h.1" stroke="#171717" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M15.5 24.2c2.8 3.2 6.4 3.2 9.2 0" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span>
        <span className="block display text-lg font-extrabold leading-tight">Who Am I?</span>
        <span className="block text-ui text-muted tracking-[.14em] font-bold">{tagline}</span>
      </span>
    </Link>
  )
}
