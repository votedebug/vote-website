import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSanityQuery } from '@/lib/useSanity'
import { articlesListQuery } from '@/lib/queries'
import { metaForPath, OG_IMAGE } from '@/lib/seo'

function setTag(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(attrs.rel ? 'link' : 'meta')
    document.head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
}

/**
 * Keeps head metadata in sync during client-side navigation. First load is
 * already correct from the prerendered HTML; this covers every route change
 * after it. Article titles need the Sanity list, which is cached by the time
 * most navigations happen.
 */
export function Seo() {
  const { pathname } = useLocation()
  const { data: articles } = useSanityQuery(articlesListQuery)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const { title, description, canonical, noindex } = metaForPath(pathname, articles)

    document.title = title
    setTag('meta[name="description"]', { name: 'description', content: description })
    setTag('link[rel="canonical"]', { rel: 'canonical', href: canonical })
    setTag('meta[property="og:title"]', { property: 'og:title', content: title })
    setTag('meta[property="og:description"]', { property: 'og:description', content: description })
    setTag('meta[property="og:url"]', { property: 'og:url', content: canonical })
    setTag('meta[property="og:image"]', { property: 'og:image', content: OG_IMAGE })
    setTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    setTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description })

    const robots = document.head.querySelector('meta[name="robots"]')
    if (noindex) setTag('meta[name="robots"]', { name: 'robots', content: 'noindex' })
    else if (robots) robots.remove()
  }, [pathname, articles])

  return null
}
