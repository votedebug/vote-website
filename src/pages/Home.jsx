import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ImagePlus } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { Eyebrow, SectionHeading, StarRow, LinkButton } from '@/components/Bits'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { MiniUsMap } from '@/components/MiniUsMap'
import { useCarouselIndex } from '@/lib/useCarouselAutoplay'
import { useSanityQuery } from '@/lib/useSanity'
import { siteSettingsQuery, chaptersQuery, articlesListQuery } from '@/lib/queries'
import { cn } from '@/lib/utils'

export default function Home() {
  const { data: site } = useSanityQuery(siteSettingsQuery)
  const { data: chapters } = useSanityQuery(chaptersQuery)
  const { data: articles } = useSanityQuery(articlesListQuery)

  if (!site || !chapters || !articles) return null

  const featured = articles.find((a) => a.feature) || articles[0]
  const secondary = articles.filter((a) => a.slug !== featured?.slug).slice(0, 2)

  return (
    <>
      <Hero site={site} />
      <StatsBand stats={site.stats} />
      <MissionTeaser />
      {featured && <FeaturedArticles featured={featured} secondary={secondary} />}
      <LegislationTeaser />
      <ClosingCta site={site} />
      <ChaptersStrip chapters={chapters} />
    </>
  )
}

function Hero({ site }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-royal/8 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-flag-red/6 blur-3xl" aria-hidden />
      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <Eyebrow>{site.tagline}</Eyebrow>
          <h1 className="mt-5 font-serif text-[2.6rem] font-semibold leading-[1.03] tracking-tight text-navy text-balance sm:text-6xl">
            Registering the next
            <span className="relative whitespace-nowrap text-flag-red"> generation </span>
            of American voters.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75 text-pretty">
            Vote of Teens is a student-led movement turning high school hallways into the front
            line of democracy — one registration, one chapter, one first-time voter at a time.
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
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StarRow />
            <p className="min-w-0 text-sm font-medium text-ink/60">
              <span className="font-bold text-navy">2,000+</span> teens registered across New York City
            </p>
          </div>
        </div>

        <HeroCarousel slides={site.heroSlides} />
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
                    className="aspect-[4/5] w-full select-none object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-navy/15 bg-secondary text-ink/40">
                    <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Add photo</span>
                  </div>
                )}
                {slide.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/35 to-transparent pt-16 pb-6 pl-6 pr-6">
                    <figcaption className="font-serif text-lg leading-snug text-white text-balance">
                      {slide.caption}
                    </figcaption>
                  </div>
                )}
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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
        <span className="ml-auto text-xs font-semibold tabular-nums text-ink/45">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

function StatsBand({ stats }) {
  return (
    <section className="border-y border-border bg-navy">
      <Container className="grid grid-cols-2 divide-x divide-white/10 py-2 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group px-4 py-8 text-center">
            <div className="font-serif text-4xl font-semibold text-white transition-[color,filter] duration-300 group-hover:text-flag-red group-hover:drop-shadow-[0_0_18px_var(--color-flag-red)] sm:text-5xl">
              {s.value}
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
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            <img src="/img/drive-1.jpg" alt="Students at a registration table" className="col-span-2 aspect-[16/9] w-full rounded-2xl object-cover" />
            <img src="/img/drive-3.jpg" alt="A Vote of Teens organizer" className="aspect-square w-full rounded-2xl object-cover" />
            <img src="/img/drive-4.jpg" alt="Registration drive in action" className="aspect-square w-full rounded-2xl object-cover" />
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2" delay={100}>
          <SectionHeading
            eyebrow="Our mission"
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
      <div className="absolute inset-0 navy-grid" aria-hidden />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-royal/25 blur-3xl" aria-hidden />
      <Container className="relative">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading light eyebrow="From the desk" title="Stories on youth & democracy" />
          <Link to="/articles" className="hidden shrink-0 items-center gap-1 pb-2 text-sm font-semibold text-royal-light hover:underline sm:flex">
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
                <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight text-white transition-colors group-hover:text-royal-light">
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
                    <h4 className="mt-1 font-serif text-lg font-semibold leading-snug text-white transition-colors group-hover:text-royal-light">
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
    <section className="overflow-hidden border-y border-border py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Know your state"
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
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-28">
      <div className="absolute inset-0 navy-grid" aria-hidden />
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-flag-red/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-royal/25 blur-3xl" aria-hidden />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <StarRow className="mx-auto justify-center text-flag-red" />
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-balance sm:text-[2.75rem]">
            Start a chapter, run a drive, and change who shows up on Election Day.
          </h2>
          <p className="mt-4 text-white/70">
            Whether you want to bring VOTE to your school or help move youth-voting legislation,
            it starts with one email.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-flag-red text-white hover:bg-flag-red-dark">
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
          <Eyebrow>{chapters.length} chapters and counting</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-serif text-2xl font-semibold text-navy sm:text-3xl text-balance">
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
