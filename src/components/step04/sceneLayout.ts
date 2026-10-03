// The camera looks from (0, 5, 12) at the origin; the overlay uses the same projection.
export type Point = readonly [number, number, number]
export const complexes = [
  { name: 'I', x: -4.7, pump: true },
  { name: 'II', x: -2.8, pump: false },
  { name: 'III', x: -0.7, pump: true },
  { name: 'IV', x: 1.45, pump: true },
] as const
export const synthaseX = 4.05
export const leakX = 5.8
export function project([x, y, z]: Point) {
  return { x: (x + 6.8) * 50, y: 225 - (12 * y - 5 * z) / 13 * 50 }
}
export const electronPaths: Point[][] = [
  [[-5.65, -2.05, 0.6], [-4.7, -0.75, 0.6], [-4.7, 0.1, 1.12], [-1.8, 0.1, 1.12]],
  [[-2.8, -2.05, 0.6], [-2.8, -0.4, 1.12], [-1.8, 0.1, 1.12]],
  [[-1.8, 0.1, 1.12], [-0.7, 0.1, 1.12], [-0.7, 1.25, 0.6], [1.45, 1.25, 0.6], [1.45, -0.9, 0.6], [2.15, -1.9, 0.6]],
]
