import { Link } from 'react-router'
import { Check, Plus } from 'lucide-react'
import { useToast } from '../../../components/toastContext'
import { actions, getCategoryRecord, useWhoAmI } from '../../../store/whoAmIStore'
import { RIASEC_TYPES, riasecCopy, toRiasecProfile } from '../categories/careerInterest'
import { GROWTH_ACTIONS, QUADRANTS, strengthsMap, type Quadrant } from '../categories/strengths'
import type { ResultViewProps } from './resultViewTypes'

const QUADRANT_ORDER: Quadrant[] = ['love', 'grow', 'able', 'explore']
const quadrantTone: Record<Quadrant, string> = { love: 'bg-lemon-soft', grow: 'bg-mint', able: 'bg-lilac', explore: 'bg-paper' }

/** Category 05 result: confidence per area and, once Category 04 is done, the 2 × 2 strengths map. */
export function StrengthsResult({ result, onReview }: ResultViewProps) {
  const state = useWhoAmI()
  const showToast = useToast()
  const confidence = toRiasecProfile(result.scores)
  const interest = toRiasecProfile(getCategoryRecord(state, 'careerInterest').result?.scores)
  if (!confidence) return null
  const placements = interest ? strengthsMap(interest, confidence) : null

  function addExperiment(type: keyof typeof GROWTH_ACTIONS) {
    actions.addExperiment(GROWTH_ACTIONS[type])
    showToast('เพิ่มการทดลองใน Micro-Actions บน Dashboard แล้ว')
  }

  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-mint p-5 sm:p-6">
        <div className="eyebrow text-black/60">Section 05 · Strengths &amp; Potential</div>
        <h3 className="section-title text-2xl font-extrabold mt-1">แผนที่จุดแข็งและศักยภาพของคุณ</h3>
        <p className="text-xs text-black/65 mt-2 max-w-2xl">
          แต่ละด้านถูกเทียบกับค่าเฉลี่ยของตัวคุณเอง ไม่ได้เทียบกับคนอื่น ความมั่นใจเปลี่ยนได้เสมอ ยิ่งได้ลองทำสำเร็จทีละขั้น ความมั่นใจก็ยิ่งเพิ่มขึ้น
        </p>
      </div>

      {placements ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUADRANT_ORDER.map((quadrant) => {
            const copy = QUADRANTS[quadrant]
            const items = placements.filter((placement) => placement.quadrant === quadrant)
            return (
              <section key={quadrant} className={`rounded-2xl p-4 ${quadrantTone[quadrant]}`} aria-labelledby={`quadrant-${quadrant}`}>
                <h4 id={`quadrant-${quadrant}`} className="font-bold text-sm">
                  <span aria-hidden="true">{copy.icon}</span> {copy.title}
                </h4>
                <p className="text-[11px] text-black/60 mt-1">{copy.hint}</p>
                {items.length === 0 ? (
                  <p className="text-[11px] text-muted mt-3">ยังไม่มีด้านไหนอยู่ช่องนี้</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {items.map(({ type, interest: interestScore, confidence: confidenceScore }) => {
                      const action = GROWTH_ACTIONS[type]
                      const added = state.experiments.some((experiment) => experiment.title === action.title)
                      return (
                        <li key={type} className="rounded-xl bg-white/80 p-3 text-[11px]">
                          <div className="font-bold text-xs">
                            {type} — {riasecCopy[type].name} ({riasecCopy[type].english})
                          </div>
                          <div className="text-muted mt-0.5">
                            ความสนใจ {interestScore} · ความมั่นใจ {confidenceScore}
                          </div>
                          {quadrant === 'grow' && (
                            <div className="mt-2 border-t border-black/10 pt-2">
                              <div className="font-semibold">{action.title}</div>
                              <p className="text-muted mt-0.5">{action.description}</p>
                              <button
                                type="button"
                                onClick={() => addExperiment(type)}
                                disabled={added}
                                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-3.5 py-2 text-[11px] font-bold hover:bg-black/80 disabled:bg-white disabled:text-ink disabled:border disabled:border-black/15 disabled:cursor-default"
                              >
                                {added ? (
                                  <>
                                    <Check size={24} className="w-3.5 h-3.5" aria-hidden="true" /> เพิ่มแล้ว
                                  </>
                                ) : (
                                  <>
                                    <Plus size={24} className="w-3.5 h-3.5" aria-hidden="true" /> เพิ่มเป็นการทดลอง
                                  </>
                                )}
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
              <li key={type} className="grid grid-cols-[minmax(130px,.7fr)_1fr_36px] items-center gap-3 text-xs">
                <span className="font-semibold">
                  {type} — {riasecCopy[type].name}
                </span>
                <span className="meter" aria-hidden="true">
                  <span style={{ width: `${confidence[type]}%` }} />
                </span>
                <span className="font-bold text-right">{confidence[type]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-paper p-3 text-[11px]">
            ทำหมวด 04 Career Interest Explorer ให้เสร็จ แล้วเราจะรวมความสนใจกับความมั่นใจเป็นแผนที่จุดแข็งให้{' '}
            <Link to="/assessment?step=careerInterest&page=1" className="font-bold underline underline-offset-4">
              ไปทำหมวด 04
            </Link>
          </p>
        </div>
      )}

      <p className="border-t border-black/10 px-5 sm:px-6 py-4 text-[10px] leading-relaxed text-muted">
        ความมั่นใจในความสามารถ (self-efficacy) ตามแนวคิดของ Bandura (1977) บนกรอบ Holland RIASEC · ข้อคำถามเขียนขึ้นใหม่โดย Who Am I? และยังอยู่ระหว่างตรวจสอบคุณภาพ ·
        ความสนใจกับความมั่นใจเป็นคนละเรื่องที่สัมพันธ์กันปานกลาง จึงวัดทั้งสองอย่าง
      </p>
      {onReview && (
        <div className="px-5 sm:px-6 pb-5">
          <button type="button" onClick={onReview} className="rounded-full border border-black/15 px-5 py-3 text-xs font-bold hover:bg-paper">
            Review my answers
          </button>
        </div>
      )}
    </div>
  )
}
