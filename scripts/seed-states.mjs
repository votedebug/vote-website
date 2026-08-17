/**
 * One-off seed for the state layer of the chapters map.
 *
 * Creates the Massachusetts and New York `stateChapter` documents and the two
 * Massachusetts school chapters. Uses createIfNotExists with fixed IDs, so
 * running it twice is harmless and it will never overwrite edits made in the
 * Studio afterwards.
 *
 * Needs a write token — the app's own token is read-only on purpose:
 *
 *   npx sanity tokens create "seed" --role=editor
 *   SANITY_WRITE_TOKEN=sk... node scripts/seed-states.mjs
 *
 * Delete this file once the content is in.
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('Set SANITY_WRITE_TOKEN to an editor token and re-run.')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'c0h6oqi4',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// Four unnamed slots so the Massachusetts page renders its four director
// placeholders straight away; fill in the names, roles, photos and bios in the
// Studio. Keys are fixed so re-running does not duplicate them.
const maDirectors = [1, 2, 3, 4].map((n) => ({
  _key: `ma-director-${n}`,
  _type: 'object',
  role: 'State Director',
}))

const docs = [
  {
    _id: 'state-ny',
    _type: 'stateChapter',
    code: 'NY',
    name: 'New York',
    order: 1,
    directors: [],
  },
  {
    _id: 'state-ma',
    _type: 'stateChapter',
    code: 'MA',
    name: 'Massachusetts',
    order: 2,
    directors: maDirectors,
  },
  {
    _id: 'chapter-acton-boxborough',
    _type: 'chapter',
    name: 'Acton-Boxborough Regional High School',
    short: 'Acton-Boxborough',
    monogram: 'AB',
    state: 'MA',
    borough: 'Acton',
    address: '36 Charter Road, Acton, MA 01720',
    order: 100,
    // Approximate — nudge the geopoint in the Studio if the dot sits off.
    coords: { _type: 'geopoint', lat: 42.4879, lng: -71.4406 },
    directors: [],
  },
  {
    _id: 'chapter-lexington',
    _type: 'chapter',
    name: 'Lexington High School',
    short: 'Lexington High School',
    monogram: 'LH',
    state: 'MA',
    borough: 'Lexington',
    address: '251 Waltham Street, Lexington, MA 02421',
    order: 101,
    coords: { _type: 'geopoint', lat: 42.4353, lng: -71.232 },
    directors: [],
  },
]

const tx = docs.reduce((t, doc) => t.createIfNotExists(doc), client.transaction())
await tx.commit()

console.log('Seeded:')
for (const d of docs) console.log(`  ${d._id}  (${d._type})`)
console.log('\nNow publish them in the Studio, then redeploy so /chapters/ma is prerendered.')
