import { useMemo, useState } from 'react'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ExternalLink, Mail } from 'lucide-react'
import topo from '@/data/states-10m.json'
import { STATES, CATEGORIES, STATE_PORTAL, getStateById } from '@/data/states'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const WIDTH = 975
const HEIGHT = 610

export function LegislationMap() {
  const [selectedId, setSelectedId] = useState('36') // New York, the flagship state
  const [hoverId, setHoverId] = useState(null)

  const { paths } = useMemo(() => {
    const fc = feature(topo, topo.objects.states)
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], fc)
    const pathGen = geoPath(projection)
    const paths = fc.features
      .map((f) => {
        const id = String(f.id).padStart(2, '0')
        const meta = STATES[id]
        if (!meta) return null
        return { id, d: pathGen(f), name: meta.name, category: meta.category }
      })
      .filter(Boolean)
    return { paths }
  }, [])

  const selected = getStateById(selectedId)
  const orderedStates = Object.entries(STATES).sort((a, b) => a[1].name.localeCompare(b[1].name))

  return (
    <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr] lg:items-start">
      {/* Map + legend */}
      <div>
        <div>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="Map of the United States. Select a state to see its voter registration rules."
          >
            {paths.map((s) => {
              const isSelected = s.id === selectedId
              const isHover = s.id === hoverId
              return (
                <path
                  key={s.id}
                  d={s.d}
                  fill={CATEGORIES[s.category].color}
                  stroke={isSelected ? 'var(--color-flag-red)' : '#ffffff'}
                  strokeWidth={isSelected ? 2.5 : 0.75}
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.name}: ${STATES[s.id].rule}`}
                  onClick={() => setSelectedId(s.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelectedId(s.id))}
                  onMouseEnter={() => setHoverId(s.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className="cursor-pointer outline-none transition-[filter,opacity] duration-150 focus-visible:opacity-100"
                  style={{
                    filter: isHover && !isSelected ? 'brightness(1.12)' : 'none',
                    opacity: isSelected || !hoverId ? 1 : isHover ? 1 : 0.92,
                  }}
                />
              )
            })}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
            {Object.values(CATEGORIES).map((c) => (
              <div key={c.key} className="flex items-center gap-2 text-xs font-medium text-ink/75">
                <span className="h-3 w-3 rounded-sm ring-1 ring-black/5" style={{ background: c.color }} />
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / a11y state picker */}
        <div className="mt-4">
          <label htmlFor="state-select" className="eyebrow text-royal">
            Or pick a state
          </label>
          <select
            id="state-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-white px-4 py-3 text-sm font-medium text-navy shadow-sm focus-visible:border-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/30"
          >
            {orderedStates.map(([id, s]) => (
              <option key={id} value={id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Detail panel */}
      <StatePanel selected={selected} />
    </div>
  )
}

function StatePanel({ selected }) {
  if (!selected) return null
  const cat = selected.cat
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-24px_rgba(11,42,107,0.45)]">
        <div className="relative px-6 pt-6 pb-5" style={{ background: cat.color }}>
          <div className="absolute inset-0 opacity-15 stripe-accent" aria-hidden />
          <div className="relative">
            <span className="eyebrow text-white/80">{selected.abbr} · United States</span>
            <h3 className="mt-1 font-serif text-3xl font-semibold text-white">{selected.name}</h3>
          </div>
        </div>

        <div className="px-6 py-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-navy">
            <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
            {cat.label}
          </span>

          <p className="mt-4 font-serif text-xl leading-snug text-navy">{selected.rule}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cat.blurb}</p>

          <div className="mt-6 space-y-3">
            <Button asChild className="w-full bg-navy text-white hover:bg-navy-dark">
              <a href={STATE_PORTAL(selected.abbr)} target="_blank" rel="noreferrer">
                Register / check your status
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full border-flag-red text-flag-red hover:bg-flag-red hover:text-white">
              <Link to="/get-involved">
                <Mail className="h-4 w-4" />
                Help pass youth-voting laws
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-lg bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Want to know your legislators or push a pre-registration bill in {selected.name}?{' '}
            <Link to="/get-involved" className="font-semibold text-royal underline-offset-2 hover:underline">
              Get involved
            </Link>{' '}
            and email us — we’ll connect you with the tools and people to make it happen.
          </div>
        </div>
      </div>

      <p className="mt-3 px-1 text-xs text-muted-foreground">
        Rules reflect the 2026 cycle and can change.{' '}
        <a
          href="https://www.thecivicscenter.org/prereg"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-royal hover:underline"
        >
          Source: The Civics Center <ArrowUpRight className="h-3 w-3" />
        </a>
      </p>
    </aside>
  )
}
