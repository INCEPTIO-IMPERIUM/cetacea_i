import { L, useT, type Localized } from '../../../i18n/language'
import { DIRECTIONS, workStyleFromScores, type Direction, type WorkStyleReading } from '../categories/workStyle'
import { ReviewButton } from './ReviewButton'
import type { ResultViewProps } from './resultViewTypes'

// Wider than tall so the East and West labels sit outside the ring.
const WIDTH = 360
const HEIGHT = 280
const CX = WIDTH / 2
const CY = HEIGHT / 2
const RADIUS = 104

/**
 * The circle is turned 45° so each quadrant's centre sits on a compass point:
 * Navigator (Dominance +, Warmth −) at the top, Spark on the right, Harbor at the bottom, Cartographer on the left.
 */
function toScreen(warmth: number, dominance: number, scale = RADIUS / 100) {
  const x = (warmth + dominance) * Math.SQRT1_2
  const y = (dominance - warmth) * Math.SQRT1_2
  return { x: CX + x * scale, y: CY - y * scale }
}

const directionLabels: { id: Direction; x: number; y: number; anchor: 'middle' | 'start' | 'end' }[] = [
  { id: 'navigator', x: CX, y: 14, anchor: 'middle' },
  { id: 'spark', x: CX + RADIUS + 8, y: CY + 4, anchor: 'start' },
  { id: 'harbor', x: CX, y: HEIGHT - 6, anchor: 'middle' },
  { id: 'cartographer', x: CX - RADIUS - 8, y: CY + 4, anchor: 'end' },
]

const listNames = (directions: Direction[]): Localized => ({
  th: directions.map((id) => `${DIRECTIONS[id].name.th} (${DIRECTIONS[id].english})`).join(' + '),
  en: directions.map((id) => DIRECTIONS[id].english).join(' + '),
})

function CompassDial({ reading }: { reading: WorkStyleReading }) {
  const t = useT()
  const point = toScreen(reading.warmth, reading.dominance)
  const lead = toScreen(0, 100)
  const follow = toScreen(0, -100)
  const warm = toScreen(100, 0)
  const task = toScreen(-100, 0)
  const names = listNames(reading.directions)
  const compass = DIRECTIONS[reading.directions[0]].compass
  const summary: Localized = reading.blended
    ? { th: `จุดของคุณอยู่ระหว่าง ${names.th}`, en: `Your point sits between ${names.en}` }
    : { th: `จุดของคุณอยู่ทิศ${compass.th}: ${names.th}`, en: `Your point is ${compass.en}: ${names.en}` }
  const axes: Localized = {
    th: `การนำ ${reading.dominance}, ความอบอุ่น ${reading.warmth} (จาก −100 ถึง 100)`,
    en: `leading ${reading.dominance}, warmth ${reading.warmth} (from −100 to 100)`,
  }

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-[360px] mx-auto" role="img" aria-label={`${t(summary)} · ${t(axes)}`}>
      <circle cx={CX} cy={CY} r={RADIUS} className="fill-lilac stroke-ink" strokeWidth={1.5} />
      <circle cx={CX} cy={CY} r={RADIUS * 0.1} className="fill-white/70 stroke-black/20" strokeDasharray="3 3" />
      {/* Compass cross: borders between the four directions. */}
      <line x1={CX} y1={CY - RADIUS} x2={CX} y2={CY + RADIUS} className="stroke-black/10" />
      <line x1={CX - RADIUS} y1={CY} x2={CX + RADIUS} y2={CY} className="stroke-black/10" />
      {/* The two measured axes run diagonally once the circle is turned. */}
      <line x1={follow.x} y1={follow.y} x2={lead.x} y2={lead.y} className="stroke-ink/40" strokeDasharray="4 4" />
      <line x1={task.x} y1={task.y} x2={warm.x} y2={warm.y} className="stroke-ink/40" strokeDasharray="4 4" />
      <text x={lead.x + 4} y={lead.y - 4} className="fill-muted text-[9px]">{t(L('นำ', 'Lead'))}</text>
      <text x={follow.x - 4} y={follow.y + 11} textAnchor="end" className="fill-muted text-[9px]">{t(L('ตาม', 'Follow'))}</text>
      <text x={warm.x + 4} y={warm.y + 11} className="fill-muted text-[9px]">{t(L('อบอุ่น', 'Warm'))}</text>
      <text x={task.x - 4} y={task.y - 4} textAnchor="end" className="fill-muted text-[9px]">{t(L('เน้นงาน', 'Task-first'))}</text>
      {directionLabels.map(({ id, x, y, anchor }) => (
        <text key={id} x={x} y={y} textAnchor={anchor} className={`text-[10px] ${reading.directions.includes(id) ? 'fill-ink font-bold' : 'fill-muted'}`}>
          {DIRECTIONS[id].icon} {t(DIRECTIONS[id].name)}
        </text>
      ))}
      <line x1={CX} y1={CY} x2={point.x} y2={point.y} className="stroke-ink" strokeWidth={2} />
      <circle cx={point.x} cy={point.y} r={8} className="fill-lemon stroke-ink" strokeWidth={2} />
    </svg>
  )
}

