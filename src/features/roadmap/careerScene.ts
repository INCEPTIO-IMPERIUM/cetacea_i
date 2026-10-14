import * as THREE from 'three'
import { careers, type NodeId } from '../../data/careers'

/**
 * A true 3D career map: perspective camera, depth-separated cards, volumetric
 * routes, XYZ axes and drag-to-orbit / wheel-to-zoom controls.
 * Framework-free so React only owns mounting and selection state.
 */

export interface CareerScene {
  setActive(id: NodeId): void
  resetView(): void
  dispose(): void
}

interface CardSpec {
  name: string
  subtitle: string
  color: string
  size: [number, number]
  position: [number, number, number]
  icon: string
}

type Point = [number, number, number]

const cardSpecs: Record<Exclude<NodeId, 'you'>, CardSpec> = {
  ux: { name: careers.ux.name, subtitle: careers.ux.focus, color: '#FFF66B', size: [3.5, 1.18], position: [-4.15, 2.0, -1.25], icon: '+' },
  front: { name: 'Frontend Dev', subtitle: careers.front.focus, color: '#EDE5FF', size: [3.5, 1.18], position: [4.1, 2.0, 1.75], icon: '‹›' },
  learning: { name: careers.learning.name, subtitle: careers.learning.focus, color: '#DDF1DB', size: [3.75, 1.18], position: [-4.2, -2.15, 1.65], icon: '▣' },
  product: { name: careers.product.name, subtitle: careers.product.focus, color: '#F5DED1', size: [3.55, 1.18], position: [4.1, -1.95, -1.65], icon: '◇' },
  coach: { name: careers.coach.name, subtitle: careers.coach.focus, color: '#FFFFFF', size: [3.0, 0.96], position: [1.85, -3.28, 2.8], icon: '●' },
}

const routeSpecs: { from: NodeId; to: NodeId; color: string; points: Point[] }[] = [
  { from: 'you', to: 'ux', color: '#FFF66B', points: [[-0.48, 0.42, 0.16], [-1.2, 1.04, -0.45], [-2.1, 2.0, -1.9], [-2.45, 2.0, -1.25]] },
  { from: 'you', to: 'front', color: '#C9B2FF', points: [[0.48, 0.42, 0.18], [1.35, 1.2, 1.15], [2.25, 2.05, 2.5], [2.35, 2.0, 1.75]] },
  { from: 'you', to: 'learning', color: '#DDF1DB', points: [[-0.48, -0.42, 0.15], [-1.35, -1.1, 1.55], [-2.25, -2.15, 2.45], [-2.35, -2.15, 1.65]] },
  { from: 'you', to: 'product', color: '#F5DED1', points: [[0.48, -0.42, 0.15], [1.35, -1.05, -0.65], [2.25, -1.95, -2.55], [2.32, -1.95, -1.65]] },
  { from: 'ux', to: 'product', color: '#C9B2FF', points: [[-2.55, 2.0, -1.25], [-1.7, 1.0, -2.4], [0.7, -0.3, -3.1], [2.45, -1.95, -1.65]] },
  { from: 'learning', to: 'coach', color: '#C9B2FF', points: [[-2.35, -2.15, 1.65], [-1.1, -3.1, 2.45], [0.15, -3.7, 3.6], [0.35, -3.28, 2.8]] },
  { from: 'front', to: 'product', color: '#C9B2FF', points: [[2.35, 2.0, 1.75], [3.4, 1.0, 2.8], [3.65, -0.6, 0.7], [2.35, -1.95, -1.65]] },
]

const INITIAL_CAMERA = new THREE.Vector3(5.7, 4.8, 15.5)

