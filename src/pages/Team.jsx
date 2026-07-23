import { ImagePlus } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { PageHeader } from '@/components/Bits'
import { BOARD, FOUNDERS, EDITORIAL, MEDIA } from '@/data/team'

function SubHeading({ children }) {
  return (
    <h2 className="font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">{children}</h2>
  )
}

export default function Team() {
  return (
    <>
      <PageHeader
        eyebrow="Our Team"
        title="The students running the show."
        intro="VOTE is built and led entirely by high schoolers and the alumni who started it — the board steering the mission and the editorial and media teams telling its story."
      />

      {/* Directors */}
      <section id="directors" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <span className="eyebrow text-flag-red">Our Board</span>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <SubHeading>Executive Directors</SubHeading>
          </div>
          <p className="mt-3 max-w-2xl text-ink/70">
            Our directors set strategy, lead the flagship Bronx Science chapter, and support chapters across the city.
          </p>

          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {BOARD.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PersonCard person={p} />
              </Reveal>
            ))}
          </div>

          {/* Founders — heading matches "Executive Directors", cards centered */}
          <div className="mt-20 text-center">
            <SubHeading>Founders</SubHeading>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-x-8 gap-y-12 sm:grid-cols-2">
            {FOUNDERS.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PersonCard person={p} center />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Editorial */}
      <section id="editorial" className="scroll-mt-24 border-t border-border bg-cream py-16 sm:py-20">
        <Container>
          <span className="eyebrow text-flag-red">Our Editorial Team</span>
          <div className="mt-3">
            <SubHeading>The voices</SubHeading>
          </div>
          <p className="mt-3 max-w-2xl text-ink/70">
            Our editorial desk reports on youth civic power and writes the stories in The Reader.
          </p>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {EDITORIAL.map((p, i) => (
              <Reveal key={i} delay={i * 70}>
                <PersonCard person={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Media */}
      <section id="media" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <span className="eyebrow text-flag-red">Our Media Team</span>
          <div className="mt-3">
            <SubHeading>The visuals</SubHeading>
          </div>
          <p className="mt-3 max-w-2xl text-ink/70">
            Our media team documents every drive and builds the VOTE brand across social platforms.
          </p>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {MEDIA.map((p, i) => (
              <Reveal key={i} delay={i * 70}>
                <PersonCard person={p} />
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            Editorial &amp; Media rosters are placeholders — send the real names, roles, and photos
            and they’ll drop right in.
          </p>
        </Container>
      </section>
    </>
  )
}

function PersonCard({ person, center }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            style={person.imgStyle}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-ink/40">
            <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-xs font-semibold uppercase tracking-wider">Add photo</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold text-navy">{person.name}</h3>
      <p className="mt-0.5 text-sm font-semibold text-royal">{person.role}</p>
      {person.chapter && <p className="text-xs font-medium text-ink/50">{person.chapter}</p>}
      <p className={`mt-2.5 text-sm leading-relaxed text-ink/70 ${center ? 'mx-auto max-w-xs' : ''}`}>{person.bio}</p>
    </div>
  )
}
