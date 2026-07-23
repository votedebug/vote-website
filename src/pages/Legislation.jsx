import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Search, Users2, Vote } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { PageHero, SectionHeading, LinkButton } from '@/components/Bits'
import { LegislationMap } from '@/components/LegislationMap'
import { POLICIES } from '@/data/policies'
import { SITE } from '@/data/site'

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

      {/* Policies we support */}
      <section className="border-t border-border py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Our platform"
            title="Policies Vote of Teens supports"
            intro="These are the reforms we believe would bring more young people into democracy. Read the case for each."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {POLICIES.map((p, i) => (
              <Reveal key={p.articleSlug} delay={i * 90}>
                <Link
                  to={`/articles/${p.articleSlug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-md"
                >
                  <span className="font-serif text-4xl font-semibold text-flag-red/25">0{i + 1}</span>
                  <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-navy">{p.title}</h3>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink/70">{p.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-royal">
                    Read the case <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How to help */}
      <section className="bg-cream py-20">
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
