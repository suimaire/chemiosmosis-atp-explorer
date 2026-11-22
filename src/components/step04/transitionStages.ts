import type { PresetKey } from '../../science'
import { cyanideStages } from './cyanideTransition'

export type Stage = { time: number; title: string; note: string }
export type TransitionKey = PresetKey | 'custom'
const standard = (steps: [string, string][]): Stage[] =>
  steps.map(([title, note], i) => ({ time: [0, 1, 2.6, 4.6, 7][i], title, note }))

const stages: Record<TransitionKey, readonly Stage[]> = {
  normal: standard([
    ['정상 조건 재설정', '전자 공급, 복합체 IV 활성, 막의 누출 전도도와 ATP 합성 조건을 정상값으로 되돌린다.'],
    ['H⁺ 이동 경로 조정', 'ATP 합성효소를 통한 귀환과 누출량이 재설정된 조건에 따라 변한다.'],
    ['기울기 재형성', 'H⁺ 유입이 유출보다 크면 기울기가 커지고, 유출이 더 크면 기울기가 작아진다.'],
    ['산소 소비와 ATP 합성 조정', '현재 기울기에 따라 전자전달과 ATP 합성 속도가 각각 정상 수준에 접근한다.'],
    ['정상 결합 상태', '복합체 I, III, IV가 수송하는 H⁺의 양과 ATP 합성효소 및 누출 경로를 통한 귀환량이 같다.'],
  ]),
  inhibited: standard([
    ['ATP 합성 경로 억제', 'ATP 합성효소를 통한 H⁺ 이동 경로의 활성을 낮춘다.'],
    ['ATP 합성효소를 통한 귀환 제한', '같은 기울기에서도 ATP 합성효소를 통과하는 H⁺와 ATP 생성량이 줄어든다.'],
    ['막사이공간에 H⁺ 축적', '펌핑이 귀환보다 많은 동안 막사이공간에 H⁺가 축적된다.'],
    ['전자전달과 산소 소비 조정', '높아진 기울기에 맞서 H⁺를 수송하기 어려워져 전자전달과 산소 소비가 제한된다.'],
    ['ATP 합성 경로 억제 정상상태', '정상 조건보다 H⁺ 기울기가 크고, 산소 소비와 ATP 합성 속도는 낮다.'],
  ]),
  leak: standard([
    ['누출 전도도 증가', 'ATP 합성효소를 우회해 H⁺가 기질로 돌아가는 경로의 전도도를 높인다.'],
    ['누출 경로로 H⁺ 귀환', '같은 기울기에서도 이 경로를 통한 H⁺ 귀환량이 증가한다.'],
    ['H⁺ 기울기 조정', '총 귀환량이 펌핑을 넘으면 막사이공간의 H⁺ 축적이 감소한다.'],
    ['산소 소비와 ATP 합성 분리', '낮은 기울기는 H⁺ 펌핑을 쉽게 하지만 ATP 합성효소를 구동하는 힘은 약해진다.'],
    ['누출 증가 정상상태', '정상 조건보다 산소 소비가 많고 H⁺ 기울기와 ATP 합성 속도는 낮다.'],
  ]),
  reduced: standard([
    ['전자 공급 감소', 'NADH 경로와 복합체 II 경로에 공급되는 전자 입력을 정상의 25%로 설정한다.'],
    ['전자전달과 산소 소비 제한', '전자 공급이 제한되어 O₂로 전달할 수 있는 전자의 양이 줄어든다.'],
    ['H⁺ 펌핑과 기울기 조정', '복합체 I, III, IV의 수송량과 H⁺ 귀환량의 차이에 따라 기울기가 변한다.'],
    ['ATP 합성 조정', 'ATP 합성효소를 통한 H⁺ 이동량은 남아 있는 기울기에 따라 변한다.'],
    ['입력 감소 정상상태', '정상 조건보다 낮은 전자 공급량에서 H⁺ 기울기와 산화적 ATP 합성이 유지된다.'],
  ]),
  stopped: standard([
    ['전자 공급 중단', 'NADH와 복합체 II를 통한 새 전자 공급을 0으로 낮춘다.'],
    ['전자전달과 펌핑 중단', '전자 공급이 끊기면 O₂ 환원과 복합체 I, III, IV의 H⁺ 펌핑도 멈춘다.'],
    ['남은 H⁺의 귀환', '펌핑이 멈춰도 남은 기울기에 의해 H⁺가 ATP 합성효소와 누출 경로를 통해 돌아온다.'],
    ['H⁺ 기울기 소실 중', 'H⁺ 기울기가 줄어들면서 ATP 합성도 감소한다.'],
    ['전자 공급 중단 정상상태', '전자 공급이 없어 산소 소비가 멈추고 H⁺ 기울기가 소실되어 ATP 합성도 멈춘다.'],
  ]),
  adp: standard([
    ['ADP 공급 제한', 'ATP 합성효소의 기질인 ADP 가용성을 정상의 15%로 설정한다.'],
    ['기질 부족으로 ATP 합성 제한', '합성효소의 활성 설정은 정상이다. 이용할 수 있는 ADP가 적어 ATP 합성과 결합된 H⁺ 귀환이 제한된다.'],
    ['H⁺ 기울기 형성', 'H⁺ 펌핑이 귀환보다 많으면 막사이공간에 H⁺가 축적된다.'],
    ['전자전달과 산소 소비 조정', '높은 기울기가 추가 H⁺ 수송을 어렵게 하므로 전자전달과 산소 소비가 제한된다.'],
    ['ADP 제한 정상상태', 'ADP 부족으로 ATP 합성이 제한된다. 정상 조건보다 H⁺ 기울기는 크고 산소 소비는 적다.'],
  ]),
  cyanide: cyanideStages,
  custom: [
    { time: 0, title: '세부 조건 조절', note: '설정한 전자 공급량과 각 경로의 전도도에 따라 H⁺ 유입과 귀환이 변한다.' },
    { time: 0.9, title: '조절 후 정상상태', note: '설정한 조건에서 H⁺ 유입량과 총유출량이 같다.' },
  ],
}

