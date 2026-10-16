import { useState } from 'react'
import { ArrowRight, Info, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { careers, getNodeInfo, type NodeId } from '../../data/careers'
import { MATCH_TAGS, type CareerMatch } from '../assessment/matcher'
import { skillLabel } from '../../data/dashboard'
import { L, useLang, useT } from '../../i18n/language'
import { CareerRoadmap3D } from '../roadmap/CareerRoadmap3D'
import { SectionHeading } from './SectionHeading'

interface RoadmapSectionProps {
  activeId: NodeId
  /** The matcher's top careers, best first; empty until the assessment has suggested any. */
  matches: CareerMatch[]
  onSelect: (id: NodeId) => void
  onReset: () => void
  onTryCareer: (id: NodeId) => void
}

export function RoadmapSection({ activeId, matches, onSelect, onReset, onTryCareer }: RoadmapSectionProps) {
  const t = useT()
  const lang = useLang()
  const [resetSignal, setResetSignal] = useState(0)
  const info = getNodeInfo(activeId)
  const careerIds = matches.map((match) => match.id)
  const personalised = matches.length > 0
  const activeMatch = activeId === 'you' ? undefined : matches.find((match) => match.id === activeId)

  return (
    <section id="roadmap" className="pt-10 sm:pt-12 scroll-mt-24" aria-labelledby="roadmap-heading">
      <SectionHeading
        id="roadmap-heading"
        eyebrow={t(L('04 / สำรวจความเป็นไปได้', '04 / Explore possibilities'))}
        title={t(L('แผนที่เส้นทางอาชีพ', 'Career roadmap graph'))}
        description={t(L('สำรวจความเชื่อมโยงบนแกน X, Y และ Z ลากเพื่อหมุนฉาก เลื่อนเพื่อซูม หรือเลือกการ์ดอาชีพ', 'Explore connections across X, Y and Z. Drag to orbit the scene, scroll to zoom, or select a career node.'))}
        action={
          personalised && (
            <span className="flex items-center gap-1.5 text-ui text-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-lemon border border-black/20" />
              {t(L('การ์ดสีเหลือง = อาชีพที่เข้ากับคุณที่สุด', 'Yellow card = your best match'))}
            </span>
          )
        }
      />
      <div className="panel p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-read font-bold">{t(personalised ? L('อาชีพที่เข้ากับคุณที่สุดจากแบบสำรวจ', 'Your top matches from the discovery form') : L('ยังไม่มีอาชีพที่แนะนำ', 'No suggested careers yet'))}</h3>
            <p className="text-read text-muted mt-1">
              {t(
                personalised
                  ? L('เส้นทางที่น่าสำรวจ เรียงจากที่เข้ากันที่สุด — ไม่ใช่แบบวัดความถนัดหรือคำตัดสิน', 'Paths worth exploring, best match first — not an aptitude test or a verdict.')
                  : L('ทำหมวด 04 สำรวจความสนใจด้านอาชีพให้เสร็จ แล้วอาชีพที่เข้ากับคำตอบของคุณจะขึ้นบนแผนที่นี้', 'Finish section 04, Career Interest Explorer, and the careers that fit your answers will appear on this map.'),
              )}
            </p>
            {!personalised && (
              <Link to="/assessment?step=careerInterest&page=1" className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 py-2.5 text-ui font-bold hover:bg-black/80">
                {t(L('ไปทำหมวด 04', 'Go to section 04'))} <ArrowRight size={24} className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setResetSignal((value) => value + 1)
              onReset()
            }}
            className="rounded-full border border-black/10 px-3 py-2 text-ui font-semibold hover:bg-paper"
          >
            {t(L('รีเซ็ตมุมมอง', 'Reset view'))} <RotateCcw size={24} className="inline ml-1" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(230px,.65fr)] gap-3 items-stretch">
          <div className="graph-scroll rounded-2xl bg-paper border border-black/5 p-2 sm:p-3">
            <CareerRoadmap3D activeId={activeId} careerIds={careerIds} onSelect={onSelect} resetSignal={resetSignal} />
            {/* Keyboard and screen-reader route into the same selection the 3D scene drives; visible only while focused so the layout matches the template. */}
            <div className="sr-only focus-within:not-sr-only focus-within:flex flex-wrap gap-1.5 mt-2" role="group" aria-label={t(L('เลือกการ์ด', 'Select a node'))}>
              {(['you', ...careerIds] as NodeId[]).map((id) => (
                <button key={id} type="button" className="pill py-1.5 text-ui" aria-pressed={activeId === id} onClick={() => onSelect(id)}>
                  {id === 'you' ? t(L('คุณ', 'You')) : t(careers[id].name)}
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-black/10 bg-white p-5 flex flex-col min-h-[260px]" aria-live="polite">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow">{t(info.type)}</span>
              {activeMatch && (
                <span className={`rounded-full px-2.5 py-1 text-ui font-bold ${MATCH_TAGS[activeMatch.tag].tone}`}>
                  {t(MATCH_TAGS[activeMatch.tag].label)} · {activeMatch.score}/100
                </span>
              )}
            </div>
            <h3 className="section-title text-2xl font-extrabold mt-4">{t(info.name)}</h3>
            <p className="text-read text-muted leading-relaxed mt-2">{t(info.description)}</p>
            <div className="mt-5">
              <div className="eyebrow mb-2">{t(L('ทักษะที่น่าลอง', 'Skills to try'))}</div>
              <div className="flex flex-wrap gap-2">
                {info.skills.map((skill) => (
                  <span key={skill} className="pill">{skillLabel(skill, lang)}</span>
                ))}
              </div>
            </div>
            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={() => onTryCareer(activeId)}
                className="w-full rounded-full bg-ink text-white font-bold text-ui px-4 py-3 hover:bg-black/80 transition"
              >
                {t(L('เพิ่มการทดลองเล็ก ๆ', 'Add a tiny experiment'))} <ArrowRight size={24} className="inline ml-1" aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>

        <div className="flex items-center gap-2 mt-4 rounded-xl bg-lemon-soft/60 px-3 py-2.5">
          <Info size={24} aria-hidden="true" />
          <p className="text-read leading-relaxed text-black/65">
            {t(
              L(
                'อาชีพคือเส้นทางที่ยืดหยุ่น ไม่ใช่กล่อง งานหนึ่งพาไปสู่งานอื่นได้อีกมาก และทักษะเดียวกันใช้ได้ในหลายสาขา',
                'Careers are flexible paths, not boxes. One role can lead to many others, and the same skills can be useful in different fields.',
              ),
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
