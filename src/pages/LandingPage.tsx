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

type Mood = 'lost' | 'idea'

const moodCopy: Record<Mood, { eyebrow: string; title: string; copy: string; cta: string }> = {
  lost: {
    eyebrow: 'A gentle place to begin',
    title: "You don't have to know yet.",
    copy: "Start by noticing what draws your attention, what gives you energy, and what kind of problems you like to solve. We'll take it one question at a time.",
    cta: "Let's find a clue",
  },
  idea: {
    eyebrow: 'Turn curiosity into a next step',
    title: 'You can explore before you commit.',
    copy: 'You do not need to make one big decision today. Let’s connect your interest to a few possible paths, then choose a tiny experiment that helps you learn what feels right.',
    cta: 'Explore my next step',
  },
}

const steps = [
  { icon: ScanSearch, label: '01 · Understand', title: 'Notice your clues', copy: 'Reflect on your interests, your natural ways of working, and the things that matter to you.', tone: 'bg-paper', iconTone: 'bg-lemon' },
  { icon: GitBranch, label: '02 · Explore', title: 'See more than one path', copy: 'Connect those clues to different careers, skills, and directions you may not have considered yet.', tone: 'bg-lilac/80', iconTone: 'bg-white' },
  { icon: Footprints, label: '03 · Try', title: 'Make the next step small', copy: 'Try a tiny project, learn from the experience, and change direction whenever you discover something new.', tone: 'bg-peach', iconTone: 'bg-white' },
]

const container = 'max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8'

