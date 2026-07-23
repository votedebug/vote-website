import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { Eyebrow } from '@/components/Bits'
import { ARTICLES, featuredArticle } from '@/data/articles'
import { cn } from '@/lib/utils'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Articles() {
  const lead = featuredArticle()
  const categories = useMemo(() => ['All', ...Array.from(new Set(ARTICLES.map((a) => a.category)))], [])
  const [active, setActive] = useState('All')

  const rest = ARTICLES.filter((a) => a.slug !== lead.slug)
  const filtered = active === 'All' ? rest : rest.filter((a) => a.category === active)

  return (
    <>
      {/* Masthead */}
      <section className="border-b border-navy/15 bg-cream">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-col items-center border-b border-navy/15 pb-6 text-center">
            <Eyebrow>Vote of Teens</Eyebrow>
            <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-navy sm:text-6xl">
              The Reader
            </h1>
            <p className="mt-3 max-w-xl text-ink/60">
              Reporting and essays on youth, voting, and the fight to be counted — written by
              students, for students.
            </p>
          </div>
        </Container>
      </section>

      {/* Lead story */}
      <section className="py-14">
        <Container>
          <Reveal>
            <Link to={`/articles/${lead.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="order-2 overflow-hidden rounded-2xl lg:order-1">
                <img
                  src={lead.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="rounded-full bg-flag-red px-2.5 py-1 uppercase tracking-wider text-white">Lead story</span>
                  <span className="uppercase tracking-wider text-royal">{lead.category}</span>
                </div>
                <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] text-navy transition-colors group-hover:text-royal sm:text-5xl">
                  {lead.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-ink/70">{lead.dek}</p>
                <p className="mt-5 text-sm font-medium text-ink/55">
                  By {lead.author} · {fmtDate(lead.date)} · {lead.readTime}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 font-semibold text-flag-red">
                  Read the story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* Filter + index */}
      <section className="pb-24">
        <Container>
          <div className="flex flex-col gap-6 border-y border-navy/15 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-serif text-2xl font-semibold text-navy">Latest</h3>
            <div className="flex flex-wrap gap-2">
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
          </div>

          <ul className="mt-2">
            {filtered.map((a, i) => (
              <li key={a.slug}>
                <Link
                  to={`/articles/${a.slug}`}
                  className="group grid grid-cols-[auto_1fr] items-center gap-5 border-b border-border py-7 sm:grid-cols-[3rem_1fr_auto] sm:gap-8"
                >
                  <span className="font-serif text-2xl font-semibold text-flag-red/40 sm:text-3xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-wider text-royal">
                      {a.category}
                      <span className="text-ink/30">·</span>
                      <span className="font-medium normal-case tracking-normal text-ink/45">{fmtDate(a.date)}</span>
                    </div>
                    <h4 className="mt-1.5 font-serif text-2xl font-semibold leading-snug text-navy transition-colors group-hover:text-royal sm:text-[1.7rem]">
                      {a.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink/60">{a.dek}</p>
                    <p className="mt-2 text-xs font-medium text-ink/45">By {a.author} · {a.readTime}</p>
                  </div>
                  <img
                    src={a.image}
                    alt=""
                    className="col-start-2 hidden h-24 w-36 rounded-lg object-cover sm:col-start-3 sm:block"
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
