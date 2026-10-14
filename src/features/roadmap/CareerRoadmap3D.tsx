import { useEffect, useRef, useState } from 'react'
import { CAREER_IDS, careers, type NodeId } from '../../data/careers'
import { createCareerScene, type CareerScene } from './careerScene'

interface CareerRoadmap3DProps {
  activeId: NodeId
  onSelect: (id: NodeId) => void
  /** Increment to snap the camera back to its starting angle. */
  resetSignal: number
}

/**
 * Mounts the Three.js scene into a fresh canvas each time, so React StrictMode's
 * mount → unmount → mount never reuses a canvas whose WebGL context was released.
 */
export function CareerRoadmap3D({ activeId, onSelect, resetSignal }: CareerRoadmap3DProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<CareerScene | null>(null)
  const onSelectRef = useRef(onSelect)
  const activeRef = useRef(activeId)
  const [failed, setFailed] = useState(false)

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
      const scene = createCareerScene(canvas, (id) => onSelectRef.current(id))
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
  }, [])

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
          <p className="col-span-full text-sm font-bold mb-1">Career paths</p>
          {CAREER_IDS.map((id) => (
            <button key={id} type="button" className="fallback-career" aria-pressed={activeId === id} onClick={() => onSelect(id)}>
              {careers[id].name} · {careers[id].focus}
            </button>
          ))}
        </div>
      ) : (
        <div className="roadmap-hint">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Drag to rotate <span className="opacity-40">·</span> Scroll to zoom
        </div>
      )}
    </div>
  )
}
