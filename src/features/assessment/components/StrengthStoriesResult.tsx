import { Check, Plus } from 'lucide-react'
import { useToast } from '../../../components/toastContext'
import { toExperiment } from '../../../data/dashboard'
import { hasExperiment } from '../../../data/experimentText'
import { L, useLang, useT } from '../../../i18n/language'
import { actions, useWhoAmI } from '../../../store/whoAmIStore'
import { GROUP_COPY, STORY_ACTIONS, STORY_GROUPS, groupScores, readStories, strengthByKey, type StoryGroup } from '../categories/strengthStories'
import { ReviewButton } from './ReviewButton'
import type { ResultViewProps } from './resultViewTypes'

/** How many top-rated strengths the card names. */
const TOP = 5

/** Category 06 result: the top-rated strengths, the four groups, and the stories told. */
export function StrengthStoriesResult({ result, answers, onReview }: ResultViewProps) {
  const t = useT()
  const lang = useLang()
  const state = useWhoAmI()
  const showToast = useToast()
  const top = result.ranking.flatMap((key) => strengthByKey.get(key) ?? []).slice(0, TOP)
  const groups = groupScores(result.scores)
  const stories = readStories(answers)
  const leadGroup = STORY_GROUPS.filter((group) => groups[group] !== undefined).sort((a, b) => (groups[b] ?? 0) - (groups[a] ?? 0))[0] as StoryGroup | undefined
  const action = leadGroup ? STORY_ACTIONS[leadGroup] : null
  const added = action ? hasExperiment(state.experiments, action.key) : false

  return (
    <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel overflow-hidden" aria-live="polite">
      <div className="bg-lemon-soft p-5 sm:p-6">
        <div className="eyebrow text-black/60">{t(L('หมวด 06 · เรื่องเล่าจุดแข็ง', 'Section 06 · Strength Stories'))}</div>
        <h3 className="section-title text-2xl font-extrabold mt-1">{t(L('จุดแข็งที่เหมือนตัวคุณที่สุด', 'The strengths most like you'))}</h3>
        <p className="text-read text-black/65 mt-2 max-w-2xl">
          {t(
            L(
              'เรียงจากคะแนนที่คุณให้ตัวเอง ไม่ได้เทียบกับคนอื่น ข้อที่อยู่ท้าย ๆ ไม่ใช่สิ่งที่ขาด แค่เป็นด้านที่คุณยังไม่ค่อยได้ใช้',
              'Ordered by the ratings you gave yourself, not compared with anyone. Strengths lower down are not missing — just ones you use less so far.',
            ),
          )}
        </p>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-labelledby="stories-top">
          <h4 id="stories-top" className="font-bold text-read">
            {t({ th: `${TOP} อันดับแรก`, en: `Your top ${TOP}` })}
          </h4>
          <ol className="mt-3 space-y-2">
            {top.map((strength, index) => (
              <li key={strength.key} className={`rounded-xl p-3 text-read ${GROUP_COPY[strength.group].tone}`}>
                <div className="font-bold">
                  {index + 1}. {t(strength.name)} <span className="font-semibold text-black/60">· {result.scores[strength.key]}</span>
                </div>
                <div className="text-black/65 mt-0.5">
                  <span aria-hidden="true">{GROUP_COPY[strength.group].icon}</span> {t(GROUP_COPY[strength.group].name)}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="stories-groups">
          <h4 id="stories-groups" className="font-bold text-read">
            {t(L('4 กลุ่มจุดแข็ง', 'Four groups of strengths'))}
          </h4>
          <ul className="mt-3 space-y-3">
            {STORY_GROUPS.map((group) => (
              <li key={group} className="text-ui">
                <div className="grid grid-cols-[minmax(130px,.8fr)_1fr_36px] items-center gap-3">
                  <span className="font-semibold">
                    <span aria-hidden="true">{GROUP_COPY[group].icon}</span> {t(GROUP_COPY[group].name)}
                  </span>
                  <span className="meter" aria-hidden="true">
                    <span style={{ width: `${groups[group] ?? 0}%` }} />
                  </span>
                  <span className="font-bold text-right">{groups[group] ?? '–'}</span>
                </div>
                <p className="text-muted mt-0.5">{t(GROUP_COPY[group].hint)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {stories.length > 0 && (
        <section className="px-5 sm:px-6 pb-5" aria-labelledby="stories-told">
          <h4 id="stories-told" className="font-bold text-read">
            {t(L('เรื่องเล่าของคุณ', 'Your stories'))}
          </h4>
          <ul className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {stories.map((story) => (
              <li key={story.slot} className="rounded-2xl bg-[#F4EFFF] p-4 text-read">
                <div className="font-bold">{t(story.strength.name)}</div>
                {story.age && <div className="text-ui text-muted mt-0.5">{t({ th: `เห็นครั้งแรก: ${story.age.label.th}`, en: `First noticed: ${story.age.label.en}` })}</div>}
                {story.event && <p className="mt-2 whitespace-pre-line">{story.event}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {action && leadGroup && (
        <div className="mx-5 sm:mx-6 mb-5 rounded-2xl bg-paper p-4 text-read">
          <div className="text-ui font-bold text-accent tracking-[.12em] uppercase">{t(L('ลองใช้จุดแข็งสัปดาห์นี้', 'Use a strength this week'))}</div>
          <div className="font-semibold mt-1">{t(action.title)}</div>
          <p className="text-muted mt-0.5">{t(action.description)}</p>
          <button
            type="button"
            onClick={() => {
              actions.addExperiment(toExperiment(action, lang))
              showToast(t(L('เพิ่มการทดลองใน Micro-Actions บน Dashboard แล้ว', 'Added to Micro-Actions on your dashboard.')))
            }}
            disabled={added}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-3.5 py-2 text-ui font-bold hover:bg-black/80 disabled:bg-white disabled:text-ink disabled:border disabled:border-black/15 disabled:cursor-default"
          >
            {added ? <Check size={24} className="w-3.5 h-3.5" aria-hidden="true" /> : <Plus size={24} className="w-3.5 h-3.5" aria-hidden="true" />}
            {t(added ? L('เพิ่มแล้ว', 'Added') : L('เพิ่มเป็นการทดลอง', 'Add as an experiment'))}
          </button>
        </div>
      )}

      <p className="border-t border-black/10 px-5 sm:px-6 py-4 text-read text-muted">
        {t(
          L(
            'แบบฝึกสะท้อนคิด ไม่ใช่แบบวัดที่ผ่านการตรวจสอบ · จุดแข็ง กลุ่ม และข้อความทั้งหมดเขียนขึ้นใหม่โดย Who Am I? · เรื่องเล่าเก็บไว้ในเครื่องของคุณเท่านั้น',
            'A reflection exercise, not a validated test · Every strength, group and statement was written by Who Am I? · Your stories stay on your device.',
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
