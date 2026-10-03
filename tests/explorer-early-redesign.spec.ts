import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { coupledEnergy, defaultGradient, protonEnergy } from '../src/science'

const directory = 'verification/screenshots/explorer-early-redesign'
const sizes = [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]
const modules = ['전자전달과 H⁺ 축적', 'H⁺ 기울기의 에너지', 'ATP 합성에 충분한가?', '막을 조작하기', '어떤 설명이 자료와 맞는가?', '광합성으로 옮겨 보기']
async function navigate(page: Page, step: number) { await page.getByRole('navigation', { name: '탐색기 모듈' }).getByRole('button', { name: `0${step} ${modules[step]}`, exact: true }).click() }
async function shot(page: Page, width: number, name: string) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(await page.locator('.module-content').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
  await page.screenshot({ path: `${directory}/${width}-${name}.png`, fullPage: true })
}
for (const size of sizes) test(`early redesign interaction and layout ${size.width}x${size.height}`, async ({ page }) => {
  await mkdir(directory, { recursive: true })
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  await page.setViewportSize(size); await page.goto('./#/explorer')
  await expect(page.getByRole('navigation', { name: '탐색기 모듈' }).getByRole('button')).toHaveCount(6)
  const model = page.getByTestId('concept-model'), canvas = model.locator('canvas')
  await expect(model).toHaveAttribute('data-render-mode', '3d')
  await model.scrollIntoViewIfNeeded()
  const rotation = await canvas.getAttribute('data-rotation')
  await expect.poll(() => canvas.getAttribute('data-rotation')).not.toBe(rotation)
  for (const [label, path, attr] of [['전자 경로 보기','electron-path','data-electron-particles'],['H⁺ 이동 보기','proton-path','data-pump-particles'],['ATP 합성 경로 보기','atp-path','data-return-particles']]) {
    await page.getByRole('checkbox', { name: label, exact: true }).uncheck()
    await expect(model.getByTestId(path)).toHaveCount(0)
    await expect(canvas).toHaveAttribute(attr, '0')
    await page.getByRole('checkbox', { name: label, exact: true }).check()
    await expect(model.getByTestId(path)).toBeVisible()
    await expect.poll(async () => Number(await canvas.getAttribute(attr))).toBeGreaterThan(0)
  }
  await page.getByRole('button', { name: '움직임 일시정지', exact: true }).click()
  const stopped = await canvas.getAttribute('data-rotation')
  await page.waitForTimeout(200); await expect(canvas).toHaveAttribute('data-rotation', stopped!)
  await page.getByRole('button', { name: '움직임 재개', exact: true }).click()
  await expect(model).toHaveAttribute('data-paused','false')
  await canvas.scrollIntoViewIfNeeded()
  await expect.poll(() => canvas.evaluate((el, previous) => ({ moved: el.dataset.rotation !== previous, motion: el.dataset.motion, hidden: document.hidden }), stopped)).toMatchObject({ moved: true })
  // Full-page capture temporarily changes the viewport and can leave Chromium's
  // IntersectionObserver at offscreen. Finish real motion checks before capture.
  await shot(page, size.width, '00-default')
  await model.screenshot({ path: `${directory}/${size.width}-00-model.png` })
  await page.getByRole('checkbox', { name: '전자 경로 보기', exact: true }).uncheck()
  await shot(page, size.width, '00-path-toggle')
  await page.getByRole('button', { name: '다음 단계 →', exact: true }).click()
  await expect(page.locator('.module-title h2')).toHaveText('01 · H⁺ 기울기의 에너지')
  await expect(page.getByTestId('gradient-lesson').locator('details')).not.toHaveAttribute('open')
  await expect(page.locator('.metrics .metric small')).toHaveText(['화학적 기여','전기적 기여','전체 기울기 에너지'])
  await shot(page, size.width, '01-default')
  await page.getByRole('button', { name: '기울기 0', exact: true }).click()
  await expect(page.locator('.result-direction')).toContainText('순 구동력이 없습니다')
  await page.getByRole('slider', { name: 'A 구획의 pH', exact: true }).fill('6')
  await page.getByRole('slider', { name: '막 양쪽 전위 차', exact: true }).fill('100')
  await expect(page.locator('.result-direction')).toContainText('B → A')
  await page.getByText('+ 정식 식으로 정리하기', { exact: true }).click()
  expect(await page.getByTestId('gradient-lesson').innerText()).not.toMatch(/pH_|ψ_|ΔG_/)
  await expect(page.locator('.formula sub')).toHaveCount(5)
  await expect(page.locator('.formula sup')).toHaveCount(1)
  await shot(page, size.width, '01-adjusted')
  await page.getByRole('button', { name: '미토콘드리아 예시', exact: true }).click()
  await page.getByRole('button', { name: '다음 단계 →', exact: true }).click()
  await expect(page.locator('.module-title h2')).toHaveText('02 · ATP 합성에 충분한가?')
  await expect(page.getByTestId('coupling-lesson')).toHaveAttribute('data-mode', 'basic')
  await expect(page.locator('.coupling-result')).toHaveAttribute('data-outcome','sufficient')
  await expect(page.locator('.coupling-result strong')).toHaveText('충분')
  await shot(page, size.width, '02-default')
  await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  await expect(page.locator('.coupling-story h3')).toHaveText(['H⁺가 이동할 때 얻을 수 있는 에너지','여러 H⁺의 이동 에너지를 합치기','ATP 합성에 필요한 에너지'])
  await expect(page.locator('.coupling-result strong')).toContainText(coupledEnergy(protonEnergy(defaultGradient).total, 3.3, 50).toFixed(2))
  await page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true }).fill('2')
  await expect(page.locator('.coupling-result')).toHaveAttribute('data-outcome','insufficient')
  await page.getByRole('button', { name: '기울기 조건 바꾸기', exact: true }).click()
  await page.getByRole('button', { name: '기울기 0', exact: true }).click()
  await navigate(page, 2)
  await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  await expect(page.locator('.coupling-result strong')).toContainText('50.00')
  await expect(page.getByRole('slider', { name: '유효 H⁺/ATP 결합비 n', exact: true })).toHaveValue('2')
  await page.getByRole('button', { name: '다음 단계 →', exact: true }).click()
  await expect(page.getByTestId('etc-panel-a')).toHaveAttribute('data-render-mode','3d')
  await expect(page.getByTestId('etc-panel-b')).toHaveAttribute('data-render-mode','3d')
  await shot(page, size.width, '03-regression')
  for (const step of [4,5]) {
    await page.getByRole('button', { name: '다음 단계 →', exact: true }).click()
    await expect(page.locator('.module-title h2')).toHaveText(`0${step} · ${modules[step]}`)
    await expect(page.locator('.module-title .eyebrow')).toHaveText(`단계 0${step} / 05`)
  }
  await expect(page.getByRole('link', { name: '학습 홈으로 →', exact: true })).toBeVisible()
  for (const step of [4,3,2,1,0]) {
    await page.getByRole('button', { name: '← 이전', exact: true }).click()
    await expect(page.locator('.module-title h2')).toHaveText(`0${step} · ${modules[step]}`)
  }
  await expect(page.getByRole('button', { name: '← 이전', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: '엽록체 틸라코이드', exact: true }).click()
  await expect(page.getByText('A · 틸라코이드 내강 · Thylakoid lumen', { exact: true })).toBeVisible()
  await expect(page.getByTestId('electron-path')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('concept model keyboard, reduced motion and context-loss fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./#/explorer')
  const model = page.getByTestId('concept-model')
  await expect(model).toHaveAttribute('data-render-mode','3d')
  await expect(model).toHaveAttribute('data-paused','true')
  await page.getByRole('checkbox', { name: '전자 경로 보기', exact: true }).focus()
  await page.keyboard.press('Space')
  await expect(model.locator('canvas')).toHaveAttribute('data-electron-particles','0')
  await model.locator('canvas').evaluate((el: HTMLCanvasElement) => el.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext())
  await expect(model).toHaveAttribute('data-render-mode','fallback')
  await expect(model.getByRole('status')).toContainText('정적 개념도')
  await expect(model.getByTestId('electron-path')).toHaveCount(0)
  await expect(model.getByTestId('atp-path')).toBeVisible()
})
test('concept model remains usable without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === 'webgl2' || type === 'webgl') return null
      return original.apply(this, [type, ...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto('./#/explorer')
  await expect(page.getByTestId('concept-model')).toHaveAttribute('data-render-mode','fallback')
  await expect(page.getByTestId('proton-path')).toBeVisible()
  await page.getByRole('checkbox', { name: 'H⁺ 이동 보기', exact: true }).uncheck()
  await expect(page.getByTestId('proton-path')).toHaveCount(0)
})
