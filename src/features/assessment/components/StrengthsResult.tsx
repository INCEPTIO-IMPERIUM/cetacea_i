import { Link } from 'react-router'
import { Check, Plus } from 'lucide-react'
import { useToast } from '../../../components/toastContext'
import { toExperiment } from '../../../data/dashboard'
import { hasExperiment } from '../../../data/experimentText'
import { L, useLang, useT } from '../../../i18n/language'
import { actions, getCategoryRecord, useWhoAmI } from '../../../store/whoAmIStore'
import { RIASEC_TYPES, riasecCopy, toRiasecProfile, type RiasecType } from '../categories/careerInterest'
import { GROWTH_ACTIONS, QUADRANTS, strengthsMap, type Quadrant } from '../categories/strengths'
import { ReviewButton } from './ReviewButton'
import type { ResultViewProps } from './resultViewTypes'

const QUADRANT_ORDER: Quadrant[] = ['love', 'grow', 'able', 'explore']
const quadrantTone: Record<Quadrant, string> = { love: 'bg-lemon-soft', grow: 'bg-mint', able: 'bg-lilac', explore: 'bg-paper' }

/** Category 05 result: confidence per area and, once Category 04 is done, the 2 × 2 strengths map. */
export function StrengthsResult({ result, onReview }: ResultViewProps) {
  const t = useT()
  const lang = useLang()
  const state = useWhoAmI()
  const showToast = useToast()
  const confidence = toRiasecProfile(result.scores)
  const interest = toRiasecProfile(getCategoryRecord(state, 'careerInterest').result?.scores)
  if (!confidence) return null
  const placements = interest ? strengthsMap(interest, confidence) : null
  const typeName = (type: RiasecType) => t({ th: `${riasecCopy[type].name.th} (${riasecCopy[type].english})`, en: riasecCopy[type].english })

  function addExperiment(type: RiasecType) {
    actions.addExperiment(toExperiment(GROWTH_ACTIONS[type], lang))
    showToast(t(L('เพิ่มการทดลองใน Micro-Actions บน Dashboard แล้ว', 'Added to Micro-Actions on your dashboard.')))
  }

  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-mint p-5 sm:p-6">
        <div className="eyebrow text-black/60">{t(L('หมวด 05 · จุดแข็งและศักยภาพ', 'Section 05 · Strengths & Potential'))}</div>
        <h3 className="section-title text-2xl font-extrabold mt-1">{t(L('แผนที่จุดแข็งและศักยภาพของคุณ', 'Your map of strengths and potential'))}</h3>
        <p className="text-read text-black/65 mt-2 max-w-2xl">
          {t(
            L(
              'แต่ละด้านถูกเทียบกับค่าเฉลี่ยของตัวคุณเอง ไม่ได้เทียบกับคนอื่น ความมั่นใจเปลี่ยนได้เสมอ ยิ่งได้ลองทำสำเร็จทีละขั้น ความมั่นใจก็ยิ่งเพิ่มขึ้น',
              'Each area is compared with your own average, not with other people. Confidence can always change — every small success adds to it.',
            ),
          )}
        </p>
      </div>

      {placements ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUADRANT_ORDER.map((quadrant) => {
            const copy = QUADRANTS[quadrant]
            const items = placements.filter((placement) => placement.quadrant === quadrant)
            return (
              <section key={quadrant} className={`rounded-2xl p-4 ${quadrantTone[quadrant]}`} aria-labelledby={`quadrant-${quadrant}`}>
                <h4 id={`quadrant-${quadrant}`} className="font-bold text-read">
                  <span aria-hidden="true">{copy.icon}</span> {t(copy.title)}
                </h4>
                <p className="text-read text-black/60 mt-1">{t(copy.hint)}</p>
                {items.length === 0 ? (
                  <p className="text-ui text-muted mt-3">{t(L('ยังไม่มีด้านไหนอยู่ช่องนี้', 'No areas here yet.'))}</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {items.map(({ type, interest: interestScore, confidence: confidenceScore }) => {
                      const action = GROWTH_ACTIONS[type]
                      const added = hasExperiment(state.experiments, action.key)
                      return (
                        <li key={type} className="rounded-xl bg-white/80 p-3 text-read">
                          <div className="font-bold text-read">
                            {type} — {typeName(type)}
                          </div>
                          <div className="text-muted mt-0.5">
                            {t({ th: `ความสนใจ ${interestScore} · ความมั่นใจ ${confidenceScore}`, en: `Interest ${interestScore} · confidence ${confidenceScore}` })}
                          </div>
                          {quadrant === 'grow' && (
                            <div className="mt-2 border-t border-black/10 pt-2">
                              <div className="font-semibold">{t(action.title)}</div>
                              <p className="text-muted mt-0.5">{t(action.description)}</p>
                              <button
                                type="button"
                                onClick={() => addExperiment(type)}
                                disabled={added}
                                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-3.5 py-2 text-ui font-bold hover:bg-black/80 disabled:bg-white disabled:text-ink disabled:border disabled:border-black/15 disabled:cursor-default"
                              >
                                {added ? <Check size={24} className="w-3.5 h-3.5" aria-hidden="true" /> : <Plus size={24} className="w-3.5 h-3.5" aria-hidden="true" />}
                                {t(added ? L('เพิ่มแล้ว', 'Added') : L('เพิ่มเป็นการทดลอง', 'Add as an experiment'))}
                              </button>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          <ul className="space-y-3">
            {RIASEC_TYPES.map((type) => (
              <li key={type} className="grid grid-cols-[minmax(130px,.7fr)_1fr_36px] items-center gap-3 text-ui">
                <span className="font-semibold">
                  {type} — {typeName(type)}
                </span>
                <span className="meter" aria-hidden="true">
                  <span style={{ width: `${confidence[type]}%` }} />
                </span>
                <span className="font-bold text-right">{confidence[type]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-paper p-3 text-read">
            {t(
              L(
                'ทำหมวด 04 สำรวจความสนใจด้านอาชีพให้เสร็จ แล้วเราจะรวมความสนใจกับความมั่นใจเป็นแผนที่จุดแข็งให้ ',
                'Finish section 04, Career Interest Explorer, and we will combine your interests and confidence into a strengths map. ',
              ),
            )}
            <Link to="/assessment?step=careerInterest&page=1" className="font-bold underline underline-offset-4">
              {t(L('ไปทำหมวด 04', 'Go to section 04'))}
            </Link>
          </p>
        </div>
      )}

      <p className="border-t border-black/10 px-5 sm:px-6 py-4 text-read text-muted">
        {t(
          L(
            'ความมั่นใจในความสามารถ (self-efficacy) ตามแนวคิดของ Bandura (1977) บนกรอบ Holland RIASEC · ข้อคำถามเขียนขึ้นใหม่โดย Who Am I? และยังอยู่ระหว่างตรวจสอบคุณภาพ · ความสนใจกับความมั่นใจเป็นคนละเรื่องที่สัมพันธ์กันปานกลาง จึงวัดทั้งสองอย่าง',
            'Self-efficacy as described by Bandura (1977), on Holland’s RIASEC framework · Items written anew by Who Am I? and still being quality-checked · Interest and confidence are different things that are only moderately related, so we measure both.',
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
