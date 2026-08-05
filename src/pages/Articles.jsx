import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Container } from '@/components/Container'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useCarouselAutoplay } from '@/lib/useCarouselAutoplay'
import { useSanityQuery } from '@/lib/useSanity'
import { articlesListQuery } from '@/lib/queries'
import { cn } from '@/lib/utils'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Articles() {
  const { data: ARTICLES } = useSanityQuery(articlesListQuery)
  const [active, setActive] = useState('All')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set((ARTICLES || []).map((a) => a.category)))],
    [ARTICLES],
  )

  // The carousel leads with the featured story, then the rest in order.
  const featured = useMemo(() => {
    if (!ARTICLES) return []
    const lead = ARTICLES.find((a) => a.feature) || ARTICLES[0]
    if (!lead) return []
    return [lead, ...ARTICLES.filter((a) => a.slug !== lead.slug)].slice(0, 5)
  }, [ARTICLES])

  if (!ARTICLES) return null

  const filtered = active === 'All' ? ARTICLES : ARTICLES.filter((a) => a.category === active)

  return (
    <>
      <StoriesCarousel stories={featured} />

      <section className="pb-24 pt-16">
        <Container>
          <span className="eyebrow text-flag-red">All Stories</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Browse our full collection
          </h2>

          <div className="mt-8 flex flex-wrap gap-2 border-b border-navy/15 pb-6">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                  active === c
                    ? 'border-navy bg-navy text-white'
                    : 'border-border bg-white text-ink/70 hover:border-navy/40 hover:text-navy',
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <ul>
            {filtered.map((a) => (
              <li key={a.slug}>
                <Link
                  to={`/articles/${a.slug}`}
                  className="group grid grid-cols-1 items-center gap-5 border-b border-border py-7 sm:grid-cols-[1fr_auto] sm:gap-8"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-wider text-royal">
                      {a.category}
                      <span className="text-ink/30">·</span>
                      <span className="font-medium normal-case tracking-normal text-ink/45">{fmtDate(a.date)}</span>
                    </div>
                    <h3 className="mt-1.5 font-serif text-2xl font-semibold leading-snug text-navy transition-colors group-hover:text-royal sm:text-[1.7rem]">
                      {a.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink/60">{a.dek}</p>
                    <p className="mt-2 text-xs font-medium text-ink/45">By {a.author} · {a.readTime}</p>
                  </div>
                  <img
                    src={a.image}
                    alt=""
                    className="hidden h-24 w-36 rounded-lg object-cover sm:block"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">No articles in this category yet.</p>
          )}
        </Container>
      </section>
    </>
  )
}

/**
 * Full-bleed featured-story carousel: the active slide sits centre stage with
 * its neighbours peeking in behind edge fades, and the caption links through
 * to the story.
 */
function StoriesCarousel({ stories }) {
  const [api, setApi] = useState()
  const [paused, setPaused] = useState(false)
  const { index, count, scrollTo } = useCarouselAutoplay(api, { delay: 6000, paused })
  const current = stories[Math.min(index, stories.length - 1)]

  return (
    <section
      className="relative overflow-hidden bg-navy pt-10 pb-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured stories"
    >
      <div className="absolute inset-0 navy-grid" aria-hidden />

      <div className="relative">
        <Carousel setApi={setApi} opts={{ loop: true, align: 'center' }}>
          <CarouselContent className="ml-0">
            {stories.map((s, i) => (
              <CarouselItem key={s.slug} className="basis-[86%] pl-0 sm:basis-[70%] lg:basis-[58%]">
                <Link
                  to={`/articles/${s.slug}`}
                  tabIndex={i === index ? 0 : -1}
                  className={cn(
                    'group relative mx-2 block overflow-hidden rounded-2xl transition-all duration-500 sm:mx-3',
                    i === index ? 'opacity-100' : 'opacity-45',
                  )}
                >
                  <img
                    src={s.image}
                    alt=""
                    className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="eyebrow text-flag-red">{s.category}</span>
                    <h2 className="mt-2 max-w-2xl font-serif text-2xl font-semibold leading-tight text-white text-balance sm:text-4xl">
                      {s.title}
                    </h2>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[8vw] bg-gradient-to-r from-navy to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[8vw] bg-gradient-to-l from-navy to-transparent" aria-hidden />

        {/* Arrows */}
        <button
          onClick={() => api?.scrollPrev()}
          aria-label="Previous story"
          className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          aria-label="Next story"
          className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Caption + dots */}
      <Container className="relative mt-7">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.98rem] leading-relaxed text-white/70 text-pretty">{current?.dek}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/45">
            By {current?.author} · {current && fmtDate(current.date)} · {current?.readTime}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2.5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Show story ${i + 1} of ${count}`}
                aria-current={i === index}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-7 bg-flag-red' : 'w-1.5 bg-white/30 hover:bg-white/60',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
