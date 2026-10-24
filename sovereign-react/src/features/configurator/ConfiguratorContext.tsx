import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { GarmentType } from '../../data/types'
import { defaultPiece, disallowed, PIECE_PRODUCT, type ConfigState, type Piece, type PieceConfig, type SizingMethod } from './model'

type Action =
  | { type: 'garment'; garment: GarmentType; productId?: string }
  | { type: 'piece'; piece: Piece }
  | { type: 'set'; key: 'fabric' | 'colour' | 'fit'; value: string }
  | { type: 'detail'; key: string; value: string }
  | { type: 'monogram'; value: string }
  | { type: 'sizing'; method: SizingMethod }
  | { type: 'size'; size: string }
  | { type: 'measure'; key: string; value: number | '' }
  | { type: 'unit'; unit: 'cm' | 'in' }
  | { type: 'step'; step: number }
  | { type: 'reset' }

const initial: ConfigState = {
  garment: null, pieces: {}, activePiece: 'blazer',
  sizing: { method: 'standard', size: 'UK 10', measurements: {}, unit: 'cm' }, step: 0,
}

function reducer(s: ConfigState, a: Action): ConfigState {
  switch (a.type) {
    case 'garment': {
      if (a.garment === 'suit') {
        const pieces: ConfigState['pieces'] = {}
        for (const k of Object.keys(PIECE_PRODUCT) as Piece[]) pieces[k] = s.garment === 'suit' && s.pieces[k] ? s.pieces[k] : defaultPiece(PIECE_PRODUCT[k])
        // one cloth for the whole suit: every piece follows the blazer's fabric and colour
        const lead = pieces.blazer!
        for (const k of Object.keys(pieces) as Piece[]) pieces[k] = { ...pieces[k]!, fabric: lead.fabric, colour: lead.colour }
        return { ...s, garment: 'suit', pieces, activePiece: 'blazer' }
      }
      const piece = a.garment as Piece
      const productId = a.productId ?? PIECE_PRODUCT[piece]
      const keep = s.garment === a.garment && s.pieces[piece]?.productId === productId ? s.pieces[piece] : defaultPiece(productId)
      return { ...s, garment: a.garment, pieces: { [piece]: keep }, activePiece: piece }
    }
    case 'piece': return { ...s, activePiece: a.piece }
    case 'set': {
      const pc = s.pieces[s.activePiece]; if (!pc) return s
      if (disallowed(pc, a.key, a.value)) return s
      const next: PieceConfig = { ...pc, [a.key]: a.value }
      // keep the suit in one cloth: fabric + colour propagate to all pieces
      if (s.garment === 'suit' && (a.key === 'fabric' || a.key === 'colour')) {
        const pieces = { ...s.pieces }
        for (const k of Object.keys(pieces) as Piece[]) pieces[k] = { ...pieces[k]!, [a.key]: a.value }
        return { ...s, pieces }
      }
      return { ...s, pieces: { ...s.pieces, [s.activePiece]: next } }
    }
    case 'detail': {
      const pc = s.pieces[s.activePiece]; if (!pc) return s
      if (disallowed(pc, a.key, a.value)) return s
      return { ...s, pieces: { ...s.pieces, [s.activePiece]: { ...pc, details: { ...pc.details, [a.key]: a.value } } } }
    }
    case 'monogram': {
      const pc = s.pieces[s.activePiece]; if (!pc) return s
      return { ...s, pieces: { ...s.pieces, [s.activePiece]: { ...pc, monogram: a.value.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 3) } } }
    }
    case 'sizing': return { ...s, sizing: { ...s.sizing, method: a.method } }
    case 'size': return { ...s, sizing: { ...s.sizing, size: a.size } }
    case 'measure': return { ...s, sizing: { ...s.sizing, measurements: { ...s.sizing.measurements, [a.key]: a.value } } }
    case 'unit': return { ...s, sizing: { ...s.sizing, unit: a.unit } }
    case 'step': return { ...s, step: Math.max(0, Math.min(6, a.step)) }
    case 'reset': return initial
  }
}

interface Api { state: ConfigState; dispatch: (a: Action) => void; active: PieceConfig | null }
const Ctx = createContext<Api | null>(null)
export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const api = useMemo(() => ({ state, dispatch, active: state.pieces[state.activePiece] ?? null }), [state])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export function useConfigurator() { const c = useContext(Ctx); if (!c) throw new Error('ConfiguratorProvider missing'); return c }
