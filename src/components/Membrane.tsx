import { Arrow, Figure, Node } from './Shared'
export const compartments = {
  mito: { high: '막사이공간 · Intermembrane space', low: '기질 · Matrix', membrane: '미토콘드리아 내막 · Inner mitochondrial membrane', direction: '막사이공간 → 기질' },
  plant: { high: '틸라코이드 내강 · Thylakoid lumen', low: '스트로마 · Stroma', membrane: '틸라코이드 막 · Thylakoid membrane', direction: 'Lumen → Stroma' },
}
export function Membrane({ context, electrons = true, protons = true, atp = true }: { context: 'mito' | 'plant'; electrons?: boolean; protons?: boolean; atp?: boolean }) {
  const c = compartments[context]
  const mito = context === 'mito'
  return <Figure title={mito ? '미토콘드리아 내막 확대' : '틸라코이드 막과 H⁺ 귀환'} description={`H⁺ 축적: ${c.high}. ATP synthase를 통한 합성 방향의 H⁺ 이동: ${c.direction}. 전자와 H⁺는 서로 다른 경로를 따릅니다. Q = ubiquinone, cyt c = cytochrome c.`} height={410}>
    <rect x="15" y="20" width="970" height="145" rx="15" className="high-side" /><rect x="15" y="226" width="970" height="167" rx="15" className="low-side" />
    <text x="34" y="52" className="region-label">A · {c.high}</text><text x="34" y="371" className="region-label">B · {c.low}</text><text x="480" y="392" className="sub-label">{c.membrane}</text>
    <rect x="15" y="169" width="970" height="52" rx="8" className="membrane-band" />{Array.from({ length: 38 }, (_, i) => <g key={i} className="lipid"><circle cx={28 + i * 25} cy="175" r="5" /><path d={`M${26 + i * 25} 181 v10 m4 -10 v10 M${26 + i * 25} 208 v-10 m4 10 v-10`} /><circle cx={28 + i * 25} cy="215" r="5" /></g>)}
    {Array.from({ length: 10 }, (_, i) => <text x={90 + i * 84} y={99 + (i % 2) * 24} key={i} className="proton-symbol">H⁺</text>)}
    {mito ? <><Node x={58} y={174} width={86} label="I" active /><Node x={218} y={211} width={86} label="II" /><Node x={394} y={174} width={86} label="III" active /><Node x={577} y={174} width={86} label="IV" active /><Node x={320} y={173} width={47} label="Q" />
      <text x="78" y="159" className="sub-label">Complex I</text><text x="399" y="159" className="sub-label">Complex III</text><text x="586" y="159" className="sub-label">Complex IV</text><text x="207" y="278" className="sub-label">Complex II · H⁺ 펌프 아님</text>
      {electrons && <g data-testid="electron-path"><Arrow d="M144 193 H314" kind="electron" /><Arrow d="M304 234 H344 V218" kind="electron" /><Arrow d="M367 194 H390" kind="electron" /><Arrow d="M480 195 H573" kind="electron" label="cyt c · e⁻" x={490} y={239} /><Arrow d="M101 294 V223" kind="electron" label="NADH" x={46} y={313} /><Arrow d="M260 323 V285" kind="electron" label="FADH₂ 유래 e⁻" x={205} y={344} /><Arrow d="M624 220 V280" kind="electron" label="O₂ → H₂O" x={560} y={313} /></g>}
      {protons && <g data-testid="proton-path">{[110, 440, 633].map(x => <Arrow key={x} d={`M${x + 42} 273 V123`} kind="proton" label="H⁺" x={x + 48} y={144} />)}</g>}
    </> : <><Node x={87} y={174} width={135} label="PSII" /><Node x={325} y={174} width={148} label="cyt b₆f" active /><Node x={575} y={174} width={95} label="PSI" />{electrons && <g data-testid="electron-path"><Arrow d="M222 195 H319" kind="electron" label="PQ · e⁻" x={244} y={159} /><Arrow d="M473 195 H570" kind="electron" label="PC · e⁻" x={491} y={159} /><Arrow d="M625 222 V283 H722" kind="electron" label="Fd → NADPH" x={577} y={312} /></g>}{protons && <g data-testid="proton-path"><Arrow d="M399 278 V111" kind="proton" label="H⁺" x={414} y={146} /><text x="44" y="140" className="sub-label">2 H₂O → O₂ + 4 H⁺ + 4 e⁻ (PSII)</text></g>}<text x="123" y="307" className="sub-label">PSII·PSI는 빛 흡수</text></>}
    <g className="synthase"><rect x="806" y="154" width="61" height="91" rx="14" /><path d="M836 245 v21" /><ellipse cx="836" cy="286" rx="75" ry="31" /><text x="836" y="282" textAnchor="middle">ATP</text><text x="836" y="302" textAnchor="middle">synthase</text></g>
    {atp && <g data-testid="atp-path"><Arrow d="M836 115 V267" kind="proton" label="H⁺" x={854} y={148} /><Arrow d="M761 335 H916" kind="energy" /><text x="777" y="358" className="sub-label">ADP + Pi → ATP</text></g>}
  </Figure>
}
