let started = false
// Use the portal's exported API. Keep its dedupe state in sessionStorage so
// this app's localStorage remains limited to the four learning flags.
export async function startPageViews() {
  if (started) return
  started = true
  const mount = document.querySelector<HTMLElement>('[data-page-views]')
  if (!mount) return
  if (location.hostname !== 'suimaire.github.io') {
    mount.textContent = '조회수 · 개발 환경에서는 집계하지 않음'
    mount.hidden = false
    return
  }
  try {
    Object.assign(window, { __hafsPageViewsStarted: true })
    const url = 'https://suimaire.github.io/assets/js/page-views.js'
    const counter = await import(/* @vite-ignore */ url)
    let storage: Storage | null = null
    try { storage = window.sessionStorage } catch { /* memory-only visit */ }
    const mode = counter.resolveMode(location)
    if (mode === 'disabled') return
    const counts = await counter.loadCounts({ pageKey: counter.normalizePageKey(location.pathname), mode, storage })
    counter.renderCounts(mount, counts.today, counts.total)
    mount.hidden = false
  } catch { mount.hidden = true }
}
