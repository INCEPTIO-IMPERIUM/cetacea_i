interface MascotProps {
  className?: string
  /** Adds the lavender sparkles used on the dashboard hero. */
  sparkles?: boolean
}

/** The yellow compass companion. Decorative — callers decide whether it is announced. */
export function Mascot({ className, sparkles = false }: MascotProps) {
  return (
    <svg viewBox="0 0 220 250" fill="none" className={className} aria-hidden="true">
      <ellipse cx="111" cy="225" rx="63" ry="9" fill="#171717" />
      <path d="M82 190v23c0 10 24 13 24 0v-23M122 190v23c0 10 24 13 24 0v-23" fill="#FFF66B" stroke="#171717" strokeWidth="5" strokeLinecap="round" />
      <path d="M99 28c-13-19-28-6-13 7M119 31c3-19 23-20 19-5-2 6-7 8-12 10" stroke="#171717" strokeWidth="5" strokeLinecap="round" />
      <path d="M109 35c-48 0-68 32-68 79v47c0 34 21 52 52 52h53c32 0 53-18 53-52v-47c0-47-20-79-68-79h-22Z" fill="#FFF66B" stroke="#171717" strokeWidth="5" strokeLinejoin="round" />
      <path d="M67 94c-13 22-22 48-25 67-2 11 6 17 13 9l25-43M178 94c13 22 22 48 25 67 2 11-6 17-13 9l-25-43" fill="#FFF66B" stroke="#171717" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M83 94h12m33 0h12" stroke="#171717" strokeWidth="4" strokeLinecap="round" />
      <path d="M91 125c10 12 25 12 36 0" stroke="#171717" strokeWidth="5" strokeLinecap="round" />
      <circle cx="74" cy="132" r="5" fill="#E8B4A9" />
      <circle cx="164" cy="132" r="5" fill="#E8B4A9" />
      {sparkles && (
        <>
          <path d="M27 73l5 11 11 5-11 5-5 11-5-11-11-5 11-5 5-11Z" fill="#C9B2FF" stroke="#171717" strokeWidth="2" className="sparkle" />
          <path d="M191 33l4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8Z" fill="#C9B2FF" stroke="#171717" strokeWidth="2" className="sparkle" />
        </>
      )}
    </svg>
  )
}
