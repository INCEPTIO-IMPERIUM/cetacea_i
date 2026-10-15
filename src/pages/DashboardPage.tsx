import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { Heart, PenLine } from 'lucide-react'
import { useToast } from '../components/toastContext'
import { careers, isCareerId, type NodeId, CAREER_IDS, DEFAULT_ROADMAP_CAREERS } from '../data/careers'
import { ikigaiCards, selfDiscoveryStarter, skillLabel, toExperiment } from '../data/dashboard'
import { L, useLang, useT } from '../i18n/language'
import { actions, useWhoAmI } from '../store/whoAmIStore'
import { recommendationsFor } from '../features/assessment/matcher'
import { MAX_ROADMAP_CAREERS } from '../features/roadmap/careerScene'
import { DashboardHeader } from '../features/dashboard/DashboardHeader'
import { DashboardSidebar } from '../features/dashboard/DashboardSidebar'
import { IkigaiSection } from '../features/dashboard/IkigaiSection'
import { MicroActionsSection } from '../features/dashboard/MicroActionsSection'
import { OverviewSection } from '../features/dashboard/OverviewSection'
import { ReflectionModal } from '../features/dashboard/ReflectionModal'
import { RoadmapSection } from '../features/dashboard/RoadmapSection'
import { SkillMatrixSection } from '../features/dashboard/SkillMatrixSection'
import { sectionNav, type SectionId } from '../features/dashboard/sections'

const loveOptions = (ikigaiCards.find((card) => card.area === 'love')?.options ?? []).map((option) => option.id)

