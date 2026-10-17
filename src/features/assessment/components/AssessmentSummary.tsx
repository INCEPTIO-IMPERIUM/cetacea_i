import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Plus, Waypoints } from 'lucide-react'
import { useToast } from '../../../components/toastContext'
import { careers } from '../../../data/careers'
import { skillLabel, toExperiment } from '../../../data/dashboard'
import { hasExperiment } from '../../../data/experimentText'
import { L, useLang, useT, type Localized } from '../../../i18n/language'
import { actions, getCategoryRecord, useWhoAmI, type WhoAmIState } from '../../../store/whoAmIStore'
import { bigFiveCopy, toBigFiveScores } from '../categories/bigFive'
import { readInterests, riasecCopy, toRiasecProfile } from '../categories/careerInterest'
import { personalityCompass } from '../categories/personalityCompass'
import { QUADRANTS, strengthsMap } from '../categories/strengths'
import { DIRECTIONS, workStyleFromScores } from '../categories/workStyle'
import { MATCH_TAGS, recommendationsFor, type CareerMatch, type Confidence } from '../matcher'
import { CategoryResultView } from './CategoryResultView'
import { PersonalityCompassResult } from './PersonalityCompassResult'

/** How many careers the summary recommends (the issue asks for 3–5). */
const SHOWN_MATCHES = 5

const confidenceCopy: Record<Confidence, { label: Localized; tone: string }> = {
  none: { label: L('ยังไม่มีข้อมูลพอ', 'Not enough answers yet'), tone: 'bg-paper' },
  low: { label: L('ความมั่นใจของผล: ต่ำ', 'Result confidence: low'), tone: 'bg-peach' },
  medium: { label: L('ความมั่นใจของผล: ปานกลาง', 'Result confidence: medium'), tone: 'bg-lemon' },
  high: { label: L('ความมั่นใจของผล: สูง', 'Result confidence: high'), tone: 'bg-mint' },
}

interface SectionRow {
  number: string
  title: Localized
  /** Category to open; the compass opens the Big Five questions it is computed from. */
  categoryId: string
  /** One-line result, or null when the section is not done yet. */
  line: Localized | null
  detail: ReactNode
}

function sectionRows(state: WhoAmIState): SectionRow[] {
  const record = (id: string) => getCategoryRecord(state, id)
  const bigFive = record('bigFive')
  const bigFiveScores = toBigFiveScores(bigFive.result?.scores)
  const workStyle = workStyleFromScores(record('workStyle').result?.scores)
  const interest = toRiasecProfile(record('careerInterest').result?.scores)
  const confidence = toRiasecProfile(record('strengths').result?.scores)

  let compassLine: Localized | null = null
  if (bigFiveScores) {
    const leaning = personalityCompass(bigFiveScores)
      .filter((reading) => !reading.balanced)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 2)
    compassLine = leaning.length
      ? { th: leaning.map((reading) => reading.text.th).join(' · '), en: leaning.map((reading) => reading.text.en).join(' · ') }
      : L('สมดุล / ยืดหยุ่นในทุกด้าน', 'Balanced / flexible on every side')
  }
  const topDimension = bigFive.result?.ranking[0] as keyof typeof bigFiveCopy | undefined
  const interestReading = interest ? readInterests(interest) : null
  const love = interest && confidence ? strengthsMap(interest, confidence).filter((placement) => placement.quadrant === 'love') : []

  const detail = (id: string) => {
    const result = record(id).result
    return result ? <CategoryResultView categoryId={id} result={result} answers={record(id).answers} /> : null
  }

  return [
    {
      number: '01',
      title: L('เข็มทิศบุคลิกภาพ', 'Personality Compass'),
      categoryId: 'bigFive',
      line: compassLine,
      detail: bigFiveScores ? <PersonalityCompassResult scores={bigFiveScores} /> : null,
    },
    {
      number: '02',
      title: L('สเปกตรัมบุคลิกภาพ', 'Personality Spectrum'),
      categoryId: 'bigFive',
      line:
        topDimension && bigFive.result
          ? {
              th: `มิติที่คะแนนสูงสุด: ${bigFiveCopy[topDimension].label.th} ${bigFive.result.scores[topDimension]}`,
              en: `Highest dimension: ${bigFiveCopy[topDimension].label.en} ${bigFive.result.scores[topDimension]}`,
            }
          : null,
      detail: detail('bigFive'),
    },
    {
      number: '03',
      title: L('เข็มทิศการทำงาน', 'Work Style Compass'),
      categoryId: 'workStyle',
      line: workStyle
        ? {
            th: workStyle.directions.map((id) => `${DIRECTIONS[id].icon} ${DIRECTIONS[id].name.th}`).join(' + '),
            en: workStyle.directions.map((id) => `${DIRECTIONS[id].icon} ${DIRECTIONS[id].name.en}`).join(' + '),
          }
        : null,
      detail: detail('workStyle'),
    },
    {
      number: '04',
      title: L('สำรวจความสนใจด้านอาชีพ', 'Career Interest Explorer'),
      categoryId: 'careerInterest',
      line: interestReading
        ? interestReading.flat
          ? L('ความสนใจยังไม่ชัด', 'Interests not clear yet')
          : { th: `Holland Code ${interestReading.hollandCode}`, en: `Holland code ${interestReading.hollandCode}` }
        : null,
      detail: detail('careerInterest'),
    },
    {
      number: '05',
      title: L('จุดแข็งและศักยภาพ', 'Strengths & Potential'),
      categoryId: 'strengths',
      line: confidence
        ? love.length
          ? {
              th: `${QUADRANTS.love.title.th}: ${love.map((placement) => riasecCopy[placement.type].name.th).join(', ')}`,
              en: `${QUADRANTS.love.title.en}: ${love.map((placement) => riasecCopy[placement.type].english).join(', ')}`,
            }
          : L('ดูแผนที่จุดแข็งในรายละเอียด', 'See the strengths map in the details')
        : null,
      detail: detail('strengths'),
    },
  ]
}

