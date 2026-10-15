import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, ListChecks } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { AssessmentHub } from '../features/assessment/components/AssessmentHub'
import { AssessmentSummary } from '../features/assessment/components/AssessmentSummary'
import { CategoryRunner } from '../features/assessment/components/CategoryRunner'
import { categories, getCategory } from '../features/assessment/registry'
import { pageCount } from '../features/assessment/scoring'
import { L, useT } from '../i18n/language'
import { LanguageToggle } from '../i18n/LanguageToggle'

/**
 * Discovery Assessment flow, driven by the URL so refresh and the back button keep the place:
 *   /assessment                        → intro: every section and its status
 *   /assessment?step=<id>&page=<n>     → a section, page n (1-based)
 *   /assessment?step=summary           → results of finished sections
 */
export function AssessmentPage() {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const step = params.get('step')
  const category = getCategory(step)
  const isSummary = step === 'summary'
  const rawPage = Number(params.get('page') ?? '1')
  const page = category ? Math.min(Math.max(Number.isFinite(rawPage) ? Math.floor(rawPage) - 1 : 0, 0), pageCount(category) - 1) : 0

  const goTo = (next: Record<string, string> | null) => setParams(next ?? {})
  const openCategory = (id: string, targetPage = 0) => goTo({ step: id, page: String(targetPage + 1) })
  const openHub = () => goTo(null)

  // New step: start at the top of the page.
  const stepKey = `${step ?? 'intro'}`
  const previousStep = useRef(stepKey)
  useEffect(() => {
    if (previousStep.current === stepKey) return
    previousStep.current = stepKey
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [stepKey])

  const stepNumber = category ? categories.indexOf(category) + 1 : 0
  const badge = category
    ? t({ th: `ขั้นที่ ${stepNumber} จาก ${categories.length}`, en: `STEP ${stepNumber} OF ${categories.length}` })
    : t(isSummary ? L('สรุปผล', 'SUMMARY') : L('เริ่มที่นี่', 'START HERE'))

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
          <BrandMark variant="app" to="/dashboard" tagline={t(L('ค้นหาตัวเองและเส้นทางอาชีพ', 'CAREER & SELF-DISCOVERY'))} ariaLabel={t(L('กลับไปที่ Dashboard ของ Who Am I', 'Back to Who Am I dashboard'))} />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5 text-xs font-bold hover:bg-lemon transition">
              <ArrowLeft size={24} aria-hidden="true" />
              <span className="hidden sm:inline">{t(L('กลับไปที่ Dashboard', 'Back to dashboard'))}</span>
              <span className="sm:hidden">{t(L('กลับ', 'Back'))}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="pt-7 sm:pt-9 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-lilac px-3 py-2 text-[10px] font-bold">
            <ListChecks size={24} aria-hidden="true" /> {t(L('เส้นทางค้นหาตัวเองของคุณ', 'YOUR DISCOVERY JOURNEY'))} · {badge}
          </div>
          <h1 className="section-title text-3xl sm:text-4xl font-extrabold mt-4">
            {/* Thai does not put a space between these words. */}
            {t(L('ใกล้ความเป็น', 'A little closer to '))}
            <span className="text-accent">{t(L('คุณอีกนิด', 'you.'))}</span>
          </h1>
          <p className="text-sm text-muted mt-2 max-w-2xl">
            {t(
              L(
                'ทำแบบสำรวจนี้ตามจังหวะของคุณ คำตอบคือเบาะแสให้สำรวจต่อ ไม่ใช่ป้ายหรือคำตัดสินสุดท้าย',
                'Take this short questionnaire at your own pace. Your choices are clues to explore, not a label or a final decision.',
              ),
            )}
          </p>
        </div>

        <div key={stepKey} className="step-enter">
          {category ? (
            <CategoryRunner category={category} page={page} onPageChange={(next) => openCategory(category.id, next)} onExit={openHub} />
          ) : isSummary ? (
            <AssessmentSummary onBack={openHub} onOpenCategory={(id) => openCategory(id)} />
          ) : (
            <AssessmentHub onOpenCategory={openCategory} onOpenSummary={() => goTo({ step: 'summary' })} />
          )}
        </div>

        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-8 text-[10px] text-muted">
          <span>{t(L('© 2026 Who Am I? · สร้างเพื่อคนช่างสงสัย', '© 2026 Who Am I? · Built for curious minds.'))}</span>
          <span>{t(L('สำรวจอย่างอ่อนโยน เติบโตตามจังหวะของคุณ', 'Explore gently. Grow at your own pace.'))}</span>
        </footer>
      </main>
    </>
  )
}
