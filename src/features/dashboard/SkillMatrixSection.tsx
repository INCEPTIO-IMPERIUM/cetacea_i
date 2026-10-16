import { ArrowUpRight, Orbit, Plus } from 'lucide-react'
import { skillLabel, type Skill } from '../../data/dashboard'
import { L, useLang, useT } from '../../i18n/language'
import { actions } from '../../store/whoAmIStore'
import { useToast } from '../../components/toastContext'
import { VasInput } from '../assessment/components/VasInput'
import { InlineAddForm } from './InlineAddForm'
import { SectionHeading } from './SectionHeading'

interface SkillMatrixSectionProps {
  skills: Skill[]
  /** Skills used by the careers the matcher suggested — offered as one-tap additions. */
  suggestedSkills: string[]
  /** Skill name to briefly highlight after a search hit. */
  highlighted: string | null
  onExplorePaths: () => void
}

export function SkillMatrixSection({ skills, suggestedSkills, highlighted, onExplorePaths }: SkillMatrixSectionProps) {
  const t = useT()
  const lang = useLang()
  const showToast = useToast()
  const rated = skills.filter((skill): skill is Skill & { value: number } => skill.value !== null)
  const topSkills = [...rated].sort((a, b) => b.value - a.value).slice(0, 3)
  const notYetAdded = suggestedSkills.filter((name) => !skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase()))

  function addSuggested(name: string) {
    if (actions.addSkill(name)) showToast(t({ th: `เพิ่ม ${skillLabel(name, 'th')} ในตารางแล้ว`, en: `${name} added to your matrix.` }))
  }

  return (
    <section id="skills" className="pt-10 sm:pt-12 scroll-mt-24" aria-labelledby="skills-heading">
      <SectionHeading
        id="skills-heading"
        eyebrow={t(L('03 / มองเห็นจุดแข็ง', '03 / See your strengths'))}
        title={t(L('ตารางทักษะของคุณ', 'Your skill matrix'))}
        description={t(L('ทักษะคือความสามารถที่กำลังเติบโต ไม่ใช่ป้ายที่กำหนดตัวคุณ', 'Skills are capabilities in progress, not labels that define you.'))}
        action={
          <InlineAddForm
            buttonLabel={t(L('เพิ่มทักษะ', 'Add a skill'))}
            inputLabel={t(L('ชื่อทักษะ', 'Skill name'))}
            placeholder={t(L('เช่น การพูดในที่สาธารณะ', 'e.g. Public speaking'))}
            maxLength={40}
            onAdd={(name) => {
              if (!actions.addSkill(name)) {
                showToast(t(L('มีทักษะนี้ในตารางแล้ว', 'That skill is already in your matrix.')))
                return false
              }
              showToast(t({ th: `เพิ่ม ${name} ในตารางแล้ว`, en: `${name} added to your matrix.` }))
            }}
          />
        }
      />
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,.85fr)] gap-4">
        <div className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h3 className="font-bold text-read">{t(L('ทักษะที่ฉันกำลังสำรวจ', "Skills I'm exploring"))}</h3>
              <p className="text-read text-muted mt-1">
                {t(L('แตะบนเส้นให้ตรงกับความมั่นใจของคุณวันนี้ ทักษะที่ยังไม่ให้คะแนนจะไม่ถูกนำไปคิดคำแนะนำอาชีพ', 'Tap the line to show how confident you feel today. Skills you have not rated are left out of career suggestions.'))}
              </p>
            </div>
            <span className="rounded-full bg-paper px-3 py-1.5 text-ui font-bold shrink-0">{t(L('ประเมินตนเอง', 'SELF-RATED'))}</span>
          </div>

          {skills.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black/20 p-5 text-read text-muted">
              {t(L('ยังไม่มีทักษะในตาราง เพิ่มทักษะที่คุณกำลังฝึกหรืออยากพัฒนาด้วยปุ่ม “เพิ่มทักษะ”', 'No skills yet. Add one you are practising or want to grow with “Add a skill”.'))}
            </p>
          ) : (
            <ul className="space-y-6">
              {skills.map((skill) => {
                const labelId = `skill-${skill.name.replace(/\W+/g, '-').toLowerCase()}`
                return (
                  <li key={skill.name} data-skill={skill.name} className={`rounded-xl transition-colors ${highlighted === skill.name ? 'bg-lemon/60 -mx-2 px-2 py-1' : ''}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span id={labelId} className="text-read font-semibold">
                        {skillLabel(skill.name, lang)}
                      </span>
                      <span className="text-ui font-bold text-muted">{skill.value === null ? t(L('ยังไม่ได้ให้คะแนน', 'Not rated yet')) : skill.value}</span>
                    </div>
                    <div className="mt-3">
                      <VasInput
                        value={skill.value ?? undefined}
                        onChange={(value) => actions.setSkillValue(skill.name, value)}
                        labelledBy={labelId}
                        minLabel={t(L('ยังใหม่มาก', 'Brand new to me'))}
                        maxLabel={t(L('มั่นใจมาก', 'Very confident'))}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {notYetAdded.length > 0 && (
            <div className="mt-7 border-t border-black/10 pt-4">
              <p className="text-read font-semibold">{t(L('ทักษะที่อาชีพซึ่งแนะนำให้คุณใช้', 'Skills used by your suggested careers'))}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {notYetAdded.map((name) => (
                  <button key={name} type="button" className="pill" onClick={() => addSuggested(name)}>
                    <Plus size={24} className="w-4 h-4" aria-hidden="true" /> {skillLabel(name, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[22px] bg-ink text-white p-5 sm:p-6 relative overflow-hidden min-h-[280px]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-lemon">
              <Orbit size={24} aria-hidden="true" />
              <span className="eyebrow text-lemon">{t(L('ค้นหารูปแบบ', 'Pattern finder'))}</span>
            </div>
            <h3 className="section-title text-2xl font-extrabold mt-3 max-w-[280px]">{t(L('ทักษะของคุณติดตัวไปได้ทุกที่', 'Your skills can travel with you.'))}</h3>
            <p className="text-read text-white/70 mt-3 max-w-[300px]">
              {topSkills.length
                ? t(L('ทักษะที่คุณให้คะแนนตัวเองสูงสุด ลองดูว่าเชื่อมไปอาชีพไหนได้บ้าง', 'The skills you rated highest — see which careers they connect to.'))
                : t(L('ให้คะแนนทักษะสักอย่าง แล้วทักษะที่คุณมั่นใจที่สุดจะขึ้นที่นี่', 'Rate a skill and your most confident ones will show up here.'))}
            </p>
            {topSkills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {topSkills.map((skill) => (
                  <span key={skill.name} className="rounded-full bg-white/10 border border-white/15 px-3 py-2 text-ui">
                    {skillLabel(skill.name, lang)} <span className="text-white/60">{skill.value}</span>
                  </span>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={onExplorePaths}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-lemon text-ink px-4 py-2.5 text-ui font-bold hover:translate-x-1 transition"
            >
              {t(L('สำรวจเส้นทางที่เข้ากัน', 'Explore matching paths'))} <ArrowUpRight size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="absolute -right-8 -bottom-14 w-44 h-44 rounded-full border border-white/15" />
          <div className="absolute right-4 bottom-[-35px] w-28 h-28 rounded-full border border-white/15" />
          <div className="absolute right-12 bottom-12 w-3 h-3 rounded-full bg-lavender" />
          <div className="absolute right-24 bottom-20 w-2 h-2 rounded-full bg-lemon" />
        </div>
      </div>
    </section>
  )
}
