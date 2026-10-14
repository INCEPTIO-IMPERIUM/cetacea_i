import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
  id?: string
  action?: ReactNode
}

export function SectionHeading({ eyebrow, title, description, id, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 id={id} className="section-title text-[27px] sm:text-[32px] font-extrabold mt-1">
          {title}
          <span className="text-[#8b76cf]">.</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2">{description}</p>
      </div>
      {action}
    </div>
  )
}
