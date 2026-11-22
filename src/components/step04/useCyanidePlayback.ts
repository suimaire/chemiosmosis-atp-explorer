import { useEffect, useMemo, useState } from 'react'
import { cyanideDuration, cyanideFrame, cyanideStages } from './cyanideTransition'

export function useCyanidePlayback(active: boolean, paused: boolean) {
  const [elapsed, setElapsed] = useState(0)
  const complete = elapsed >= cyanideDuration
  useEffect(() => {
    if (!active) { setElapsed(0); return }
    if (paused || complete) return
    let previous = performance.now()
    const resetTime = () => { previous = performance.now() }
    const timer = window.setInterval(() => {
      const now = performance.now()
      const delta = (now - previous) / 1000
      previous = now
      if (!document.hidden) setElapsed(value => Math.min(cyanideDuration, value + delta))
    }, 80)
    document.addEventListener('visibilitychange', resetTime)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', resetTime) }
  }, [active, paused, complete])
  const frame = useMemo(() => active ? cyanideFrame(elapsed) : null, [active, elapsed])
  const restart = () => setElapsed(0)
  const advance = () => setElapsed(value => cyanideStages.find(stage => stage.time > value)?.time ?? cyanideDuration)
  return { frame, restart, advance }
}
