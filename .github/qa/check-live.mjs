import { chromium, expect } from '@playwright/test'

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, locale: 'ko-KR' })
  await page.route('https://suimaire.github.io/assets/js/page-views.js', route => route.fulfill({
    contentType: 'text/javascript', body: "export const resolveMode = () => 'disabled'",
  }))
  const response = await page.goto('https://suimaire.github.io/chemiosmosis-atp-explorer/#/explorer')
  expect(response.status()).toBe(200)
  await page.getByRole('button', { name: '03 미토콘드리아 조건 비교', exact: true }).click()
  const panels = page.locator('.etc-panel')
  for (const panel of await panels.all()) {
    await expect(panel).toHaveAttribute('data-render-mode', '3d')
    for (const reading of await panel.locator('.etc-summary dd').all()) await expect(reading).toBeInViewport({ ratio: 1 })
    await expect(panel.locator('.etc-playback')).toBeInViewport({ ratio: 1 })
  }
  expect((await panels.first().boundingBox()).width).toBeGreaterThan(840)
  const sheet = await page.locator('link[rel="stylesheet"]').evaluate(el => new URL(el.href).pathname)
  expect(sheet).toContain(process.env.VERIFIED_CSS)
  await page.getByRole('combobox', { name: '조건 B 처리', exact: true }).selectOption('cyanide')
  await expect(panels.nth(1).getByRole('heading')).toHaveText('시안화합물 처리')
  await page.getByRole('button', { name: '정적 보기', exact: true }).click()
  await expect(panels.nth(1)).toHaveAttribute('data-render-mode', 'static')
  console.log('LIVE_PAGES', JSON.stringify({ status: response.status(), sheet, card: await panels.first().boundingBox() }))
} finally {
  await browser.close()
}