/** Category 03 result: the user's point on the turned circumplex, read as compass directions. */
export function WorkStyleResult({ result, onReview }: ResultViewProps) {
  const t = useT()
  const reading = workStyleFromScores(result.scores)
  if (!reading) return null
  const first = DIRECTIONS[reading.directions[0]]
  const heading: Localized =
    reading.directions.length === 4
      ? L('คุณผสมทั้งสี่ทิศได้อย่างสมดุล', 'You blend all four directions')
      : reading.blended
        ? { th: `คุณอยู่ระหว่าง ${reading.directions.map((id) => DIRECTIONS[id].name.th).join(' กับ ')}`, en: `You sit between ${reading.directions.map((id) => DIRECTIONS[id].name.en).join(' and ')}` }
        : { th: `ทิศหลักของคุณ: ${first.name.th}`, en: `Your main direction: ${first.name.en}` }

  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-mint p-5 sm:p-6">
        <div className="eyebrow text-black/60">{t(L('หมวด 03 · เข็มทิศการทำงาน', 'Section 03 · Work Style Compass'))}</div>
        <h3 className="section-title text-2xl font-extrabold mt-1">{t(heading)}</h3>
        <p className="text-xs text-black/65 mt-2 max-w-2xl">
          {t(
            L(
              'คนส่วนใหญ่ผสมหลายทิศ และขยับไปตามสถานการณ์และคนที่ทำงานด้วย ทิศหลักคือจุดที่คุณมักเริ่มต้น ไม่ใช่ขอบเขตของคุณ',
              'Most people blend several directions and shift with the situation and the people around them. Your main direction is where you tend to start, not a limit.',
            ),
          )}
        </p>
      </div>
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-6 items-center">
        <CompassDial reading={reading} />
        <div className="space-y-3">
          {(Object.keys(DIRECTIONS) as Direction[]).map((id) => {
            const direction = DIRECTIONS[id]
            const active = reading.directions.includes(id)
            return (
              <div key={id} className={`rounded-xl p-3 text-[11px] leading-relaxed ${active ? 'bg-lemon-soft border border-ink' : 'border border-black/10'}`}>
                <div className="font-bold text-xs">
                  <span aria-hidden="true">{direction.icon}</span> {t(direction.compass)} — {t({ th: `${direction.name.th} (${direction.english})`, en: direction.english })}
                  {active && <span className="sr-only">{t(L(' (ทิศของคุณ)', ' (your direction)'))}</span>}
                </div>
                <div className="text-muted mt-0.5">{t(direction.quadrant)}</div>
                <p className="mt-1">{t(direction.description)}</p>
              </div>
            )
          })}
          <p className="text-[11px] text-muted">
            {t({
              th: `ความชัดของทิศ ${reading.intensity} / 100 — ยิ่งใกล้ศูนย์กลาง ยิ่งปรับตัวได้หลายแบบ`,
              en: `Direction strength ${reading.intensity} / 100 — the closer to the centre, the more ways you adapt.`,
            })}
          </p>
        </div>
      </div>
      <p className="border-t border-black/10 px-5 sm:px-6 py-4 text-[10px] leading-relaxed text-muted">
        {t(
          L(
            'ข้อคำถามจาก IPIP-IPC (Markey & Markey, 2009) ซึ่งเป็น public domain — ipip.ori.org · วัดสองแกนคือการนำ (Dominance) กับความอบอุ่น (Warmth) การแบ่งวงกลมเป็นสี่ทิศและชื่อตัวละครเป็นการตีความของ Who Am I? เอง ไม่ใช่ส่วนหนึ่งของเครื่องมือ · แบบสำรวจนี้ใช้เพื่อการรู้จักตัวเอง ไม่ใช่การวินิจฉัย',
            'Items from the IPIP-IPC (Markey & Markey, 2009), public domain — ipip.ori.org · It measures two axes, dominance and warmth. Splitting the circle into four directions and naming the characters is Who Am I?’s own interpretation, not part of the instrument · A self-discovery survey, not a diagnosis.',
          ),
        )}
      </p>
      {onReview && (
        <div className="px-5 sm:px-6 pb-5">
          <ReviewButton onReview={onReview} />
        </div>
      )}
    </div>
  )
}
