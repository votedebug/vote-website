import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, ImagePlus } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { SectionHeading, LinkButton } from '@/components/Bits'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { MiniUsMap } from '@/components/MiniUsMap'
import { CalendarSection } from '@/components/ChapterCalendar'
import { TornEdge, LogoButtonSticker, RegisteredSticker, PreRegisterSticker, FirstTimeVoterSticker } from '@/components/Decor'
import { useCarouselIndex } from '@/lib/useCarouselAutoplay'
import { useReveal } from '@/lib/useReveal'
import { useSanityQuery } from '@/lib/useSanity'
import { siteSettingsQuery, chaptersQuery, articlesListQuery } from '@/lib/queries'
import { cn } from '@/lib/utils'

export default function Home() {
  const { data: site } = useSanityQuery(siteSettingsQuery)
  const { data: chapters } = useSanityQuery(chaptersQuery)
  const { data: articles } = useSanityQuery(articlesListQuery)

  if (!site || !chapters || !articles) return null

  const featured = articles.find((a) => a.slug === site.featuredArticleSlug) || articles[0]
  const secondary = articles.filter((a) => a.slug !== featured?.slug).slice(0, 5)

  return (
    <>
      <Hero site={site} />
      <StatsBand stats={site.stats} />
      <MissionTeaser />
      {featured && <FeaturedArticles featured={featured} secondary={secondary} />}
      <LegislationTeaser />
      <CalendarSection showIntro={false} tornEdges />
      <ChaptersStrip chapters={chapters} />
      <ClosingCta site={site} />
    </>
  )
}

function Hero({ site }) {
  return (
    <section className="relative overflow-hidden">
      <Container className="relative grid items-center gap-12 pt-10 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-8 lg:pb-14">
        <div>
          <h1 className="font-serif text-[2.6rem] font-bold leading-[1.03] tracking-tight text-navy text-balance sm:text-6xl">
            Registering the next
            <span className="relative whitespace-nowrap text-flag-red"> generation </span>
            of American voters.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75 text-pretty">
            Vote of Teens is a student-led movement registering high school students to vote.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-flag-red text-white hover:bg-flag-red-dark">
              <Link to="/get-involved">
                Get Involved <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-navy/20 text-navy hover:bg-navy hover:text-white">
              <Link to="/chapters">Explore our chapters</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <LogoButtonSticker className="-left-3 -top-4 h-20 w-20 -rotate-12 sm:-left-6 sm:-top-6 sm:h-24 sm:w-24" />
          <RegisteredSticker className="-right-2 -bottom-3 w-32 rotate-[8deg] sm:-right-6 sm:w-40" />
          <HeroCarousel slides={site.heroSlides} />
        </div>
      </Container>
    </section>
  )
}

