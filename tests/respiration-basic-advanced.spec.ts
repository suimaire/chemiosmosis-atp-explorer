import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const directory = 'verification/screenshots/respiration-basic-advanced'
const sizes = [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]
const steps = [
  { tab: '01 해당과정', name: 'glycolysis', basic: '.basic-glycolysis', advanced: '.glycolysis-map' },
  { tab: '02 아세틸-CoA 생성', name: 'pdh', basic: '.basic-pdh', advanced: '.pdh-map' },
  { tab: '03 TCA 회로', name: 'tca', basic: '.basic-tca', advanced: '.tca-map' },
]

async function capture(page: Page, width: number, name: string) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.locator('.step-detail').screenshot({ path: `${directory}/${width}-${name}.png`, animations: 'disabled' })
  await page.locator('.respiration-mode-toggle').scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.step-detail')!.getBoundingClientRect().top + scrollY - 12))
  await page.screenshot({ path: `${directory}/${width}-${name}-viewport.png`, animations: 'disabled' })
}

for (const size of sizes) {
  test(`basic and advanced layers ${size.width}x${size.height}`, async ({ page }) => {
    await mkdir(directory, { recursive: true })
    await page.setViewportSize(size)
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.goto('./#/respiration')
    let reloads = 0
    page.on('load', () => reloads++)
    const detail = page.getByRole('region', { name: '선택한 세포호흡 단계' })
    const storage = await page.evaluate(() => ({ ...localStorage }))
    for (const step of steps) {
      await page.getByRole('button', { name: step.tab, exact: true }).click()
      await expect(detail).toHaveAttribute('data-mode', 'basic')
      await expect(page.locator(step.basic)).toBeVisible()
      await expect(page.locator(step.advanced)).toHaveCount(0)
      await expect(page.getByRole('button', { name: '+ 심화', exact: true })).toHaveAttribute('aria-expanded', 'false')
      expect(await page.locator('main').innerText()).not.toMatch(/FAD-linked|QH₂|enzyme-bound|isoform|Glycolysis|Pyruvate oxidation|TCA cycle/)
      expect(await detail.innerText()).not.toMatch(/Hexokinase|Phospho\w+|Aldolase|isomerase|Enolase|kinase|GAPDH|PFK-1|G6P|F6P|F1,6BP|DHAP|1,3-BPG|3-PG|2-PG|PEP|E1|E2|E3|TPP|lipoamide|dehydrogenase/)
      if (step.name === 'glycolysis') {
        await expect(detail.locator('.basic-flow>li')).toHaveCount(4)
        await expect(detail.getByLabel('해당과정 기본 수지')).toHaveText('ATP 사용 2ATP 생성 4순 ATP 2NADH 2피루브산 2')
      }
      if (step.name === 'pdh') {
        await expect(detail).toContainText('피루브산 탈수소효소 복합체 안에서 여러 반응이 서로 연결')
        await expect(detail.getByLabel('아세틸-CoA 생성 기본 수지')).toContainText('아세틸-CoA 2분자 + CO₂ 2개 + NADH 2개')
      }
      if (step.name === 'tca') {
        await expect(detail.locator('.basic-cycle-events>li')).toHaveCount(4)
        await expect(detail.getByRole('button', { name: '아세틸-CoA 1분자', exact: true })).toHaveAttribute('aria-pressed', 'true')
        await expect(detail.getByLabel('TCA 기본 산물 수지')).toHaveText('아세틸-CoA 1분자 기준 · 1회전CO₂ 2NADH 3FADH₂ 1ATP 1 상당')
        await expect(detail).toContainText('ATP 1개 상당 생성')
      }
      await capture(page, size.width, `${step.name}-basic`)
      if (step.name === 'tca') {
        await detail.getByRole('button', { name: '포도당 1분자', exact: true }).click()
        await expect(detail.getByLabel('TCA 기본 산물 수지')).toHaveText('포도당 1분자 기준 · 2회전CO₂ 4NADH 6FADH₂ 2ATP 2 상당')
        await capture(page, size.width, 'tca-basic-glucose')
        await detail.getByRole('button', { name: '아세틸-CoA 1분자', exact: true }).click()
      }
      await page.getByRole('button', { name: '+ 심화', exact: true }).click()
      await expect(detail).toHaveAttribute('data-mode', 'advanced')
      await expect(page.locator(step.basic)).toHaveCount(0)
      await expect(page.locator(step.advanced)).toBeVisible()
      await expect(page.getByRole('button', { name: '− 기본으로', exact: true })).toHaveAttribute('aria-expanded', 'true')
      if (step.name === 'glycolysis') {
        await expect(detail.getByRole('group', { name: '반응별 이름과 설명' }).getByRole('button')).toHaveCount(10)
        await expect(detail.getByRole('button', { name: '1. Hexokinase', exact: true })).toBeVisible()
        await expect(detail.getByRole('button', { name: '10. Pyruvate kinase', exact: true })).toBeVisible()
      }
      if (step.name === 'pdh') {
        await expect(detail.locator('.pdh-events h4')).toHaveText(['E1 · Decarboxylation', 'E2 · Acetyl transfer to CoA', 'E3 · Cofactor reoxidation'])
        await expect(detail.getByText('보조인자: TPP · lipoamide · CoA · FAD · NAD⁺', { exact: true })).toBeVisible()
        await expect(detail.getByText('NADH는 이 보조인자 재생 과정의 뒤쪽에서 생성됩니다.', { exact: true })).toBeVisible()
      }
      if (step.name === 'tca') {
        await expect(detail.getByRole('group', { name: '반응별 이름과 설명' }).getByRole('button')).toHaveCount(8)
        await expect(detail.locator('.sdh-note')).toContainText('Succinate dehydrogenase')
        await expect(detail.locator('.sdh-note')).toContainText('ETC Complex II')
        await expect(detail.locator('.sdh-note')).toContainText('효소 결합 FAD → 효소 결합 FADH₂ → 전자가 Q로 전달 → QH₂')
      }
      await capture(page, size.width, `${step.name}-advanced`)
      await page.getByRole('button', { name: '− 기본으로', exact: true }).click()
      await expect(page.locator(step.basic)).toBeVisible()
      await expect(page.locator(step.advanced)).toHaveCount(0)
      expect(await detail.innerText()).not.toMatch(/FAD-linked|QH₂|Hexokinase|TPP|dehydrogenase/)
    }
    expect(reloads).toBe(0)
    expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(storage)
    expect(errors).toEqual([])
  })
}

test('mode choices are independent per step and work by keyboard without storage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('Storage disabled') } }) })
  await page.goto('./#/respiration')
  const toggle = page.locator('.respiration-mode-toggle')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveText('− 기본으로')
  expect(await toggle.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid')
  await page.getByRole('button', { name: '02 아세틸-CoA 생성', exact: true }).click()
  await expect(toggle).toHaveText('+ 심화')
  await toggle.click()
  await page.getByRole('button', { name: '03 TCA 회로', exact: true }).click()
  await expect(toggle).toHaveText('+ 심화')
  await page.getByRole('button', { name: '01 해당과정', exact: true }).click()
  await expect(toggle).toHaveText('− 기본으로')
  await toggle.focus()
  await page.keyboard.press('Space')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveText('+ 심화')
  await page.getByRole('button', { name: '02 아세틸-CoA 생성', exact: true }).click()
  await expect(toggle).toHaveText('− 기본으로')
  await page.reload()
  await expect(toggle).toHaveText('+ 심화')
  await expect(page.locator('.basic-glycolysis')).toBeVisible()
})
