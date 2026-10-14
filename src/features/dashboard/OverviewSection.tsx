import { Link } from 'react-router'
import { ArrowUpRight, Clock3, Telescope } from 'lucide-react'
import { Mascot } from '../../components/Mascot'
import { careers, type CareerId } from '../../data/careers'

interface OverviewSectionProps {
  interestsSelected: number
  interestsTotal: number
  skillCount: number
  experimentsDone: number
  experimentsTotal: number
  /** Top career from the completed assessment, if any. */
  suggestedCareer: CareerId | null
}

export function OverviewSection({ interestsSelected, interestsTotal, skillCount, experimentsDone, experimentsTotal, suggestedCareer }: OverviewSectionProps) {
  return (
    <section id="overview" className="pt-7 sm:pt-9 scroll-mt-28" aria-label="Overview">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,.75fr)] gap-5">
        <div className="relative overflow-hidden rounded-[25px] bg-lemon border-[1.5px] border-ink shadow-panel min-h-[255px] sm:min-h-[285px] p-6 sm:p-8 flex flex-col justify-between">
          <div className="relative z-10 max-w-[580px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em]">
              <span className="w-2 h-2 rounded-full bg-[#74a875]" /> Your journey, your rules
            </div>
            <h1 className="section-title text-[38px] sm:text-[50px] leading-[1.02] font-extrabold mt-5 max-w-[590px]">
              Your future isn't<br className="hidden sm:block" /> a single choice<span className="text-[#7360bf]">.</span>
            </h1>
            <p className="text-sm sm:text-[15px] leading-relaxed mt-4 max-w-[440px] text-black/70">
              Discover what matters to you, connect it to real-world possibilities, and try tiny steps before making big decisions.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white text-xs font-bold px-5 py-3 hover:-translate-y-0.5 transition shadow-[0_3px_0_rgba(23,23,23,.25)]"
            >
              {suggestedCareer ? 'Revisit your discovery form' : 'Start your discovery form'} <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
            <span className="text-[11px] font-medium text-black/60 flex items-center gap-1.5">
              <Clock3 size={24} aria-hidden="true" /> Just 5 minutes today
            </span>
          </div>
          <div className="absolute right-[-6px] bottom-[-20px] sm:right-4 sm:bottom-0 w-[150px] sm:w-[210px] opacity-95 pointer-events-none" aria-hidden="true">
            <Mascot sparkles className="mascot-bob w-full h-auto" />
          </div>
          <svg className="absolute right-[125px] sm:right-[205px] top-7 w-24 sm:w-36 opacity-40" viewBox="0 0 150 100" fill="none" aria-hidden="true">
            <path d="M4 70C30 8 63 95 91 36c13-27 28-29 53-18" stroke="#806ad0" strokeWidth="2" strokeLinecap="round" className="hero-orbit" />
            <circle cx="91" cy="36" r="4" fill="#806ad0" />
          </svg>
        </div>

        <div className="panel bg-white p-5 sm:p-6 flex flex-col justify-between min-h-[255px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="eyebrow">Your current snapshot</div>
              <h2 className="section-title text-2xl font-extrabold mt-2">
                {suggestedCareer ? 'You have a first clue.' : "You're in discovery mode."}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-lilac grid place-items-center" aria-hidden="true">
              <Telescope size={24} />
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed mt-2">
            {suggestedCareer
              ? `Your form pointed toward ${careers[suggestedCareer].name} — one path among several. Try a small experiment before deciding anything.`
              : "You don't need a perfect plan. Collect a few clues, notice what gives you energy, and let your direction take shape."}
          </p>
          <div className="grid grid-cols-3 gap-2 mt-5">
            <Stat label="Interests" value={interestsSelected} total={interestsTotal} caption="mapped" tone="bg-paper" />
            <Stat label="Skills" value={skillCount} caption="explored" tone="bg-lilac/70" />
            <Stat label="Experiments" value={experimentsDone} total={experimentsTotal} caption="completed" tone="bg-[#D8F0D8]" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, total, caption, tone }: { label: string; value: number; total?: number; caption: string; tone: string }) {
  return (
    <div className={`rounded-2xl ${tone} p-3`}>
      <span className="text-[10px] text-muted block">{label}</span>
      <span className="section-title text-2xl font-extrabold">
        {value}
        {total !== undefined && <span className="text-xs font-medium text-muted">/{total}</span>}
      </span>
      <span className="text-[9px] text-muted block mt-1">{caption}</span>
    </div>
  )
}
