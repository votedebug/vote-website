import { useEffect, useRef, useState } from 'react'

// Lightweight reveal-on-scroll. Adds `is-visible` when the element enters view.
export function useReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)
  // Render visible during prerender so crawlers never see opacity-0 content.
  // The client boots with createRoot (not hydrate), so there is no mismatch.
  const [visible, setVisible] = useState(typeof window === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) io.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])

  return [ref, visible]
}
