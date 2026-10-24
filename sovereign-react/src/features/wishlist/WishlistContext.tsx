import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { load, save } from '../../lib/storage'

interface WishApi { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void; remove: (id: string) => void }
const Ctx = createContext<WishApi | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => load<string[]>('sov.wishlist', []))
  useEffect(() => save('sov.wishlist', ids), [ids])
  const api = useMemo<WishApi>(() => ({
    ids, has: id => ids.includes(id),
    toggle: id => setIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]),
    remove: id => setIds(s => s.filter(x => x !== id)),
  }), [ids])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export function useWishlist() { const c = useContext(Ctx); if (!c) throw new Error('WishlistProvider missing'); return c }
