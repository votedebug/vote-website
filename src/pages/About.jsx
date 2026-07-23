import { ArrowRight } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { SectionHeading, Eyebrow, LinkButton, StarRow } from '@/components/Bits'
import { STATS } from '@/data/site'

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-[0.06] stripe-accent" aria-hidden />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-royal/30 blur-3xl" aria-hidden />
        <Container className="relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow light>About VOTE</Eyebrow>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Who we are.
            </h1>
            <figure className="mt-6 max-w-2xl border-l-2 border-flag-red pl-5">
              <blockquote className="font-serif text-xl italic leading-relaxed text-white/90 sm:text-2xl">
                “The future promise of any nation can be directly measured by the present prospects
                of its youth.”
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-white/60">
                — President John F. Kennedy
              </figcaption>
            </figure>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border-4 border-white/90 shadow-2xl">
              <img
                src="/img/jfk.png"
                alt="President John F. Kennedy addressing a crowd"
                className="aspect-[4/3] w-full bg-white object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1.5 stripe-accent opacity-90" />
          </div>
        </Container>
      </section>

      {/* WHO WE ARE */}
      <section className="py-20 sm:py-24">
        <Container className="grid items-start gap-14 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <SectionHeading eyebrow="Who we are" title="A student-led, non-partisan movement." />
            <p className="mt-6 text-lg leading-relaxed text-ink/75">
              Vote of Teens in Elections (VOTE) was founded by two Bronx Science students with a
              passion for politics and American history. Inspired by the success of their school’s
              voter registration drive, they set out to expand their initiative citywide, empowering
              students across New York City schools to participate in voting - the keystone of
              American democracy. VOTE is a student-led, non-partisan movement dedicated to
              amplifying young voices and ensuring they play a crucial role in shaping the future of
              their communities and the nation.
            </p>
            <div className="mt-8">
              <LinkButton to="/team" className="bg-navy text-white hover:bg-navy-dark">
                Meet the people behind it <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border-4 border-white shadow-xl">
              <img src="/img/drive-4.jpg" alt="Vote of Teens organizers" className="aspect-[4/5] w-full object-cover" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Impact band */}
      <section className="bg-cream py-16">
        <Container>
          <SectionHeading center eyebrow="By the numbers" title="What student-led looks like." />
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
                <div className="font-serif text-4xl font-semibold text-flag-red">{s.value}</div>
                <div className="eyebrow mt-2 text-navy/60">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* WHY VOTE */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <StarRow />
            <SectionHeading className="mt-5" eyebrow="Why VOTE?" title="Every vote is a seed planted for a more inclusive democracy." />
            <p className="mt-6 text-lg leading-relaxed text-ink/75">
              In our modern democracy, marked by a plethora of ideological divides that seem as vast
              as the Grand Canyon, the importance of teen voter registration emerges as a vital cog
              in the machinery of our nation. Despite its essentiality, young people’s involvement in
              the democratic process has been in atrophy recently, as many feel discouraged by the
              chaos and commotion of the endeavor. The creation of VOTE was not an act of whimsy but
              a calculated response to this alarming apathy that plagues the teenage demographic,
              which threatens the very fabric of our democracy. By spreading the movement of voter
              registration to a multitude of NYC High Schools, we weave a new narrative in which the
              youth are not mere spectators but active participants in shaping the future of their
              country. In doing so, VOTE not only combats the lack of civic activity among teenagers
              but also instills a sense of hope and optimism that transcends the ideological chasms,
              proving that every vote is a seed planted for a more inclusive and vibrant democracy.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-14 text-white sm:px-12">
            <div className="absolute inset-0 opacity-10 stripe-accent" aria-hidden />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl">
                <Eyebrow light>Join us</Eyebrow>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-balance">
                  Bring Vote of Teens to your school.
                </h2>
              </div>
              <LinkButton to="/get-involved" size="lg" className="bg-flag-red text-white hover:bg-flag-red-dark">
                Get Involved <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
