import { L, useT } from '../../../i18n/language'
import { BIG_FIVE_DIMENSIONS, bigFiveCopy } from '../categories/bigFive'
import { PoleLine } from './PoleLine'
import type { ResultViewProps } from './resultViewTypes'

/** Category 02 result: each Big Five dimension on a 0–100 line with both ends described. */
export function PersonalitySpectrumResult({ result }: Pick<ResultViewProps, 'result'>) {
  const t = useT()
  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-lilac p-5 sm:p-6">
        <div className="eyebrow text-black/60">{t(L('หมวด 02 · สเปกตรัมบุคลิกภาพ', 'Section 02 · Personality Spectrum'))}</div>
        <h3 className="section-title text-2xl font-extrabold mt-1">{t(L('บุคลิกภาพ 5 มิติของคุณ', 'Your five personality dimensions'))}</h3>
        <p className="text-read text-black/65 mt-2 max-w-2xl">
          {t(
            L(
              'คะแนน 0–100 แสดงว่าคุณอยู่ตรงไหนระหว่างสองด้านของแต่ละมิติ ทั้งสองด้านมีจุดแข็งของตัวเอง ไม่มีด้านไหนดีกว่า และนี่ไม่ใช่การเทียบกับคนอื่น',
              'Each 0–100 score shows where you sit between the two ends of a dimension. Both ends have their own strengths — neither is better — and this is not a comparison with other people.',
            ),
          )}
        </p>
      </div>
      <ul className="p-5 sm:p-6 space-y-6">
        {BIG_FIVE_DIMENSIONS.map((dimension) => {
          const score = result.scores[dimension]
          if (typeof score !== 'number') return null
          const copy = bigFiveCopy[dimension]
          return (
            <li key={dimension}>
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-bold text-read">{t(copy.label)}</h4>
                <span className="section-title font-extrabold">{score}</span>
              </div>
              <div className="mt-3">
                <PoleLine position={score} lowLabel={t(copy.low)} highLabel={t(copy.high)} valueText={t({ th: `${score} จาก 100`, en: `${score} out of 100` })} />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="border-t border-black/10 px-5 sm:px-6 py-4 text-read text-muted">
        {t(
          L(
            'ข้อคำถามจาก IPIP 50-item Big-Five Factor Markers (Goldberg, 1992) ซึ่งเป็น public domain — ipip.ori.org · แบบสำรวจนี้ใช้เพื่อการรู้จักตัวเอง ไม่ใช่การวินิจฉัยสุขภาพจิต และยังไม่มีเกณฑ์เทียบกับผู้ใช้ชาวไทย',
            'Items from the IPIP 50-item Big-Five Factor Markers (Goldberg, 1992), public domain — ipip.ori.org · A self-discovery survey, not a mental-health diagnosis; there are no Thai norms yet.',
          ),
        )}
      </p>
    </div>
  )
}
