export type Question = { prompt: string; options: string[]; answer: number; explanation: string }
export const respirationSteps = [
  { title: '해당과정', english: 'Glycolysis', location: '세포질', input: '포도당 1분자', output: '피루브산 2 · NADH 2 · 순 ATP 2', method: '기질수준 인산화', relation: '전자 운반체를 준비', detail: '6C 포도당이 두 개의 3C 피루브산으로 나뉩니다. ATP 2개를 투자하고 4개를 만들어, 순 ATP 2개와 NADH 2개를 얻습니다.', key: '여기서 ATP가 만들어지지만, 아직 ATP synthase를 이용하는 화학삼투는 아니다.' },
  { title: '아세틸-CoA 생성', english: 'Pyruvate oxidation', location: '미토콘드리아 기질', input: '피루브산 2 · CoA 2 · NAD⁺ 2', output: '아세틸-CoA 2 · CO₂ 2 · NADH 2', method: 'ATP 직접 생성 없음', relation: 'NADH에 전자를 모음', detail: '각 3C 피루브산에서 탄소 하나가 CO₂로 방출됩니다. 남은 2C 아세틸기에 CoA가 결합합니다.', key: '탄소의 일부가 CO₂로 방출되고, 전자는 NADH에 저장된다.' },
  { title: 'TCA 회로', english: 'TCA cycle', location: '미토콘드리아 기질', input: '아세틸-CoA 2분자', output: 'CO₂ 4 · NADH 6 · FADH₂ 2 · ATP 2 상당', method: '기질수준 인산화', relation: '전자 운반체를 공급', detail: '아세틸-CoA 한 분자가 들어오면 회로가 한 번 진행되고 옥살로아세트산이 재생됩니다. 포도당 1분자에 해당하는 두 회전의 수지도 비교해 보세요.', key: 'NADH와 FAD-linked 환원력이 생기는 반응을 찾고, succinate dehydrogenase에서 Q로 이어지는 전자 전달을 따라가 보세요.' },
  { title: '전자전달계와 산화적 인산화', english: 'Electron transport & ATP synthase', location: '미토콘드리아 내막', input: 'NADH·FADH₂의 전자 · O₂ · ADP + 무기 인산', output: 'H₂O · ATP', method: '산화적 인산화', relation: 'H⁺ 기울기 → ATP 합성', detail: 'Complex I·III·IV가 H⁺ 기울기 형성에 기여합니다. Complex II는 전자를 전달하지만 H⁺를 펌프하지 않습니다. O₂는 Complex IV에서 최종 전자수용체로 사용되어 H₂O가 됩니다.', key: '여기서부터 화학삼투가 직접 등장한다.' },
]
export const respirationQuestions: Question[] = [
  { prompt: 'TCA 회로에서 생성된 NADH가 이후 가장 직접적으로 연결되는 과정은?', options: ['전자전달계에 전자 공급', '포도당의 탄소 분해', '캘빈 회로의 탄소 고정'], answer: 0, explanation: 'NADH는 Complex I에 전자를 전달합니다. 전자전달의 에너지가 H⁺ 기울기 형성에 연결됩니다.' },
  { prompt: '미토콘드리아에서 H⁺ 농도가 상대적으로 증가하는 구획은?', options: ['미토콘드리아 기질', '막사이공간 (IMS)', '세포핵'], answer: 1, explanation: '내막을 가로질러 기질 → 막사이공간으로 H⁺가 이동합니다. ATP 합성 시에는 ATP synthase를 통해 기질로 돌아옵니다.' },
  { prompt: 'Complex II에 대한 설명 중 옳은 것은?', options: ['O₂를 환원하는 최종 복합체이다', 'H⁺를 막사이공간으로 펌프한다', '전자를 Q에 전달하지만 H⁺를 펌프하지 않는다'], answer: 2, explanation: 'Complex II의 효소 결합 FAD가 받은 전자는 Q로 전달됩니다. H⁺ 펌프 작용은 없습니다.' },
]
export const photoFacts = { calvinLocation: 'Stroma', linear: { psii: true, psi: true, oxygen: true, nadph: true, pmf: true }, cyclic: { psii: false, psi: true, oxygen: false, nadph: false, pmf: true } }
export const photosynthesisQuestions: Question[] = [
  { prompt: 'Linear electron flow에서 O₂는 어떤 과정과 연결되는가?', options: ['PSI의 NADPH 생성', 'PSII에서의 물 산화', 'Calvin cycle의 CO₂ 고정'], answer: 1, explanation: 'PSII의 물 산화가 전자를 공급하고 O₂와 lumen 쪽 H⁺를 방출합니다. 광합성 산소의 기원은 물입니다.' },
  { prompt: 'Cyclic electron flow가 직접 추가 공급에 기여하는 에너지 산물은?', options: ['ATP', 'NADPH의 순생성', 'O₂의 순생성'], answer: 0, explanation: 'PSI 중심의 순환은 H⁺ 기울기와 ATP 합성에 기여합니다. 이 회로 자체의 NADPH·O₂ 순생성은 없습니다.' },
  { prompt: 'Calvin cycle에서 ATP와 NADPH는 어떻게 되는가?', options: ['둘 다 만들어진다', 'ATP만 만들어진다', '둘 다 사용된다'], answer: 2, explanation: 'ATP는 에너지를, NADPH는 환원력을 제공합니다. 3 CO₂에서 순 G3P 1개를 얻는 데 9 ATP와 6 NADPH가 사용됩니다.' },
]
export const sources = [
  { title: 'Alberts et al. · How Cells Obtain Energy from Food', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26882/' },
  { title: 'Cooper · Mitochondria', url: 'https://www.ncbi.nlm.nih.gov/books/NBK9896/' },
  { title: 'Alberts et al. · Electron-Transport Chains and Their Proton Pumps', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26904/' },
  { title: 'Alberts et al. · Chloroplasts and Photosynthesis', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26819/' },
  { title: 'Johnson (2016) · Photosynthesis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5264509/' },
  { title: 'Watt et al. (2010) · Bioenergetic cost of making ATP', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2947889/' },
  { title: 'NIST · CODATA physical constants', url: 'https://physics.nist.gov/cuu/Constants/' },
]
