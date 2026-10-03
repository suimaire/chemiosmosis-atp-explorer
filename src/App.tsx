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
    <header className="site-header">
      <div className="site-heading">
        <nav className="breadcrumb" aria-label="현재 위치"><a href="https://suimaire.github.io/">수업 포털</a><span aria-hidden="true">›</span><a href="https://suimaire.github.io/#molecular">분자 · 생화학 탐구</a></nav>
        <a className="site-title" href="#/">세포호흡 · 광합성과 화학삼투 탐색기</a>
        {route === '/' && <p className="site-subtitle">세포호흡과 광합성의 흐름을 정리한 뒤, H⁺ 기울기와 ATP 합성을 직접 조작해 봅니다.</p>}
      </div>
      <a className="portal-link" href="https://suimaire.github.io/">← 메인 포털</a>
    </header>
    <nav className="main-nav" aria-label="주요 학습 화면"><div className="main-nav-inner">{['사전학습 홈', '세포호흡', '광합성', '화학삼투 탐색기'].map((name, i) => <a key={name} href={`#${routes[i]}`} aria-current={route === routes[i] ? 'page' : undefined}><span>0{i}</span>{name}</a>)}</div></nav>
    <main id="main" ref={heading} tabIndex={-1}>
      {route === '/' && <>
        <section className="home-intro"><p className="eyebrow">기초 생화학 · 사전학습</p><h1>화학삼투를 보기 전에</h1><p className="lead">세포호흡과 광합성의 큰 흐름을 먼저 정리해 보세요.<br className="desktop-only" /> 전자, H⁺, ATP가 어디에서 만들어지고 어디로 이동하는지 이해하면 화학삼투가 훨씬 잘 보입니다.</p></section>
        <section className="path-section" aria-labelledby="prelearning-title">
          <div className="path-heading"><h2 id="prelearning-title">사전학습 · 큰 흐름 정리</h2><p>순서대로 보면 좋지만, 잠금 없이 자유롭게 이동할 수 있습니다.</p></div>
          <ol className="learning-path">{(['respiration', 'photosynthesis'] as const).map((topic, i) => <li key={topic}><a className={`learning-card ${topic}`} href={`#/${topic}`}>
            <span className="path-number" aria-hidden="true">0{i + 1}</span>
            <div className="path-body">
              <h3>{i ? '광합성 빠른 정리' : '세포호흡 빠른 정리'}</h3>
              <p className="card-flow">{i ? 'Light → Electron Flow → ATP/NADPH → Calvin Cycle' : 'Glucose → NADH/FADH₂ → Electron Transport → ATP'}</p>
              <p className="card-topics">{i ? '비순환적 전자 흐름 · 순환적 전자 흐름 · H⁺ 기울기 · Calvin cycle' : '해당과정 · 아세틸-CoA 생성 · TCA cycle · 전자전달계와 ATP synthase'}</p>
              <p className="card-meta"><span className="duration">약 5~7분</span><span className="completion">{progress[`${topic}Viewed`] ? '✓ 학습 확인' : '학습 전'}{progress[`${topic}QuizCompleted`] && ' · ✓ 퀴즈 완료'}</span></p>
              <strong className="card-action">{i ? '광합성부터 보기' : '세포호흡부터 보기'} <span aria-hidden="true">→</span></strong>
            </div>
            <OrganelleIcon plant={!!i} />
          </a></li>)}</ol>
        </section>
        <section className="path-section explorer-entry" aria-labelledby="explorer-entry-title">
          <div className="path-heading"><h2 id="explorer-entry-title">탐구 · 막을 직접 조작하기</h2><p>큰 흐름을 알고 있다면 바로 시작해도 됩니다.</p></div>
          <div className="explorer-entry-row"><span className="path-number" aria-hidden="true">03</span><div className="path-body"><h3>화학삼투와 ATP 합성 탐색기</h3><p>막의 양쪽에서 시작해 H⁺가 어디에 쌓이고, 왜 에너지가 되며, ATP 합성에 충분한지 여섯 단계로 탐구합니다.</p></div><a className="button primary" href="#/explorer">탐색기로 바로 들어가기 →</a></div>
        </section>
        {progress.respirationViewed && progress.photosynthesisViewed && <Bridge />}
        <p className="quiet storage-note">이 브라우저에는 학습 확인·퀴즈 완료 여부 네 항목만 저장합니다.</p>
      </>}
      {route === '/respiration' && <Respiration mark={mark} />}
      {route === '/photosynthesis' && <Photosynthesis mark={mark} />}
      {route === '/explorer' && <Explorer />}
    </main>
    <footer><div className="footer-inner"><div><strong>세포호흡 · 광합성과 화학삼투 탐색기</strong><p>HAFS Biology Lab · 기초 생화학 — 구조에서 흐름으로, 흐름에서 에너지로.<br />Teacher-built interactive science tools · CH Park</p></div><details className="sources"><summary>자료 출처와 모형 안내</summary><p>진핵세포의 세포호흡과 산소발생 광합성을 다룹니다. 그림은 축척을 생략한 교육적 단순화입니다. 막 실험은 정상상태의 제한 모형이며 측정 데이터가 아닙니다.</p><ul>{sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></li>)}</ul><p>R = 8.314462618 J·mol⁻¹·K⁻¹, F = 96485.33212 C·mol⁻¹. 계산·검증 방법은 <a href="https://github.com/suimaire/chemiosmosis-atp-explorer/blob/main/docs/SCIENCE_VALIDATION.md">과학 검증 문서</a>에 기록했습니다.</p><p>공통 조회수 모듈은 포털에서 제공하며, 개인정보를 입력받지 않습니다.</p></details><p data-page-views hidden /></div></footer>
  </>
}
