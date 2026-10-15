import { L, useT } from '../../../i18n/language'
import { RIASEC_TYPES, readInterests, riasecCopy, toRiasecProfile, type RiasecProfile, type RiasecType } from '../categories/careerInterest'
import { ReviewButton } from './ReviewButton'
import type { ResultViewProps } from './resultViewTypes'

const SIZE = 300
const CENTER = SIZE / 2
const RADIUS = 104

/** Holland's hexagon: R at the top, then I, A, S, E, C clockwise. */
function vertex(index: number, value = 100) {
  const angle = -Math.PI / 2 + (index * Math.PI) / 3
  const r = (RADIUS * value) / 100
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) }
}

const points = (values: number[]) =>
  values
    .map((value, index) => vertex(index, value))
    .map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')

function Hexagon({ profile, top }: { profile: RiasecProfile; top: string[] }) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[300px] mx-auto" aria-hidden="true">
      {[25, 50, 75, 100].map((ring) => (
        <polygon key={ring} points={points(RIASEC_TYPES.map(() => ring))} className={ring === 100 ? 'fill-lilac stroke-ink' : 'fill-none stroke-black/10'} strokeWidth={ring === 100 ? 1.5 : 1} />
      ))}
      {RIASEC_TYPES.map((type, index) => {
        const end = vertex(index)
        return <line key={type} x1={CENTER} y1={CENTER} x2={end.x} y2={end.y} className="stroke-black/10" />
      })}
      <polygon points={points(RIASEC_TYPES.map((type) => profile[type]))} className="fill-lemon/80 stroke-ink" strokeWidth={2} strokeLinejoin="round" />
      {RIASEC_TYPES.map((type, index) => {
        const label = vertex(index, 122)
        const highlighted = top.includes(type)
        return (
          <text key={type} x={label.x} y={label.y + 4} textAnchor="middle" className={`text-[11px] ${highlighted ? 'fill-ink font-bold' : 'fill-muted'}`}>
            {type} · {profile[type]}
          </text>
        )
      })}
    </svg>
  )
}

/** Category 04 result: the six-type hexagon, the Holland code (or "not clear yet"), and what each type looks like. */
export function CareerInterestResult({ result, onReview }: ResultViewProps) {
  const t = useT()
  const profile = toRiasecProfile(result.scores)
  if (!profile) return null
  const reading = readInterests(profile)
  const typeName = (type: RiasecType) => t({ th: `${riasecCopy[type].name.th} (${riasecCopy[type].english})`, en: `${riasecCopy[type].english} — ${riasecCopy[type].name.en}` })

  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-peach p-5 sm:p-6">
        <div className="eyebrow text-black/60">{t(L('หมวด 04 · สำรวจความสนใจด้านอาชีพ', 'Section 04 · Career Interest Explorer'))}</div>
        {reading.flat ? (
          <>
            <h3 className="section-title text-2xl font-extrabold mt-1">{t(L('ความสนใจของคุณยังไม่ชัด — และนั่นไม่เป็นไรเลย', 'Your interests are not clear yet — and that is fine'))}</h3>
            <p className="text-xs text-black/65 mt-2 max-w-2xl">
              {t({
                th: `คะแนนทั้ง 6 แบบใกล้กันมาก (ห่างกันแค่ ${reading.spread} คะแนน) ลองทำ Micro-Action เล็ก ๆ ในแบบที่ไม่เคยลอง แล้วกลับมาตอบใหม่ จะช่วยให้เห็นทิศทางชัดขึ้น`,
                en: `All six scores are very close (only ${reading.spread} points apart). Try a small Micro-Action in an area you have not explored, then answer again to see a clearer direction.`,
              })}
            </p>
          </>
        ) : (
          <>
            <h3 className="section-title text-2xl font-extrabold mt-1">
              {t(L('Holland Code ของคุณ: ', 'Your Holland code: '))}
              <span className="tracking-[.12em]">{reading.hollandCode}</span>
            </h3>
            <p className="text-xs text-black/65 mt-2 max-w-2xl">
              {t({
                th: `สามแบบที่คุณสนใจมากที่สุดคือ ${reading.top.map((type) => riasecCopy[type].name.th).join(' · ')} ความสนใจช่วยชี้ทางว่าควรลองสำรวจอะไร ไม่ได้ทำนายว่าคุณจะประสบความสำเร็จแค่ไหน`,
                en: `Your three strongest interests are ${reading.top.map((type) => riasecCopy[type].english).join(' · ')}. Interests point to what is worth exploring; they do not predict how successful you will be.`,
              })}
            </p>
          </>
        )}
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-[minmax(0,300px)_1fr] gap-6 items-start">
        <div>
          <Hexagon profile={profile} top={reading.flat ? [] : reading.top} />
          <table className="sr-only">
            <caption>{t(L('คะแนนความสนใจทั้ง 6 แบบ (0–100)', 'Interest scores for all six types (0–100)'))}</caption>
            <thead>
              <tr>
                <th scope="col">{t(L('แบบ', 'Type'))}</th>
                <th scope="col">{t(L('คะแนน', 'Score'))}</th>
              </tr>
            </thead>
            <tbody>
              {RIASEC_TYPES.map((type) => (
                <tr key={type}>
                  <th scope="row">{typeName(type)}</th>
                  <td>{profile[type]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="space-y-2">
          {result.ranking.map((key) => {
            const type = key as RiasecType
            const copy = riasecCopy[type]
            const isTop = !reading.flat && reading.top.includes(type)
            return (
              <li key={type} className={`rounded-xl p-3 text-[11px] leading-relaxed ${isTop ? 'bg-lemon-soft border border-ink' : 'border border-black/10'}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-bold text-xs">
                    {type} — {typeName(type)}
                  </span>
                  <span className="section-title font-extrabold">{profile[type]}</span>
                </div>
                <p className="mt-1">{t(copy.description)}</p>
                <p className="text-muted mt-0.5">
                  {t(L('ตัวอย่างสาขาที่น่าสำรวจ: ', 'Fields worth exploring: '))}
                  {t(copy.examples)}
                </p>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="border-t border-black/10 px-5 sm:px-6 py-4 text-[10px] leading-relaxed text-muted">
        {t(
          L(
            'กรอบแนวคิด Holland RIASEC (Holland, 1997) · รูปแบบแบบสำรวจ 8 กิจกรรมต่อแบบอ้างอิง Armstrong, Allison & Rounds (2008) ส่วนข้อกิจกรรมทั้งหมดเขียนขึ้นใหม่โดย Who Am I? และยังอยู่ระหว่างตรวจสอบคุณภาพ · ความสนใจที่ตรงกับงานสัมพันธ์กับผลงานและความพึงพอใจในระดับเล็กถึงปานกลาง จึงใช้เพื่อชี้ทาง ไม่ใช่ทำนายอนาคต',
            'Holland RIASEC framework (Holland, 1997) · The eight-activities-per-type design follows Armstrong, Allison & Rounds (2008); every activity was written anew by Who Am I? and is still being quality-checked · Interest fit relates to performance and satisfaction at a small-to-moderate level, so use it to point the way, not to predict the future.',
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
