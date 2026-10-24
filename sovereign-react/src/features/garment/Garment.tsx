import { useMemo } from 'react'
import { renderGarment, type GarmentKind, type GarmentSpec } from './engine'
import type { Product } from '../../data/types'
import { colourById, fabricById, fitById } from '../../data/options'
import { cx } from '../../lib/format'

export function Garment({ kind, spec, className }: { kind: GarmentKind; spec: GarmentSpec; className?: string }) {
  const html = useMemo(() => renderGarment(kind, spec), [kind, spec])
  return <div className={cx('garment', className)} dangerouslySetInnerHTML={{ __html: html }} />
}

/* Spec for a catalogue product in a given colour (defaults otherwise). */
export function specFor(p: Product, colourId?: string, fabricId?: string, fitId?: string): GarmentSpec {
  const colour = colourById(colourId ?? p.defaultColour).hex
  const fabric = fabricById(fabricId ?? p.defaultFabric)
  const fit = fitById(fitId ?? p.defaultFit)
  return {
    colour, texture: fabric.texture, fitScale: fit.scale,
    lapel: p.lapel, closure: p.doubleBreasted ? 'db4' : p.buttons === 2 ? 'sb2' : 'sb1',
    length: p.doubleBreasted ? 'long' : 'hip', pleat: p.pleat, leg: p.leg, neck: p.neck,
  }
}