function HeroCarousel({ slides }) {
  const [api, setApi] = useState()
  const { index, count, scrollTo } = useCarouselIndex(api)

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: true, dragFree: false }} className="overflow-hidden rounded-[1.75rem] cursor-grab active:cursor-grabbing">
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide._key} className="pl-0">
              <figure className="relative">
                {slide.src ? (
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className="aspect-[4/5] lg:aspect-square w-full select-none object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] lg:aspect-square w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-navy/15 bg-secondary text-ink/40">
                    <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Add photo</span>
                  </div>
                )}
                {slide.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/35 to-transparent pt-16 pb-6 pl-6 pr-6">
                    <figcaption className="font-serif font-bold text-lg leading-snug text-white text-balance">
                      {slide.caption}
                    </figcaption>
                  </div>
                )}
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        onClick={() => api?.scrollPrev()}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
      >
        <ArrowRight className="h-5 w-5" />
      </button>

      {/* Slide indicators sit under the frame, not on it */}
      <div className="mt-5 flex items-center gap-2.5">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Show slide ${i + 1} of ${count}`}
            aria-current={i === index}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              i === index ? 'w-8 bg-flag-red' : 'w-4 bg-navy/20 hover:bg-navy/40',
            )}
          />
        ))}
      </div>
    </div>
  )
}

// Splits a stat string like "2,000+" into its animatable pieces — the
// leading/trailing non-digits are kept static, only the number counts up.
function parseStatValue(raw) {
  const match = String(raw).match(/^(\D*)([\d,]+)(.*)$/)
  if (!match) return null
  const [, prefix, digits, suffix] = match
  return { prefix, target: parseInt(digits.replace(/,/g, ''), 10), suffix }
}

function CountUp({ value, start, delay = 0 }) {
  const parsed = useMemo(() => parseStatValue(value), [value])
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value)

  useEffect(() => {
    if (!start || !parsed) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }

    const duration = 1400
    let raf
    let startTime

    const tick = (now) => {
      if (startTime === undefined) startTime = now
      const progress = Math.min(1, (now - startTime) / duration)
      // easeOutExpo — quick at first, settles gently into the final number.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.round(parsed.target * eased)
      setDisplay(`${parsed.prefix}${current.toLocaleString('en-US')}${parsed.suffix}`)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [start, parsed, value, delay])

  return display
}

function StatsBand({ stats }) {
  const [ref, visible] = useReveal({ threshold: 0.4 })

  return (
    <section ref={ref} className="relative bg-navy">
      <TornEdge position="top" className="text-white" seed={3} />
      <TornEdge position="bottom" className="text-white" seed={17} />
      <Container className="grid grid-cols-2 divide-x divide-white/10 py-5 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="px-4 py-8 text-center">
            <div className="font-serif text-4xl font-bold tabular-nums text-white sm:text-5xl">
              <CountUp value={s.value} start={visible} delay={i * 120} />
            </div>
            <div className="eyebrow mt-2 text-white/60">{s.label}</div>
          </div>
        ))}
      </Container>
    </section>
  )
}

function MissionTeaser() {
  return (
    <section className="overflow-hidden py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative grid grid-cols-2 gap-4">
            <PreRegisterSticker className="-right-2 -top-5 w-36 rotate-[7deg] sm:-right-5 sm:w-44" />
            <FirstTimeVoterSticker className="-bottom-6 -left-2 w-24 -rotate-[14deg] sm:-left-6 sm:w-28" />
            <img src="/img/drive-1.jpg" alt="Students at a registration table" className="col-span-2 aspect-[16/9] w-full rounded-2xl object-cover" />
            <img src="/img/drive-3.jpg" alt="A Vote of Teens organizer" className="aspect-square w-full rounded-2xl object-cover" />
            <img src="/img/drive-4.jpg" alt="Registration drive in action" className="aspect-square w-full rounded-2xl object-cover" />
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2" delay={100}>
          <SectionHeading
            title="Young people are both the present and future of democracy."
            intro="VOTE is a student-led, non-partisan movement dedicated to amplifying young voices and ensuring they play a crucial role in shaping the future of their communities and the nation."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/about" className="bg-navy text-white hover:bg-navy-dark">
              Read our story
            </LinkButton>
            <LinkButton to="/team" variant="ghost" className="text-navy hover:bg-secondary">
              Meet the team <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

function FeaturedArticles({ featured, secondary }) {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <TornEdge position="top" className="text-white" seed={29} />
      <TornEdge position="bottom" className="text-white" seed={41} />
      <Container className="relative">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading light title="Stories on youth & democracy" />
          <Link to="/articles" className="hidden shrink-0 items-center gap-1 pb-2 text-sm font-semibold text-flag-red hover:underline sm:flex">
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Link to={`/articles/${featured.slug}`} className="group block">
              <div className="overflow-hidden rounded-2xl">
                <img src={featured.image} alt="" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-5">
                <span className="eyebrow text-flag-red">{featured.category}</span>
                <h3 className="mt-2 font-serif text-3xl font-bold leading-tight text-white transition-colors group-hover:text-royal-light">
                  {featured.title}
                </h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-white/70">{featured.dek}</p>
                <p className="mt-4 text-sm font-medium text-white/55">
                  {featured.author} · {featured.readTime}
                </p>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col divide-y divide-white/10">
            {secondary.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90}>
                <Link to={`/articles/${a.slug}`} className="group flex gap-4 py-5 first:pt-0">
                  <img src={a.image} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                  <div>
                    <span className="eyebrow text-flag-red">{a.category}</span>
                    <h4 className="mt-1 font-serif text-lg font-bold leading-snug text-white transition-colors group-hover:text-royal-light">
                      {a.title}
                    </h4>
                    <p className="mt-1 text-xs font-medium text-white/50">{a.author} · {a.readTime}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
            <Link to="/articles" className="mt-2 flex items-center gap-1 pt-4 text-sm font-semibold text-royal-light hover:underline sm:hidden">
              All articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

function LegislationTeaser() {
  return (
    <section className="overflow-hidden py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              title="We mapped the registration rules across every state."
              intro="From pre-registering at 16 to same-day deadlines, the path to the ballot changes at every state line. Explore the interactive map to see when teens in each state can get on the rolls and how to help change the law where they can’t."
            />
            <div className="mt-8">
              <LinkButton to="/legislation" className="bg-flag-red text-white hover:bg-flag-red-dark">
                Open the legislation map <ArrowUpRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>

          {/* The map itself is the visual — no card wrapper. */}
          <Link to="/legislation" className="group relative block">
            <MiniUsMap className="h-auto w-full drop-shadow-[0_18px_28px_rgba(11,42,107,0.16)]" />
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-navy">Interactive · all 50 states + D.C.</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-flag-red">
                Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  )
}

function ClosingCta({ site }) {
  return (
    <section className="relative overflow-hidden bg-flag-red py-20 text-white sm:py-28">
      <TornEdge position="top" className="text-white" seed={53} />
      <TornEdge position="bottom" className="text-navy" seed={61} />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold leading-tight text-balance sm:text-[2.75rem]">
            Start a chapter, run a drive, and change who shows up on Election Day.
          </h2>
          <p className="mt-4 text-white/85">
            Email us to bring VOTE to your school or to work on youth-voting legislation.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-flag-red hover:bg-navy hover:text-white">
              <Link to="/get-involved">Get Involved</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-navy">
              <a href={`mailto:${site.email}`}>Email us</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

function ChaptersStrip({ chapters }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl font-serif text-2xl font-bold text-navy sm:text-3xl text-balance">
            Representing high schools across New York City.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-3 items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
          {chapters.filter((c) => c.logo).map((c) => (
            <div key={c.short} className="flex items-center justify-center" title={c.name}>
              <img
                src={c.logo}
                alt={c.name}
                className="h-14 w-auto max-w-[100px] object-contain opacity-90 transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <LinkButton to="/chapters" variant="outline" className="border-navy/20 text-navy hover:bg-navy hover:text-white">
            See all chapters <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Container>
    </section>
  )
}
