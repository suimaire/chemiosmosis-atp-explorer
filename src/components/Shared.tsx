import { useId, useState, type ReactNode } from 'react'
import type { Question } from '../content'
export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <header className="page-title"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lead">{children}</p></header>
}
export function Figure({ title, description, children, height = 420 }: { title: string; description: string; children: ReactNode; height?: number }) {
  const id = useId().replace(/:/g, '')
  return <figure className="science-figure"><div className="diagram-scroll" tabIndex={0} role="region" aria-label={`${title} 확대 그림. 작은 화면에서는 좌우로 스크롤할 수 있습니다.`}><svg viewBox={`0 0 1000 ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}><title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}</svg></div><figcaption>{description}</figcaption></figure>
}
export function Arrow({ d, kind = 'carbon', label, x, y }: { d: string; kind?: 'carbon' | 'electron' | 'proton' | 'energy'; label?: string; x?: number; y?: number }) {
  const id = useId().replace(/:/g, '')
  return <g className={`flow ${kind}`}><defs><marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="arrowhead" /></marker></defs><path d={d} fill="none" markerEnd={`url(#${id})`} />{label && <text x={x} y={y} className="flow-label">{label}</text>}</g>
}
export function Node({ x, y, width = 145, label, sub, active = false }: { x: number; y: number; width?: number; label: string; sub?: string; active?: boolean }) {
  return <g className={`process-node ${active ? 'active' : ''}`}><rect x={x} y={y} width={width} height={sub ? 60 : 44} rx="9" /><text x={x + width / 2} y={y + 27} textAnchor="middle">{label}</text>{sub && <text x={x + width / 2} y={y + 47} textAnchor="middle" className="sub-label">{sub}</text>}</g>
}
export function Legend() { return <div className="legend"><span><i className="carbon" />탄소 흐름</span><span><i className="electron" />전자 e⁻</span><span><i className="proton" />H⁺ 이동</span><span><i className="energy" />ATP / 환원력</span></div> }
export function Quiz({ questions, onComplete }: { questions: Question[]; onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  return <section className="quiz"><div className="section-heading"><div><p className="eyebrow">QUICK CHECK</p><h2>흐름을 연결해 보세요</h2></div><span>3개의 확인 문제</span></div>{questions.map((q, i) => <fieldset key={q.prompt}><legend><span>0{i + 1}</span>{q.prompt}</legend><div className="quiz-options">{q.options.map((option, j) => <button key={option} aria-pressed={answers[i] === j} onClick={() => { const next = { ...answers, [i]: j }; setAnswers(next); if (questions.every((v, n) => next[n] === v.answer)) onComplete() }}>{option}</button>)}</div>{answers[i] !== undefined && <p className={`feedback ${answers[i] === q.answer ? 'correct' : 'retry'}`} role="status"><strong>{answers[i] === q.answer ? '맞아요.' : '다시 생각해 보세요.'}</strong> {q.explanation}</p>}</fieldset>)}{questions.every((q, i) => answers[i] === q.answer) && <p className="note">✓ 세 문제의 연결을 모두 확인했습니다.</p>}</section>
}
export function Bridge() {
  return <section className="bridge"><p className="eyebrow">ONE PRINCIPLE, TWO SYSTEMS</p><h2>두 시스템에서 같은 원리는 무엇일까?</h2><div className="bridge-grid"><div><h3>Mitochondrion</h3><p>미토콘드리아 내막</p><strong>막사이공간 → 기질</strong><p>환원된 전자 운반체의 산화가 에너지 공급<br />최종 전자수용체: O₂</p></div><div className="shared-principle"><span>전기화학적 H⁺ 기울기</span><b>↓</b><strong>ATP synthase</strong><b>↓</b><span>ADP + Pi → ATP</span></div><div><h3>Chloroplast thylakoid</h3><p>틸라코이드 막</p><strong>내강 (lumen) → 스트로마</strong><p>빛에 의한 전자전달이 에너지 공급<br />비순환적 흐름의 최종 전자수용체: NADP⁺</p></div></div></section>
}
export function OrganelleIcon({ plant }: { plant: boolean }) {
  return <svg className="organelle-art" viewBox="0 0 440 140" role="img" aria-label={plant ? '엽록체의 틸라코이드에서 빛 에너지가 ATP와 NADPH로 연결됩니다.' : '미토콘드리아 내막에서 전자전달이 H⁺ 기울기와 ATP로 연결됩니다.'}><rect x="16" y="24" width="270" height="100" rx="50" fill={plant ? '#e9efdf' : '#f0e8df'} stroke="currentColor" strokeWidth="1.5" />{plant ? [0, 1, 2].map(i => <g key={i}>{[0, 1, 2].map(j => <rect key={j} x={58 + i * 65} y={47 + j * 18} width="49" height="13" rx="6" fill="none" stroke="currentColor" />)}{i < 2 && <path d={`M${107 + i * 65} 72 h16`} stroke="currentColor" />}</g>) : <path d="M48 79 Q48 41 83 46 L90 93 Q96 115 108 86 L116 45 Q136 34 141 79 Q150 111 162 74 L170 45 Q194 33 199 89 Q211 112 222 78 L231 49 Q263 44 264 80 Q265 110 224 112 L84 112 Q47 110 48 79Z" fill="none" stroke="currentColor" strokeWidth="2" />}<path d="M302 74 h47 m-8 -7 8 7 -8 7" fill="none" stroke="currentColor" strokeWidth="2" /><text x="364" y="70" fill="currentColor" fontSize="18" fontWeight="700">ATP</text><text x="358" y="93" fill="currentColor" fontSize="13">{plant ? '+ NADPH' : 'H⁺ →'}</text><text x="32" y="17" fill="currentColor" fontSize="12" letterSpacing="1.2">{plant ? 'LIGHT → CHEMICAL ENERGY' : 'CARBON → ELECTRONS → ATP'}</text></svg>
}
