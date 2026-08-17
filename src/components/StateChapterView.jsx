import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { geoMercator, geoPath } from 'd3-geo'
import { ArrowLeft, ImagePlus } from 'lucide-react'
import { stateFeature, isInNyc, NYC_CENTER } from '@/lib/chapterStates'
import { NycChapterMap } from '@/components/NycChapterMap'
import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'

// The state is fitted to this width and the viewBox height follows from its
// real proportions, so Massachusetts reads wide and New York reads tall
// instead of both being letterboxed into one fixed frame.
const INNER = 900
const PAD = 44

/**
 * One state, zoomed: the state itself as the main object on screen, its state
 * directors beside it, and a dot for every school chapter.
 *
 * New York gets a second level. Twenty of its twenty-one chapters sit inside
 * New York City, where at state zoom they collapse into a few pixels of each
 * other — so they are drawn as a single cluster that opens the borough map
 * (the same NycChapterMap this page has always used) when clicked.
 */
export function StateChapterView({ abbr, name, chapters, stateDoc, onSelectChapter }) {
  const [zoomedToNyc, setZoomedToNyc] = useState(false)

  const nycChapters = abbr === 'NY' ? chapters.filter(isInNyc) : []
  const hasNycCluster = nycChapters.length > 1

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {zoomedToNyc ? (
          <button
            onClick={() => setZoomedToNyc(false)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal transition-colors hover:text-flag-red"
          >
            <ArrowLeft className="h-4 w-4" /> {name} State
          </button>
        ) : (
          <Link
            to="/chapters"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal transition-colors hover:text-flag-red"
          >
            <ArrowLeft className="h-4 w-4" /> All states
          </Link>
        )}
        <span className="text-sm text-ink/40">
          {chapters.length} school chapter{chapters.length === 1 ? '' : 's'}
          {zoomedToNyc ? ' · New York City' : ''}
        </span>
      </div>

      {/* The page hero already carries the state as the h1, so the state name
          is not repeated here — only the borough view needs its own title. */}
      {zoomedToNyc && (
        <h2 className="mt-3 font-serif text-4xl font-semibold uppercase leading-none tracking-tight text-navy sm:text-5xl">
          New York City
        </h2>
      )}
      {stateDoc?.blurb && !zoomedToNyc && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70 text-pretty">{stateDoc.blurb}</p>
      )}

      {zoomedToNyc ? (
        <div key="nyc" className="mt-10 animate-in fade-in zoom-in-95 duration-500">
          <NycChapterMap chapters={nycChapters} onSelect={onSelectChapter} />
        </div>
      ) : (
        <div key={abbr} className="mt-10 animate-in fade-in zoom-in-95 duration-500">
          <StateMap
            abbr={abbr}
            chapters={chapters}
            nycChapters={hasNycCluster ? nycChapters : []}
            onSelectChapter={onSelectChapter}
            onOpenNyc={() => setZoomedToNyc(true)}
          />
          <DirectorPanel name={name} stateDoc={stateDoc} />
          <ChapterList
            chapters={chapters}
            nycCount={hasNycCluster ? nycChapters.length : 0}
            onSelectChapter={onSelectChapter}
            onOpenNyc={() => setZoomedToNyc(true)}
          />
        </div>
      )}
    </div>
  )
}

function StateMap({ abbr, chapters, nycChapters, onSelectChapter, onOpenNyc }) {
  const [hovered, setHovered] = useState(null)

  const geo = useMemo(() => {
    const feat = stateFeature(abbr)
    if (!feat) return null

    const projection = geoMercator().fitWidth(INNER, feat)
    const pathGen = geoPath(projection)
    const [[x0, y0], [x1, y1]] = pathGen.bounds(feat)

    const clustered = new Set(nycChapters.map((c) => c._id))
    const pins = chapters
      .filter((c) => !clustered.has(c._id) && Array.isArray(c.coords) && typeof c.coords[0] === 'number')
      .map((c) => {
        const p = projection(c.coords)
        return p ? { chapter: c, x: p[0], y: p[1] } : null
      })
      .filter(Boolean)

    const nycPoint = nycChapters.length ? projection(NYC_CENTER) : null

    return {
      d: pathGen(feat),
      pins,
      nyc: nycPoint ? { x: nycPoint[0], y: nycPoint[1] } : null,
      viewBox: `${x0 - PAD} ${y0 - PAD} ${x1 - x0 + PAD * 2} ${y1 - y0 + PAD * 2}`,
      ratio: (x1 - x0 + PAD * 2) / (y1 - y0 + PAD * 2),
    }
  }, [abbr, chapters, nycChapters])

  if (!geo) return null

  return (
    <div>
      <svg
        viewBox={geo.viewBox}
        style={{ aspectRatio: geo.ratio }}
        className="mx-auto block max-h-[78vh] w-full"
        role="img"
        aria-label={`Map of ${abbr} showing every Vote of Teens school chapter.`}
      >
        <path
          d={geo.d}
          fill="var(--color-royal)"
          fillOpacity={0.14}
          stroke="var(--color-royal)"
          strokeOpacity={0.55}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {geo.pins.map(({ chapter, x, y }) => {
          const isHover = hovered === chapter._id
          return (
            <g
              key={chapter._id}
              transform={`translate(${x},${y})`}
              className="cursor-pointer outline-none"
              tabIndex={0}
              role="button"
              aria-label={`${chapter.name} — view chapter leaders`}
              onMouseEnter={() => setHovered(chapter._id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(chapter._id)}
              onBlur={() => setHovered(null)}
              onClick={() => onSelectChapter(chapter)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectChapter(chapter)
                }
              }}
            >
              {isHover && <circle r={20} className="fill-flag-red/25" />}
              <circle
                r={isHover ? 11 : 8}
                className="fill-flag-red transition-all duration-200"
                stroke="#fff"
                strokeWidth={3}
              />
            </g>
          )
        })}

        {geo.nyc && (
          <g
            transform={`translate(${geo.nyc.x},${geo.nyc.y})`}
            className="cursor-pointer outline-none"
            tabIndex={0}
            role="button"
            aria-label={`New York City — ${nycChapters.length} chapters. Open the borough map.`}
            onMouseEnter={() => setHovered('nyc')}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered('nyc')}
            onBlur={() => setHovered(null)}
            onClick={onOpenNyc}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpenNyc()
              }
            }}
          >
            <circle r={46} className="fill-flag-red/15" />
            <circle
              r={hovered === 'nyc' ? 32 : 29}
              className="fill-flag-red transition-all duration-200"
              stroke="#fff"
              strokeWidth={3}
            />
            <text
              textAnchor="middle"
              dy="0.36em"
              className="pointer-events-none select-none fill-white font-sans font-bold"
              style={{ fontSize: 26 }}
            >
              {nycChapters.length}
            </text>
            <text
              y={72}
              textAnchor="middle"
              className="pointer-events-none select-none fill-navy font-sans font-bold uppercase"
              style={{ fontSize: 22, letterSpacing: 2 }}
            >
              New York City
            </text>
          </g>
        )}
      </svg>

      {/* Hover rail */}
      <div className="mt-4 flex min-h-[2.5rem] items-center justify-center text-center">
        {hovered === 'nyc' ? (
          <p className="text-sm text-ink/70">
            <span className="font-semibold text-navy">New York City</span>
            <span className="text-ink/45"> · {nycChapters.length} chapters — click to open the borough map</span>
          </p>
        ) : hovered ? (
          <p className="text-sm text-ink/70">
            <span className="font-semibold text-navy">{chapters.find((c) => c._id === hovered)?.name}</span>
            <span className="text-ink/45"> · {chapters.find((c) => c._id === hovered)?.address}</span>
          </p>
        ) : (
          <p className="text-sm text-ink/40">Hover a dot to see the school and meet its leaders.</p>
        )}
      </div>
    </div>
  )
}

