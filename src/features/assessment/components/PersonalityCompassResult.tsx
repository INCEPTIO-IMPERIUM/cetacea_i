import { Compass } from 'lucide-react'
import { L, useT } from '../../../i18n/language'
import type { BigFiveScores } from '../categories/bigFive'
import { personalityCompass } from '../categories/personalityCompass'
import { PoleLine } from './PoleLine'

/** Category 01 result: five two-pole sides as a lean in %, read from the Big Five scores. */
export function PersonalityCompassResult({ scores }: { scores: BigFiveScores }) {
  const t = useT()
  const readings = personalityCompass(scores)
  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-lemon p-5 sm:p-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="eyebrow text-black/60">{t(L('หมวด 01 · เข็มทิศบุคลิกภาพ', 'Section 01 · Personality Compass'))}</div>
          <h3 className="section-title text-2xl font-extrabold mt-1">{t(L('แนวโน้มของคุณใน 5 ด้าน', 'Your tendencies on five sides'))}</h3>
          <p className="text-read text-black/65 mt-2 max-w-2xl">
            {t(
              L(
                'แต่ละด้านเป็นเส้นต่อเนื่องระหว่างสองขั้ว คุณอยู่ตรงไหนก็ได้บนเส้นนั้น และอาจขยับไปตามสถานการณ์ นี่คือแนวโน้ม ไม่ใช่ประเภทหรือป้ายที่ติดตัว',
                'Each side is a continuous line between two poles. You can sit anywhere on it, and you may move with the situation. These are tendencies, not types or labels.',
              ),
            )}
          </p>
        </div>
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/70" aria-hidden="true">
          <Compass size={24} />
        </span>
      </div>
      <ul className="p-5 sm:p-6 space-y-6">
        {readings.map((reading) => (
          <li key={reading.side.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="font-bold text-read">{t(reading.side.label)}</h4>
              <span className={`rounded-full px-2.5 py-1 text-ui font-bold ${reading.balanced ? 'bg-mint' : 'bg-lilac'}`}>{t(reading.text)}</span>
            </div>
            <div className="mt-3">
              <PoleLine position={reading.position} lowLabel={t(reading.side.lowPole)} highLabel={t(reading.side.highPole)} valueText={t(reading.text)} showBalancedBand />
            </div>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-read leading-relaxed">
              <div className={`rounded-xl p-3 ${reading.leansTo === 'low' ? 'bg-paper' : 'bg-white border border-black/10'}`}>
                <dt className="font-semibold">{t(reading.side.lowPole)}</dt>
                <dd className="text-muted mt-0.5">{t(reading.side.lowDescription)}</dd>
              </div>
              <div className={`rounded-xl p-3 ${reading.leansTo === 'high' ? 'bg-paper' : 'bg-white border border-black/10'}`}>
                <dt className="font-semibold">{t(reading.side.highPole)}</dt>
                <dd className="text-muted mt-0.5">{t(reading.side.highDescription)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <p className="border-t border-black/10 px-5 sm:px-6 py-4 text-read text-muted">
        {t(
          L(
            'คำนวณจากคำตอบ Big Five ในหมวด 02 (IPIP, public domain) โดยไม่มีคำถามเพิ่ม ช่วง 45–55 ถือว่าสมดุล / ยืดหยุ่น · อ้างอิง McCrae & Costa (1989) ที่พบว่าบุคลิกภาพเป็นแนวโน้มต่อเนื่องมากกว่าการแบ่งเป็นประเภท',
            'Calculated from your Big Five answers in section 02 (IPIP, public domain) with no extra questions. 45–55 counts as balanced / flexible · Based on McCrae & Costa (1989), who found personality is a continuum rather than distinct types.',
          ),
        )}
      </p>
    </div>
  )
}