export function LandingPage() {
  const [mood, setMood] = useState<Mood>('lost')
  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)
  const current = moodCopy[mood]

  return (
    <div ref={pageRef}>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-paper/90 backdrop-blur-xl">
        <div className={`${container} h-[76px] flex items-center justify-between gap-4`}>
          <BrandMark />
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <a className="nav-a" href="#how-it-works">How it works</a>
            <a className="nav-a" href="#your-journey">Your journey</a>
            <a className="nav-a" href="#why-compass">Our belief</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-bold hover:bg-white transition">
              <LayoutDashboard size={24} aria-hidden="true" /> Open my space
            </Link>
            <Link to="/assessment" className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 sm:px-5 py-3 text-xs font-bold hover:-translate-y-0.5 transition">
              Find my direction <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={`${container} pt-8 sm:pt-12 lg:pt-16 pb-12`}>
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(410px,.95fr)] gap-7 lg:gap-12 items-center">
            <div className="py-3 sm:py-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.12em]">
                <span className="w-2 h-2 bg-[#8EA88D] rounded-full" /> A little space to figure things out
              </div>
              <h1 className="display text-[45px] sm:text-[60px] lg:text-[72px] xl:text-[78px] font-extrabold leading-[.98] mt-6 max-w-[760px]">
                Find your way,
                <br />
                at your{' '}
                <span className="relative inline-block isolate">
                  own pace
                  <span className="absolute left-0 right-0 bottom-[2px] h-[9px] sm:h-3 bg-lavender/80 -z-10 rounded-full" />
                </span>
                <span className="text-[#8D78CF]">.</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed sm:leading-7 text-black/65 mt-6 max-w-[560px]">
                Some days, you know exactly where you want to go. Other days, you don't know where to begin. Wherever you are right now, let's explore who you are and find your next step — together.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-8">
                <Link to="/assessment" className="inline-flex justify-center items-center gap-2 rounded-full bg-lemon border-[1.5px] border-ink shadow-panel px-6 py-4 text-sm font-extrabold hover:-translate-y-0.5 transition">
                  Start with a few questions <ArrowUpRight size={24} aria-hidden="true" />
                </Link>
                <Link to="/dashboard" className="inline-flex justify-center items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-4 text-sm font-bold hover:border-ink transition">
                  Explore the compass <Compass size={24} aria-hidden="true" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5"><Clock3 size={24} aria-hidden="true" /> 5 short sections</span>
                <span className="inline-flex items-center gap-1.5"><Heart size={24} aria-hidden="true" /> No right or wrong answers</span>
                <span className="inline-flex items-center gap-1.5"><Footprints size={24} aria-hidden="true" /> One small step at a time</span>
              </div>
            </div>

            <HeroIllustration />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-white border-y border-black/10 py-14 sm:py-20">
          <div className={container}>
            <div className="max-w-2xl reveal">
              <div className="text-[10px] uppercase tracking-[.16em] font-extrabold text-accent">How it works</div>
              <h2 className="display text-3xl sm:text-5xl font-extrabold mt-3">Not a verdict.<br />A starting point.</h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed sm:leading-6 mt-4">
                Your answers are clues, not labels. We bring those clues together so you can see possibilities, try something small, and decide what feels right for you.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-10">
              {steps.map(({ icon: Icon, ...step }) => (
                <article key={step.label} className={`reveal rounded-[24px] ${step.tone} border border-black/10 p-6`}>
                  <div className={`w-12 h-12 grid place-items-center rounded-2xl ${step.iconTone} border border-black/10`}>
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted font-bold mt-6">{step.label}</div>
                  <h3 className="display font-extrabold text-xl mt-2">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-3">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Where are you today */}
        <section id="your-journey" className={`${container} py-14 sm:py-20`}>
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-8 lg:gap-14 items-start">
            <div className="reveal">
              <div className="text-[10px] uppercase tracking-[.16em] font-extrabold text-accent">Meet yourself where you are</div>
              <h2 className="display text-3xl sm:text-5xl font-extrabold mt-3">Where are you<br />today?</h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed sm:leading-6 mt-4 max-w-lg">
                You don't need to arrive with a perfect plan. Pick the feeling that comes closest to yours, and we'll help you choose a gentle starting point.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[11px] text-muted">
                <ShieldCheck size={24} aria-hidden="true" /> Private local demo · no account needed
              </div>
            </div>
            <div className="reveal rounded-[28px] bg-white border-[1.5px] border-ink shadow-panel p-5 sm:p-7">
              <div className="grid sm:grid-cols-2 gap-3" role="group" aria-label="Choose where you are today">
                <MoodButton mood="lost" current={mood} onSelect={setMood} icon={<CloudFog size={24} />} iconTone="bg-lilac" title="I'm figuring it out" copy="I have questions, but not a clear direction yet." />
                <MoodButton mood="idea" current={mood} onSelect={setMood} icon={<Sun size={24} />} iconTone="bg-lemon" title="I have an idea" copy="Something interests me; I'd like to know what to do next." />
              </div>
              <div className="mt-5 rounded-2xl bg-paper p-5 sm:p-6" aria-live="polite">
                <div className="text-[10px] uppercase tracking-[.14em] text-muted font-extrabold">{current.eyebrow}</div>
                <h3 className="display font-extrabold text-2xl mt-2">{current.title}</h3>
                <p className="text-sm text-muted leading-relaxed mt-3">{current.copy}</p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link to={`/assessment?mode=${mood}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-xs font-bold">
                    {current.cta} <ArrowRight size={24} aria-hidden="true" />
                  </Link>
                  <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-black/10 px-5 py-3.5 text-xs font-bold hover:border-black/40 transition">
                    Explore my paths <Waypoints size={24} aria-hidden="true" />
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
              <div className="text-[10px] uppercase tracking-[.16em] font-extrabold text-black/55">The belief behind Who Am I?</div>
              <h2 className="display text-3xl sm:text-5xl font-extrabold mt-3">
                A compass can't walk for you.<br className="hidden sm:block" /> But it can help you choose a direction.
              </h2>
              <p className="text-sm sm:text-base text-black/65 leading-relaxed sm:leading-6 mt-5 max-w-2xl">
                We won't tell you who you must become. We'll help you notice what matters, explore possible paths, and take one step that belongs to you.
              </p>
            </div>
            <div className="reveal flex flex-col items-center justify-center rounded-full w-36 h-36 sm:w-44 sm:h-44 bg-white border-[1.5px] border-ink shadow-panel">
              <Compass size={24} strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[10px] font-extrabold mt-2 tracking-[.14em]">YOUR WAY</span>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className={`${container} py-14 sm:py-20`}>
          <div className="rounded-[28px] bg-white border-[1.5px] border-ink shadow-panel p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 reveal">
            <div className="max-w-2xl">
              <div className="text-[10px] uppercase tracking-[.16em] font-extrabold text-accent">No perfect plan required</div>
              <h2 className="display text-3xl sm:text-4xl font-extrabold mt-3">You are not behind.<br />You are discovering.</h2>
              <p className="text-sm text-muted leading-relaxed mt-4">
                Take a few minutes to understand your clues. You can come back, change your mind, and begin again whenever you need to.
              </p>
            </div>
            <Link to="/assessment" className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-6 py-4 text-sm font-bold hover:-translate-y-0.5 transition">
              Begin my journey <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-white">
        <div className={`${container} py-7 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-[10px] text-muted`}>
          <span>© 2026 Who Am I? · Your personal compass.</span>
          <span>
            Explore gently. Grow at your own pace.{' '}
            <Link className="underline underline-offset-4 ml-2" to="/dashboard">Open dashboard</Link>
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
      <span className={`grid place-items-center w-10 h-10 rounded-xl ${iconTone} mb-4`} aria-hidden="true">{icon}</span>
      <span className="block font-extrabold">{title}</span>
      <span className="block text-xs text-black/60 leading-relaxed mt-2">{copy}</span>
    </button>
  )
}

function HeroIllustration() {
  const note = 'absolute z-10 rounded-2xl border-[1.5px] border-ink shadow-[0_3px_0_#171717] px-4 py-3'
  return (
    <div className="relative min-h-[450px] sm:min-h-[540px] rounded-[30px] border-[1.5px] border-ink bg-white overflow-hidden shadow-panel">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,246,107,.36),transparent_26%),radial-gradient(circle_at_80%_78%,rgba(201,178,255,.34),transparent_32%)]" />
      <div className="absolute left-5 top-5 z-10 rounded-full bg-white/85 border border-black/10 px-3 py-2 text-[10px] font-bold">
        <span className="inline-block w-2 h-2 rounded-full bg-lemon border border-black mr-1.5" /> Your journey is allowed to change
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
        <div className="text-[9px] uppercase font-bold tracking-[.1em] text-black/55">A clue</div>
        <div className="font-bold text-sm mt-0.5">What gives me energy?</div>
      </div>
      <div className={`${note} right-[5%] top-[42%] sm:right-[7%] bg-lilac rotate-[4deg]`}>
        <div className="text-[9px] uppercase font-bold tracking-[.1em] text-black/55">A possibility</div>
        <div className="font-bold text-sm mt-0.5">What could I try?</div>
      </div>
      <div className={`${note} bottom-[7%] left-[8%] sm:left-[12%] bg-mint rotate-[2deg]`}>
        <div className="text-[9px] uppercase font-bold tracking-[.1em] text-black/55">A next step</div>
        <div className="font-bold text-sm mt-0.5">One small experiment</div>
      </div>
      <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-[180px]" role="img" aria-label="Friendly yellow compass mascot">
        <Mascot className="float w-full h-auto drop-shadow-[0_7px_0_rgba(23,23,23,.1)]" />
      </div>
      <div className="absolute z-10 right-5 bottom-5 flex items-center gap-2 bg-white/90 border border-black/10 rounded-full px-3 py-2 text-[10px] font-bold">
        <Compass size={24} aria-hidden="true" /> You choose the direction
      </div>
    </div>
  )
}
