/**
 * Post-build step: render every route to static HTML with its own head tags.
 *
 * Pages get their content from Sanity through a `useEffect`, which never runs
 * during renderToString — so this script fetches the same queries over HTTP
 * first and seeds them into the module cache that useSanityQuery reads
 * synchronously. Without that, every prerendered page would be blank.
 *
 * Only published content is read, which Sanity serves anonymously, so no
 * token is needed here.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createClient } from '@sanity/client'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const {
  render,
  preloadSanityData,
  queries,
  allRoutes,
  metaForPath,
  organizationSchema,
  websiteSchema,
  articleSchema,
  SITE_URL,
  OG_IMAGE,
} = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  perspective: 'published',
})

console.log('Fetching published content from Sanity…')
const [site, team, chapters, articles] = await Promise.all([
  client.fetch(queries.siteSettingsQuery),
  client.fetch(queries.teamQuery),
  client.fetch(queries.chaptersQuery),
  client.fetch(queries.articlesListQuery),
])

if (!articles?.length) throw new Error('Sanity returned no articles — refusing to prerender empty pages.')

const entries = [
  { query: queries.siteSettingsQuery, data: site },
  { query: queries.teamQuery, data: team },
  { query: queries.chaptersQuery, data: chapters },
  { query: queries.articlesListQuery, data: articles },
]

// ArticleDetail fetches one article by slug.
for (const { slug } of articles) {
  entries.push({
    query: queries.articleBySlugQuery,
    params: { slug },
    data: await client.fetch(queries.articleBySlugQuery, { slug }),
  })
}

preloadSanityData(entries)
console.log(`  ${articles.length} articles, ${team?.length ?? 0} team members, ${chapters?.length ?? 0} chapters`)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Guard against `</script>` inside JSON-LD closing the script element early.
const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

function buildHead(meta) {
  const tags = [
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(OG_IMAGE)}" />`,
    `<meta property="og:site_name" content="Vote of Teens" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(OG_IMAGE)}" />`,
  ]
  if (meta.noindex) tags.push('<meta name="robots" content="noindex, follow" />')
  if (meta.article) tags.push(jsonLd(articleSchema(meta.article)))
  else if (meta.canonical === `${SITE_URL}/`) tags.push(jsonLd(organizationSchema(site)), jsonLd(websiteSchema()))
  return tags.join('\n    ')
}

function renderPage(route) {
  const meta = metaForPath(route, articles)
  const appHtml = render(route)

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    )
    .replace('</head>', `  ${buildHead(meta)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
}

const routes = allRoutes(articles)
const failures = []

for (const route of routes) {
  try {
    const html = renderPage(route)
    const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, html)
    console.log(`  prerendered ${route}`)
  } catch (err) {
    failures.push(route)
    console.error(`  FAILED ${route}: ${err.message}`)
  }
}

// A real 404 document so unmatched URLs stop returning HTTP 200.
fs.writeFileSync(path.join(dist, '404.html'), renderPage('/404'))

const today = new Date().toISOString().slice(0, 10)
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((route) => {
    const { article } = metaForPath(route, articles)
    return `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${article?.date ?? today}</lastmod>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`
  }),
  '</urlset>',
  '',
].join('\n')

fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
console.log(`\nPrerendered ${routes.length - failures.length}/${routes.length} routes + sitemap.xml`)

if (failures.length) {
  console.error(`\nPrerender failed for: ${failures.join(', ')}`)
  process.exit(1)
}
