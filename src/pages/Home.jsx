import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ClipboardCheck, Megaphone, Users } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { Eyebrow, SectionHeading, StarRow, LinkButton } from '@/components/Bits'
import { Button } from '@/components/ui/button'
import { STATS, SITE } from '@/data/site'
import { CHAPTERS } from '@/data/chapters'
import { featuredArticle, ARTICLES } from '@/data/articles'

export default function Home() {
  const featured = featuredArticle()
  const secondary = ARTICLES.filter((a) => a.slug !== featured.slug).slice(0, 2)

  return (
    <>
      <Hero />
      <StatsBand />
      <MissionTeaser />
      <HowItWorks />
      <FeaturedArticles featured={featured} secondary={secondary} />
      <ChaptersStrip />
      <LegislationTeaser />
      <ClosingCta />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-royal/10 blur-3xl" aria-hidden />
      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <Eyebrow>{SITE.tagline}</Eyebrow>
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

        {/* Image cluster */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-white shadow-[0_30px_60px_-30px_rgba(11,42,107,0.5)]">
            <img
              src="/img/drive-2.jpg"
              alt="Vote of Teens students running a voter registration drive"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-2 stripe-accent opacity-90" />
          </div>
          {/* Floating stat card */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-white/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
            <div className="font-serif text-3xl font-semibold text-navy">15</div>
            <div className="eyebrow text-flag-red">School chapters</div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function StatsBand() {
  return (
    <section className="border-y border-border bg-navy">
      <Container className="grid grid-cols-2 divide-x divide-white/10 py-2 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="group px-4 py-8 text-center">
            <div className="font-serif text-4xl font-semibold text-white transition-all duration-300 group-hover:text-flag-red group-hover:[text-shadow:0_0_22px_rgba(200,16,46,0.85)] sm:text-5xl">
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
            <img src="/img/drive-1.jpg" alt="Students at a registration table" className="col-span-2 aspect-[16/9] w-full rounded-2xl object-cover shadow-sm" />
            <img src="/img/drive-3.jpg" alt="A Vote of Teens organizer" className="aspect-square w-full rounded-2xl object-cover shadow-sm" />
            <img src="/img/drive-4.jpg" alt="Registration drive in action" className="aspect-square w-full rounded-2xl object-cover shadow-sm" />
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2" delay={100}>
          <SectionHeading
            eyebrow="Our mission"
            title="Young people aren’t the future of democracy. They’re the present."
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

const STEPS = [
  {
    icon: ClipboardCheck,
    title: 'Register',
    body: 'We run registration and pre-registration drives inside schools, meeting students where they already are.',
  },
  {
    icon: Users,
    title: 'Organize',
    body: 'Student directors launch chapters, train volunteers, and build a culture of voting that outlasts any single election.',
  },
  {
    icon: Megaphone,
    title: 'Advocate',
    body: 'We track youth-voting laws state by state and connect teens to the legislators who can expand access.',
  },
]

function HowItWorks() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <Container>
        <SectionHeading center eyebrow="How it works" title="Three moves that turn students into voters." />
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 90} className="relative">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-5xl font-semibold text-flag-red/25">0{i + 1}</span>
                <step.icon className="h-6 w-6 text-royal" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-[0.975rem] leading-relaxed text-ink/70">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FeaturedArticles({ featured, secondary }) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="From the desk" title="Stories on youth & democracy" />
          <Link to="/articles" className="hidden shrink-0 items-center gap-1 pb-2 text-sm font-semibold text-royal hover:underline sm:flex">
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
                <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight text-navy transition-colors group-hover:text-royal">
                  {featured.title}
                </h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/70">{featured.dek}</p>
                <p className="mt-4 text-sm font-medium text-ink/55">
                  {featured.author} · {featured.readTime}
                </p>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col divide-y divide-border">
            {secondary.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90}>
                <Link to={`/articles/${a.slug}`} className="group flex gap-4 py-5 first:pt-0">
                  <img src={a.image} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                  <div>
                    <span className="eyebrow text-royal">{a.category}</span>
                    <h4 className="mt-1 font-serif text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-royal">
                      {a.title}
                    </h4>
                    <p className="mt-1 text-xs font-medium text-ink/50">{a.author} · {a.readTime}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
            <Link to="/articles" className="mt-2 flex items-center gap-1 pt-4 text-sm font-semibold text-royal hover:underline sm:hidden">
              All articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

function ChaptersStrip() {
  return (
    <section className="border-y border-border bg-white py-16">
      <Container>
        <div className="flex flex-col items-center text-center">
          <Eyebrow>15 chapters and counting</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-serif text-2xl font-semibold text-navy sm:text-3xl text-balance">
            Trusted by students at New York City’s most storied high schools.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-3 items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
          {CHAPTERS.filter((c) => c.logo).map((c) => (
            <div key={c.short} className="flex items-center justify-center" title={c.name}>
              <img
                src={c.logo}
                alt={c.name}
                className="h-14 w-auto max-w-[100px] object-contain transition-transform duration-300 hover:scale-105"
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

function LegislationTeaser() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-border bg-cream">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Know your state"
                title="Every state writes its own rules. We mapped all of them."
                intro="From pre-registering at 16 to same-day deadlines, the path to the ballot changes at every state line. Explore the interactive map to see when teens in each state can get on the rolls — and how to help change the law where they can’t."
              />
              <div className="mt-8">
                <LinkButton to="/legislation" className="bg-flag-red text-white hover:bg-flag-red-dark">
                  Open the legislation map <ArrowUpRight className="h-4 w-4" />
                </LinkButton>
              </div>
            </div>
            <Link to="/legislation" className="group relative block">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <MiniMapGlyph />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy">Interactive · all 50 states + D.C.</span>
                  <ArrowRight className="h-5 w-5 text-flag-red transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

function MiniMapGlyph() {
  // Simple decorative dotted-grid glyph evoking the map (kept lightweight).
  const cols = 14
  const rows = 7
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }} aria-hidden>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const palette = ['var(--color-navy)', 'var(--color-royal)', '#9fb4e0', '#e3e6ef']
        const c = palette[(i * 7) % palette.length]
        return <span key={i} className="aspect-square rounded-[3px]" style={{ background: c, opacity: i % 5 === 0 ? 0.4 : 1 }} />
      })}
    </div>
  )
}

function ClosingCta() {
  return (
    <section className="pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-14 text-center text-white sm:px-12 sm:py-20">
          <div className="absolute inset-0 opacity-10 stripe-accent" aria-hidden />
          <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-flag-red/30 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <StarRow className="mx-auto justify-center text-flag-red" />
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              Start a chapter. Run a drive. Change who shows up on Election Day.
            </h2>
            <p className="mt-4 text-white/75">
              Whether you want to bring VOTE to your school or help move youth-voting legislation,
              it starts with one email.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-flag-red text-white hover:bg-flag-red-dark">
                <Link to="/get-involved">Get Involved</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-navy">
                <a href={`mailto:${SITE.email}`}>Email us</a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
