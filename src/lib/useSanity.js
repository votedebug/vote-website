import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'

// Minimal GROQ data-fetching hook — no caching library in this app yet,
// so each call fetches fresh. Good enough for a mostly-static content site;
// swap for React Query/SWR if traffic or query count grows.
const cacheKey = (query, params) => `${query}::${JSON.stringify(params ?? {})}`

// Build-time cache. scripts/prerender.mjs fills this before rendering each
// route so pages have their content synchronously and the prerendered HTML
// contains real copy instead of the `if (!data) return null` blank. Always
// empty in the browser, where the effect below fetches as it always has.
const preloaded = new Map()

export function preloadSanityData(entries) {
  for (const { query, params, data } of entries) preloaded.set(cacheKey(query, params), data)
}

export function useSanityQuery(query, params = {}, deps = []) {
  const initial = preloaded.get(cacheKey(query, params)) ?? null
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(initial === null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client
      .fetch(query, params)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