/** Returns null when WebGL is unavailable so the caller can show the list fallback. */
export function createCareerScene(canvas: HTMLCanvasElement, onSelect: (id: NodeId) => void): CareerScene | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  } catch (error) {
    console.warn('3D roadmap unavailable; showing the accessible career list instead.', error)
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.18

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  const cameraTarget = new THREE.Vector3(0, 0, 0)
  const orbit = new THREE.Spherical().setFromVector3(INITIAL_CAMERA.clone().sub(cameraTarget))

  // Render only when something changes — the scene is static between interactions.
  let frame = 0
  const requestRender = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      renderer.render(scene, camera)
    })
  }
  const updateCamera = () => {
    camera.position.setFromSpherical(orbit).add(cameraTarget)
    camera.lookAt(cameraTarget)
    requestRender()
  }
  updateCamera()

  scene.add(new THREE.AmbientLight(0xffffff, 1.7))
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.6)
  keyLight.position.set(-4, 8, 10)
  const fillLight = new THREE.DirectionalLight(0xc9b2ff, 1.45)
  fillLight.position.set(7, 0, -5)
  const lemonLight = new THREE.PointLight(0xfff66b, 0.55, 16)
  lemonLight.position.set(-4, 2, 4)
  scene.add(keyLight, fillLight, lemonLight)

  const world = new THREE.Group()
  const routeGroup = new THREE.Group()
  const nodeGroup = new THREE.Group()
  const axisGroup = new THREE.Group()
  world.add(routeGroup, nodeGroup, axisGroup)
  scene.add(world)

  const hitTargets: THREE.Object3D[] = []

  /* ---------- Grids ---------- */
  const softenGrid = (grid: THREE.GridHelper, opacity: number) => {
    const material = grid.material as THREE.Material
    material.transparent = true
    material.opacity = opacity
    material.depthWrite = false
    grid.renderOrder = -2
  }
  const floorGrid = new THREE.GridHelper(15, 15, 0xd8d0ea, 0xe6e2d9)
  floorGrid.position.set(0, -3.8, 0)
  softenGrid(floorGrid, 0.34)
  const backGrid = new THREE.GridHelper(12, 12, 0xd8d0ea, 0xe9e5de)
  backGrid.rotation.x = Math.PI / 2
  backGrid.position.set(0, 0, -3.4)
  softenGrid(backGrid, 0.17)
  world.add(floorGrid, backGrid)

  /* ---------- Routes ---------- */
  const lineMaterial = (color: string, opacity = 1) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.38, metalness: 0.08, transparent: opacity < 1, opacity })
  const makeTube = (points: Point[], radius: number, material: THREE.Material, tubularSegments = 90, radialSegments = 8) => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)), false, 'catmullrom', 0.35)
    return new THREE.Mesh(new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false), material)
  }

  const routes = routeSpecs.map((spec) => {
    const outer = makeTube(spec.points, 0.052, lineMaterial('#bcb8b0', 0.96))
    const inner = makeTube(spec.points.map(([x, y, z]) => [x, y, z + 0.045]), 0.022, lineMaterial('#e7e3dd', 0.98))
    const glint = makeTube(
      spec.points.map(([x, y, z]) => [x, y + 0.045, z + 0.078]),
      0.006,
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.72 }),
      90,
      5,
    )
    routeGroup.add(outer, inner, glint)
    return {
      ...spec,
      outer: outer.material as THREE.MeshStandardMaterial,
      inner: inner.material as THREE.MeshStandardMaterial,
      glint: glint.material as THREE.MeshBasicMaterial,
    }
  })

  /* ---------- Cards ---------- */
  function roundedRectShape(width: number, height: number, radius: number) {
    const x = -width / 2
    const y = -height / 2
    const shape = new THREE.Shape()
    shape.moveTo(x + radius, y)
    shape.lineTo(x + width - radius, y)
    shape.quadraticCurveTo(x + width, y, x + width, y + radius)
    shape.lineTo(x + width, y + height - radius)
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    shape.lineTo(x + radius, y + height)
    shape.quadraticCurveTo(x, y + height, x, y + height - radius)
    shape.lineTo(x, y + radius)
    shape.quadraticCurveTo(x, y, x + radius, y)
    return shape
  }

  function cardTexture(title: string, subtitle: string, icon: string, central = false) {
    const texCanvas = document.createElement('canvas')
    texCanvas.width = 900
    texCanvas.height = 300
    const ctx = texCanvas.getContext('2d')!
    if (central) {
      ctx.fillStyle = '#171717'
      ctx.font = '800 74px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(title, 450, 118)
      ctx.fillStyle = 'rgba(23,23,23,.62)'
      ctx.font = '500 40px Inter, sans-serif'
      ctx.fillText(subtitle, 450, 178)
    } else {
      ctx.fillStyle = 'rgba(255,255,255,.88)'
      ctx.strokeStyle = '#171717'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(88, 106, 43, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#171717'
      ctx.font = `700 ${icon.length > 1 ? 42 : 58}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(icon, 88, 106)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
      ctx.font = '800 48px Inter, sans-serif'
      ctx.fillText(title, 155, 112)
      ctx.fillStyle = 'rgba(23,23,23,.66)'
      ctx.font = '500 35px Inter, sans-serif'
      ctx.fillText(subtitle, 70, 207)
    }
    const texture = new THREE.CanvasTexture(texCanvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    return texture
  }

  // The central "YOU" coin.
  {
    const group = new THREE.Group()
    const outer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.92, 0.92, 0.28, 64),
      new THREE.MeshStandardMaterial({ color: '#171717', roughness: 0.27, metalness: 0.12 }),
    )
    outer.rotation.x = Math.PI / 2
    outer.position.z = 0.02
    outer.userData.nodeId = 'you'
    const face = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.72, 0.075, 64),
      new THREE.MeshStandardMaterial({ color: '#FFF66B', roughness: 0.34, metalness: 0.02 }),
    )
    face.rotation.x = Math.PI / 2
    face.position.z = 0.205
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: '#171717' })
    for (const x of [-0.22, 0.22]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 10), eyeMaterial)
      eye.position.set(x, 0.105, 0.27)
      group.add(eye)
    }
    const smile = makeTube([[-0.23, -0.06, 0.282], [-0.12, -0.16, 0.29], [0, -0.19, 0.29], [0.12, -0.16, 0.29], [0.23, -0.06, 0.282]], 0.025, eyeMaterial, 28, 8)
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: cardTexture('YOU', 'your clues', '', true), transparent: true, depthWrite: false }))
    label.scale.set(2.15, 0.72, 1)
    label.position.set(0, -1.15, 0.1)
    group.add(outer, face, smile, label)
    nodeGroup.add(group)
    hitTargets.push(outer)
  }

  const roleCards = (Object.entries(cardSpecs) as [Exclude<NodeId, 'you'>, CardSpec][]).map(([id, spec]) => {
    const group = new THREE.Group()
    group.position.set(...spec.position)
    const [width, height] = spec.size
    const geometry = new THREE.ExtrudeGeometry(roundedRectShape(width, height, 0.25), {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 14,
    })
    geometry.computeVertexNormals()
    const baseMaterial = new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.34, metalness: 0.04 })
    const base = new THREE.Mesh(geometry, baseMaterial)
    base.userData.nodeId = id
    const edgeMaterial = new THREE.LineBasicMaterial({ color: '#171717', transparent: true, opacity: 0.9 })
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 28), edgeMaterial)
    const front = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 0.08, height - 0.08),
      new THREE.MeshBasicMaterial({ map: cardTexture(spec.name, spec.subtitle, spec.icon), transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    )
    front.position.z = 0.205
    front.userData.nodeId = id
    group.add(base, edge, front)
    nodeGroup.add(group)
    hitTargets.push(base)
    return { id, group, baseMaterial, edgeMaterial }
  })

  /* ---------- XYZ axes ---------- */
  function axisLine(end: Point, color: string, radius = 0.018) {
    const a = new THREE.Vector3(0, 0, 0)
    const b = new THREE.Vector3(...end)
    const direction = new THREE.Vector3().subVectors(b, a)
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, direction.length(), 10),
      new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.08 }),
    )
    mesh.position.copy(a).add(b).multiplyScalar(0.5)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
    axisGroup.add(mesh)
  }
  function axisLabel(text: string, color: string, position: Point) {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 128
    const ctx = c.getContext('2d')!
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(64, 64, 52, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#171717'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.fillStyle = '#171717'
    ctx.font = '800 54px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 64, 67)
    const texture = new THREE.CanvasTexture(c)
    texture.colorSpace = THREE.SRGBColorSpace
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }))
    sprite.scale.set(0.34, 0.34, 1)
    sprite.position.set(...position)
    axisGroup.add(sprite)
  }
  axisGroup.position.set(-5.35, -2.78, 1.25)
  axisLine([1.15, 0, 0], '#171717')
  axisLabel('X', '#FFF66B', [1.38, 0, 0])
  axisLine([0, 1.15, 0], '#8B76CF')
  axisLabel('Y', '#C9B2FF', [0, 1.38, 0])
  axisLine([0, 0, 1.15], '#D5C64B')
  axisLabel('Z', '#DDF1DB', [0, 0, 1.38])

  /* ---------- Selection ---------- */
  function setActive(id: NodeId) {
    for (const route of routes) {
      const active = route.from === id || route.to === id
      route.outer.color.set(active ? '#171717' : '#c4c0b8')
      route.outer.roughness = active ? 0.23 : 0.52
      route.inner.color.set(active ? route.color : '#e8e4dc')
      route.inner.roughness = active ? 0.28 : 0.52
      route.glint.opacity = active ? 0.86 : 0.26
    }
    for (const card of roleCards) {
      const active = card.id === id
      card.edgeMaterial.color.set(active ? '#171717' : '#5e5b55')
      card.edgeMaterial.opacity = active ? 1 : 0.72
      card.baseMaterial.emissive.set(active ? '#161616' : '#000000')
      card.baseMaterial.emissiveIntensity = active ? 0.055 : 0
      card.group.scale.setScalar(active ? 1.035 : 1)
    }
    requestRender()
  }

  /* ---------- Pointer controls ---------- */
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let drag: { x: number; y: number; lastX: number; lastY: number; moved: boolean } | null = null

  function pick(event: PointerEvent): NodeId | null {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(hitTargets, false)[0]
    return hit ? ((hit.object.userData.nodeId as NodeId | undefined) ?? 'you') : null
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    drag = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false }
    try {
      canvas.setPointerCapture(event.pointerId)
    } catch {
      /* pointer capture may be unavailable */
    }
    canvas.style.cursor = 'grabbing'
  }
  const onPointerUp = (event: PointerEvent) => {
    if (!drag) return
    const wasDrag = drag.moved || Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 7
    drag = null
    canvas.style.cursor = 'grab'
    if (wasDrag) return
    const id = pick(event)
    if (id) onSelect(id)
  }
  const onPointerCancel = () => {
    drag = null
    canvas.style.cursor = 'grab'
  }
  const onPointerMove = (event: PointerEvent) => {
    if (drag) {
      const dx = event.clientX - drag.lastX
      const dy = event.clientY - drag.lastY
      if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5) drag.moved = true
      if (drag.moved) {
        orbit.theta -= dx * 0.0065
        orbit.phi = THREE.MathUtils.clamp(orbit.phi - dy * 0.0065, 0.28, Math.PI - 0.28)
        updateCamera()
      }
      drag.lastX = event.clientX
      drag.lastY = event.clientY
      return
    }
    if (event.pointerType === 'mouse') canvas.style.cursor = pick(event) ? 'pointer' : 'grab'
  }
  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    orbit.radius = THREE.MathUtils.clamp(orbit.radius * (event.deltaY > 0 ? 1.08 : 0.92), 10, 22)
    updateCamera()
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerCancel)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('wheel', onWheel, { passive: false })

  /* ---------- Resize ---------- */
  function resize() {
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    renderer.setSize(rect.width, rect.height, false)
    camera.aspect = rect.width / rect.height
    camera.updateProjectionMatrix()
    requestRender()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  return {
    setActive,
    resetView() {
      orbit.setFromVector3(INITIAL_CAMERA.clone().sub(cameraTarget))
      updateCamera()
    },
    dispose() {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerCancel)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('wheel', onWheel)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
        for (const material of materials) {
          ;(material as THREE.MeshBasicMaterial).map?.dispose()
          material.dispose()
        }
      })
      renderer.dispose()
    },
  }
}
