import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { L, useT } from '../../../i18n/language'
import { SCALE_MAX, SCALE_MIN, clampScale } from '../scoring'

interface VasInputProps {
  id?: string
  /** `undefined` = not answered yet. There is deliberately no default point. */
  value: number | undefined
  onChange: (value: number) => void
  labelledBy: string
  describedBy?: string
  minLabel?: string
  maxLabel?: string
  invalid?: boolean
}

const STEP = 1
const PAGE_STEP = 10

/**
 * Visual analogue scale (0–100): tap or click anywhere on the line to answer.
 * Point-and-click with no pre-placed marker, per Funke (2016) — drag-only sliders
 * and a default handle raise non-response and anchor answers at the start point.
 */
export function VasInput({ id, value, onChange, labelledBy, describedBy, minLabel, maxLabel, invalid = false }: VasInputProps) {
  const t = useT()
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const answered = typeof value === 'number'

  function valueFromPointer(clientX: number): number {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return 50
    return clampScale(((clientX - rect.left) / rect.width) * 100)
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== undefined && event.button !== 0) return
    dragging.current = true
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      /* capture unavailable — the click still counts */
    }
    onChange(valueFromPointer(event.clientX))
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragging.current) onChange(valueFromPointer(event.clientX))
  }

  function stopDragging() {
    dragging.current = false
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // First key press on an empty scale starts from the midpoint, then moves.
    const current = answered ? value : 50
    let next: number | null = null
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = answered ? current + STEP : current
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = answered ? current - STEP : current
        break
      case 'PageUp':
        next = current + PAGE_STEP
        break
      case 'PageDown':
        next = current - PAGE_STEP
        break
      case 'Home':
        next = SCALE_MIN
        break
      case 'End':
        next = SCALE_MAX
        break
    }
    if (next === null) return
    event.preventDefault()
    onChange(clampScale(next))
  }

  return (
    <div className="vas">
      <div
        id={id}
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-valuemin={SCALE_MIN}
        aria-valuemax={SCALE_MAX}
        aria-valuenow={answered ? value : undefined}
        aria-valuetext={answered ? t({ th: `${value} จาก 100`, en: `${value} out of 100` }) : t(L('ยังไม่ได้ตอบ', 'Not answered yet'))}
        aria-invalid={invalid || undefined}
        className={`vas-track ${answered ? 'answered' : ''} ${invalid ? 'invalid' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onKeyDown={handleKeyDown}
      >
        <span className="vas-line" aria-hidden="true">
          {answered && <span className="vas-fill" style={{ width: `${value}%` }} />}
        </span>
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} className="vas-tick" style={{ left: `${tick}%` }} aria-hidden="true" />
        ))}
        {answered && (
          <span className="vas-marker" style={{ left: `${value}%` }} aria-hidden="true">
            <span className="vas-value">{value}</span>
          </span>
        )}
      </div>
      <div className="flex justify-between gap-3 mt-2 text-[10px] font-semibold text-muted" aria-hidden="true">
        <span>{minLabel ?? t(L('ไม่ตรงกับฉันเลย', 'Not like me at all'))}</span>
        <span className="text-right">{maxLabel ?? t(L('ตรงกับฉันมาก', 'Very much like me'))}</span>
      </div>
    </div>
  )
}
