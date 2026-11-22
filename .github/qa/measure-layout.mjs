import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium, expect } from '@playwright/test'

const sizes = [[390, 844], [768, 1024], [1024, 768], [1440, 900], [1536, 768], [1920, 1080]]
const directory = 'verification/fhd-layout'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
async function measure(page, url, version, width, height) {
  await page.goto(url + '#/explorer')
  await page.getByRole('button', { name: '03 미토콘드리아 조건 비교', exact: true }).click()
  for (const name of ['a', 'b']) await expect(page.getByTestId('etc-panel-' + name)).toHaveAttribute('data-render-mode', '3d')
  await page.evaluate(async () => {
    await document.fonts.ready
    window.scrollTo(0, 0)
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
  const result = await page.evaluate(() => {
    function box(el) {
      const { x, y, width, height, right, bottom } = el.getBoundingClientRect()
      return { x, y, width, height, right, bottom }
    }
    const columns = Array.from(document.querySelectorAll('.etc-column'), col => {
      const rect = selector => box(col.querySelector(selector))
      return {
        card: rect('.etc-panel'), scene: rect('.etc-scene'), svg: rect('.etc-overlay'), canvas: rect('canvas'),
        metrics: Array.from(col.querySelectorAll('.etc-summary dd'), box),
        picker: rect('select'), sliders: rect('.condition'), buttons: rect('.etc-playback'),
        overflow: Array.from(col.querySelectorAll('.etc-panel, .etc-summary div, .etc-playback, .preset-picker, select')).some(el => el.scrollWidth > el.clientWidth + 1),
      }
    })
    return { width: innerWidth, height: innerHeight, scrollY, pageOverflow: document.documentElement.scrollWidth > innerWidth,
      title: box(document.querySelector('.module-title')), compare: box(document.querySelector('.etc-comparison')), columns }
  })
  await page.screenshot({ path: directory + '/' + version + '-' + width + '.png' })
  assert.equal(result.scrollY, 0)
  assert(!result.pageOverflow, 'horizontal page overflow ' + width)
  const [a, b] = result.columns
  if (width <= 768) assert(b.card.y > a.card.bottom)
  else assert(Math.abs(a.card.y - b.card.y) < 2)
  for (const col of result.columns) {
    assert(!col.overflow, 'overflow ' + width)
    assert(Math.abs(col.scene.width / col.scene.height - 680 / 450) < 0.01)
    assert(Math.abs(col.canvas.width - col.svg.width) < 1)
    assert(Math.abs(col.canvas.height - col.svg.height) < 1)
    assert(col.picker.bottom <= col.card.y + 1 && col.buttons.bottom <= col.sliders.y + 1)
  }
  if (version === 'after' && width >= 1440) {
    console.log('FHD_GEOMETRY ' + JSON.stringify({width, scene: a.scene, metrics: a.metrics, buttons: a.buttons, sliders: a.sliders}))
    for (const col of result.columns) assert(col.metrics.every(m => m.y >= 0 && m.bottom <= height), 'all four readings should be visible at ' + width)
    await page.getByRole('button', { name: '정적 보기', exact: true }).click()
    await expect(page.getByTestId('etc-panel-b')).toHaveAttribute('data-render-mode', 'static')
    await page.getByRole('button', { name: '3D 보기', exact: true }).click()
  }
  return result
}

const rows = []
try {
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, locale: 'ko-KR' })
    const before = await measure(page, process.env.BASELINE_URL, 'before', width, height)
    const after = await measure(page, process.env.CANDIDATE_URL, 'after', width, height)
    const simplify = r => {
      const a = r.columns[0], round = Math.round
      return { margin: round(a.card.x), cardWidth: round(a.card.width), cardTop: round(a.card.y),
        sceneWidth: round(a.scene.width), sceneHeight: round(a.scene.height), sceneTop: round(a.scene.y),
        firstMetric: round(a.metrics[0].y), lastMetricBottom: round(a.metrics[3].bottom),
        buttonsBottom: round(a.buttons.bottom), slidersTop: round(a.sliders.y) }
    }
    const row = { width, height, before: simplify(before), after: simplify(after) }
    console.log('FHD_MEASUREMENT ' + JSON.stringify(row))
    rows.push(row)
    if (width === 1920) {
      assert(after.columns[0].card.width > before.columns[0].card.width * 1.35)
      assert(after.columns[0].scene.width > before.columns[0].scene.width * 1.15)
      assert(after.columns[0].scene.y < before.columns[0].scene.y - 100)
      assert(after.columns[0].buttons.bottom <= height)
    }
    if (width <= 768) assert.deepEqual(row.after, row.before)
    for (const route of ['respiration', 'photosynthesis']) {
      const boxes = []
      for (const url of [process.env.BASELINE_URL, process.env.CANDIDATE_URL]) {
        await page.goto(url + '#/' + route)
        await expect(page.locator('main h1')).toBeVisible()
        boxes.push(await page.locator('main').boundingBox())
      }
      assert.equal(boxes[0].x, boxes[1].x)
      assert.equal(boxes[0].width, boxes[1].width)
    }
    await page.close()
  }
  await writeFile(directory + '/measurements.json', JSON.stringify(rows, null, 2))
} finally {
  await browser.close()
}
