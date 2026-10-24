import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { CartLine } from '../../data/types'
import { load, save } from '../../lib/storage'

type Action =
  | { type: 'add'; line: Omit<CartLine, 'key' | 'qty'> & { qty?: number } }
  | { type: 'remove'; key: string }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'clear' }

function keyFor(l: Omit<CartLine, 'key' | 'qty'>) {
  return [l.productId, l.colour, l.fabric ?? '', l.fit ?? '', l.size, JSON.stringify(l.details ?? {})].join('|')
}

function reducer(state: CartLine[], a: Action): CartLine[] {
  switch (a.type) {
    case 'add': {
      const key = keyFor(a.line)
      const qty = a.line.qty ?? 1
      const existing = state.find(l => l.key === key)
      if (existing) return state.map(l => l.key === key ? { ...l, qty: l.qty + qty } : l)
      return [...state, { ...a.line, key, qty }]
    }
    case 'remove': return state.filter(l => l.key !== a.key)
    case 'qty': return state.map(l => l.key === a.key ? { ...l, qty: Math.max(1, Math.min(9, a.qty)) } : l).filter(l => l.qty > 0)
    case 'clear': return []
  }
}

interface CartApi {
  lines: CartLine[]; count: number; subtotal: number
  add: (line: Omit<CartLine, 'key' | 'qty'> & { qty?: number }) => void
  remove: (key: string) => void; setQty: (key: string, qty: number) => void; clear: () => void
  open: boolean; setOpen: (v: boolean) => void
  lastAdded: string | null
}
const Ctx = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, [], () => load<CartLine[]>('sov.bag', []))
  const [open, setOpen] = useState(false)
  const [lastAdded, setLast] = useState<string | null>(null)
  useEffect(() => save('sov.bag', lines), [lines])
  const api = useMemo<CartApi>(() => ({
    lines, count: lines.reduce((s, l) => s + l.qty, 0), subtotal: lines.reduce((s, l) => s + l.unitPrice * l.qty, 0),
    add: line => { dispatch({ type: 'add', line }); setLast(line.name); setOpen(true) },
    remove: key => dispatch({ type: 'remove', key }), setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
    clear: () => dispatch({ type: 'clear' }), open, setOpen, lastAdded,
  }), [lines, open, lastAdded])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export function useCart() { const c = useContext(Ctx); if (!c) throw new Error('CartProvider missing'); return c }
