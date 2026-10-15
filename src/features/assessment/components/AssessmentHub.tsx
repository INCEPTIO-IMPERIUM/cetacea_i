import { useState } from 'react'
import { ArrowRight, CircleCheck, Clock3, ShieldCheck, Trash2 } from 'lucide-react'
import { useToast } from '../../../components/toastContext'
import { L, useT } from '../../../i18n/language'
import { actions, getCategoryRecord, useWhoAmI } from '../../../store/whoAmIStore'
import { categories, getCategory } from '../registry'
import { categoryProgress } from '../scoring'

interface AssessmentHubProps {
  onOpenCategory: (categoryId: string, page?: number) => void
  onOpenSummary: () => void
}

/** Intro step: every section with its status, in any order, plus the user's data controls. */
export function AssessmentHub({ onOpenCategory, onOpenSummary }: AssessmentHubProps) {
  const t = useT()
  const state = useWhoAmI()
  const showToast = useToast()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const completed = categories.filter((category) => getCategoryRecord(state, category.id).result).length
  const totalMinutes = categories.reduce((sum, category) => sum + category.estimatedMinutes, 0)
  const hasAnyData = Object.keys(state.assessment).length > 0

  const last = getCategory(state.lastCategory)
  const lastRecord = last ? getCategoryRecord(state, last.id) : null
  const resume = last && lastRecord && !lastRecord.result && categoryProgress(last, lastRecord.answers).answered > 0 ? last : null

  const progressTitle =
    completed === 0
      ? L('เริ่มต้นใหม่ได้เลย', 'A fresh start.')
      : completed === categories.length
        ? L('ทำครบทุกหมวดแล้ว', 'Every section done.')
        : L('ไปได้สวย — พร้อมเมื่อไรค่อยทำต่อ', 'Nice progress — keep going when you are ready.')

  return (
    <section className="pt-6 sm:pt-8" aria-labelledby="hub-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">{t(L('เส้นทางค้นหาตัวเองของคุณ', 'Your discovery journey'))}</div>
          <h2 id="hub-heading" className="section-title text-[27px] sm:text-[32px] font-extrabold mt-1">
            {t(L('เลือกจุดเริ่มต้น', 'Choose where to begin'))}
            <span className="text-[#8b76cf]">.</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl">
            {t(
              L(
                'แต่ละหมวดสั้นและบันทึกให้อัตโนมัติ ทำหมวดไหนก่อนก็ได้ หยุดเมื่อไรก็ได้ แล้วกลับมาทำต่อทีหลัง ผลจะขึ้นทันทีที่ทำแต่ละหมวดเสร็จ',
                'Each section is short and saves as you go. Do them in any order, stop whenever you like, and come back later — your results appear as soon as a section is done.',
              ),
            )}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-3 py-2 text-[10px] font-bold">
          <Clock3 size={24} aria-hidden="true" /> {t({ th: `รวมประมาณ ${totalMinutes} นาที`, en: `About ${totalMinutes} minutes in total` })}
        </span>
      </div>

      <div className="rounded-[22px] overflow-hidden border-[1.5px] border-ink bg-white shadow-panel mb-4">
        <div className="h-2 bg-lilac" role="progressbar" aria-label={t(L('หมวดที่ทำเสร็จ', 'Sections completed'))} aria-valuemin={0} aria-valuemax={categories.length} aria-valuenow={completed}>
          <div className="h-full bg-ink transition-all duration-300" style={{ width: `${Math.round((completed / categories.length) * 100)}%` }} />
        </div>
        <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">{t(L('หมวดที่ทำเสร็จ', 'Sections completed'))}</div>
            <h3 className="section-title text-xl sm:text-2xl font-extrabold mt-1">{t(progressTitle)}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {resume && (
              <button
                type="button"
                onClick={() => onOpenCategory(resume.id, lastRecord?.page)}
                className="inline-flex items-center gap-2 rounded-full bg-lemon border-[1.5px] border-ink shadow-[0_2px_0_#171717] px-4 py-2.5 text-xs font-bold"
              >
                {t({ th: `ทำต่อ “${resume.title.th}”`, en: `Continue “${resume.title.en}”` })} <ArrowRight size={24} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenSummary}
              disabled={completed === 0}
              className="rounded-full bg-ink text-white px-4 py-2.5 text-xs font-bold hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t(L('ดูสรุปผลของฉัน', 'See my summary'))}
            </button>
          </div>
        </div>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label={t(L('หมวดแบบประเมิน', 'Assessment sections'))}>
        {categories.map((category) => {
          const record = getCategoryRecord(state, category.id)
          const progress = categoryProgress(category, record.answers)
          const status = record.result ? 'done' : progress.answered > 0 ? 'progress' : 'new'
          return (
            <li key={category.id} className="form-question flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[10px] font-bold text-accent tracking-[.12em] uppercase">{t({ th: `หมวด ${category.number}`, en: `Section ${category.number}` })}</div>
                <span className={`rounded-full px-2.5 py-1.5 text-[9px] font-bold ${status === 'done' ? 'bg-mint' : status === 'progress' ? 'bg-lemon' : 'bg-paper text-muted'}`}>
                  {status === 'done' ? (
                    <span className="inline-flex items-center gap-1">
                      <CircleCheck size={24} className="w-3 h-3" aria-hidden="true" /> {t(L('เสร็จแล้ว', 'Done'))}
                    </span>
                  ) : status === 'progress' ? (
                    t({ th: `ตอบแล้ว ${progress.answeredRequired} / ${progress.required}`, en: `${progress.answeredRequired} / ${progress.required} answered` })
                  ) : (
                    t(L('ยังไม่เริ่ม', 'Not started'))
                  )}
                </span>
              </div>
              <h3 className="section-title text-xl font-extrabold mt-2">{t(category.title)}</h3>
              <p className="text-xs text-muted leading-relaxed mt-2">{t(category.summary)}</p>
              <p className="text-[10px] text-muted mt-3">
                {t({ th: `${progress.required} ข้อ`, en: `${progress.required} questions` })}
                {progress.total > progress.required && t({ th: ` + ไม่บังคับ ${progress.total - progress.required} ข้อ`, en: ` + ${progress.total - progress.required} optional` })}
                {t({ th: ` · ประมาณ ${category.estimatedMinutes} นาที`, en: ` · about ${category.estimatedMinutes} minutes` })}
              </p>
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => onOpenCategory(category.id, status === 'progress' ? record.page : 0)}
                  className="inline-flex items-center gap-2 rounded-full border border-ink bg-white px-4 py-2.5 text-[11px] font-bold hover:bg-lemon transition"
                >
                  {t(status === 'done' ? L('ดูผลและแก้คำตอบ', 'See result & edit answers') : status === 'progress' ? L('ทำต่อ', 'Continue') : L('เริ่ม', 'Start'))}{' '}
                  <ArrowRight size={24} aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] text-muted">
          <ShieldCheck size={24} className="w-4 h-4 shrink-0" aria-hidden="true" />
          {t(
            L(
              'คำตอบของคุณเก็บไว้ในอุปกรณ์นี้เท่านั้น นี่คือแบบสำรวจเพื่อรู้จักตัวเอง ไม่ใช่การวินิจฉัยหรือแบบทดสอบมาตรฐาน',
              'Your answers stay on this device. This is a self-discovery survey, not a diagnosis or a standardised test.',
            ),
          )}
        </p>
        {confirmingDelete ? (
          <div className="flex items-center gap-2" role="group" aria-label={t(L('ยืนยันการลบข้อมูลแบบประเมินทั้งหมด', 'Confirm deleting all assessment data'))}>
            <span className="text-[11px] font-semibold">{t(L('ลบคำตอบและผลทั้งหมดใช่ไหม', 'Delete every answer and result?'))}</span>
            <button
              type="button"
              onClick={() => {
                actions.clearAllAssessments()
                setConfirmingDelete(false)
                showToast(t(L('ลบคำตอบและผลแบบประเมินทั้งหมดแล้ว', 'All assessment answers and results were deleted.')))
              }}
              className="rounded-full bg-danger text-white px-3 py-2 text-[11px] font-bold"
            >
              {t(L('ลบเลย', 'Yes, delete'))}
            </button>
            <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-full px-3 py-2 text-[11px] font-semibold text-muted hover:text-ink">
              {t(L('ยกเลิก', 'Cancel'))}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            disabled={!hasAnyData}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted underline underline-offset-4 hover:text-danger disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
          >
            <Trash2 size={24} className="w-3.5 h-3.5" aria-hidden="true" /> {t(L('ลบข้อมูลแบบประเมินทั้งหมดของฉัน', 'Delete all my assessment data'))}
          </button>
        )}
      </div>
    </section>
  )
}
