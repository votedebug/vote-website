import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'

// Minimal GROQ data-fetching hook — no caching library in this app yet,
// so each call fetches fresh. Good enough for a mostly-static content site;
// swap for React Query/SWR if traffic or query count grows.
export function useSanityQuery(query, params = {}, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
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
