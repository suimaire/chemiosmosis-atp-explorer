import { useEffect, useRef, useState } from 'react'
import { Respiration } from './Respiration'
import { Photosynthesis } from './Photosynthesis'
import { Explorer } from './Explorer'
import { Bridge, OrganelleIcon } from './components/Shared'
import { readProgress, saveProgress, type ProgressKey } from './progress'
import { sources } from './content'
import { startPageViews } from './pageViews'
import './App.css'

const routes = ['/', '/respiration', '/photosynthesis', '/explorer']
const routeFromHash = () => routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : '/'
export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [progress, setProgress] = useState(readProgress)
  const heading = useRef<HTMLElement>(null)
  const first = useRef(true)
  useEffect(() => { void startPageViews() }, [])
  useEffect(() => {
    const change = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', change)
    return () => window.removeEventListener('hashchange', change)
  }, [])
  useEffect(() => {
    const names = ['화학삼투를 보기 전에', '세포호흡', '광합성', '화학삼투와 ATP 합성 탐색기']
    document.title = `${names[routes.indexOf(route)]} | HAFS Biology Lab`
    if (first.current) { first.current = false; return }
    window.scrollTo(0, 0)
    heading.current?.focus({ preventScroll: true })
  }, [route])
  function mark(key: ProgressKey) {
    setProgress(p => { if (p[key]) return p; const next = { ...p, [key]: true }; saveProgress(next); return next })
  }
  return <>
    <a className="skip-link" href="#main" onClick={e => { e.preventDefault(); heading.current?.focus(); heading.current?.scrollIntoView() }}>본문으로 건너뛰기</a>
    <header className="site-header"><div className="brand"><span className="brand-mark" aria-hidden="true">H</span><div><a href="#/">HAFS BIOLOGY LAB</a><small>Teacher-built interactive science tools · CH Park</small></div></div><a className="portal-link" href="https://suimaire.github.io/">포털로 돌아가기 ↗</a></header>
    <nav className="main-nav" aria-label="주요 학습 화면">{['사전학습 홈', '세포호흡', '광합성', '화학삼투 탐색기'].map((name, i) => <a key={name} href={`#${routes[i]}`} aria-current={route === routes[i] ? 'page' : undefined}><span>0{i}</span>{name}</a>)}</nav>
    <main id="main" ref={heading} tabIndex={-1}>
      {route === '/' && <>
        <section className="home-intro"><p className="eyebrow">BASIC BIOCHEMISTRY / PRE-LEARNING</p><h1>화학삼투를 보기 전에</h1><p className="lead">세포호흡과 광합성의 큰 흐름을 먼저 정리해 보세요.<br className="desktop-only" /> 전자, H⁺, ATP가 어디에서 만들어지고 어디로 이동하는지 이해하면 화학삼투가 훨씬 잘 보입니다.</p></section>
        <div className="learning-cards">{(['respiration', 'photosynthesis'] as const).map((topic, i) => <a className={`learning-card ${topic}`} href={`#/${topic}`} key={topic}>
          <div className="card-top"><span className="eyebrow">0{i + 1} / {i ? 'PHOTOSYNTHESIS' : 'CELLULAR RESPIRATION'}</span><span className="duration">약 5~7분</span></div>
          <OrganelleIcon plant={!!i} />
          <h2>{i ? '광합성 빠른 정리' : '세포호흡 빠른 정리'}</h2>
          <p className="card-flow">{i ? 'Light → Electron Flow → ATP/NADPH → Calvin Cycle' : 'Glucose → NADH/FADH₂ → Electron Transport → ATP'}</p>
          <p>{i ? '비순환적 전자 흐름 · 순환적 전자 흐름 · H⁺ 기울기 · Calvin cycle' : '해당과정 · 아세틸-CoA 생성 · TCA cycle · 전자전달계와 ATP synthase'}</p>
          <div className="card-bottom"><strong>{i ? '광합성부터 보기' : '세포호흡부터 보기'} <span aria-hidden="true">↗</span></strong><span className="completion">{progress[`${topic}Viewed`] ? '✓ 학습 확인' : '학습 전'}{progress[`${topic}QuizCompleted`] && ' · ✓ 퀴즈 완료'}</span></div>
        </a>)}</div>
        <div className="explorer-entry"><div><p className="eyebrow">READY TO EXPERIMENT?</p><p>큰 흐름을 알고 있다면, 막의 양쪽에서 시작해 보세요.</p></div><a className="button primary" href="#/explorer">탐색기로 바로 들어가기 →</a></div>
        {progress.respirationViewed && progress.photosynthesisViewed && <Bridge />}
        <p className="quiet">사전학습은 잠금 없이 자유롭게 이동할 수 있습니다. 이 브라우저에는 학습 확인·퀴즈 완료 여부 네 항목만 저장합니다.</p>
      </>}
      {route === '/respiration' && <Respiration mark={mark} />}
      {route === '/photosynthesis' && <Photosynthesis mark={mark} />}
      {route === '/explorer' && <Explorer />}
    </main>
    <footer><div><strong>CHEMIOSMOSIS & ATP SYNTHASE EXPLORER</strong><p>HAFS Basic Biochemistry · 구조에서 흐름으로, 흐름에서 에너지로.</p></div><details className="sources"><summary>About / Sources</summary><p>진핵세포의 세포호흡과 산소발생 광합성을 다룹니다. 그림은 축척을 생략한 교육적 단순화입니다. 막 실험은 정상상태의 제한 모형이며 측정 데이터가 아닙니다.</p><ul>{sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></li>)}</ul><p>R = 8.314462618 J·mol⁻¹·K⁻¹, F = 96485.33212 C·mol⁻¹. 계산·검증 방법은 <a href="https://github.com/suimaire/chemiosmosis-atp-explorer/blob/main/docs/SCIENCE_VALIDATION.md">과학 검증 문서</a>에 기록했습니다.</p><p>공통 조회수 모듈은 포털에서 제공하며, 개인정보를 입력받지 않습니다.</p></details><p data-page-views hidden /></footer>
  </>
}