export function DashboardPage() {
  const state = useWhoAmI()
  const t = useT()
  const lang = useLang()
  const showToast = useToast()
  const { hash } = useLocation()
  const [searchParams] = useSearchParams()

  const recommendations = recommendationsFor(state)
  const suggestedCareer = recommendations.matches[0]?.id ?? null
  const roadmapCareers = recommendations.matches.length ? recommendations.matches.slice(0, MAX_ROADMAP_CAREERS).map((match) => match.id) : DEFAULT_ROADMAP_CAREERS

  // ?career= wins (deep link from the summary), then the career the user picked, then the best match.
  const [activeCareer, setActiveCareer] = useState<NodeId>(() => {
    const requested = searchParams.get('career')
    if (isCareerId(requested)) return requested
    return state.recommendedCareer ?? suggestedCareer ?? roadmapCareers[0]
  })
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const doneCount = state.experiments.filter((item) => item.done).length
  const progress = Math.min(100, Math.round(20 + state.ikigai.length * 7 + doneCount * 10))
  const interestsSelected = loveOptions.filter((option) => state.ikigai.includes(option)).length
  const latestReflection = state.reflections[0]

  const goToSection = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
    setSidebarOpen(false)
  }, [])

  // Honour #roadmap etc. on arrival (the router does not scroll to hashes).
  useEffect(() => {
    const id = hash.slice(1)
    if (!sectionNav.some((section) => section.id === id)) return
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }), 60)
    return () => window.clearTimeout(timer)
  }, [hash])

  // Keep the sidebar highlight in sync with the section on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id as SectionId)
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: [0, 0.1, 0.3, 0.6] },
    )
    sectionNav.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  // Global keys: Escape closes the drawer, "/" jumps to search.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
      const target = event.target as HTMLElement
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Clear the search highlight after a moment.
  useEffect(() => {
    if (!highlightedSkill) return
    const timer = window.setTimeout(() => setHighlightedSkill(null), 1800)
    return () => window.clearTimeout(timer)
  }, [highlightedSkill])

  function handleSearch(query: string) {
    if (!query) return
    // Search both languages, so a Thai query finds a career while the interface is in English and vice versa.
    const matches = (text: string) => text.toLocaleLowerCase().includes(query)
    const career = CAREER_IDS.find((id) => {
      const data = careers[id]
      return (
        [data.name.th, data.name.en, data.description.th, data.description.en].some(matches) ||
        data.skills.some((skill) => matches(skill) || matches(skillLabel(skill, 'th')))
      )
    })
    if (career) {
      goToSection('roadmap')
      setActiveCareer(career)
      showToast(t({ th: `แสดง${careers[career].name.th}`, en: `Showing ${careers[career].name.en}.` }))
      return
    }
    const skill = state.skills.find((item) => matches(item.name) || matches(skillLabel(item.name, 'th')))
    if (skill) {
      goToSection('skills')
      setHighlightedSkill(skill.name)
      showToast(t({ th: `พบทักษะ: ${skillLabel(skill.name, 'th')}`, en: `Found skill: ${skill.name}.` }))
      return
    }
    showToast(t(L('ไม่พบที่ตรงกัน ลองพิมพ์ชื่ออาชีพหรือทักษะ', 'No exact match. Try a role or skill name.')))
  }

  function handleTryCareer(id: NodeId) {
    actions.addExperiment(toExperiment(id === 'you' ? selfDiscoveryStarter : careers[id].starter, lang))
    goToSection('actions')
    showToast(t(L('เพิ่มการทดลองเส้นทางอาชีพในรายการแล้ว', 'A career experiment was added to your list.')))
  }

  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" aria-hidden="true" onClick={() => setSidebarOpen(false)} />}

      <div className="min-h-screen lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        <DashboardSidebar
          open={sidebarOpen}
          activeSection={activeSection}
          progress={progress}
          onNavigate={goToSection}
          onProfile={() => showToast(t(L('การตั้งค่าโปรไฟล์จะเชื่อมกับบัญชีของคุณในภายหลัง', 'Profile settings can be connected to your account later.')))}
        />

        <main className="min-w-0 px-4 sm:px-6 lg:px-8 pb-12">
          <DashboardHeader
            searchRef={searchRef}
            onOpenMenu={() => setSidebarOpen(true)}
            onSearch={handleSearch}
            onReflect={() => setModalOpen(true)}
            onNotifications={() => showToast(t(L('ไม่มีอะไรค้างอยู่ สำรวจต่อได้ตามจังหวะของคุณ', 'You’re all caught up. Keep exploring at your own pace.')))}
          />

          <OverviewSection
            interestsSelected={interestsSelected}
            interestsTotal={loveOptions.length}
            skillCount={state.skills.length}
            experimentsDone={doneCount}
            experimentsTotal={state.experiments.length}
            suggestedCareer={suggestedCareer}
          />
          <IkigaiSection selected={state.ikigai} />
          <SkillMatrixSection skills={state.skills} highlighted={highlightedSkill} onExplorePaths={() => goToSection('roadmap')} />
          <RoadmapSection
            activeId={activeCareer}
            careerIds={roadmapCareers}
            personalised={recommendations.matches.length > 0}
            onSelect={setActiveCareer}
            onReset={() => {
              setActiveCareer('you')
              showToast(t(L('กลับไปที่จุดเริ่มต้นของคุณ', 'Back to your starting point.')))
            }}
            onTryCareer={handleTryCareer}
          />
          <MicroActionsSection experiments={state.experiments} />

          <section className="pt-8 sm:pt-10" aria-labelledby="reflect-heading">
            <div className="rounded-[22px] bg-ink text-white p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden">
              <div className="relative z-10 flex-1">
                <div className="eyebrow text-lemon">{t(L('หยุดพักสักครู่', 'A moment to pause'))}</div>
                <h2 id="reflect-heading" className="section-title text-2xl sm:text-3xl font-extrabold mt-2">{t(L('วันนี้คุณได้เรียนรู้อะไรเกี่ยวกับตัวเอง?', 'What did you learn about yourself today?'))}</h2>
                <p className="text-xs text-white/60 mt-2 max-w-xl leading-relaxed">
                  {t(L('ประโยคเดียวก็พอ สังเกตว่าอะไรให้พลัง อะไรยาก หรืออยากสำรวจอะไรต่อ', 'One sentence is enough. Notice what felt energizing, what felt hard, or what you want to explore next.'))}
                </p>
                {latestReflection && (
                  <div className="mt-4 rounded-xl bg-white/10 border border-white/10 p-3 text-xs text-white/80">
                    “{latestReflection.text}”
                    {state.reflections.length > 1 && (
                      <span className="block mt-1 text-[10px] text-white/45">
                        {t({
                          th: `+ บันทึกก่อนหน้า ${state.reflections.length - 1} รายการ`,
                          en: `+ ${state.reflections.length - 1} earlier ${state.reflections.length === 2 ? 'reflection' : 'reflections'} saved`,
                        })}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="relative z-10 inline-flex items-center justify-center gap-2 rounded-full bg-lemon text-ink px-5 py-3 text-xs font-bold hover:-translate-y-0.5 transition shrink-0"
              >
                {t(L('เขียนบันทึก', 'Write a reflection'))} <PenLine size={24} aria-hidden="true" />
              </button>
              <div className="absolute -right-8 -bottom-20 w-48 h-48 rounded-full border border-white/10" />
              <div className="absolute right-12 -bottom-24 w-40 h-40 rounded-full border border-white/10" />
            </div>
          </section>

          <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-8 text-[10px] text-muted">
            <span>{t(L('© 2026 Who Am I? · สร้างเพื่อคนช่างสงสัย', '© 2026 Who Am I? · Built for curious minds.'))}</span>
            <span className="flex items-center gap-1.5">
              <Heart size={24} aria-hidden="true" /> {t(L('สำรวจอย่างอ่อนโยน เติบโตตามจังหวะของคุณ', 'Explore gently. Grow at your own pace.'))}
            </span>
          </footer>
        </main>
      </div>

      {modalOpen && (
        <ReflectionModal
          onClose={closeModal}
          onSave={(text) => {
            actions.addReflection(text)
            setModalOpen(false)
            showToast(t(L('บันทึกไว้ในเครื่องนี้แล้ว', 'Reflection saved on this device.')))
          }}
        />
      )}
    </>
  )
}
