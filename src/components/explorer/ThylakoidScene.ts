import * as THREE from 'three'
import type { AnimationState } from '../step04/animationState'
import type { PathVisibility, SceneCallbacks, SceneController } from '../step04/EtcScene'
import { synthaseX, type Point } from '../step04/sceneLayout'
import { b6fProtonPath, ferredoxin, lightRays, lightWave, plastocyanin, plastoquinone, thylakoidComplexes, thylakoidElectronPaths, waterProtonPath } from './thylakoidLayout'

// Concept view of linear electron flow in the thylakoid membrane. It follows the
// mitochondrial concept scene (EtcScene) so the two contexts look and behave alike.
export function createThylakoidScene(canvas: HTMLCanvasElement, initial: AnimationState, callbacks: SceneCallbacks, options: { paths?: PathVisibility } = {}): SceneController {
  let paths = options.paths ?? { electrons: true, protons: true, atp: true }
  // Probe before constructing Three's renderer so unsupported WebGL does not log an uncaught error.
  const context = canvas.getContext('webgl2', { alpha: true, antialias: initial.particleBudget === 1, powerPreference: 'low-power' })
  if (!context) throw new Error('WebGL2 unavailable')
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: initial.particleBudget === 1 })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, initial.particleBudget < 1 ? 1 : 1.5))
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-6.8, 6.8, 4.5, -4.5, 0.1, 60)
  camera.position.set(0, 5, 12)
  camera.lookAt(0, 0, 0)
  scene.add(new THREE.HemisphereLight(0xffffff, 0x68746b, 2.3))
  const sun = new THREE.DirectionalLight(0xffffff, 2.5)
  sun.position.set(-4, 8, 7)
  scene.add(sun)

  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const geometry = <T extends THREE.BufferGeometry>(g: T) => { geometries.add(g); return g }
  const material = (color: number, opacity = 1) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, transparent: opacity < 1, opacity })
    materials.add(m); return m
  }
  const teal = material(0x568b88), darkTeal = material(0x326663), green = material(0x81a46e)
  const photosystem = material(0x4f8f6a), photosystemCap = material(0x2f6448)
  const orange = material(0xc87542), blue = material(0x207cae), atpGreen = material(0x3c934e)
  const photon = new THREE.MeshBasicMaterial({ color: 0xf2bf2c }); materials.add(photon)
  const sphere = geometry(new THREE.SphereGeometry(0.1, 10, 7))
  const addMesh = (g: THREE.BufferGeometry, m: THREE.Material, p: Point, parent: THREE.Object3D = scene) => {
    const mesh = new THREE.Mesh(g, m); mesh.position.set(...p); parent.add(mesh); return mesh
  }
  const box = (w: number, h: number, d: number) => geometry(new THREE.BoxGeometry(w, h, d))
  const cylinder = (r: number, h: number) => geometry(new THREE.CylinderGeometry(r, r, h, 16))
  addMesh(box(12.8, 0.48, 2.1), material(0xc7cfb8), [0, 0, 0])
  addMesh(box(12.8, 0.07, 2.15), material(0xd7cda6), [0, 0.29, 0])
  addMesh(box(12.8, 0.07, 2.15), material(0xbbc9ac), [0, -0.29, 0])
  const lipid = geometry(new THREE.SphereGeometry(0.12, 8, 5))
  const lipids = new THREE.InstancedMesh(lipid, material(0xd7d1b4), 100)
  const matrix = new THREE.Matrix4()
  for (let i = 0; i < 100; i++) {
    matrix.makeTranslation(-6.15 + (i % 50) * 0.25, i < 50 ? 0.33 : -0.33, 1.06)
    lipids.setMatrixAt(i, matrix)
  }
  scene.add(lipids)
  // Photosystems glow briefly as each photon arrives; cyt b₆f matches the mitochondrial pumps.
  const glows = thylakoidComplexes.filter(c => c.light).map(c => {
    const glow = new THREE.MeshBasicMaterial({ color: 0xf6d36b, transparent: true, opacity: 0, depthWrite: false }); materials.add(glow)
    addMesh(cylinder(0.66, 1.3), glow, [c.x, 0.05, 0])
    return glow
  })
  thylakoidComplexes.forEach(c => {
    addMesh(cylinder(c.light ? 0.5 : 0.42, 1.6), c.light ? photosystem : teal, [c.x, 0.05, 0])
    addMesh(cylinder(c.light ? 0.54 : 0.46, 0.16), c.light ? photosystemCap : darkTeal, [c.x, 0.7, 0])
  })
  addMesh(geometry(new THREE.SphereGeometry(0.19, 12, 8)), material(0xd0aa55), plastoquinone)
  addMesh(geometry(new THREE.SphereGeometry(0.15, 12, 8)), material(0x7e8cc0), plastocyanin)
  addMesh(geometry(new THREE.SphereGeometry(0.15, 12, 8)), material(0xb07a52), ferredoxin)
  addMesh(cylinder(0.36, 0.9), green, [synthaseX, 0, 0])
  addMesh(cylinder(0.1, 1.15), darkTeal, [synthaseX, -0.9, 0])
  const head = addMesh(geometry(new THREE.SphereGeometry(0.58, 20, 12)), green, [synthaseX, -1.7, 0])
  head.scale.y = 0.65
  const rotor = new THREE.Group(); rotor.position.set(synthaseX, -1.7, 0); scene.add(rotor)
  for (let i = 0; i < 3; i++) {
    const angle = i * Math.PI * 2 / 3
    addMesh(geometry(new THREE.SphereGeometry(0.14, 10, 7)), atpGreen, [Math.cos(angle) * 0.57, 0, Math.sin(angle) * 0.57], rotor)
  }
  const shaft = addMesh(box(0.16, 0.82, 0.16), atpGreen, [0, 0.65, 0], rotor)
  shaft.rotation.y = Math.PI / 4

  const makePath = (points: Point[], color: number, dashed = false, opacity = 0.4) => {
    const g = geometry(new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p))))
    const m = dashed ? new THREE.LineDashedMaterial({ color, dashSize: 0.14, gapSize: 0.12, transparent: true, opacity: 0.6 }) : new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    materials.add(m)
    const line = new THREE.Line(g, m); line.computeLineDistances(); scene.add(line); return line
  }
  const arrow = geometry(new THREE.ConeGeometry(0.1, 0.22, 8))
  const pointArrow = (from: Point, to: Point, m: THREE.Material) => {
    const cone = addMesh(arrow, m, to); cone.rotation.z = Math.atan2(to[1] - from[1], to[0] - from[0]) - Math.PI / 2; return cone
  }
  const electronLines = thylakoidElectronPaths.map(p => makePath(p, 0x428bad, true))
  const lightPaths = lightRays.map(ray => lightWave(ray))
  const lightLines = lightPaths.map(p => makePath(p, 0xd9a21b, false, 0.85))
  const lightArrows = lightRays.map(([from, to]) => pointArrow(from, to, photon))
  const protonPaths = [waterProtonPath, b6fProtonPath]
  const returnPath: Point[] = [[synthaseX, 1.7, 1.15], [synthaseX, -1.35, 1.15]]
  const protonLines = protonPaths.map(p => makePath(p, 0xc87542))
  const protonArrows = protonPaths.map(p => pointArrow(p[0], p[1], orange))
  const returnLine = makePath(returnPath, 0xc87542)
  const returnArrow = pointArrow(returnPath[0], returnPath[1], orange)

  const cloud = new THREE.InstancedMesh(sphere, orange, 60); scene.add(cloud)
  const cloudPositions: Point[] = Array.from({ length: 60 }, (_, i) => [-5.85 + ((i * 17) % 59) / 59 * 11.5, 2.1 + ((i * 7) % 11) / 11 * 0.9, -0.7 + (i % 4) * 0.4])
  const pools = (count: number, m: THREE.Material) => Array.from({ length: count }, () => addMesh(sphere, m, [0, 0, 0]))
  const electrons = thylakoidElectronPaths.map(() => pools(8, blue))
  const photons = lightPaths.map(() => pools(3, photon))
  photons.flat().forEach(m => m.scale.setScalar(1.3))
  const protons = protonPaths.map(() => pools(4, orange))
  const returns = pools(5, orange), atps = pools(3, atpGreen)
  const cumulative = (points: Point[]) => {
    const v = points.map(p => new THREE.Vector3(...p)); const lengths = [0]
    for (let i = 1; i < v.length; i++) lengths.push(lengths[i - 1] + v[i].distanceTo(v[i - 1]))
    return (fraction: number, target: THREE.Vector3) => {
      const d = fraction * lengths[lengths.length - 1]
      let i = 1; while (i < lengths.length - 1 && lengths[i] < d) i++
      target.lerpVectors(v[i - 1], v[i], (d - lengths[i - 1]) / (lengths[i] - lengths[i - 1]))
    }
  }
  const electronCurves = thylakoidElectronPaths.map(cumulative), photonCurves = lightPaths.map(cumulative)
  const protonCurves = protonPaths.map(cumulative), returnCurve = cumulative(returnPath)
  let state = initial, paused = false, disposed = false, inView = true, raf = 0, last = 0, frames = 0, slowFrames = 0, lowDetail = false
  const phases = { light: 0, electron: 0, pump: 0, synthase: 0, atp: 0 }
  const countFor = (pool: THREE.Mesh[], rate: number, budget: number) => rate <= 0.0001 ? 0 : Math.max(1, Math.min(pool.length, Math.ceil(rate * 3 * budget)))
  const movePool = (pool: THREE.Mesh[], curve: ReturnType<typeof cumulative>, phase: number, rate: number, budget: number) => {
    const count = countFor(pool, rate, budget)
    pool.forEach((m, i) => { m.visible = i < count; if (m.visible) curve((phase + i / count) % 1, m.position) })
  }
  function render(dt: number) {
    const s = state, motion = paused ? 0 : s.motionIntensity
    const budget = s.particleBudget * (lowDetail ? 0.5 : 1)
    phases.light += dt * s.electronFlowSpeed * 0.35 * motion
    phases.electron += dt * s.electronFlowSpeed * 0.25 * motion
    phases.pump += dt * s.protonPumpRate * 0.5 * motion
    phases.synthase += dt * s.synthaseRotationSpeed * 0.4 * motion
    phases.atp += dt * s.atpPulseRate * 0.4 * motion
    photons.forEach((pool, i) => movePool(pool, photonCurves[i], phases.light, s.electronFlowSpeed, budget))
    // A photosystem brightens just after a photon reaches it, then fades.
    glows.forEach((glow, i) => {
      const count = countFor(photons[i], s.electronFlowSpeed, budget)
      const arrival = count ? Math.max(...Array.from({ length: count }, (_, k) => Math.max(0, 1 - ((phases.light + k / count) % 1) / 0.2))) : 0
      glow.opacity = count ? 0.08 + 0.3 * arrival : 0
    })
    electrons.forEach((pool, i) => movePool(pool, electronCurves[i], phases.electron, s.electronFlowSpeed, budget))
    protons.forEach((pool, i) => movePool(pool, protonCurves[i], phases.pump, s.protonPumpRate, budget))
    movePool(returns, returnCurve, phases.synthase, s.synthaseRotationSpeed, budget)
    rotor.rotation.y = phases.synthase * Math.PI * 2
    cloud.count = Math.min(60, Math.round(s.protonDensity * 30 * budget))
    for (let i = 0; i < cloud.count; i++) { matrix.makeTranslation(...cloudPositions[i]); cloud.setMatrixAt(i, matrix) }
    cloud.instanceMatrix.needsUpdate = true
    atps.forEach((m, i) => {
      const phase = (phases.atp + i / atps.length) % 1
      const window = Math.min(0.8, s.atpPulseRate * 0.26)
      const t = window > 0 ? phase / window : 1
      m.visible = s.atpPulseRate > 0.001 && t < 1
      m.position.set(synthaseX + 0.25 + t * 0.7, -2.15 - t * 0.65, 0.3)
      m.scale.setScalar(1.6 * (1 - t * 0.5))
    })
    // Visibility is a teaching aid only. Light drives the electron path, so it follows that toggle.
    ;[...electronLines, ...lightLines, ...lightArrows].forEach(m => { m.visible = paths.electrons })
    ;[...electrons.flat(), ...photons.flat()].forEach(m => { m.visible = m.visible && paths.electrons })
    glows.forEach(glow => { glow.visible = paths.electrons })
    ;[...protonLines, ...protonArrows, cloud].forEach(m => { m.visible = paths.protons })
    protons.flat().forEach(m => { m.visible = m.visible && paths.protons })
    returnLine.visible = returnArrow.visible = rotor.visible = paths.atp
    ;[...returns, ...atps].forEach(m => { m.visible = m.visible && paths.atp })
    canvas.dataset.frame = String(++frames)
    canvas.dataset.density = s.protonDensity.toFixed(4)
    canvas.dataset.rotation = rotor.rotation.y.toFixed(4)
    canvas.dataset.lightParticles = String(photons.flat().filter(m => m.visible).length)
    canvas.dataset.electronParticles = String(electrons.flat().filter(m => m.visible).length)
    canvas.dataset.pumpParticles = String(protons.flat().filter(m => m.visible).length)
    canvas.dataset.returnParticles = String(returns.filter(m => m.visible).length)
    renderer.render(scene, camera)
  }
  const fail = () => { if (!disposed) { dispose(); callbacks.onFailure() } }
  function tick(time: number) {
    raf = 0
    if (disposed || paused || document.hidden || !inView) return
    // Render at most 30 fps (15 in reduced motion/mobile); never advance by a hidden-tab interval.
    const interval = state.motionIntensity < 1 || state.particleBudget < 1 || lowDetail ? 65 : 32
    if (!last) last = time - interval
    const delta = time - last
    if (delta >= interval) {
      if (delta > 130) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1)
      if (slowFrames > 20 && !lowDetail) { lowDetail = true; renderer.setPixelRatio(1); callbacks.onLowDetail() }
      if (slowFrames > 80) { fail(); return }
      last = time
      try { render(Math.min(delta / 1000, 0.16)) } catch { fail(); return }
    }
    raf = requestAnimationFrame(tick)
  }
  function schedule() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0; last = 0
    canvas.dataset.motion = paused ? 'paused' : !inView ? 'offscreen' : document.hidden ? 'hidden' : disposed ? 'disposed' : 'running'
    if (!disposed && !paused && inView && !document.hidden) raf = requestAnimationFrame(tick)
  }
  const resize = new ResizeObserver(() => {
    if (disposed) return
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    try { render(0) } catch { fail() }
  })
  const visibility = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule() })
  const onLost = (event: Event) => { event.preventDefault(); fail() }
  canvas.addEventListener('webglcontextlost', onLost)
  document.addEventListener('visibilitychange', schedule)
  resize.observe(canvas); visibility.observe(canvas)
  function dispose() {
    if (disposed) return
    disposed = true; cancelAnimationFrame(raf)
    resize.disconnect(); visibility.disconnect()
    canvas.removeEventListener('webglcontextlost', onLost)
    document.removeEventListener('visibilitychange', schedule)
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose())
    lipids.dispose(); cloud.dispose(); renderer.dispose(); renderer.forceContextLoss()
  }
  try { renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); render(0); schedule() } catch (error) { dispose(); throw error }
  return {
    setPaths(nextPaths) { paths = nextPaths; if (!disposed) { try { render(0) } catch { fail() } } },
    update(nextState, isPaused) {
      state = nextState; paused = isPaused
      try { render(0); schedule() } catch { fail() }
    },
    dispose,
  }
}
