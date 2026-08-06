import { ArrowRight } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { SectionHeading, Eyebrow, LinkButton, StarRow } from '@/components/Bits'

export default function About() {
  return (
    <>
      {/* Giant blue section — the JFK quote and the cut-out photo sit directly
          on the navy, no frame, mirroring the original voteofteens.org. */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 navy-grid" aria-hidden />
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-royal/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-flag-red/15 blur-3xl" aria-hidden />

        {/* Wider than the standard Container — at the target font size, the
            quote's line breaks and a 10%-bigger photo don't both fit inside
            the site's normal max-w-6xl content width side by side. */}
        <div className="relative mx-auto grid w-full max-w-[92rem] items-end gap-6 px-5 pt-16 pb-[84px] sm:pt-20 min-[1518px]:grid-cols-[max-content_581px] min-[1518px]:justify-center min-[1518px]:gap-4 min-[1518px]:px-[140px]">
          <div className="max-w-2xl">
            <Eyebrow light>About VOTE</Eyebrow>
            <blockquote className="mt-8 font-serif text-3xl font-semibold leading-[1.15] sm:text-5xl md:text-[3.4rem]">
              “The future promise of
              <br />
              any nation can be directly
              <br />
              measured by the present
              <br />
              prospects of its youth.”
            </blockquote>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-white/55">
              — President John F. Kennedy
            </p>
          </div>

          {/* Cut-out photo, no border or card, bled flush to the bottom edge
              of the section (10% larger than the original render). A soft
              spotlight keeps the dark suit from disappearing into the navy. */}
          <div className="relative mx-auto -mb-[84px] max-w-3xl min-[1518px]:mx-0 min-[1518px]:w-full min-[1518px]:max-w-none">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 top-8 rounded-t-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.22),transparent_65%)]"
              aria-hidden
            />
            <img
              src="/img/jfk.png"
              alt="President John F. Kennedy addressing a crowd"
              className="relative mx-auto block w-full"
            />
          </div>
        </div>
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
            <img src="/img/drive-4.jpg" alt="Vote of Teens organizers" className="aspect-[4/5] w-full rounded-2xl object-cover" />
          </Reveal>
        </Container>
      </section>

      {/* WHY VOTE */}
      <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
        <div className="absolute inset-0 navy-grid" aria-hidden />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-royal/20 blur-3xl" aria-hidden />
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <StarRow />
            <SectionHeading
              light
              className="mt-5"
              eyebrow="Why VOTE?"
              title="Every vote is a seed planted for a more inclusive democracy."
            />
            <p className="mt-6 text-lg leading-relaxed text-white/75">
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

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <Eyebrow>Join us</Eyebrow>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-navy text-balance sm:text-4xl">
                Bring Vote of Teens to your school.
              </h2>
            </div>
            <LinkButton to="/get-involved" size="lg" className="shrink-0 bg-flag-red text-white hover:bg-flag-red-dark">
              Get Involved <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  )
}
