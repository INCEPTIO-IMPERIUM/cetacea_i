import { useEffect, useRef, useState } from 'react'
import { careers, type CareerId, type NodeId } from '../../data/careers'
import { L, useLang, useT } from '../../i18n/language'
import { createCareerScene, type CareerScene } from './careerScene'

interface CareerRoadmap3DProps {
  activeId: NodeId
  /** Careers on the map, best match first (up to five). */
  careerIds: CareerId[]
  onSelect: (id: NodeId) => void
  /** Increment to snap the camera back to its starting angle. */
  resetSignal: number
}

/**
 * Mounts the Three.js scene into a fresh canvas each time, so React StrictMode's
 * mount → unmount → mount never reuses a canvas whose WebGL context was released.
 */
export function CareerRoadmap3D({ activeId, careerIds, onSelect, resetSignal }: CareerRoadmap3DProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<CareerScene | null>(null)
  const onSelectRef = useRef(onSelect)
  const activeRef = useRef(activeId)
  const t = useT()
  const lang = useLang()
  const [failed, setFailed] = useState(false)
  // Rebuild the scene only when the careers shown or the language of their card text changes.
  const idsKey = careerIds.join(',')

  useEffect(() => {
    onSelectRef.current = onSelect
    activeRef.current = activeId
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let cancelled = false
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    stage.prepend(canvas)

    // Card labels are drawn onto textures, so wait for the brand font first.
    document.fonts.ready.then(() => {
      if (cancelled) return
      const scene = createCareerScene(canvas, (id) => onSelectRef.current(id), (idsKey ? idsKey.split(',') : []) as CareerId[], lang)
      if (!scene) {
        setFailed(true)
        return
      }
      scene.setActive(activeRef.current)
      sceneRef.current = scene
    })

    return () => {
      cancelled = true
      sceneRef.current?.dispose()
      sceneRef.current = null
      canvas.remove()
    }
  }, [idsKey, lang])

  useEffect(() => {
    sceneRef.current?.setActive(activeId)
  }, [activeId])

  useEffect(() => {
    if (resetSignal) sceneRef.current?.resetView()
  }, [resetSignal])

  return (
    <div ref={stageRef} className="roadmap-stage">
      {failed ? (
        <div className="absolute inset-3 z-10 rounded-2xl bg-white/95 p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 content-center">
          <p className="col-span-full text-sm font-bold mb-1">{t(L('เส้นทางอาชีพ', 'Career paths'))}</p>
          {careerIds.map((id) => (
            <button key={id} type="button" className="fallback-career" aria-pressed={activeId === id} onClick={() => onSelect(id)}>
              {t(careers[id].name)} · {t(careers[id].focus)}
            </button>
          ))}
        </div>
      ) : (
        <div className="roadmap-hint">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {t(L('ลากเพื่อหมุน', 'Drag to rotate'))} <span className="opacity-40">·</span> {t(L('เลื่อนเพื่อซูม', 'Scroll to zoom'))}
        </div>
      )}
    </div>
  )
}
