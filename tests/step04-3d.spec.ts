import { test, expect, type Page, type Locator } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { normal, presets, relativeState } from '../src/science'

const directory = 'verification/screenshots/step04-3d'
const sizes = [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]
async function openStep(page: Page) {
  await page.goto('./#/explorer')
  await page.getByRole('button', { name: '03 막을 조작하기', exact: true }).click()
  await expect(page.getByTestId('etc-comparison')).toBeVisible()
}
async function numberAttribute(locator: Locator, key: string) { return Number(await locator.getAttribute(key)) }
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  for (const panel of await page.locator('.etc-panel').all()) {
    expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
  }
}

for (const size of sizes) {
  test(`Step 04 six conditions and graph consistency ${size.width}x${size.height}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()) })
    await mkdir(directory, { recursive: true })
    await page.setViewportSize(size)
    await openStep(page)
    const a = page.getByTestId('etc-panel-a'), b = page.getByTestId('etc-panel-b')
    await expect(a).toHaveAttribute('data-render-mode', '3d')
    await expect(b).toHaveAttribute('data-render-mode', '3d')
    const boundsA = await a.boundingBox(), boundsB = await b.boundingBox()
    expect(boundsA!.width).toBeGreaterThan(320)
    if (size.width >= 1024) expect(Math.abs(boundsA!.y - boundsB!.y)).toBeLessThan(2)
    else expect(boundsB!.y).toBeGreaterThan(boundsA!.y + boundsA!.height)
    for (const [key, preset] of Object.entries(presets)) {
      await page.getByRole('combobox', { name: '조건 B 처리', exact: true }).selectOption(key)
      const values = relativeState(preset.condition)
      await expect(b.getByRole('heading')).toHaveText(preset.label)
      expect(await numberAttribute(b, 'data-electron-speed')).toBeCloseTo(values.oxygen / 100)
      expect(await numberAttribute(b, 'data-density')).toBeCloseTo(values.gradient / 100)
      expect(await numberAttribute(b, 'data-rotation-speed')).toBeCloseTo(values.atp / 100)
      await expect(a).toHaveAttribute('data-electron-speed', '1')
      await expect(a).toHaveAttribute('data-density', '1')
      await expect(page.getByLabel('B 산소 소비 · Oxygen consumption', { exact: true })).toHaveText(values.oxygen.toFixed(1))
      await expect(page.getByLabel('B 전기화학적 H⁺ 기울기', { exact: true })).toHaveText(values.gradient.toFixed(1))
      await expect(page.getByLabel('B 산화적 ATP 합성 속도', { exact: true })).toHaveText(values.atp.toFixed(1))
      if (key === 'leak') await expect(b.getByTestId('leak-path')).toBeVisible()
      else await expect(b.getByTestId('leak-path')).toHaveCount(0)
      if (key === 'adp') await expect(b.getByRole('status')).toContainText('ADP 부족')
      await noOverflow(page)
      await page.getByTestId('etc-comparison').screenshot({ path: `${directory}/${size.width}-${key}.png` })
    }
    await page.screenshot({ path: `${directory}/${size.width}-full.png`, fullPage: true })
    await page.getByRole('combobox', { name: '조건 A 처리', exact: true }).selectOption('reduced')
    await expect(a).toHaveAttribute('data-electron-speed', String(relativeState(presets.reduced.condition).oxygen / 100))
    await expect(b.getByRole('heading')).toHaveText(presets.adp.label)
    // Slider combinations update the scene, rather than merely switching preset animations.
    await page.getByRole('slider', { name: 'B · ADP 가용성', exact: true }).fill('0')
    await expect(b).toHaveAttribute('data-atp-rate', '0')
    await expect(b.getByRole('heading')).toHaveText('사용자 조절 조건')
    await expect(page.getByLabel('B 산화적 ATP 합성 속도', { exact: true })).toHaveText('0.0')
    expect(errors).toEqual([])
  })
}

test('animation changes, pause/resume, independent context loss, and input-stop transition', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openStep(page)
  const a = page.getByTestId('etc-panel-a'), b = page.getByTestId('etc-panel-b')
  await expect(a).toHaveAttribute('data-render-mode', '3d')
  await expect(b).toHaveAttribute('data-render-mode', '3d')
  await page.getByTestId('etc-comparison').scrollIntoViewIfNeeded()
  const before = await a.locator('canvas').getAttribute('data-rotation')
  await expect.poll(() => a.locator('canvas').getAttribute('data-rotation')).not.toBe(before)
  await page.getByRole('button', { name: '움직임 일시정지', exact: false }).click()
  const paused = await a.locator('canvas').getAttribute('data-rotation')
  await page.waitForTimeout(250)
  await expect(a.locator('canvas')).toHaveAttribute('data-rotation', paused!)
  await page.getByRole('button', { name: '움직임 재개', exact: false }).click()
  await expect.poll(() => a.locator('canvas').getAttribute('data-rotation')).not.toBe(paused)
  // Keep both scenes onscreen when applying input stop, to observe the displayed reservoir fade.
  await page.getByRole('combobox', { name: '조건 B 처리', exact: true }).selectOption('normal')
  await b.scrollIntoViewIfNeeded()
  await page.getByRole('combobox', { name: '조건 B 처리', exact: true }).evaluate((el: HTMLSelectElement) => { el.value = 'stopped'; el.dispatchEvent(new Event('change', { bubbles: true })) })
  await expect(b).toHaveAttribute('data-electron-speed', '0')
  await expect(b.getByRole('status')).toContainText('소실 전환')
  expect(await numberAttribute(b.locator('canvas'), 'data-density')).toBeGreaterThan(0)
  for (let i = 0; i < 4; i++) {
    await page.getByTestId('etc-comparison').screenshot({ path: `${directory}/stop-sequence-${i}.png` })
    await page.waitForTimeout(700)
  }
  await expect.poll(() => numberAttribute(b.locator('canvas'), 'data-density')).toBe(0)
  await expect(b.getByRole('status')).toContainText('소진된 정상상태')
  await a.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext())
  await expect(a).toHaveAttribute('data-render-mode', 'fallback')
  await expect(a.getByRole('status')).toContainText('정적 개념도')
  await expect(b).toHaveAttribute('data-render-mode', '3d')
  await page.getByTestId('etc-comparison').screenshot({ path: `${directory}/context-loss.png` })
})

test('reduced motion, mobile density, static view and keyboard controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await openStep(page)
  const a = page.getByTestId('etc-panel-a')
  await expect(a).toHaveAttribute('data-motion-intensity', '0.2')
  await expect(a).toHaveAttribute('data-particle-budget', '0.55')
  await expect(a).toHaveAttribute('data-density', '1')
  await expect(a).toHaveAttribute('data-render-mode', '3d')
  await page.getByRole('button', { name: '정적 보기', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(a).toHaveAttribute('data-render-mode', 'static')
  await page.getByRole('combobox', { name: '조건 B 처리', exact: true }).selectOption('leak')
  await expect(page.getByTestId('etc-panel-b').getByTestId('leak-path')).toBeVisible()
  await page.getByTestId('etc-comparison').screenshot({ path: `${directory}/390-reduced-static.png` })
  await page.getByRole('button', { name: '3D 보기', exact: true }).click()
  await expect(a).toHaveAttribute('data-render-mode', '3d')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(a).toHaveAttribute('data-motion-intensity', '1')
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: '02 ATP 합성에 충분한가?', exact: true }).click()
    await expect(page.locator('.etc-scene canvas')).toHaveCount(0)
    await page.getByRole('button', { name: '03 막을 조작하기', exact: true }).click()
    await expect(a).toHaveAttribute('data-render-mode', '3d')
  }
  await noOverflow(page)
})

test('WebGL unavailable falls back and still updates graphs and independent A/B summaries', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === 'webgl2' || type === 'webgl') return null
      return original.apply(this, [type, ...args] as Parameters<typeof original>)
    } as typeof original
  })
  await openStep(page)
  const a = page.getByTestId('etc-panel-a'), b = page.getByTestId('etc-panel-b')
  await expect(a).toHaveAttribute('data-render-mode', 'fallback')
  await expect(b).toHaveAttribute('data-render-mode', 'fallback')
  await expect(a.getByRole('status')).toContainText('3D를 사용할 수 없어')
  await page.getByRole('combobox', { name: '조건 B 처리', exact: true }).selectOption('leak')
  await expect(b.getByTestId('leak-path')).toBeVisible()
  await expect(a).toHaveAttribute('data-density', String(relativeState(normal).gradient / 100))
  await expect(page.getByLabel('B 산소 소비 · Oxygen consumption', { exact: true })).toHaveText(relativeState(presets.leak.condition).oxygen.toFixed(1))
  await page.getByTestId('etc-comparison').screenshot({ path: `${directory}/webgl-unavailable.png` })
  await page.getByRole('button', { name: '04 어떤 설명이 자료와 맞는가?', exact: true }).click()
  await expect(page.getByRole('heading', { name: '가상 조건 1' })).toBeVisible()
})
