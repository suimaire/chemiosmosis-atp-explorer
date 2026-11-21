export type Question = { prompt: string; options: string[]; answer: number; explanation: string }
export const respirationSteps = [
  {
    title: '해당과정',
    english: 'Glycolysis',
    location: '세포질',
    input: '포도당 1분자, NAD⁺, ADP, 무기 인산',
    output: '피루브산 2, NADH 2, 순 ATP 2',
    method: '기질수준 인산화',
    relation: '세포질 NADH의 전자를 셔틀로 전달',
    detail: '세포질에서 포도당의 탄소 6개가 피루브산 두 분자에 나뉜다. G3P의 산화는 NADH를, 인산화 중간체에서 ADP로의 인산기 전달은 ATP를 생성한다.',
  },
  {
    title: '아세틸-CoA 생성',
    english: 'Pyruvate oxidation',
    location: '미토콘드리아 기질',
    input: '피루브산 2, CoA 2, NAD⁺ 2',
    output: '아세틸-CoA 2, CO₂ 2, NADH 2',
    method: 'ATP 직접 생성 없음',
    relation: '기질 NADH가 복합체 I에 전자를 공급',
    detail: '미토콘드리아 기질에서 피루브산 탈수소효소 복합체가 피루브산을 산화한다. 피루브산 1분자당 CO₂ 1분자가 떨어져 나가고, 아세틸기는 CoA로, 전자는 NAD⁺로 전달된다.',
  },
  {
    title: 'TCA 회로',
    english: 'TCA cycle',
    location: '미토콘드리아 기질 (숙신산 탈수소효소는 내막)',
    input: '아세틸-CoA 2분자, NAD⁺, 유비퀴논, GDP 또는 ADP, 무기 인산',
    output: 'CO₂ 4, NADH 6, 환원형 유비퀴논 2, GTP 또는 ATP 2',
    method: '기질수준 인산화',
    relation: 'NADH와 효소 결합 FADH₂에서 전자 공급',
    detail: '아세틸기(2C)가 옥살로아세트산(4C)과 결합해 시트르산(6C)이 된다. 한 회전에서 CO₂ 두 분자가 방출되고 옥살로아세트산이 재생된다.',
  },
  {
    title: '전자전달계와 산화적 인산화',
    english: 'Electron transport & ATP synthase',
    location: '미토콘드리아 내막',
    input: 'NADH와 효소 결합 FADH₂의 전자, O₂, ADP + 무기 인산',
    output: 'H₂O, ATP',
    method: '산화적 인산화',
    relation: 'H⁺ 기울기 → ATP 합성',
    detail: '기질의 NADH는 복합체 I에 전자를 전달한다. 복합체 II에서는 숙신산이 푸마르산으로 산화될 때 효소에 결합된 FAD가 전자를 받는다. 두 경로의 전자는 유비퀴논(Q)을 거쳐 복합체 III으로, 시토크롬 c를 거쳐 복합체 IV로 전달된다. 최종 전자수용체인 O₂는 복합체 IV에서 전자와 기질의 H⁺를 받아 물로 환원된다.',
    key: '복합체 I, III, IV에서 전자전달과 결합한 H⁺ 수송이 기질에서 막사이공간으로 일어난다. 복합체 II는 H⁺를 수송하지 않는다. H⁺가 ATP 합성효소를 통해 기질로 돌아오면 회전자의 운동이 ATP 합성을 구동한다.',
  },
]
export const respirationQuestions: Question[] = [
  { prompt: 'TCA 회로에서 생성된 NADH가 이후 가장 직접적으로 연결되는 과정은?', options: ['전자전달계에 전자 공급', '포도당의 탄소 분해', '캘빈 회로의 탄소 고정'], answer: 0, explanation: 'TCA 회로에서 생성된 NADH가 복합체 I에서 산화되면 전자는 유비퀴논으로 전달되고 H⁺는 막사이공간으로 이동한다.' },
  { prompt: '미토콘드리아에서 H⁺ 농도가 상대적으로 증가하는 구획은?', options: ['미토콘드리아 기질', '막사이공간 (IMS)', '세포핵'], answer: 1, explanation: '복합체 I, III, IV가 기질에서 막사이공간으로 H⁺를 수송한다. ATP 합성 시 H⁺는 ATP 합성효소를 통해 기질로 돌아온다.' },
  { prompt: '복합체 II에 대한 설명 중 옳은 것은?', options: ['O₂를 환원하는 최종 복합체이다', 'H⁺를 막사이공간으로 펌프한다', '전자를 Q에 전달하지만 H⁺를 펌프하지 않는다'], answer: 2, explanation: '복합체 II에서 숙신산의 전자는 효소에 결합된 FAD를 거쳐 유비퀴논으로 전달된다. 이때 막을 통한 H⁺ 수송은 일어나지 않는다.' },
]
export const photoFacts = { calvinLocation: '스트로마', linear: { psii: true, psi: true, oxygen: true, nadph: true, pmf: true }, cyclic: { psii: false, psi: true, oxygen: false, nadph: false, pmf: true } }
export const photosynthesisQuestions: Question[] = [
  { prompt: '비순환적 전자 흐름에서 O₂를 방출하는 반응은?', options: ['스트로마에서 NADP⁺의 환원', 'PSII에서의 물 산화', '캘빈 회로의 CO₂ 고정'], answer: 1, explanation: '광계 II(PSII)의 산소 발생 복합체가 물 두 분자를 산화하면 O₂ 한 분자와 전자 4개가 생기고 H⁺ 4개가 틸라코이드 내강으로 방출된다.' },
  { prompt: '순환적 전자 흐름이 비순환적 전자 흐름을 보완할 때 추가로 합성할 수 있는 물질은?', options: ['ATP', 'NADPH', 'O₂'], answer: 0, explanation: '광계 I(PSI)에서 나온 전자가 시토크롬 b₆f를 거쳐 다시 PSI로 돌아가는 동안 H⁺가 내강으로 이동한다. 이 기울기로 ATP를 추가 합성하며, 순환 경로 자체에서는 NADPH나 O₂가 생성되지 않는다.' },
  { prompt: '캘빈 회로의 환원 단계에서 ATP와 NADPH는 어떻게 되는가?', options: ['둘 다 만들어진다', 'ATP만 만들어진다', '둘 다 사용된다'], answer: 2, explanation: '3-포스포글리세르산은 ATP로부터 인산기를 받고, 이어 NADPH로부터 전자를 받아 G3P로 환원된다.' },
]
export const sources = [
  { title: 'Alberts et al. / How Cells Obtain Energy from Food', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26882/' },
  { title: 'Cooper / Mitochondria', url: 'https://www.ncbi.nlm.nih.gov/books/NBK9896/' },
  { title: 'Alberts et al. / Electron-Transport Chains and Their Proton Pumps', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26904/' },
  { title: 'Alberts et al. / Chloroplasts and Photosynthesis', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26819/' },
  { title: 'Johnson (2016) / Photosynthesis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5264509/' },
  { title: 'Watt et al. (2010) / Bioenergetic cost of making ATP', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2947889/' },
  { title: 'NIST / CODATA physical constants', url: 'https://physics.nist.gov/cuu/Constants/' },
]