function ChapterList({ chapters, nycCount, onSelectChapter, onOpenNyc }) {
  const listed = nycCount ? chapters.filter((c) => !isInNyc(c)) : chapters
  return (
    <ul className="mx-auto mt-12 max-w-2xl divide-y divide-border border-t border-border">
      {nycCount > 0 && (
        <li>
          <button
            onClick={onOpenNyc}
            className="group flex w-full items-center gap-3 py-3 text-left text-ink/75 transition-colors hover:text-navy"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-flag-red" aria-hidden />
            <span className="min-w-0 flex-1 truncate font-serif text-[0.975rem] font-semibold">
              New York City
            </span>
            <span className="shrink-0 text-xs text-ink/40 group-hover:hidden">{nycCount} chapters</span>
            <span className="hidden shrink-0 text-xs font-semibold text-flag-red group-hover:inline">Zoom in →</span>
          </button>
        </li>
      )}
      {listed.map((c) => (
        <li key={c._id}>
          <button
            onClick={() => onSelectChapter(c)}
            className="group flex w-full items-center gap-3 py-3 text-left text-ink/75 transition-colors hover:text-navy"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-navy/20 transition-all group-hover:scale-125 group-hover:bg-flag-red" aria-hidden />
            <span className="min-w-0 flex-1 truncate font-serif text-[0.975rem] font-semibold">
              {c.short || c.name}
            </span>
            <span className="shrink-0 text-xs text-ink/40 group-hover:hidden">{c.borough}</span>
            <span className="hidden shrink-0 text-xs font-semibold text-flag-red group-hover:inline">View →</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function DirectorPanel({ name, stateDoc }) {
  const directors = stateDoc?.directors || []

  return (
    <section className="mt-12 border-t border-border pt-8">
      <p className="eyebrow text-center text-royal">State Directors</p>
      <h3 className="mt-2 text-center font-serif text-2xl font-semibold leading-tight text-navy">
        Running VOTE across {name}
      </h3>

      {directors.length === 0 ? (
        <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-ink/60">
          State directors for {name} are being announced.{' '}
          <Link to="/get-involved" className="font-semibold text-royal underline-offset-2 hover:underline">
            Get involved
          </Link>{' '}
          if you want to help lead them.
        </p>
      ) : (
        // Flex + wrap + justify-center instead of a fixed grid so any count —
        // three directors, four, whatever — reads as one centered cluster
        // rather than a grid row with an awkward empty trailing cell.
        <ul className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-x-10 gap-y-12">
          {directors.map((d, i) => (
            <li key={i} className="w-40 text-center">
              <div className="mx-auto aspect-square w-32 overflow-hidden rounded-2xl bg-secondary">
                {d.photo ? (
                  <img
                    src={urlFor(d.photo).width(400).height(400).fit('crop').auto('format').url()}
                    alt={d.name || `${name} state director`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-border text-ink/40">
                    <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
                    <span className="text-[0.6rem] font-semibold uppercase">Add</span>
                  </div>
                )}
              </div>
              <p
                className={cn(
                  'mt-4 font-serif text-lg font-semibold leading-tight',
                  d.name ? 'text-navy' : 'text-ink/40',
                )}
              >
                {d.name || 'Director to be announced'}
              </p>
              {d.role && (
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-flag-red">{d.role}</p>
              )}
              {d.bio && <p className="mt-3 text-sm leading-relaxed text-ink/65">{d.bio}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
