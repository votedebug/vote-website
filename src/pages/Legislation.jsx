import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Mail, Search, Users2, Vote } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { PageHero, SectionHeading, LinkButton } from '@/components/Bits'
import { LegislationMap } from '@/components/LegislationMap'
import { POLICIES } from '@/data/policies'
import { useSanityQuery } from '@/lib/useSanity'
import { siteSettingsQuery, articlesListQuery } from '@/lib/queries'
import { cn } from '@/lib/utils'

const HELP = [
  {
    icon: Search,
    title: 'Know your legislators',
    body: 'Not sure who writes election law in your state? We’ll help you find your representatives and the committees that matter.',
  },
  {
    icon: Vote,
    title: 'Back a pre-registration bill',
    body: 'Many states still don’t let teens pre-register. We connect students to the bills and coalitions working to change that.',
  },
  {
    icon: Users2,
    title: 'Organize a drive',
    body: 'The fastest way to grow youth turnout is to register the students around you. We’ll give you the playbook.',
  },
]

export default function Legislation() {
  const { data: SITE } = useSanityQuery(siteSettingsQuery)
  if (!SITE) return null

  return (
    <>
      <PageHero
        eyebrow="Legislation"
        title="Where can teens get on the rolls? Find your state."
        intro="Voter-registration law changes at every state line. Click a state to see when young people can register or pre-register — and how to help expand access where they can’t."
      />

      <section className="py-14 sm:py-16">
        <Container>
          <LegislationMap />
        </Container>
      </section>

      <PlatformSection />

      {/* How to help */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            center
            eyebrow="Make it change"
            title="Want to help write the next law?"
            intro="You don’t have to be old enough to vote to move legislation. Here’s how VOTE helps students turn a map into momentum."
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {HELP.map((h, i) => (
              <Reveal key={h.title} delay={i * 90}>
                <h.icon className="h-7 w-7 text-royal" strokeWidth={1.75} />
                <h3 className="mt-4 font-serif text-xl font-semibold text-navy">{h.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{h.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="max-w-xl text-lg text-ink/75">
              Ready to get involved with legislation in your state? Send us an email and we’ll get
              you connected.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <LinkButton to="/get-involved" size="lg" className="bg-flag-red text-white hover:bg-flag-red-dark">
                Get Involved
              </LinkButton>
              <LinkButton href={`mailto:${SITE.email}?subject=Youth%20voting%20legislation`} size="lg" variant="outline" className="border-navy/20 text-navy hover:bg-navy hover:text-white">
                <Mail className="h-4 w-4" /> Email us
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

/**
 * Our platform, as an expanding list rather than a row of cards: one plank is
 * open at a time, so the section reads as a manifesto you step through.
 */
function PlatformSection() {
  const [open, setOpen] = useState(0)
  const { data: articles } = useSanityQuery(articlesListQuery)
  const getArticle = (slug) => (articles || []).find((a) => a.slug === slug)

  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <div className="absolute inset-0 navy-grid" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-royal/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-flag-red/15 blur-3xl" aria-hidden />

      <Container className="relative">
        <SectionHeading
          light
          eyebrow="Our platform"
          title="Policies Vote of Teens supports"
          intro="These are the reforms we believe would bring more young people into democracy. Open one to read the case."
        />

        <div className="mt-14 border-t border-white/12">
          {POLICIES.map((p, i) => {
            const isOpen = open === i
            const article = getArticle(p.articleSlug)
            return (
              <div key={p.articleSlug} className="border-b border-white/12">
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`plank-${i}`}
                    className="group flex w-full items-start gap-5 py-7 text-left outline-none sm:gap-8"
                  >
                    <span
                      className={cn(
                        'font-serif text-3xl font-semibold leading-none transition-colors duration-300 sm:text-4xl',
                        isOpen ? 'text-flag-red' : 'text-white/20 group-hover:text-white/45',
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={cn(
                        'flex-1 font-serif text-xl font-semibold leading-snug transition-all duration-300 sm:text-[1.65rem]',
                        isOpen ? 'text-white' : 'text-white/75 group-hover:translate-x-1 group-hover:text-white',
                      )}
                    >
                      {p.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        'mt-1 h-5 w-5 shrink-0 transition-transform duration-300',
                        isOpen ? 'rotate-180 text-flag-red' : 'text-white/40 group-hover:text-white/70',
                      )}
                    />
                  </button>
                </h3>

                <div
                  id={`plank-${i}`}
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-400 ease-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 sm:pl-[4.5rem]">
                      <p className="max-w-2xl text-lg leading-relaxed text-white/70">{p.summary}</p>
                      {article && (
                        <Link
                          to={`/articles/${p.articleSlug}`}
                          tabIndex={isOpen ? 0 : -1}
                          className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-flag-red"
                        >
                          Read the case
                          <span className="text-white/40">· {article.readTime}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
