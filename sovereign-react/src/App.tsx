import { Suspense, lazy, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { BagDrawer } from './components/BagDrawer'
import { Intro } from './components/Intro'
import { CartProvider } from './features/cart/CartContext'
import { WishlistProvider } from './features/wishlist/WishlistContext'
import { ConfiguratorProvider } from './features/configurator/ConfiguratorContext'

/* If a route chunk fails to load (typically a stale index after a redeploy), reload once to fetch the new manifest. */
function lazyRetry<T extends { default: React.ComponentType }>(factory: () => Promise<T>) {
  return lazy(() => factory().catch(err => {
    const key = 'sov.chunk-reload'
    if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, '1'); location.reload() }
    throw err
  }))
}
const Home = lazyRetry(() => import('./pages/Home'))
const Collection = lazyRetry(() => import('./pages/Collection'))
const Product = lazyRetry(() => import('./pages/Product'))
const Atelier = lazyRetry(() => import('./pages/Atelier'))
const Fit = lazyRetry(() => import('./pages/Fit'))
const Look = lazyRetry(() => import('./pages/Look'))
const Story = lazyRetry(() => import('./pages/Story'))
const Wishlist = lazyRetry(() => import('./pages/Wishlist'))
const Bag = lazyRetry(() => import('./pages/Bag'))

const LIGHT_NAV = ['/atelier', '/collection', '/product', '/look', '/wishlist', '/bag']

function Shell() {
  const loc = useLocation()
  const light = loc.pathname === '/' || LIGHT_NAV.some(p => loc.pathname.startsWith(p))
  useEffect(() => { if (!loc.hash) window.scrollTo(0, 0); try { sessionStorage.removeItem('sov.chunk-reload') } catch { /* ignore */ } }, [loc.pathname])
  return (
    <>
      <Intro />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-copper focus:text-ink focus:px-4 focus:py-2 label-s">Skip to content</a>
      <Nav light={light} solid={loc.pathname === '/'} />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/fit" element={<Fit />} />
            <Route path="/look" element={<Look />} />
            <Route path="/story" element={<Story />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/bag" element={<Bag />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!loc.pathname.startsWith('/atelier') && <Footer />}
      <BagDrawer />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <CartProvider><WishlistProvider><ConfiguratorProvider>
        <Shell />
      </ConfiguratorProvider></WishlistProvider></CartProvider>
    </HashRouter>
  )
}
