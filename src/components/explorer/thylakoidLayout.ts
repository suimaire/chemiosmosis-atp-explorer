import type { Point } from '../step04/sceneLayout'

// Same camera and overlay projection as the mitochondrial scene (step04/sceneLayout).
// The H⁺-rich lumen is drawn on top and the stroma below, so both membranes read alike.
export const thylakoidComplexes = [
  { name: 'PSII', x: -4.45, light: true },
  { name: 'cyt b₆f', x: -1, light: false },
  { name: 'PSI', x: 1.5, light: true },
] as const
export const plastoquinone: Point = [-2.75, 0.1, 1.12]
export const plastocyanin: Point = [0.25, 1.25, 0.6]
export const ferredoxin: Point = [2.25, -1.2, 0.6]
// Linear flow: H₂O → PSII → PQ → cyt b₆f, then cyt b₆f → PC → PSI → Fd → NADP⁺.
export const thylakoidElectronPaths: Point[][] = [
  [[-4.45, 1.85, 0.6], [-4.45, 0.85, 0.6], [-4.45, 0.1, 1.12], plastoquinone, [-1, 0.1, 1.12]],
  [[-1, 0.1, 1.12], [-1, 1.25, 0.6], plastocyanin, [1.5, 1.25, 0.6], [1.5, -0.9, 0.6], ferredoxin, [2.6, -2, 0.6]],
]
// H⁺ reach the lumen from water oxidation at PSII and across the PQ/cyt b₆f step.
export const waterProtonPath: Point[] = [[-3.95, 0.85, 1.25], [-3.95, 2, 1.25]]
export const b6fProtonPath: Point[] = [[-1.42, -0.75, 1.3], [-1.42, 1.85, 1.3]]
// Photosystems absorb light arriving from either side of the membrane. It enters from the
// stroma here only to match the photosynthesis lesson's figure (LightFlow).
export const lightRays: [Point, Point][] = [
  [[-5.95, -2.25, 0.5], [-5, -0.8, 0.5]],
  [[0.3, -2.25, 0.5], [1, -0.8, 0.5]],
]
export function lightWave([start, end]: [Point, Point], waves = 3.5, amplitude = 0.08): Point[] {
  const dx = end[0] - start[0], dy = end[1] - start[1], length = Math.hypot(dx, dy)
  return Array.from({ length: 29 }, (_, i) => {
    const t = i / 28, offset = Math.sin(t * waves * Math.PI * 2) * amplitude
    return [start[0] + dx * t - dy / length * offset, start[1] + dy * t + dx / length * offset, start[2]] as const
  })
}
