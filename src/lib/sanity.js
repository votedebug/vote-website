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

// Draft content isn't reliably readable by anonymous requests — Sanity's
// intended pattern is a read-only token for exactly this case. Only ever
// sent in preview mode; published-mode visitors get a tokenless client.
const previewToken = import.meta.env.VITE_SANITY_READ_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isPreview,
  perspective: isPreview ? 'drafts' : 'published',
  token: isPreview ? previewToken : undefined,
  stega: {
    enabled: isPreview,
    studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
    // Stega embeds invisible characters in string values so Presentation can
    // find what to edit. That breaks any value our own code treats as data
    // rather than prose: filter/comparison keys (category, borough, slug,
    // state, code), the address regex fallback in chapterStates.js#stateOf,
    // hrefs (email, instagram, linkedin), and date parsing (date). Skip
    // encoding those; keep it for everything actually rendered as editable
    // copy.
    filter: (props) => {
      const field = props.resultPath[props.resultPath.length - 1]
      const NON_PROSE_FIELDS = [
        'category',
        'slug',
        'borough',
        'email',
        'instagram',
        'linkedin',
        'date',
        'alt',
        'state',
        'address',
        'code',
      ]
      if (NON_PROSE_FIELDS.includes(field)) return false
      return props.filterDefault(props)
    },
  },
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
