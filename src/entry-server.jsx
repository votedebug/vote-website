import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'

// Used only by scripts/prerender.mjs at build time. The browser bundle still
// boots from main.jsx with createRoot, so this output is never hydrated — it
// exists so crawlers get real HTML instead of an empty <div id="root">, and
// so the client is free to refetch live Sanity content on load.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}

// Re-exported so the prerender script gets these with the `@/` alias resolved.
export * from './lib/seo.js'
export { preloadSanityData } from './lib/useSanity.js'
export * as queries from './lib/queries.js'
