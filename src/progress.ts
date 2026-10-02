export const progressKeys = ['respirationViewed', 'photosynthesisViewed', 'respirationQuizCompleted', 'photosynthesisQuizCompleted'] as const
export type ProgressKey = typeof progressKeys[number]
export type Progress = Record<ProgressKey, boolean>
export function readProgress(): Progress {
  return Object.fromEntries(progressKeys.map(key => {
    try { return [key, localStorage.getItem(key) === 'true'] } catch { return [key, false] }
  })) as Progress
}
export function saveProgress(progress: Progress) {
  for (const key of progressKeys) {
    try { localStorage.setItem(key, String(progress[key])) } catch { /* Private mode: learning still works. */ }
  }
}
