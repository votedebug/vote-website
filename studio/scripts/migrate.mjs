// One-off content migration: reads the site's hardcoded src/data/*.js files,
// uploads their referenced /public/img assets to Sanity, and creates the
// corresponding documents in the `production` dataset.
//
// Run from the studio/ directory:
//   npx sanity exec scripts/migrate.mjs --with-user-token
//
// Safe to re-run: images are cached by file path so re-running won't
// re-upload duplicates, but documents ARE recreated with fresh IDs unless
// you delete them first — this is meant to be run once on a clean dataset.

import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../..')
const IMG_DIR = path.join(REPO_ROOT, 'public/img')

const client = getCliClient({apiVersion: '2024-01-01'})

const assetCache = new Map()

async function uploadImage(relPath) {
  if (!relPath) return undefined
  if (assetCache.has(relPath)) return assetCache.get(relPath)

  const filename = relPath.replace(/^\/img\//, '')
  const filePath = path.join(IMG_DIR, filename)
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! missing image, skipping: ${filePath}`)
    return undefined
  }

  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {filename})
  const ref = {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
  assetCache.set(relPath, ref)
  console.log(`  uploaded ${filename} -> ${asset._id}`)
  return ref
}

function textToBlocks(paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', text, marks: []}],
  }))
}

async function migrateSiteSettings() {
  const {SITE, HERO_SLIDES, STATS} = await import('../../src/data/site.js')
  console.log('\n--- Site Settings ---')

  const heroSlides = []
  for (const slide of HERO_SLIDES) {
    heroSlides.push({
      _type: 'object',
      _key: crypto.randomUUID(),
      image: await uploadImage(slide.src),
      caption: slide.caption,
      alt: slide.alt,
    })
  }

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: SITE.name,
    short: SITE.short,
    tagline: SITE.tagline,
    email: SITE.email,
    address: SITE.address,
    instagram: SITE.instagram,
    linkedin: SITE.linkedin,
    founded: SITE.founded,
    stats: STATS.map((s) => ({_type: 'object', _key: crypto.randomUUID(), value: s.value, label: s.label})),
    heroSlides,
  }

  await client.createOrReplace(doc)
  console.log('  siteSettings created')
}

async function migrateTeam() {
  const {BOARD, FOUNDERS, EDITORIAL, MEDIA} = await import('../../src/data/team.js')
  console.log('\n--- Team ---')

  const groups = [
    ['board', BOARD],
    ['founder', FOUNDERS],
    ['editorial', EDITORIAL],
    ['media', MEDIA],
  ]

  const nameToId = new Map()

  for (const [category, people] of groups) {
    for (let i = 0; i < people.length; i++) {
      const p = people[i]
      const doc = {
        _type: 'teamMember',
        name: p.name,
        role: p.role,
        chapter: p.chapter,
        bio: p.bio,
        category,
        order: i,
        photo: p.photo ? await uploadImage(p.photo) : undefined,
      }
      const created = await client.create(doc)
      nameToId.set(p.name, created._id)
      console.log(`  ${category}: ${p.name} -> ${created._id}`)
    }
  }

  return nameToId
}

async function migrateChapters() {
  const {CHAPTERS} = await import('../../src/data/chapters.js')
  console.log('\n--- Chapters ---')

  for (const c of CHAPTERS) {
    const directors = []
    for (const d of c.directors) {
      directors.push({
        _type: 'object',
        _key: crypto.randomUUID(),
        name: d.name,
        role: d.role,
        photo: d.photo ? await uploadImage(d.photo) : undefined,
      })
    }

    const doc = {
      _type: 'chapter',
      name: c.name,
      short: c.short,
      logo: c.logo ? await uploadImage(c.logo) : undefined,
      monogram: c.monogram,
      borough: c.borough,
      address: c.address,
      coords: c.coords ? {_type: 'geopoint', lng: c.coords[0], lat: c.coords[1]} : undefined,
      directors,
    }
    const created = await client.create(doc)
    console.log(`  ${c.short} -> ${created._id}`)
  }
}

async function migrateArticles() {
  const {ARTICLES} = await import('../../src/data/articles.js')
  console.log('\n--- Articles ---')

  for (const a of ARTICLES) {
    const doc = {
      _type: 'article',
      title: a.title,
      slug: {_type: 'slug', current: a.slug},
      dek: a.dek,
      author: a.author,
      role: a.role,
      date: a.date,
      category: a.category,
      readTime: a.readTime,
      feature: Boolean(a.feature),
      image: a.image ? await uploadImage(a.image) : undefined,
      body: textToBlocks(a.body),
      bibliography: (a.bibliography || []).map((b) => ({
        _type: 'object',
        _key: crypto.randomUUID(),
        text: b.text,
        url: b.url,
      })),
    }
    const created = await client.create(doc)
    console.log(`  ${a.slug} -> ${created._id}`)
  }
}

async function main() {
  console.log(`Migrating into project ${client.config().projectId}, dataset ${client.config().dataset}`)
  await migrateSiteSettings()
  await migrateTeam()
  await migrateChapters()
  await migrateArticles()
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
