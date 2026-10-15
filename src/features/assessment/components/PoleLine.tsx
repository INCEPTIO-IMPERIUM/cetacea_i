interface PoleLineProps {
  /** 0 (low end) – 100 (high end). */
  position: number
  lowLabel: string
  highLabel: string
  /** Text read out for the marker, e.g. "62 จาก 100". */
  valueText: string
  /** Shades the 45–55 band where a reading counts as balanced. */
  showBalancedBand?: boolean
}

/** A line between two ends with a marker — neither end is drawn as better. */
export function PoleLine({ position, lowLabel, highLabel, valueText, showBalancedBand = false }: PoleLineProps) {
  return (
    <div>
      <div className="relative h-2.5 rounded-full bg-lilac" role="img" aria-label={`${lowLabel} ↔ ${highLabel}: ${valueText}`}>
        {showBalancedBand && <span className="absolute inset-y-0 left-[45%] w-[10%] bg-lavender/60" aria-hidden="true" />}
        <span className="absolute inset-y-0 left-1/2 w-px bg-black/20" aria-hidden="true" />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-lemon shadow-[0_2px_0_#171717]"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-[10px] text-muted" aria-hidden="true">
        <span>{lowLabel}</span>
        <span className="text-right">{highLabel}</span>
      </div>
    </div>
  )
}
