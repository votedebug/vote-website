import { useEffect, useState } from 'react'

/**
 * Drives an Embla carousel forward on a timer and tracks the active slide.
 * Autoplay pauses while the pointer is down, on hover (via `paused`), and for
 * anyone who has asked for reduced motion.
 *
 * Returns { index, count, scrollTo }.
 */
export function useCarouselAutoplay(api, { delay = 5500, paused = false } = {}) {
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    const sync = () => setIndex(api.selectedScrollSnap())
    setCount(api.scrollSnapList().length)
    sync()
    api.on('select', sync)
    api.on('reInit', () => {
      setCount(api.scrollSnapList().length)
      sync()
    })
    return () => {
      api.off('select', sync)
    }
  }, [api])

  useEffect(() => {
    if (!api || paused) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (!api.canScrollNext()) api.scrollTo(0)
      else api.scrollNext()
    }, delay)
    return () => clearInterval(id)
  }, [api, delay, paused])

  return { index, count, scrollTo: (i) => api?.scrollTo(i) }
}
