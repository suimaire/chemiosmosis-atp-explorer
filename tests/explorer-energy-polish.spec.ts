import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { coupledEnergy, defaultGradient, protonEnergy } from '../src/science'

const directory = 'verification/screenshots/explorer-energy-polish'
const sizes = [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]
async function step(page: Page, number: string) {
  await page.getByRole('navigation', { name: '탐색기 모듈' }).getByRole('button', { name: new RegExp(`^${number} `) }).click()
}
async function basic(page: Page) {
  const lesson = page.getByTestId('coupling-lesson')
  await expect(lesson).toHaveAttribute('data-mode', 'basic')
  await expect(lesson.getByRole('button', { name: '+ 심화', exact: true })).toHaveAttribute('aria-expanded', 'false')
  await expect(lesson.getByRole('slider')).toHaveCount(0)
  expect(await lesson.innerText()).not.toMatch(/3\.3|ΔG|n\s*=|H⁺\/ATP|kJ·mol⁻¹|H⁺ 1개당/)
  await expect(lesson.locator('.comparison-track')).toHaveCount(2)
  await expect(lesson.getByText('ATP 합성에 필요한 에너지 · 예시 조건', { exact: true })).toBeVisible()
}
async function shot(page: Page, width: number, name: string) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  for (const selector of ['.module-content', '.energy-comparison', '.coupling-visual', '.coupling-story>li', '.controls-grid']) {
    for (const element of await page.locator(selector).all()) expect(await element.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
  }
  await page.screenshot({ path: `${directory}/${width}-${name}.png`, fullPage: true, animations: 'disabled' })
}

for (const size of sizes) test(`energy basic/advanced and protected 00/03 ${size.width}x${size.height}`, async ({ page }) => {
  await mkdir(directory, { recursive: true })
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  await page.setViewportSize(size)
  await page.goto('./#/explorer')
  await expect(page.getByTestId('concept-model')).toHaveAttribute('data-render-mode', '3d')
  await expect(page.getByRole('navigation', { name: '탐색기 모듈' }).getByRole('button')).toHaveCount(6)
  await shot(page, size.width, '00-regression')

  await step(page, '01')
  const gradient = page.getByTestId('gradient-lesson')
  for (const label of ['A 구획의 pH', 'B 구획의 pH', '막 양쪽 전위 차']) await expect(gradient.getByRole('slider', { name: label, exact: true })).toBeVisible()
  expect(await gradient.innerText()).not.toMatch(/pHA|pHB|Δψ|ψB|ψA/)
  await expect(gradient.locator('.metric small')).toHaveText(['화학적 기여', '전기적 기여', '전체 기울기 에너지'])
  await shot(page, size.width, '01-basic')
  await gradient.getByText('+ 정식 식으로 정리하기', { exact: true }).click()
  await expect(gradient.locator('details')).toContainText('막 양쪽 전위 차는 Δψ = ψB − ψA')
  await expect(gradient.locator('details')).toContainText('pHA')
  await expect(gradient.locator('details')).toContainText('pHB')
  await shot(page, size.width, '01-formal')

  await step(page, '02')
  await basic(page)
  await expect(page.locator('.coupling-result strong')).toHaveText('충분')
  await expect(page.locator('.coupling-result')).toContainText('이 조건에서는 H⁺ 기울기가 ATP 합성을 구동할 만큼 충분합니다.')
  await expect(page.locator('.coupling-visual')).toHaveAttribute('data-active', 'true')
  await expect(page.locator('.coupling-proton')).toHaveCount(3)
  await expect(page.locator('.coupling-reaction strong')).toHaveText('ADP + Pi → ATP')
  await shot(page, size.width, '02-basic')
  await page.locator('.coupling-visual').screenshot({ path: `${directory}/${size.width}-02-visual.png`, animations: 'disabled' })
  const widths = await page.locator('.comparison-track i').evaluateAll(bars => bars.map(bar => bar.getAttribute('style')))

  await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  await expect(page.getByRole('button', { name: '− 기본으로', exact: true })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true })).toHaveValue('3.3')
  await expect(page.getByRole('slider', { name: 'ATP 합성 자유에너지', exact: true })).toHaveValue('50')
  await expect(page.getByText('1 mol의 H⁺ 이동 기준', { exact: true })).toBeVisible()
  await expect(page.locator('.coupling-story')).toContainText('kJ·mol⁻¹ H⁺')
  await expect(page.locator('.coupling-story')).toContainText('H⁺/ATP')
  await expect(page.locator('.coupling-story')).toContainText('n × ΔGH+')
  await expect(page.locator('.coupling-story')).toContainText('결합비는 모든 생물에서 같은 상수가 아닙니다.')
  await expect(page.locator('.coupling-story')).toContainText('실제 값은 ATP/ADP/Pi 상태와 세포 조건에 따라 달라진다.')
  await expect(page.locator('.formula')).toHaveText('ΔGcycle = n × ΔGH+ + ΔGATP 합성')
  await expect(page.locator('.coupling-result strong')).toContainText(coupledEnergy(protonEnergy(defaultGradient).total, 3.3, 50).toFixed(2))
  await expect(page.locator('.coupling-result strong')).toContainText('kJ·mol⁻¹ ATP')
  expect(await page.getByTestId('coupling-lesson').innerText()).not.toContain('H⁺ 1개당')
  expect(await page.locator('.comparison-track i').evaluateAll(bars => bars.map(bar => bar.getAttribute('style')))).toEqual(widths)
  await shot(page, size.width, '02-advanced')

  await page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true }).fill('2')
  await expect(page.locator('.coupling-result')).toHaveAttribute('data-outcome', 'insufficient')
  await page.getByRole('button', { name: '− 기본으로', exact: true }).click()
  await basic(page)
  await expect(page.locator('.coupling-result strong')).toHaveText('부족')
  await expect(page.locator('.coupling-result')).toContainText('이 조건에서는 H⁺ 기울기만으로 ATP 합성을 구동하기 어렵습니다.')
  await expect(page.locator('.coupling-visual')).toHaveAttribute('data-active', 'false')
  await shot(page, size.width, '02-basic-insufficient')

  await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  await expect(page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true })).toHaveValue('2')
  await page.getByRole('slider', { name: 'ATP 합성 자유에너지', exact: true }).fill('30')
  await expect(page.locator('.coupling-result')).toHaveAttribute('data-outcome', 'sufficient')
  await page.getByRole('button', { name: '− 기본으로', exact: true }).click()
  await basic(page)
  await expect(page.locator('.coupling-result strong')).toHaveText('충분')
  await shot(page, size.width, '02-basic-return')

  await page.getByRole('button', { name: '기울기 조건 바꾸기', exact: true }).click()
  await page.getByRole('button', { name: '기울기 0', exact: true }).click()
  await step(page, '02')
  await basic(page)
  await expect(page.locator('.comparison-track i').first()).toHaveAttribute('style', 'width: 0%;')
  await expect(page.locator('.coupling-result strong')).toHaveText('부족')
  await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  await expect(page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true })).toHaveValue('2')
  await expect(page.getByRole('slider', { name: 'ATP 합성 자유에너지', exact: true })).toHaveValue('30')
  await expect(page.locator('.coupling-result strong')).toContainText('30.00')

  await step(page, '03')
  for (const side of ['a', 'b']) await expect(page.getByTestId(`etc-panel-${side}`)).toHaveAttribute('data-render-mode', '3d')
  await shot(page, size.width, '03-regression')
  expect(errors).toEqual([])
})

