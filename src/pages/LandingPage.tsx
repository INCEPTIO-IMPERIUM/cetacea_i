import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  CloudFog,
  Compass,
  Footprints,
  GitBranch,
  Heart,
  LayoutDashboard,
  ScanSearch,
  ShieldCheck,
  Sun,
  Waypoints,
} from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { Mascot } from '../components/Mascot'
import { useReveal } from '../hooks/useReveal'
import { L, useT, type Localized } from '../i18n/language'
import { LanguageToggle } from '../i18n/LanguageToggle'

type Mood = 'lost' | 'idea'

const moodCopy: Record<Mood, { eyebrow: Localized; title: Localized; copy: Localized; cta: Localized }> = {
  lost: {
    eyebrow: L('จุดเริ่มต้นที่อ่อนโยน', 'A gentle place to begin'),
    title: L('ไม่เป็นไรเลยที่ยังไม่รู้', "You don't have to know yet."),
    copy: L(
      'เริ่มจากสังเกตว่าอะไรดึงความสนใจคุณ อะไรให้พลัง และคุณชอบแก้ปัญหาแบบไหน เราจะค่อย ๆ ไปทีละคำถาม',
      "Start by noticing what draws your attention, what gives you energy, and what kind of problems you like to solve. We'll take it one question at a time.",
    ),
    cta: L('มาหาเบาะแสกัน', "Let's find a clue"),
  },
  idea: {
    eyebrow: L('เปลี่ยนความสนใจเป็นก้าวต่อไป', 'Turn curiosity into a next step'),
    title: L('ลองสำรวจก่อนตัดสินใจได้', 'You can explore before you commit.'),
    copy: L(
      'วันนี้ไม่จำเป็นต้องตัดสินใจเรื่องใหญ่ มาเชื่อมสิ่งที่คุณสนใจกับเส้นทางที่เป็นไปได้ แล้วเลือกการทดลองเล็ก ๆ ที่ช่วยให้รู้ว่าอะไรใช่',
      'You do not need to make one big decision today. Let’s connect your interest to a few possible paths, then choose a tiny experiment that helps you learn what feels right.',
    ),
    cta: L('สำรวจก้าวต่อไปของฉัน', 'Explore my next step'),
  },
}

const steps = [
  {
    icon: ScanSearch,
    label: L('01 · เข้าใจ', '01 · Understand'),
    title: L('สังเกตเบาะแสของคุณ', 'Notice your clues'),
    copy: L('ทบทวนความสนใจ วิธีทำงานที่เป็นธรรมชาติของคุณ และสิ่งที่สำคัญกับคุณ', 'Reflect on your interests, your natural ways of working, and the things that matter to you.'),
    tone: 'bg-paper',
    iconTone: 'bg-lemon',
  },
  {
    icon: GitBranch,
    label: L('02 · สำรวจ', '02 · Explore'),
    title: L('มองเห็นมากกว่าหนึ่งเส้นทาง', 'See more than one path'),
    copy: L('เชื่อมเบาะแสเหล่านั้นกับอาชีพ ทักษะ และทิศทางที่คุณอาจยังไม่เคยนึกถึง', 'Connect those clues to different careers, skills, and directions you may not have considered yet.'),
    tone: 'bg-lilac/80',
    iconTone: 'bg-white',
  },
  {
    icon: Footprints,
    label: L('03 · ลองทำ', '03 · Try'),
    title: L('ทำก้าวต่อไปให้เล็ก', 'Make the next step small'),
    copy: L('ลองทำโปรเจกต์เล็ก ๆ เรียนรู้จากประสบการณ์ และเปลี่ยนทิศได้ทุกเมื่อที่ค้นพบสิ่งใหม่', 'Try a tiny project, learn from the experience, and change direction whenever you discover something new.'),
    tone: 'bg-peach',
    iconTone: 'bg-white',
  },
]

const container = 'max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8'

