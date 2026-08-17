import { feature } from 'topojson-client'
import topo from '@/data/states-10m.json'
import { STATES, STATE_BY_ABBR } from '@/data/states'

export { STATE_BY_ABBR }

/**
 * Shared plumbing for the chapters map: which state a chapter belongs to, and
 * the geometry for drawing one state on its own.
 *
 * The topojson and the FIPS→state table are the same ones the Legislation map
 * uses, so there is one source of US geography in the app.
 */

// Decoding the topojson is the expensive part, so do it once per module rather
// than once per component mount.
let _fc = null
function collection() {
  if (!_fc) _fc = feature(topo, topo.objects.states)
  return _fc
}

/** The GeoJSON feature for one state, or null if the code isn't a real state. */
export function stateFeature(abbr) {
  const meta = STATE_BY_ABBR[String(abbr || '').toUpperCase()]
  if (!meta) return null
  return collection().features.find((f) => String(f.id).padStart(2, '0') === meta.id) || null
}

/** Every state feature, tagged with its postal code — for the national map. */
export function allStateFeatures() {
  return collection()
    .features.map((f) => {
      const id = String(f.id).padStart(2, '0')
      const meta = STATES[id]
      return meta ? { id, abbr: meta.abbr, name: meta.name, feature: f } : null
    })
    .filter(Boolean)
}

/**
 * Which state a chapter sits in.
 *
 * Prefers the explicit `state` field, and falls back to the two-letter code in
 * the street address ("…, Bronx, NY 10468") so the twenty-one chapters that
 * predate the field keep working without anyone re-editing them in Sanity.
 */
export function stateOf(chapter) {
  if (chapter?.state) return String(chapter.state).toUpperCase()
  const m = /,\s*([A-Za-z]{2})\s+\d{5}/.exec(chapter?.address || '')
  return m ? m[1].toUpperCase() : null
}

/** Chapters grouped by postal code, preserving the Sanity sort order. */
export function groupByState(chapters) {
  const out = {}
  for (const c of chapters || []) {
    const abbr = stateOf(c)
    if (!abbr) continue
    ;(out[abbr] ||= []).push(c)
  }
  return out
}

/**
 * New York City's bounding box, used to collapse the twenty NYC chapters into
 * one cluster at state zoom — individually they land inside a few pixels of
 * each other. Generous enough to cover all five boroughs and tight enough to
 * leave Westchester out.
 */
const NYC_BBOX = { minLng: -74.3, maxLng: -73.68, minLat: 40.45, maxLat: 40.95 }

export function isInNyc(chapter) {
  const [lng, lat] = chapter?.coords || []
  if (typeof lng !== 'number' || typeof lat !== 'number') return false
  return lng >= NYC_BBOX.minLng && lng <= NYC_BBOX.maxLng && lat >= NYC_BBOX.minLat && lat <= NYC_BBOX.maxLat
}

/** Centre of the NYC cluster, for placing its bubble on the state map. */
export const NYC_CENTER = [-73.94, 40.71]
