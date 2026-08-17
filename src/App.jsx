import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { VisualEditing } from '@sanity/visual-editing/react'
import { Seo } from '@/components/Seo'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Team from '@/pages/Team'
import Chapters from '@/pages/Chapters'
import Articles from '@/pages/Articles'
import ArticleDetail from '@/pages/ArticleDetail'
import Legislation from '@/pages/Legislation'
import GetInvolved from '@/pages/GetInvolved'
import NotFound from '@/pages/NotFound'
import { isPreview } from '@/lib/sanity'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const scrollToEl = (el) => {
        const y = el.getBoundingClientRect().top + window.scrollY - 84
        window.scrollTo({ top: y, behavior: 'smooth' })
      }

      const immediate = document.getElementById(id)
      if (immediate) {
        scrollToEl(immediate)
        return
      }

      // The target section usually doesn't exist yet on first navigation —
      // its page is still waiting on a Sanity fetch to finish rendering.
      // Poll briefly for it instead of giving up after a single frame.
      // setTimeout rather than requestAnimationFrame: rAF is paused
      // entirely in a backgrounded tab, so a poll loop built on it can
      // just never run; a timer still fires (throttled, but not stalled).
      let cancelled = false
      const deadline = Date.now() + 3000
      const tick = () => {
        if (cancelled) return
        const el = document.getElementById(id)
        if (el) {
          scrollToEl(el)
          return
        }
        if (Date.now() < deadline) {
          setTimeout(tick, 50)
        } else {
          window.scrollTo(0, 0)
        }
      }
      tick()
      return () => {
        cancelled = true
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Seo />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapters/:state" element={<Chapters />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/legislation" element={<Legislation />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {isPreview && <VisualEditing portal />}
    </div>
  )
}