export function stagesFor(key: TransitionKey, previous: PresetKey | undefined, depleted: boolean, upstreamAvailable: boolean): readonly Stage[] {
  if (key === 'cyanide' && depleted) {
    const notes = [
      '직전 조건에서 산소 소비와 H⁺ 기울기가 이미 0이다.',
      '시안화합물이 복합체 IV에 결합해 O₂로의 전자 전달을 막는다.',
      '말단에서 O₂가 환원되지 않아 산소 소비는 0으로 유지된다.',
      '직전 조건에서 정지한 상류 전자전달은 계속 정지해 있다.',
      '남아 있는 기울기가 없어 H⁺의 순 귀환도 0이다.',
      'H⁺ 기울기가 없으므로 산화적 ATP 합성도 0으로 유지된다.',
    ]
    return cyanideStages.map((stage, i) => ({ ...stage, note: notes[i] ?? stage.note }))
  }
  if (key === 'cyanide' && (previous !== 'normal' || !upstreamAvailable))
    return cyanideStages.map((stage, i) => {
      if (i === 0) return { ...stage, note: '직전 조건의 전자전달 속도와 H⁺ 기울기에서 시안화합물 처리를 시작한다.' }
      if (i === 3 && !upstreamAvailable) return { ...stage, note: '상류 전자전달이 이미 멈춰 운반체에 새 전자가 공급되지 않는다.' }
      return stage
    })
  if (key !== 'normal') return stages[key]
  const reset = previous === 'leak' ? '누출 전도도를 정상값으로 낮추면 같은 기울기에서 우회 귀환량이 감소한다.' :
    previous === 'inhibited' ? 'ATP 합성 경로의 활성을 정상값으로 높이면 남아 있는 기울기가 H⁺ 귀환과 ATP 합성을 구동한다.' :
    previous === 'adp' ? 'ADP 공급을 정상값으로 되돌리면 ATP 합성과 결합된 H⁺ 귀환이 늘어날 수 있다.' :
    previous === 'stopped' || previous === 'reduced' ? '전자 공급을 정상값으로 되돌리면 전자전달에 의해 H⁺가 다시 수송된다.' :
    previous === 'cyanide' ? '모형의 복합체 IV 활성을 정상값으로 재설정하면 O₂ 환원과 H⁺ 펌핑이 가능해진다.' : stages.normal[1].note
  return stages.normal.map((stage, i) => i === 1 ? { ...stage, note: reset } : stage)
}