export function LandingPage() {
  const t = useT()
  const [mood, setMood] = useState<Mood>('lost')
  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)
  const current = moodCopy[mood]

  return (
    <div ref={pageRef}>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-paper/90 backdrop-blur-xl">
        <div className={`${container} h-[76px] flex items-center justify-between gap-3`}>
          <BrandMark />
          <nav className="hidden md:flex items-center gap-1" aria-label={t(L('เมนูหลัก', 'Main navigation'))}>
            <a className="nav-a" href="#how-it-works">{t(L('ใช้งานอย่างไร', 'How it works'))}</a>
            <a className="nav-a" href="#your-journey">{t(L('เส้นทางของคุณ', 'Your journey'))}</a>
            <a className="nav-a" href="#why-compass">{t(L('สิ่งที่เราเชื่อ', 'Our belief'))}</a>
            <Link className="nav-a" to="/docs">{t(L('รายละเอียดเพิ่มเติม', 'More details'))}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link to="/dashboard" className="hidden lg:inline-flex items-center gap-2 rounded-full px-4 py-3 text-ui font-bold hover:bg-white transition">
              <LayoutDashboard size={24} aria-hidden="true" /> {t(L('เปิดพื้นที่ของฉัน', 'Open my space'))}
            </Link>
            <Link to="/assessment" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 sm:px-5 py-3 text-ui font-bold hover:-translate-y-0.5 transition">
              {t(L('หาทิศทางของฉัน', 'Find my direction'))} <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={`${container} pt-8 sm:pt-12 lg:pt-16 pb-12`}>
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(410px,.95fr)] gap-7 lg:gap-12 items-center">
            <div className="py-3 sm:py-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3.5 py-2 text-ui font-bold uppercase tracking-[.12em]">
                <span className="w-2 h-2 bg-[#8EA88D] rounded-full" /> {t(L('พื้นที่เล็ก ๆ ให้ค่อย ๆ คิด', 'A little space to figure things out'))}
              </div>
              <h1 className="display text-[45px] sm:text-[60px] lg:text-[72px] xl:text-[78px] font-extrabold leading-[1.05] mt-6 max-w-[760px]">
                {t(L('ค้นหาทางของคุณ', 'Find your way,'))}
                <br />
                {/* Thai does not put a space between these words. */}
                {t(L('ใน', 'at your '))}
                <span className="relative inline-block isolate">
                  {t(L('จังหวะของคุณเอง', 'own pace'))}
                  <span className="absolute left-0 right-0 bottom-[2px] h-[9px] sm:h-3 bg-lavender/80 -z-10 rounded-full" />
                </span>
                <span className="text-[#8D78CF]">.</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed sm:leading-7 text-black/65 mt-6 max-w-[560px]">
                {t(
                  L(
                    'บางวันคุณรู้ชัดว่าอยากไปทางไหน บางวันก็ไม่รู้จะเริ่มตรงไหน ไม่ว่าตอนนี้คุณอยู่ตรงไหน มาค่อย ๆ สำรวจว่าคุณเป็นใคร และหาก้าวต่อไปไปด้วยกัน',
                    "Some days, you know exactly where you want to go. Other days, you don't know where to begin. Wherever you are right now, let's explore who you are and find your next step — together.",
                  ),
                )}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-8">
                <Link to="/assessment" className="inline-flex justify-center items-center gap-2 rounded-full bg-lemon border-[1.5px] border-ink shadow-panel px-6 py-4 text-sm font-extrabold hover:-translate-y-0.5 transition">
                  {t(L('เริ่มจากคำถามไม่กี่ข้อ', 'Start with a few questions'))} <ArrowUpRight size={24} aria-hidden="true" />
                </Link>
                <Link to="/dashboard" className="inline-flex justify-center items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-4 text-sm font-bold hover:border-ink transition">
                  {t(L('สำรวจเข็มทิศ', 'Explore the compass'))} <Compass size={24} aria-hidden="true" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-ui text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={24} aria-hidden="true" /> {t(L('4 หมวดสั้น ๆ', '4 short sections'))}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart size={24} aria-hidden="true" /> {t(L('ไม่มีคำตอบถูกหรือผิด', 'No right or wrong answers'))}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Footprints size={24} aria-hidden="true" /> {t(L('ทีละก้าวเล็ก ๆ', 'One small step at a time'))}
                </span>
              </div>
            </div>

            <HeroIllustration />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-white border-y border-black/10 py-14 sm:py-20">
          <div className={container}>
            <div className="max-w-2xl reveal">
              <div className="text-ui uppercase tracking-[.16em] font-extrabold text-accent">{t(L('ใช้งานอย่างไร', 'How it works'))}</div>
              <h2 className="display text-3xl sm:text-5xl font-extrabold mt-3">
                {t(L('ไม่ใช่คำตัดสิน', 'Not a verdict.'))}
                <br />
                {t(L('แต่เป็นจุดเริ่มต้น', 'A starting point.'))}
              </h2>
              <p className="text-read text-muted leading-relaxed mt-4">
                {t(
                  L(
                    'คำตอบของคุณคือเบาะแส ไม่ใช่ป้าย เรารวมเบาะแสเหล่านั้นให้คุณเห็นความเป็นไปได้ ลองทำอะไรเล็ก ๆ และตัดสินใจเองว่าอะไรใช่สำหรับคุณ',
                    'Your answers are clues, not labels. We bring those clues together so you can see possibilities, try something small, and decide what feels right for you.',
                  ),
                )}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-10">
              {steps.map(({ icon: Icon, ...step }) => (
                <article key={step.label.en} className={`reveal rounded-[24px] ${step.tone} border border-black/10 p-6`}>
                  <div className={`w-12 h-12 grid place-items-center rounded-2xl ${step.iconTone} border border-black/10`}>
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div className="text-ui uppercase tracking-widest text-muted font-bold mt-6">{t(step.label)}</div>
                  <h3 className="display font-extrabold text-xl mt-2">{t(step.title)}</h3>
                  <p className="text-read text-muted leading-relaxed mt-3">{t(step.copy)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Where are you today */}
        <section id="your-journey" className={`${container} py-14 sm:py-20`}>
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-8 lg:gap-14 items-start">
            <div className="reveal">
              <div className="text-ui uppercase tracking-[.16em] font-extrabold text-accent">{t(L('เริ่มจากตรงที่คุณอยู่', 'Meet yourself where you are'))}</div>
              <h2 className="display text-3xl sm:text-5xl font-extrabold mt-3">
                {t(L('วันนี้คุณอยู่', 'Where are you'))}
                <br />
                {t(L('ตรงไหน', 'today?'))}
              </h2>
              <p className="text-read text-muted leading-relaxed mt-4 max-w-lg">
                {t(
                  L(
                    'ไม่ต้องมีแผนที่สมบูรณ์แบบก็เริ่มได้ เลือกความรู้สึกที่ใกล้กับคุณที่สุด แล้วเราจะช่วยเลือกจุดเริ่มต้นที่สบายใจ',
                    "You don't need to arrive with a perfect plan. Pick the feeling that comes closest to yours, and we'll help you choose a gentle starting point.",
                  ),
                )}
              </p>
              <div className="mt-6 flex items-center gap-2 text-ui text-muted">
                <ShieldCheck size={24} aria-hidden="true" /> {t(L('ข้อมูลเก็บในเครื่องนี้ · ไม่ต้องสมัครบัญชี', 'Private local demo · no account needed'))}
              </div>
            </div>
            <div className="reveal rounded-[28px] bg-white border-[1.5px] border-ink shadow-panel p-5 sm:p-7">
              <div className="grid sm:grid-cols-2 gap-3" role="group" aria-label={t(L('เลือกว่าวันนี้คุณอยู่ตรงไหน', 'Choose where you are today'))}>
                <MoodButton
                  mood="lost"
                  current={mood}
                  onSelect={setMood}
                  icon={<CloudFog size={24} />}
                  iconTone="bg-lilac"
                  title={t(L('ฉันกำลังหาคำตอบ', "I'm figuring it out"))}
                  copy={t(L('มีคำถามอยู่ แต่ยังไม่เห็นทิศทางชัด', 'I have questions, but not a clear direction yet.'))}
                />
                <MoodButton
                  mood="idea"
                  current={mood}
                  onSelect={setMood}
                  icon={<Sun size={24} />}
                  iconTone="bg-lemon"
                  title={t(L('ฉันมีไอเดียแล้ว', 'I have an idea'))}
                  copy={t(L('มีบางอย่างที่สนใจ อยากรู้ว่าควรทำอะไรต่อ', "Something interests me; I'd like to know what to do next."))}
                />
              </div>
              <div className="mt-5 rounded-2xl bg-paper p-5 sm:p-6" aria-live="polite">
                <div className="text-ui uppercase tracking-[.14em] text-muted font-extrabold">{t(current.eyebrow)}</div>
                <h3 className="display font-extrabold text-2xl mt-2">{t(current.title)}</h3>
                <p className="text-read text-muted leading-relaxed mt-3">{t(current.copy)}</p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link to={`/assessment?mode=${mood}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-ui font-bold">
                    {t(current.cta)} <ArrowRight size={24} aria-hidden="true" />
                  </Link>
                  <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-black/10 px-5 py-3.5 text-ui font-bold hover:border-black/40 transition">
                    {t(L('สำรวจเส้นทางของฉัน', 'Explore my paths'))} <Waypoints size={24} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Belief */}
        <section id="why-compass" className="bg-lemon border-y-[1.5px] border-ink py-14 sm:py-20">
          <div className={`${container} grid md:grid-cols-[1fr_auto] items-center gap-8`}>
            <div className="max-w-3xl reveal">
              <div className="text-ui uppercase tracking-[.16em] font-extrabold text-black/55">{t(L('ความเชื่อเบื้องหลัง Who Am I?', 'The belief behind Who Am I?'))}</div>
              <h2 className="display text-3xl sm:text-5xl font-extrabold mt-3">
                {t(L('เข็มทิศเดินแทนคุณไม่ได้', "A compass can't walk for you."))}
                <br className="hidden sm:block" /> {t(L('แต่ช่วยให้คุณเลือกทิศทางได้', 'But it can help you choose a direction.'))}
              </h2>
              <p className="text-read text-black/65 leading-relaxed mt-5 max-w-2xl">
                {t(
                  L(
                    'เราจะไม่บอกว่าคุณต้องเป็นอะไร แต่จะช่วยให้คุณเห็นสิ่งที่สำคัญ สำรวจเส้นทางที่เป็นไปได้ และก้าวไปหนึ่งก้าวที่เป็นของคุณเอง',
                    "We won't tell you who you must become. We'll help you notice what matters, explore possible paths, and take one step that belongs to you.",
                  ),
                )}
              </p>
            </div>
            <div className="reveal flex flex-col items-center justify-center rounded-full w-36 h-36 sm:w-44 sm:h-44 bg-white border-[1.5px] border-ink shadow-panel">
              <Compass size={24} strokeWidth={1.5} aria-hidden="true" />
              <span className="text-ui font-extrabold mt-2 tracking-[.14em]">{t(L('ทางของคุณ', 'YOUR WAY'))}</span>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className={`${container} py-14 sm:py-20`}>
          <div className="rounded-[28px] bg-white border-[1.5px] border-ink shadow-panel p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 reveal">
            <div className="max-w-2xl">
              <div className="text-ui uppercase tracking-[.16em] font-extrabold text-accent">{t(L('ไม่ต้องมีแผนที่สมบูรณ์แบบ', 'No perfect plan required'))}</div>
              <h2 className="display text-3xl sm:text-4xl font-extrabold mt-3">
                {t(L('คุณไม่ได้ช้ากว่าใคร', 'You are not behind.'))}
                <br />
                {t(L('คุณกำลังค้นพบ', 'You are discovering.'))}
              </h2>
              <p className="text-read text-muted leading-relaxed mt-4">
                {t(
                  L(
                    'ใช้เวลาสักครู่ทำความเข้าใจเบาะแสของคุณ จะกลับมา เปลี่ยนใจ หรือเริ่มใหม่เมื่อไรก็ได้',
                    'Take a few minutes to understand your clues. You can come back, change your mind, and begin again whenever you need to.',
                  ),
                )}
              </p>
            </div>
            <Link to="/assessment" className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-6 py-4 text-sm font-bold hover:-translate-y-0.5 transition">
              {t(L('เริ่มเส้นทางของฉัน', 'Begin my journey'))} <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-white">
        <div className={`${container} py-7 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-ui text-muted`}>
          <span>{t(L('© 2026 Who Am I? · เข็มทิศส่วนตัวของคุณ', '© 2026 Who Am I? · Your personal compass.'))}</span>
          <span>
            {t(L('สำรวจอย่างอ่อนโยน เติบโตตามจังหวะของคุณ', 'Explore gently. Grow at your own pace.'))}{' '}
            <Link className="underline underline-offset-4 ml-2" to="/docs">
              {t(L('รายละเอียดเพิ่มเติม', 'More details'))}
            </Link>
            <Link className="underline underline-offset-4 ml-4" to="/dashboard">
              {t(L('เปิด Dashboard', 'Open dashboard'))}
            </Link>
          </span>
        </div>
      </footer>
    </div>
  )
}

interface MoodButtonProps {
  mood: Mood
  current: Mood
  onSelect: (mood: Mood) => void
  icon: ReactNode
  iconTone: string
  title: string
  copy: string
}

function MoodButton({ mood, current, onSelect, icon, iconTone, title, copy }: MoodButtonProps) {
  return (
    <button type="button" className="choice-card text-left rounded-2xl p-5" aria-pressed={mood === current} onClick={() => onSelect(mood)}>
      <span className={`grid place-items-center w-10 h-10 rounded-xl ${iconTone} mb-4`} aria-hidden="true">
        {icon}
      </span>
      <span className="block font-extrabold">{title}</span>
      <span className="block text-read text-black/60 leading-relaxed mt-2">{copy}</span>
    </button>
  )
}

function HeroIllustration() {
  const t = useT()
  const note = 'absolute z-10 rounded-2xl border-[1.5px] border-ink shadow-[0_3px_0_#171717] px-4 py-3'
  return (
    <div className="relative min-h-[450px] sm:min-h-[540px] rounded-[30px] border-[1.5px] border-ink bg-white overflow-hidden shadow-panel">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,246,107,.36),transparent_26%),radial-gradient(circle_at_80%_78%,rgba(201,178,255,.34),transparent_32%)]" />
      <div className="absolute left-5 top-5 z-10 rounded-full bg-white/85 border border-black/10 px-3 py-2 text-ui font-bold">
        <span className="inline-block w-2 h-2 rounded-full bg-lemon border border-black mr-1.5" /> {t(L('เส้นทางของคุณเปลี่ยนได้เสมอ', 'Your journey is allowed to change'))}
      </div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
        <path d="M-40 460C80 460 45 360 180 355S275 285 300 220 420 130 650 175" stroke="#171717" strokeOpacity=".08" strokeWidth="30" strokeLinecap="round" />
        <path className="path-dash" d="M-40 460C80 460 45 360 180 355S275 285 300 220 420 130 650 175" stroke="#C9B2FF" strokeWidth="12" strokeLinecap="round" />
        <path d="M-50 520C95 500 125 450 205 430S350 470 410 390 470 290 650 320" stroke="#FFF66B" strokeWidth="4" strokeLinecap="round" strokeOpacity=".9" />
        <circle cx="180" cy="355" r="19" fill="#DDF1DB" stroke="#171717" strokeWidth="2" />
        <circle cx="300" cy="220" r="13" fill="#FFF66B" stroke="#171717" strokeWidth="2" />
        <circle cx="410" cy="390" r="14" fill="#F5DED1" stroke="#171717" strokeWidth="2" />
        <path d="M445 115l7 16 16 7-16 7-7 16-7-16-16-7 16-7 7-16Z" fill="#C9B2FF" stroke="#171717" strokeWidth="1.8" className="sparkle" />
        <path d="M130 150l4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z" fill="#FFF66B" stroke="#171717" strokeWidth="1.5" className="sparkle" />
      </svg>
      <div className={`${note} left-[7%] top-[23%] sm:left-[10%] bg-lemon rotate-[-5deg]`}>
        <div className="text-ui uppercase font-bold tracking-[.1em] text-black/55">{t(L('เบาะแส', 'A clue'))}</div>
        <div className="font-bold text-sm mt-0.5">{t(L('อะไรให้พลังกับฉัน?', 'What gives me energy?'))}</div>
      </div>
      <div className={`${note} right-[5%] top-[42%] sm:right-[7%] bg-lilac rotate-[4deg]`}>
        <div className="text-ui uppercase font-bold tracking-[.1em] text-black/55">{t(L('ความเป็นไปได้', 'A possibility'))}</div>
        <div className="font-bold text-sm mt-0.5">{t(L('ฉันลองทำอะไรได้บ้าง?', 'What could I try?'))}</div>
      </div>
      <div className={`${note} bottom-[7%] left-[8%] sm:left-[12%] bg-mint rotate-[2deg]`}>
        <div className="text-ui uppercase font-bold tracking-[.1em] text-black/55">{t(L('ก้าวต่อไป', 'A next step'))}</div>
        <div className="font-bold text-sm mt-0.5">{t(L('การทดลองเล็ก ๆ หนึ่งอย่าง', 'One small experiment'))}</div>
      </div>
      <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-[180px]" role="img" aria-label={t(L('มาสคอตเข็มทิศสีเหลืองที่เป็นมิตร', 'Friendly yellow compass mascot'))}>
        <Mascot className="float w-full h-auto drop-shadow-[0_7px_0_rgba(23,23,23,.1)]" />
      </div>
      <div className="absolute z-10 right-5 bottom-5 flex items-center gap-2 bg-white/90 border border-black/10 rounded-full px-3 py-2 text-ui font-bold">
        <Compass size={24} aria-hidden="true" /> {t(L('คุณเป็นคนเลือกทิศทาง', 'You choose the direction'))}
      </div>
    </div>
  )
}
