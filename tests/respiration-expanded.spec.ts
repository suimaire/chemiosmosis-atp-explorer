import { test, expect, type Page, type Locator } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const directory = process.env.EXPANDED_SCREENSHOT_DIR || 'verification/screenshots/respiration-expanded'
const sizes = [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
}
async function capture(page: Page, width: number, name: string) {
  await noOverflow(page)
  await page.locator('.respiration-pathway').screenshot({ path: `${directory}/after-${width}-${name}.png`, animations: 'disabled' })
  await page.locator('.respiration-pathway').scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.respiration-pathway')!.getBoundingClientRect().top + scrollY - 12))
  await page.screenshot({ path: `${directory}/after-${width}-${name}-viewport.png`, animations: 'disabled' })
}
async function highlightedIds(pathway: Locator, mobile: boolean) {
  return pathway.locator(`${mobile ? '.pathway-mobile .mobile-reaction' : '.pathway-desktop .reaction-site'}[data-highlighted=true]`).evaluateAll(elements => elements.map(el => Number(el.getAttribute('data-reaction'))))
}
for (const size of sizes) {
  test(`expanded respiration ${size.width}x${size.height}`, async ({ page }) => {
    await mkdir(directory, { recursive: true })
    await page.setViewportSize(size)
    const mobile = size.width <= 760
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.goto('./')
    await page.getByRole('link', { name: /세포호흡부터 보기/ }).click()
    await page.getByRole('button', { name: '+ 심화', exact: true }).click()
    const glycolysis = page.locator('.glycolysis-map')
    await expect(glycolysis).toBeVisible()
    await expect(glycolysis.locator(mobile ? '.pathway-mobile' : '.pathway-desktop')).toBeVisible()
    await expect(glycolysis.locator(mobile ? '.pathway-desktop' : '.pathway-mobile')).toBeHidden()
    await capture(page, size.width, 'glycolysis')
    for (const [label, ids] of [['탄소', [1,2,3,4,5,6,7,8,9,10]], ['ATP', [1,3,7,10]], ['NADH', [6]], ['비가역 단계', [1,3,10]], ['전체', [1,2,3,4,5,6,7,8,9,10]]] as const) {
      const button = glycolysis.getByRole('group', { name: '해당과정 강조' }).getByRole('button', { name: label, exact: true })
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(await highlightedIds(glycolysis, mobile)).toEqual(ids)
      await expect(glycolysis.getByLabel('ATP ledger')).toContainText('NET +2 ATP')
      if (label === '탄소') await expect(glycolysis.locator(mobile ? '.mobile-metabolite.carbon-highlight' : '.metabolite-node.carbon-highlight').first()).toBeVisible()
      if (label === 'ATP') await glycolysis.screenshot({ path: `${directory}/after-${size.width}-glycolysis-atp.png` })
    }
    const glyButtons = glycolysis.getByRole('group', { name: '반응별 이름과 설명' }).getByRole('button')
    await expect(glyButtons).toHaveCount(10)
    for (let i = 0; i < 10; i++) {
      const enzyme = (await glyButtons.nth(i).getAttribute('aria-label'))!
      await glyButtons.nth(i).click()
      await expect(glycolysis.locator('.reaction-description')).toContainText(enzyme)
    }
    await glycolysis.getByText('심화 · 해당과정의 조절', { exact: true }).click()
    await expect(glycolysis.getByText(/Hexokinase와 glucokinase의 발현/)).toBeVisible()
    await noOverflow(page)
    await page.getByRole('button', { name: '02 아세틸-CoA 생성', exact: true }).click()
    await page.getByRole('button', { name: '+ 심화', exact: true }).click()
    const pdh = page.locator('.pdh-map')
    await expect(pdh.locator('.pdh-equation')).toHaveText('Pyruvate + CoA-SH + NAD⁺ → Acetyl-CoA + CO₂ + NADH + H⁺')
    await capture(page, size.width, 'pdh')
    await pdh.getByRole('button', { name: '×2 · Glucose 1', exact: true }).click()
    await expect(pdh.locator('.pdh-equation')).toHaveText('2 Pyruvate + 2 CoA-SH + 2 NAD⁺ → 2 Acetyl-CoA + 2 CO₂ + 2 NADH + 2 H⁺')
    await expect(pdh.locator('.pdh-events')).toContainText('2 NADH 생성')
    await pdh.getByText('심화 · PDH complex', { exact: true }).click()
    await expect(pdh.getByText('보조인자: TPP · lipoamide · CoA · FAD · NAD⁺', { exact: true })).toBeVisible()
    await capture(page, size.width, 'pdh-glucose')
    await page.getByRole('button', { name: '03 TCA 회로', exact: true }).click()
    await page.getByRole('button', { name: '+ 심화', exact: true }).click()
    const tca = page.locator('.tca-map')
    await expect(tca.getByRole('button', { name: '1 turn · Acetyl-CoA 1', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(tca.getByLabel('TCA 산물 수지')).toContainText('3 NADH')
    await expect(tca.getByLabel('TCA 산물 수지')).toContainText('1 GTP')
    await capture(page, size.width, 'tca')
    for (const [label, ids] of [['탄소', [1,2,3,4,5,6,7,8]], ['NADH', [3,4,8]], ['FAD/Q', [6]], ['CO₂', [3,4]], ['GTP', [5]], ['전체', [1,2,3,4,5,6,7,8]]] as const) {
      const button = tca.getByRole('group', { name: 'TCA 강조', exact: true }).getByRole('button', { name: label, exact: true })
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(await highlightedIds(tca, mobile)).toEqual(ids)
      await expect(tca.getByLabel('TCA 산물 수지')).toContainText('3 NADH')
    }
    const tcaButtons = tca.getByRole('group', { name: '반응별 이름과 설명' }).getByRole('button')
    await expect(tcaButtons).toHaveCount(8)
    for (let i = 0; i < 8; i++) {
      const enzyme = (await tcaButtons.nth(i).getAttribute('aria-label'))!
      await tcaButtons.nth(i).click()
      await expect(tca.locator('.reaction-description')).toContainText(enzyme)
    }
    await tca.getByRole('button', { name: '2 turns · Glucose 1 equivalent', exact: true }).click()
    for (const value of ['4 CO₂', '6 NADH', '2 FAD-linked reducing equivalents → 2 QH₂', '2 GTP', 'OAA regenerated']) await expect(tca.getByLabel('TCA 산물 수지')).toContainText(value)
    const visibleMap = tca.locator(mobile ? '.pathway-mobile' : '.pathway-desktop')
    await expect(visibleMap.locator('[data-reaction="3"]')).toContainText('2 NAD⁺ → 2 NADH · 2 CO₂ ↑')
    await expect(visibleMap.locator('[data-reaction="6"]')).toContainText('FAD-linked → 2 QH₂')
    await expect(visibleMap.locator('[data-reaction="5"]')).toContainText('2 GDP + 2 Pi → 2 GTP')
    await tca.getByRole('group', { name: 'TCA 강조', exact: true }).getByRole('button', { name: 'FAD/Q', exact: true }).click()
    await capture(page, size.width, 'tca-two-turns-fad')
    await tca.getByRole('button', { name: '1 turn · Acetyl-CoA 1', exact: true }).click()
    await expect(tca.getByLabel('TCA 산물 수지')).toContainText('3 NADH')
    await tca.getByRole('button', { name: '→ Complex II · Step 04에서 보기', exact: true }).click()
    await expect(page.getByRole('button', { name: '04 전자전달계와 산화적 인산화', exact: true })).toBeFocused()
    await expect(page.getByText('Complex II · H⁺ 펌프 아님', { exact: true })).toBeVisible()
    await noOverflow(page)
    expect(errors).toEqual([])
  })
}
test('pathway keyboard navigation and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./#/respiration')
  await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  const atp = page.getByRole('group', { name: '해당과정 강조' }).getByRole('button', { name: 'ATP', exact: true })
  await atp.focus(); await page.keyboard.press('Space')
  await expect(atp).toHaveAttribute('aria-pressed', 'true')
  expect(await atp.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid')
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter')
  await expect(page.getByRole('group', { name: '해당과정 강조' }).getByRole('button', { name: 'NADH', exact: true })).toHaveAttribute('aria-pressed', 'true')
  const reaction = page.getByRole('button', { name: '6. Glyceraldehyde-3-phosphate dehydrogenase (GAPDH)', exact: true })
  await reaction.focus(); await page.keyboard.press('Enter')
  await expect(page.locator('.reaction-description')).toContainText('무기 인산(Pi)')
  const regulation = page.getByText('심화 · 해당과정의 조절', { exact: true })
  await regulation.focus(); await page.keyboard.press('Enter')
  await expect(page.getByText(/Hexokinase와 glucokinase의 발현/)).toBeVisible()
  await page.getByRole('button', { name: '03 TCA 회로', exact: true }).click()
    await page.getByRole('button', { name: '+ 심화', exact: true }).click()
  const twoTurns = page.getByRole('button', { name: '2 turns · Glucose 1 equivalent', exact: true })
  await twoTurns.focus(); await page.keyboard.press('Space')
  await expect(page.getByLabel('TCA 산물 수지')).toContainText('6 NADH')
  const co2 = page.getByRole('group', { name: 'TCA 강조', exact: true }).getByRole('button', { name: 'CO₂', exact: true })
  await co2.focus(); await page.keyboard.press('Enter')
  await expect(co2).toHaveAttribute('aria-pressed', 'true')
  expect(await co2.evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s')
})