function MatchCard({ match, rank }: { match: CareerMatch; rank: number }) {
  const t = useT()
  const lang = useLang()
  const navigate = useNavigate()
  const state = useWhoAmI()
  const showToast = useToast()
  const career = careers[match.id]
  const added = hasExperiment(state.experiments, career.starter.key)

  return (
    <li className="rounded-[20px] border-[1.5px] border-ink bg-white shadow-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-ui font-bold text-accent tracking-[.12em] uppercase">{t({ th: `ทางเลือกที่ ${rank}`, en: `Option ${rank}` })}</div>
          <h4 className="section-title text-xl font-extrabold mt-1">{t(career.name)}</h4>
          <p className="text-ui text-muted mt-0.5">
            O*NET-SOC {career.onet.code} · {career.onet.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-ui font-bold ${MATCH_TAGS[match.tag].tone}`}>{t(MATCH_TAGS[match.tag].label)}</span>
          <span className="rounded-full bg-paper px-2.5 py-1 text-ui font-bold">{t({ th: `ความสอดคล้อง ${match.score}/100`, en: `Fit ${match.score}/100` })}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-read leading-relaxed">
        <div>
          <div className="eyebrow mb-1.5">{t(L('ทำไมถึงแนะนำ', 'Why this is suggested'))}</div>
          <ul className="space-y-1.5 list-disc pl-4">
            {match.reasons.map((reason) => (
              <li key={reason.en}>{t(reason)}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          {match.workingStyle.length > 0 && (
            <div>
              <div className="eyebrow mb-1.5">{t(L('คุณอาจทำงานนี้แบบไหน', 'How you might do this work'))}</div>
              <ul className="space-y-1.5 list-disc pl-4 text-muted">
                {match.workingStyle.map((line) => (
                  <li key={line.en}>{t(line)}</li>
                ))}
              </ul>
            </div>
          )}
          {match.skillsToGrow.length > 0 && (
            <div>
              <div className="eyebrow mb-1.5">{t(L('ทักษะที่ต้องพัฒนา', 'Skills to develop'))}</div>
              <div className="flex flex-wrap gap-1.5">
                {match.skillsToGrow.map((skill) => (
                  <span key={skill} className="pill py-1 text-ui">
                    {skillLabel(skill, lang)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            actions.setRecommendedCareer(match.id)
            navigate(`/dashboard?career=${match.id}#roadmap`)
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-4 py-2.5 text-ui font-bold hover:bg-black/80"
        >
          <Waypoints size={24} className="w-4 h-4" aria-hidden="true" /> {t(L('ดูบน 3D Roadmap', 'View on 3D roadmap'))}
        </button>
        <button
          type="button"
          disabled={added}
          onClick={() => {
            actions.addExperiment(toExperiment(career.starter, lang))
            showToast(t({ th: `เพิ่ม "${career.starter.title.th}" ใน Micro-Actions แล้ว`, en: `Added "${career.starter.title.en}" to Micro-Actions.` }))
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-4 py-2.5 text-ui font-bold hover:bg-lemon disabled:border-black/15 disabled:hover:bg-white disabled:cursor-default"
        >
          {added ? <Check size={24} className="w-4 h-4" aria-hidden="true" /> : <Plus size={24} className="w-4 h-4" aria-hidden="true" />}
          {added
            ? t(L('เพิ่ม Micro-Action แล้ว', 'Micro-Action added'))
            : t({ th: `เพิ่ม Micro-Action: ${career.starter.title.th}`, en: `Add Micro-Action: ${career.starter.title.en}` })}
        </button>
      </div>
    </li>
  )
}

/** Summary of every section plus career suggestions with reasons (#7). */
export function AssessmentSummary({ onBack, onOpenCategory }: { onBack: () => void; onOpenCategory: (categoryId: string) => void }) {
  const t = useT()
  const state = useWhoAmI()
  const rows = sectionRows(state)
  const done = rows.filter((row) => row.line !== null).length
  const recommendations = recommendationsFor(state)
  const shown = recommendations.matches.slice(0, SHOWN_MATCHES)

  return (
    <section className="pt-6 sm:pt-8" aria-labelledby="summary-heading">
      <div className="mb-5">
        <div className="eyebrow">{t(L('สรุปผลการค้นหาตัวเอง', 'Your discovery summary'))}</div>
        <h2 id="summary-heading" className="section-title text-[27px] sm:text-[32px] font-extrabold mt-1">
          {t(L('สิ่งที่คำตอบของคุณบอก', 'What your answers suggest'))}
          <span className="text-[#8b76cf]">.</span>
        </h2>
        <p className="text-read text-muted mt-2 max-w-2xl">
          {t({
            th: `ทำแล้ว ${done} จาก ${rows.length} หมวด ผลเหล่านี้คือเบาะแสให้ลองสำรวจ ไม่ใช่ป้ายหรือคำตัดสินสุดท้าย`,
            en: `${done} of ${rows.length} sections finished. These are clues to explore, not a label or a final decision.`,
          })}
        </p>
      </div>

      {/* Sections at a glance */}
      <ol className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel divide-y divide-black/10" aria-label={t(L('สรุปแต่ละหมวด', 'Each section at a glance'))}>
        {rows.map((row) => (
          <li key={row.number} className="p-4 sm:px-6">
            {row.line !== null ? (
              <details className="group">
                <summary className="flex flex-wrap items-center justify-between gap-2 cursor-pointer list-none">
                  <span>
                    <span className="text-ui font-bold text-accent tracking-[.12em] uppercase">{t({ th: `หมวด ${row.number}`, en: `Section ${row.number}` })}</span>
                    <span className="block font-bold text-read">{t(row.title)}</span>
                    <span className="block text-read text-muted mt-0.5">{t(row.line)}</span>
                  </span>
                  <span className="rounded-full border border-black/15 px-3 py-1.5 text-ui font-bold group-open:bg-paper">
                    <span className="group-open:hidden">{t(L('ดูรายละเอียด', 'Show details'))}</span>
                    <span className="hidden group-open:inline">{t(L('ซ่อนรายละเอียด', 'Hide details'))}</span>
                  </span>
                </summary>
                <div className="mt-4">{row.detail}</div>
              </details>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  <span className="text-ui font-bold text-muted tracking-[.12em] uppercase">{t({ th: `หมวด ${row.number}`, en: `Section ${row.number}` })}</span>
                  <span className="block font-bold text-read">{t(row.title)}</span>
                  <span className="block text-ui text-muted mt-0.5">{t(L('ยังไม่ได้ทำ', 'Not done yet'))}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenCategory(row.categoryId)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-3.5 py-2 text-ui font-bold hover:bg-lemon"
                >
                  {t(L('ไปทำหมวดนี้', 'Go to this section'))} <ArrowRight size={24} className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Career suggestions */}
      <div className="mt-8" aria-labelledby="matches-heading">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
          <div>
            <div className="eyebrow">{t(L('เส้นทางที่น่าสำรวจ', 'Paths worth exploring'))}</div>
            <h3 id="matches-heading" className="section-title text-2xl font-extrabold mt-1">
              {t(L('อาชีพที่น่าสำรวจ', 'Careers to explore'))}
            </h3>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-ui font-bold ${confidenceCopy[recommendations.confidence].tone}`}>{t(confidenceCopy[recommendations.confidence].label)}</span>
        </div>
        {shown.length > 0 ? (
          <ol className="space-y-4">
            {shown.map((match, index) => (
              <MatchCard key={match.id} match={match} rank={index + 1} />
            ))}
          </ol>
        ) : (
          <div className="rounded-[20px] border border-dashed border-black/20 p-6 text-read text-muted">
            {t(
              L(
                'คำแนะนำอาชีพอิงความสนใจ (หมวด 04) และความมั่นใจ (หมวด 05) เป็นหลัก ไม่ได้อิงบุคลิกภาพอย่างเดียว ',
                'Career suggestions are based mainly on interests (section 04) and confidence (section 05), never on personality alone. ',
              ),
            )}
            <button type="button" onClick={() => onOpenCategory('careerInterest')} className="font-bold text-ink underline underline-offset-4">
              {t(L('เริ่มหมวด 04', 'Start section 04'))}
            </button>
          </div>
        )}
        <div className="mt-4 rounded-2xl bg-lemon-soft/70 px-4 py-3">
          <div className="text-read font-bold">{t(L('ข้อจำกัดของคำแนะนำนี้', 'Limits of these suggestions'))}</div>
          <ul className="mt-1 list-disc pl-4 text-read leading-relaxed text-black/70 space-y-0.5">
            {recommendations.limitations.map((line) => (
              <li key={line.en}>{t(line)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-ui font-semibold text-muted hover:text-ink py-2">
          <ArrowLeft size={24} aria-hidden="true" /> {t(L('กลับไปแก้คำตอบ', 'Back to edit answers'))}
        </button>
        <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-ui font-bold hover:-translate-y-0.5 transition">
          {t(L('เปิด Dashboard ของฉัน', 'Open my dashboard'))} <ArrowRight size={24} aria-hidden="true" />
        </Link>
      </div>

      {/* References and credits */}
      <details className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-4 text-read text-muted">
        <summary className="cursor-pointer font-bold text-ink">{t(L('แหล่งอ้างอิงและเครดิต', 'References and credits'))}</summary>
        <ul className="mt-3 space-y-2 list-disc pl-4">
          <li>
            {t(L('หมวด 01–02: ', 'Sections 01–02: '))}IPIP 50-item Big-Five Factor Markers — Goldberg, L. R. (1992). <i>Psychological Assessment, 4</i>, 26–42. Public domain (ipip.ori.org).{' '}
            {t(L('การแสดงเป็นแนวโน้มต่อเนื่องอ้างอิง McCrae & Costa (1989)', 'Showing traits as continuous tendencies follows McCrae & Costa (1989).'))}
          </li>
          <li>
            {t(L('หมวด 03: ', 'Section 03: '))}IPIP-IPC — Markey, P. M., &amp; Markey, C. N. (2009). <i>Assessment, 16</i>(4), 352–361. Public domain.{' '}
            {t(L('การแบ่งสี่ทิศและตัวละครเป็นการตีความของ Who Am I?', 'The four directions and characters are Who Am I?’s own interpretation.'))}
          </li>
          <li>
            {t(
              L(
                'หมวด 04–05: กรอบ Holland RIASEC (Holland, 1997) และ self-efficacy (Bandura, 1977) รูปแบบ 8 ข้อต่อแบบอ้างอิง AFPD RIASEC Markers — Armstrong, Allison & Rounds (2008), Journal of Vocational Behavior, 73, 287–299 — แต่ข้อคำถามทั้งหมดเขียนขึ้นใหม่โดย Who Am I? เพราะเครื่องมือต้นฉบับใช้ได้เฉพาะงานไม่ใช่เชิงพาณิชย์',
                'Sections 04–05: Holland’s RIASEC framework (Holland, 1997) and self-efficacy (Bandura, 1977). The eight-items-per-type design follows the AFPD RIASEC Markers — Armstrong, Allison & Rounds (2008), Journal of Vocational Behavior, 73, 287–299 — but every item was written anew by Who Am I?, because the original instrument is licensed for noncommercial use only.',
              ),
            )}
          </li>
          <li>
            {t(
              L(
                'การจับคู่อาชีพ: profile correlation (Wille et al., 2014) หลักฐานเรื่องความสอดคล้องของความสนใจ (Nye et al., 2012; Hoff et al., 2020) และความมั่นใจ (Rottinghaus et al., 2003) น้ำหนัก 60/25/15 เป็นการตัดสินใจเชิงออกแบบ ยังไม่มีงานวิจัยรองรับตัวเลข',
                'Career matching: profile correlation (Wille et al., 2014); evidence on interest fit (Nye et al., 2012; Hoff et al., 2020) and confidence (Rottinghaus et al., 2003). The 60/25/15 weights are a design choice with no research behind the exact numbers yet.',
              ),
            )}
          </li>
          <li>
            This page includes information from the O*NET 31.0 Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the CC
            BY 4.0 license. O*NET® is a trademark of USDOL/ETA. Who Am I? has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these
            modifications.
          </li>
        </ul>
      </details>
    </section>
  )
}
