import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01'

// True when the app is being rendered inside Sanity's Presentation tool
// (Visual Editing). Presentation always loads the site in an iframe, so
// that's the primary signal; `?sanity-preview` lets you force it manually
// (e.g. to test stega output without opening Presentation).
export const isPreview =
  typeof window !== 'undefined' &&
  (window.self !== window.top || new URLSearchParams(window.location.search).has('sanity-preview'))

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isPreview,
  perspective: isPreview ? 'drafts' : 'published',
  stega: {
    enabled: isPreview,
    studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
  },
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
