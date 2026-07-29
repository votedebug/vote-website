import { useMemo } from 'react'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import topo from '@/data/states-10m.json'
import { STATES, CATEGORIES } from '@/data/states'

const WIDTH = 975
const HEIGHT = 610

/**
 * A real, colored-by-category US map — the same geography and palette as the
 * full LegislationMap, rendered as a static teaser. Decorative here, so it is
 * hidden from assistive tech; the Legislation page carries the accessible copy.
 */
export function MiniUsMap({ className }) {
  const paths = useMemo(() => {
    const fc = feature(topo, topo.objects.states)
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], fc)
    const pathGen = geoPath(projection)
    return fc.features
      .map((f) => {
        const id = String(f.id).padStart(2, '0')
        const meta = STATES[id]
        if (!meta) return null
        return { id, d: pathGen(f), category: meta.category }
      })
      .filter(Boolean)
  }, [])

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={className} aria-hidden focusable="false">
      {paths.map((s) => (
        <path
          key={s.id}
          d={s.d}
          fill={CATEGORIES[s.category].color}
          stroke="#ffffff"
          strokeWidth={0.9}
          className="transition-[filter] duration-300 group-hover:brightness-110"
        />
      ))}
    </svg>
  )
}
