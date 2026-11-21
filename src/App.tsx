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
    const names = ['세포호흡과 광합성', '세포호흡', '광합성', '화학삼투와 ATP 합성 탐색기']
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
        <nav className="breadcrumb" aria-label="현재 위치"><a href="https://suimaire.github.io/">수업 포털</a><span aria-hidden="true">›</span><a href="https://suimaire.github.io/#molecular">분자생물학과 생화학</a></nav>
        <a className="site-title" href="#/">세포호흡과 광합성의 화학삼투</a>
      </div>
      <a className="portal-link" href="https://suimaire.github.io/">← 메인 포털</a>
    </header>
    <nav className="main-nav" aria-label="주요 학습 화면"><div className="main-nav-inner">{['사전학습 홈', '세포호흡', '광합성', '화학삼투 탐색기'].map((name, i) => <a key={name} href={`#${routes[i]}`} aria-current={route === routes[i] ? 'page' : undefined}><span>0{i}</span>{name}</a>)}</div></nav>
    <main id="main" ref={heading} tabIndex={-1}>
      {route === '/' && <>
        <section className="home-intro"><h1>세포호흡과 광합성</h1><p className="lead">미토콘드리아 내막과 틸라코이드 막에서는 전자전달로 H⁺ 기울기가 형성된다. H⁺가 ATP 합성효소를 통해 이동할 때 ADP와 무기 인산으로부터 ATP가 합성된다.</p></section>
        <section className="path-section" aria-labelledby="prelearning-title">
          <div className="path-heading"><h2 id="prelearning-title">사전학습</h2></div>
          <ol className="learning-path">{(['respiration', 'photosynthesis'] as const).map((topic, i) => <li key={topic}><a className={`learning-card ${topic}`} href={`#/${topic}`}>
            <span className="path-number" aria-hidden="true">0{i + 1}</span>
            <div className="path-body">
              <h3>{i ? '광합성' : '세포호흡'}</h3>
              <p className="card-topics">{i ? '비순환적 전자 흐름, 순환적 전자 흐름, 캘빈 회로' : '해당과정, 피루브산 산화, TCA 회로, 산화적 인산화'}</p>
              <p className="card-meta"><span className="completion">{progress[`${topic}Viewed`] ? '✓ 학습 확인' : '학습 전'}{progress[`${topic}QuizCompleted`] && ' / ✓ 퀴즈 완료'}</span></p>
              <strong className="card-action">{i ? '광합성 열기' : '세포호흡 열기'} <span aria-hidden="true">→</span></strong>
            </div>
            <OrganelleIcon plant={!!i} />
          </a></li>)}</ol>
        </section>
        <section className="path-section explorer-entry" aria-labelledby="explorer-entry-title">

          <div className="explorer-entry-row"><span className="path-number" aria-hidden="true">03</span><div className="path-body"><h2 id="explorer-entry-title">화학삼투와 ATP 합성 탐색기</h2><p>막 양쪽의 pH와 막전위로 H⁺ 이동의 자유에너지를 계산하고, H⁺ 누출이 산소 소비와 ATP 합성에 미치는 영향을 비교한다.</p></div><a className="button primary" href="#/explorer">탐색기 열기 →</a></div>
        </section>
        {progress.respirationViewed && progress.photosynthesisViewed && <Bridge />}
        <p className="quiet storage-note">학습 및 퀴즈 완료 기록은 이 브라우저에 저장됩니다.</p>
      </>}
      {route === '/respiration' && <Respiration mark={mark} />}
      {route === '/photosynthesis' && <Photosynthesis mark={mark} />}
      {route === '/explorer' && <Explorer />}
    </main>
    <footer><div className="footer-inner"><div><strong>세포호흡과 광합성의 화학삼투</strong><p>HAFS Biology Lab / CH Park</p></div><details className="sources"><summary>자료 출처</summary><ul>{sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></li>)}</ul><p><a href="https://github.com/suimaire/chemiosmosis-atp-explorer/blob/main/docs/SCIENCE_VALIDATION.md">과학 검증 문서</a></p></details><p data-page-views hidden /></div></footer>
  </>
}
