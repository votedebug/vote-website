import { useMemo, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import boroughs from '@/data/nyc-boroughs.json'
import { cn } from '@/lib/utils'

const W = 720
const H = 720

// Boroughs that actually host a chapter, in the order they read on the map.
const FILTERS = ['All of NYC', 'Manhattan', 'Bronx', 'Brooklyn', 'Queens']

/**
 * Real NYC borough geography (NYC Open Data borough boundaries, simplified)
 * with every chapter plotted at its geocoded address.
 *
 * Nine of the fifteen chapters sit in Manhattan, which is narrow enough that
 * their pins overlap at citywide zoom — so selecting a borough zooms the map
 * to it, which both spreads the pins out and doubles as the list filter.
 *
 * `chapters` must already be filtered down to the ones actually inside NYC —
 * this used to fetch and show every chapter in the dataset itself, which
 * leaked GISNY (Westchester, not a borough) and every other state's schools
 * in here once chapters started carrying a `state` field. The caller (the
 * state-level chapters page) is the one that knows which chapters are NYC's.
 */
export function NycChapterMap({ chapters: CHAPTERS, onSelect }) {
  const [filter, setFilter] = useState('All of NYC')
  const [hovered, setHovered] = useState(null)

  const { shapes, pins, labels } = useMemo(() => {
    const projection = geoMercator().fitSize([W, H], boroughs)
    const pathGen = geoPath(projection)

    const shapes = boroughs.features.map((f) => ({
      name: f.properties.name,
      d: pathGen(f),
      bounds: pathGen.bounds(f),
    }))

    const labels = boroughs.features.map((f) => ({
      name: f.properties.name,
      c: pathGen.centroid(f),
    }))

    const pins = (CHAPTERS || []).map((c) => {
      const [x, y] = projection(c.coords)
      return { chapter: c, x, y }
    })

    return { shapes, pins, labels }
  }, [CHAPTERS])

  // Zoom transform for the current filter.
  const { k, tx, ty } = useMemo(() => {
    if (filter === 'All of NYC') return { k: 1, tx: 0, ty: 0 }
    const target = shapes.find((s) => s.name === filter)
    if (!target) return { k: 1, tx: 0, ty: 0 }
    const [[x0, y0], [x1, y1]] = target.bounds
    const k = Math.min(W / (x1 - x0), H / (y1 - y0)) * 0.82
    return {
      k,
      tx: W / 2 - (k * (x0 + x1)) / 2,
      ty: H / 2 - (k * (y0 + y1)) / 2,
    }
  }, [filter, shapes])

  if (!CHAPTERS) return null

  const visible = filter === 'All of NYC' ? CHAPTERS : CHAPTERS.filter((c) => c.borough === filter)

  return (
    <div className="grid gap-8 lg:grid-cols-[65fr_35fr] lg:items-start">
      <div>
        {/* Borough filter / zoom */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((b) => {
            const n = b === 'All of NYC' ? CHAPTERS.length : CHAPTERS.filter((c) => c.borough === b).length
            return (
              <button
                key={b}
                onClick={() => setFilter(b)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                  filter === b
                    ? 'border-flag-red bg-flag-red text-white'
                    : 'border-border text-ink/70 hover:border-navy/40 hover:text-navy',
                )}
              >
                {b}
                <span className={cn('ml-1.5 text-xs', filter === b ? 'text-white/70' : 'text-ink/40')}>{n}</span>
              </button>
            )
          })}
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-5 h-auto w-full"
          role="img"
          aria-label="Map of New York City showing every Vote of Teens chapter."
        >
          <g
            style={{ transform: `translate(${tx}px, ${ty}px) scale(${k})`, transition: 'transform 650ms cubic-bezier(0.4,0,0.2,1)' }}
          >
            {shapes.map((s) => {
              const dim = filter !== 'All of NYC' && s.name !== filter
              return (
                <path
                  key={s.name}
                  d={s.d}
                  className="transition-[fill-opacity,stroke-opacity] duration-500"
                  fill="var(--color-royal)"
                  fillOpacity={dim ? 0.05 : 0.16}
                  stroke="var(--color-royal)"
                  strokeOpacity={dim ? 0.18 : 0.5}
                  strokeWidth={1.1 / k}
                  strokeLinejoin="round"
                />
              )
            })}

            {labels.map((l) => (
              <text
                key={l.name}
                x={l.c[0]}
                y={l.c[1]}
                textAnchor="middle"
                className="pointer-events-none select-none fill-navy/45 font-sans font-bold uppercase"
                style={{ fontSize: 13 / k, letterSpacing: 1.5 / k }}
              >
                {l.name}
              </text>
            ))}

            {pins.map(({ chapter, x, y }) => {
              const shown = filter === 'All of NYC' || chapter.borough === filter
              const isHover = hovered === chapter.short
              return (
                <g
                  key={chapter.short}
                  transform={`translate(${x},${y}) scale(${1 / k})`}
                  className={cn('transition-opacity duration-300', shown ? 'cursor-pointer' : 'pointer-events-none opacity-15')}
                  onMouseEnter={() => shown && setHovered(chapter.short)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => shown && onSelect(chapter)}
                  tabIndex={shown ? 0 : -1}
                  role="button"
                  aria-label={`${chapter.name} — view chapter leaders`}
                  onKeyDown={(e) => {
                    if (shown && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onSelect(chapter)
                    }
                  }}
                >
                  {isHover && <circle r="15" className="fill-flag-red/25" />}
                  <circle
                    r={isHover ? 8 : 6}
                    className="fill-flag-red transition-all duration-200"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </g>
              )
            })}
          </g>
        </svg>

        {/* Tooltip rail — a stable spot under the map rather than a floating layer */}
        <div className="mt-3 flex min-h-[2.5rem] items-center">
          {hovered ? (
            <p className="text-sm text-ink/70">
              <span className="font-semibold text-navy">{CHAPTERS.find((c) => c.short === hovered)?.name}</span>
              <span className="text-ink/45"> · {CHAPTERS.find((c) => c.short === hovered)?.address}</span>
            </p>
          ) : (
            <p className="text-sm text-ink/40">Hover a pin to see the school and meet its leaders.</p>
          )}
        </div>
      </div>

      {/* Chapter list, synced with the map */}
      <div>
        <ul className="divide-y divide-border">
          {visible.map((c) => (
            <li key={c.short}>
              <button
                onClick={() => onSelect(c)}
                onMouseEnter={() => setHovered(c.short)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'group flex w-full items-center gap-3 py-2.5 text-left transition-colors',
                  hovered === c.short ? 'text-navy' : 'text-ink/75 hover:text-navy',
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full transition-all duration-200',
                    hovered === c.short ? 'scale-125 bg-flag-red' : 'bg-navy/20',
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate font-serif text-[0.975rem] font-semibold">{c.short}</span>
                <span className="shrink-0 text-xs text-ink/40 group-hover:hidden">{c.borough}</span>
                <span className="hidden shrink-0 text-xs font-semibold text-flag-red group-hover:inline">
                  View →
                </span>
              </button>
            </li>
          ))}
        </ul>
        {visible.length === 0 && (
          <p className="py-8 text-sm text-ink/50">No chapters here yet — this could be the first.</p>
        )}
      </div>
    </div>
  )
}
