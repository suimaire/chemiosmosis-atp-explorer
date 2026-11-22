import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { normal, presetKeyFor, type Condition } from '../../science'
import { equilibrium, makeTransition, type ChangeSource } from './conditionTransition'

export function useConditionPlayback(condition: Condition, source: ChangeSource, held: boolean, staticMode: boolean) {
  const [initial] = useState(() => {
    const plan = makeTransition(equilibrium(normal), condition, 'preset', 'normal')
    return { plan, frame: plan.frameAt(plan.duration), condition }
  })
  const current = useRef(initial)
  const [frame, show] = useState(initial.frame)
  const [stepHold, holdStep] = useState(false)
  function seek(seconds: number) {
    const next = current.current.plan.frameAt(seconds)
    current.current.frame = next
    show(next)
  }
  useLayoutEffect(() => {
    const old = current.current
    if (old.condition === condition) return
    const plan = makeTransition(old.frame, condition, source, presetKeyFor(old.condition))
    current.current = { plan, condition, frame: old.frame }
    holdStep(false)
    seek(staticMode && source === 'slider' ? plan.duration : 0)
  }, [condition, source, staticMode])

  const frozen = held || stepHold
  useEffect(() => {
    if (frozen || frame.complete) return
    let last = performance.now()
    const resetClock = () => { last = performance.now() }
    const timer = window.setInterval(() => {
      const now = performance.now()
      const dt = Math.min(0.12, (now - last) / 1000)
      last = now
      if (!document.hidden) seek(current.current.frame.elapsed + dt)
    }, 50)
    document.addEventListener('visibilitychange', resetClock)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', resetClock) }
  }, [frozen, frame.complete])
  const restart = () => { holdStep(false); seek(0) }
  const advance = () => {
    const { plan, frame: displayed } = current.current
    const next = plan.stages.find(s => s.time > displayed.elapsed)?.time ?? plan.duration
    holdStep(!held && next < plan.duration)
    seek(next)
  }
  const resume = () => holdStep(false)
  return { frame, restart, advance, resume, stepHold, frozen }
}
