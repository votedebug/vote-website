import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { ArrowRight } from 'lucide-react'
import { allStateFeatures } from '@/lib/chapterStates'
import { cn } from '@/lib/utils'

const WIDTH = 975
const HEIGHT = 610

// Three tiers, darkest where we are most established. Fills are literal rather
// than token-driven because SVG `fill` cannot take an opacity-modified var.
const TIERS = {
  directors: { fill: 'var(--color-navy)', label: 'State directors + chapters' },
  chapters: { fill: '#7d99d4', label: 'Chapters, no state director yet' },
  none: { fill: '#e2e6ef', label: 'No chapter yet' },
}

/**
 * The national view of where VOTE is: click a state to open it.
 *
 * Only states that actually have a chapter are navigable — the rest are drawn
 * flat and inert, since /chapters/oh would be a dead URL. Hovering one still
 * reads out as an invitation in the rail under the map.
 */
export function UsChapterMap({ chaptersByState, directorsByState, loading, error }) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(null)

  const paths = useMemo(() => {
    const features = allStateFeatures()
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], {
      type: 'FeatureCollection',
      features: features.map((s) => s.feature),
    })
    const pathGen = geoPath(projection)
    return features.map((s) => ({ ...s, d: pathGen(s.feature) }))
  }, [])

  const tierOf = (abbr) => {
    if (!chaptersByState[abbr]?.length) return 'none'
    return directorsByState[abbr]?.directors?.length ? 'directors' : 'chapters'
  }

  // States we can actually open, alphabetical.
  const active = Object.keys(chaptersByState)
    .filter((abbr) => paths.some((p) => p.abbr === abbr))
    .map((abbr) => ({
      abbr,
      name: paths.find((p) => p.abbr === abbr).name,
      chapters: chaptersByState[abbr],
      state: directorsByState[abbr],
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const hovered = hover ? paths.find((p) => p.abbr === hover) : null
  const open = (abbr) => navigate(`/chapters/${abbr.toLowerCase()}`)

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Map of the United States. States with Vote of Teens chapters are highlighted — select one to see its directors and schools."
        >
          {paths.map((s) => {
            const tier = tierOf(s.abbr)
            const clickable = tier !== 'none'
            const isHover = hover === s.abbr
            return (
              <path
                key={s.abbr}
                d={s.d}
                fill={TIERS[tier].fill}
                stroke="#ffffff"
                strokeWidth={isHover && clickable ? 2 : 0.75}
                tabIndex={clickable ? 0 : -1}
                role={clickable ? 'button' : undefined}
                aria-label={
                  clickable
                    ? `${s.name}: ${chaptersByState[s.abbr].length} chapters — open`
                    : undefined
                }
                onMouseEnter={() => setHover(s.abbr)}
                onMouseLeave={() => setHover(null)}
                onClick={() => clickable && open(s.abbr)}
                onKeyDown={(e) => {
                  if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    open(s.abbr)
                  }
                }}
                className={cn(
                  'outline-none transition-[filter,stroke-width] duration-150',
                  clickable && 'cursor-pointer focus-visible:stroke-flag-red',
                )}
                style={{ filter: isHover && clickable ? 'brightness(1.25)' : 'none' }}
              />
            )
          })}
        </svg>

        {/* Hover rail — a fixed line under the map rather than a floating tooltip */}
        <div className="mt-3 flex min-h-[2.5rem] items-center">
          {hovered ? (
            chaptersByState[hovered.abbr]?.length ? (
              <p className="text-sm text-ink/70">
                <span className="font-semibold text-navy">{hovered.name}</span>
                <span className="text-ink/45">
                  {' '}
                  · {chaptersByState[hovered.abbr].length} school chapter
                  {chaptersByState[hovered.abbr].length === 1 ? '' : 's'}
                  {directorsByState[hovered.abbr]?.directors?.length
                    ? ` · ${directorsByState[hovered.abbr].directors.length} state directors`
                    : ''}
                </span>
              </p>
            ) : (
              <p className="text-sm text-ink/45">
                No chapter in {hovered.name} yet — it could start with you.
              </p>
            )
          ) : (
            <p className="text-sm text-ink/40">Hover a state to see what we have there. Click to open it.</p>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
          {Object.entries(TIERS).map(([key, t]) => (
            <div key={key} className="flex items-center gap-2 text-xs font-medium text-ink/75">
              <span className="h-3 w-3 rounded-sm ring-1 ring-black/5" style={{ background: t.fill }} />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* State index */}
      <div>
        <p className="eyebrow text-royal">Where we are</p>
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {active.map((s) => (
            <li key={s.abbr}>
              <Link
                to={`/chapters/${s.abbr.toLowerCase()}`}
                onMouseEnter={() => setHover(s.abbr)}
                onMouseLeave={() => setHover(null)}
                className="group flex items-baseline gap-3 py-4 transition-colors"
              >
                <span className="font-serif text-2xl font-semibold leading-none text-navy/25 transition-colors group-hover:text-flag-red">
                  {s.abbr}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg font-semibold leading-tight text-navy">{s.name}</span>
                  <span className="block text-xs text-ink/50">
                    {s.chapters.length} chapter{s.chapters.length === 1 ? '' : 's'}
                    {s.state?.directors?.length
                      ? ` · ${s.state.directors.length} state director${s.state.directors.length === 1 ? '' : 's'}`
                      : ''}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 self-center text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-flag-red"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
        {active.length === 0 && (
          <p className="py-8 text-sm text-ink/50">
            {error
              ? // Nearly always the Sanity CORS allowlist: published content is
                // readable without a token, but only from an approved origin, so
                // preview URLs and non-5173 localhost ports get a 403.
                'Chapters could not be loaded. If this is a preview URL, add its origin to the Sanity CORS allowlist.'
              : loading
                ? 'Chapters are loading.'
                : 'No chapters yet.'}
          </p>
        )}
      </div>
    </div>
  )
}
