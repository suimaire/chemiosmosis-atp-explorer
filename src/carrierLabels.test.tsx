import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Membrane, compartments } from './components/Membrane'
import { LightFlow, Photosynthesis } from './Photosynthesis'
import { EtcDiagram } from './components/step04/EtcDiagram'
import { ConceptMembrane } from './components/explorer/ConceptMembrane'
import { mapAnimationState } from './components/step04/animationState'
import { normal, relativeState } from './science'

// Mitochondrial ETC carriers (Q/ubiquinone, cyt c) and thylakoid carriers
// (PQ/plastoquinone, PC/plastocyanin, Fd/ferredoxin) must never be mixed.
const mitochondrialOnly = ['ubiquinone', 'cytochrome c', 'cyt c', 'Q = ']
const thylakoidOnly = ['plastoquinone', 'plastocyanin', 'ferredoxin', 'PQ', 'PC = ', 'PC · ']
const withoutPQ = (html: string) => html.replaceAll('PQ = ', '')

describe('electron carrier labels stay in their own membrane', () => {
  it('maps carrier abbreviations per compartment', () => {
    expect(compartments.mito.carriers).toBe('Q = ubiquinone, cyt c = cytochrome c')
    expect(compartments.plant.carriers).toContain('PQ = plastoquinone')
    expect(compartments.plant.carriers).toContain('PC = plastocyanin')
    for (const text of mitochondrialOnly) expect(withoutPQ(compartments.plant.carriers)).not.toContain(text)
    for (const text of thylakoidOnly) expect(compartments.mito.carriers).not.toContain(text)
  })
  it('labels the mitochondrial inner membrane with Q and cytochrome c only', () => {
    const html = renderToStaticMarkup(<Membrane context="mito" />)
    expect(html).toContain('Q = ubiquinone, cyt c = cytochrome c')
    expect(html).toContain('cyt c · e⁻')
    for (const text of thylakoidOnly) expect(html).not.toContain(text)
  })
  it('labels the thylakoid membrane with PQ and PC, never ubiquinone or cytochrome c', () => {
    const html = renderToStaticMarkup(<Membrane context="plant" />)
    expect(html).toContain('PQ = plastoquinone, PC = plastocyanin')
    expect(html).toContain('PQ · e⁻')
    expect(html).toContain('PC · e⁻')
    for (const text of mitochondrialOnly) expect(withoutPQ(html)).not.toContain(text)
  })
  it('keeps the photosynthesis lesson free of mitochondrial carriers', () => {
    for (const html of [renderToStaticMarkup(<LightFlow cyclic={false} />), renderToStaticMarkup(<LightFlow cyclic />), renderToStaticMarkup(<Photosynthesis mark={() => {}} />)]) {
      expect(html).toContain('plastoquinone')
      expect(html).toContain('plastocyanin')
      for (const text of mitochondrialOnly) expect(withoutPQ(html)).not.toContain(text)
    }
  })
  it('keeps the mitochondrial 3D overlays free of thylakoid carriers', () => {
    const state = mapAnimationState(normal, relativeState(normal), { reducedMotion: false, compact: false })
    const etc = renderToStaticMarkup(<EtcDiagram state={state} fallback />)
    expect(etc).toContain('cyt c')
    for (const html of [etc, renderToStaticMarkup(<ConceptMembrane paths={{ electrons: true, protons: true, atp: true }} />)]) {
      for (const text of thylakoidOnly) expect(html).not.toContain(text)
    }
  })
  it('keeps the thylakoid 3D overlay free of mitochondrial carriers', () => {
    const html = renderToStaticMarkup(<ConceptMembrane context="plant" paths={{ electrons: true, protons: true, atp: true }} />)
    expect(html).toContain('cyt b₆f')
    for (const text of mitochondrialOnly) expect(html).not.toContain(text)
  })
})
