import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
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
      allowOrigins: [previewOrigin, 'http://localhost:5173'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
