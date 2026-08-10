import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineLocations} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

// Set SANITY_STUDIO_PREVIEW_ORIGIN once the site is deployed (e.g. to your
// Vercel URL) so the Presentation tool previews the real site instead of
// localhost. Vite/Sanity Studio expose SANITY_STUDIO_-prefixed vars to the
// client automatically — see studio/.env.example.
const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:5173'

export default defineConfig({
  name: 'default',
  title: 'voteofteens',

  projectId: 'c0h6oqi4',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        initial: previewOrigin,
      },
      // Comlink (the postMessage channel the Presentation tool uses to talk
      // to the previewed site) only connects to explicitly allowed origins.
      // Keep the old vercel.app URL allowed too — Vercel doesn't remove it
      // when a custom domain is added, so it still resolves.
      allowOrigins: [
        previewOrigin,
        'https://vote-of-teens.org',
        'https://www.vote-of-teens.org',
        'https://vote-website-eight.vercel.app',
        'http://localhost:5173',
      ],
      // Without this, Presentation has no idea which page a given document
      // lives on — clicking into a Chapter, Article, or Team Member from
      // the content list just leaves the preview iframe sitting on
      // whatever it loaded first (the home page), so nothing outside of
      // Home ever appeared editable.
      resolve: {
        locations: {
          siteSettings: defineLocations({
            resolve: () => ({
              locations: [{title: 'Home', href: '/'}],
            }),
          }),
          article: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {title: doc?.title || 'Untitled', href: `/articles/${doc?.slug}`},
                {title: 'All articles', href: '/articles'},
              ],
            }),
          }),
          chapter: defineLocations({
            select: {title: 'name'},
            resolve: (doc) => ({
              locations: [
                {title: doc?.title || 'Untitled', href: '/chapters'},
                {title: 'Home (chapters strip)', href: '/'},
              ],
            }),
          }),
          teamMember: defineLocations({
            select: {title: 'name'},
            resolve: (doc) => ({
              locations: [{title: doc?.title || 'Untitled', href: '/team'}],
            }),
          }),
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
