import { useState } from 'react'
import { ArrowRight, Info, RotateCcw } from 'lucide-react'
import { CAREER_IDS, careers, getNodeInfo, type NodeId } from '../../data/careers'
import { CareerRoadmap3D } from '../roadmap/CareerRoadmap3D'
import { SectionHeading } from './SectionHeading'

interface RoadmapSectionProps {
  activeId: NodeId
  onSelect: (id: NodeId) => void
  onReset: () => void
  onTryCareer: (id: NodeId) => void
}

export function RoadmapSection({ activeId, onSelect, onReset, onTryCareer }: RoadmapSectionProps) {
  const [resetSignal, setResetSignal] = useState(0)
  const info = getNodeInfo(activeId)

  return (
    <section id="roadmap" className="pt-10 sm:pt-12 scroll-mt-24" aria-labelledby="roadmap-heading">
      <SectionHeading
        id="roadmap-heading"
        eyebrow="04 / Explore possibilities"
        title="Career roadmap graph"
        description="Explore connections across X, Y and Z. Drag to orbit the scene, scroll to zoom, or select a career node."
        action={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] text-muted"><span className="w-2.5 h-2.5 rounded-full bg-lemon border border-black/20" />Strong match</span>
            <span className="flex items-center gap-1.5 text-[10px] text-muted"><span className="w-2.5 h-2.5 rounded-full bg-lilac border border-black/20" />Explore</span>
          </div>
        }
      />
      <div className="panel p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold">Possible paths from your clues</h3>
            <p className="text-[11px] text-muted mt-1">Illustrative connections — not an aptitude test or ranking.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setResetSignal((value) => value + 1)
              onReset()
            }}
            className="rounded-full border border-black/10 px-3 py-2 text-[10px] font-semibold hover:bg-paper"
          >
            Reset view <RotateCcw size={24} className="inline ml-1" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(230px,.65fr)] gap-3 items-stretch">
          <div className="graph-scroll rounded-2xl bg-paper border border-black/5 p-2 sm:p-3">
            <CareerRoadmap3D activeId={activeId} onSelect={onSelect} resetSignal={resetSignal} />
            {/* Keyboard and screen-reader route into the same selection the 3D scene drives; visible only while focused so the layout matches the template. */}
            <div className="sr-only focus-within:not-sr-only focus-within:flex flex-wrap gap-1.5 mt-2" role="group" aria-label="Select a node">
              {(['you', ...CAREER_IDS] as NodeId[]).map((id) => (
                <button key={id} type="button" className="pill py-1.5 text-[10px]" aria-pressed={activeId === id} onClick={() => onSelect(id)}>
                  {id === 'you' ? 'You' : careers[id].name}
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-black/10 bg-white p-5 flex flex-col min-h-[260px]" aria-live="polite">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow">{info.type}</span>
              <span className="rounded-full bg-lemon px-2.5 py-1 text-[9px] font-bold">{info.match}</span>
            </div>
            <h3 className="section-title text-2xl font-extrabold mt-4">{info.name}</h3>
            <p className="text-xs text-muted leading-relaxed mt-2">{info.description}</p>
            <div className="mt-5">
              <div className="eyebrow mb-2">Skills to try</div>
              <div className="flex flex-wrap gap-2">
                {info.skills.map((skill) => (
                  <span key={skill} className="pill">{skill}</span>
                ))}
              </div>
            </div>
            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={() => onTryCareer(activeId)}
                className="w-full rounded-full bg-ink text-white font-bold text-[11px] px-4 py-3 hover:bg-black/80 transition"
              >
                Add a tiny experiment <ArrowRight size={24} className="inline ml-1" aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>

        <div className="flex items-center gap-2 mt-4 rounded-xl bg-lemon-soft/60 px-3 py-2.5">
          <Info size={24} aria-hidden="true" />
          <p className="text-[10px] leading-relaxed text-black/65">
            Careers are flexible paths, not boxes. One role can lead to many others, and the same skills can be useful in different fields.
          </p>
        </div>
      </div>
    </section>
  )
}