test('energy mode keyboard controls, conceptual motion, reduced motion and uphill energy', async ({ page }) => {
  await page.goto('./#/explorer')
  await step(page, '02')
  const rotor = page.locator('.coupling-rotor')
  await expect.poll(() => rotor.evaluate(el => getComputedStyle(el).animationName)).toBe('coupling-spin')
  await page.getByRole('button', { name: '그림 움직임 멈추기', exact: true }).click()
  await expect.poll(() => rotor.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused')
  await page.getByRole('button', { name: '그림 움직임 재개', exact: true }).click()
  await expect.poll(() => rotor.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running')
  const rotation = await rotor.evaluate(el => getComputedStyle(el).transform)
  await expect.poll(() => rotor.evaluate(el => getComputedStyle(el).transform)).not.toBe(rotation)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const selector of ['.coupling-rotor', '.coupling-proton', '.coupling-atp']) {
    for (const element of await page.locator(selector).all()) expect(await element.evaluate(el => getComputedStyle(el).animationName)).toBe('none')
  }
  await page.getByRole('button', { name: '+ 심화', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: '− 기본으로', exact: true })).toBeFocused()
  await page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true })).toHaveValue('3.4')
  await page.getByRole('button', { name: '− 기본으로', exact: true }).focus()
  await page.keyboard.press('Space')
  await basic(page)
  await page.getByRole('button', { name: '기울기 조건 바꾸기', exact: true }).click()
  await page.getByRole('slider', { name: 'A 구획의 pH', exact: true }).fill('8')
  await page.getByRole('slider', { name: 'B 구획의 pH', exact: true }).fill('7')
  await page.getByRole('slider', { name: '막 양쪽 전위 차', exact: true }).fill('100')
  await step(page, '02')
  await expect(page.locator('.comparison-track i').first()).toHaveAttribute('style', 'width: 0%;')
  await expect(page.locator('.coupling-result strong')).toHaveText('부족')
  await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  await expect(page.getByTestId('coupling-lesson')).toContainText('이 비용까지 더해야 합니다.')
  const uphill = protonEnergy({ ...defaultGradient, pHA: 8, pHB: 7, deltaPsiMv: 100 }).total
  await expect(page.locator('.coupling-result strong')).toContainText(coupledEnergy(uphill, 3.4, 50).toFixed(2))
})
