import { ImagePlus } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { useSanityQuery } from '@/lib/useSanity'
import { teamQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'

function SubHeading({ children, light }) {
  return (
    <h2 className={cn('font-serif text-3xl font-semibold tracking-tight sm:text-4xl', light ? 'text-white' : 'text-navy')}>
      {children}
    </h2>
  )
}

export default function Team() {
  const { data: team } = useSanityQuery(teamQuery)
  if (!team) return null

  const BOARD = team.filter((p) => p.category === 'board')
  const FOUNDERS = team.filter((p) => p.category === 'founder')
  const EDITORIAL = team.filter((p) => p.category === 'editorial')
  const MEDIA = team.filter((p) => p.category === 'media')

  return (
    <>
      {/* Directors — the page opens straight onto the board */}
      <section id="directors" className="scroll-mt-24 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <Container>
          <span className="eyebrow text-flag-red">Our Board</span>
          <div className="mt-3">
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
        </Container>
      </section>

      {/* Editorial — deep navy band, cards reveal their bio on hover */}
      <section id="editorial" className="relative scroll-mt-24 overflow-hidden bg-navy py-16 text-white sm:py-20">
        <div className="absolute inset-0 navy-grid" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-royal/25 blur-3xl" aria-hidden />
        <Container className="relative">
          <span className="eyebrow text-flag-red">Our Editorial Team</span>
          <div className="mt-3">
            <SubHeading light>The voices</SubHeading>
          </div>
          <p className="mt-3 max-w-2xl text-white/65">
            Our editorial desk reports on youth civic power and writes the stories in The Reader.
          </p>
          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {EDITORIAL.map((p, i) => (
              <Reveal key={i} delay={i * 70}>
                <RevealCard person={p} />
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
                <RevealCard person={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Founders — closing the page, where the story started */}
      <section id="founders" className="scroll-mt-24 border-t border-border py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <span className="eyebrow text-flag-red">Where it started</span>
            <div className="mt-3">
              <SubHeading>Founders</SubHeading>
            </div>
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
    </>
  )
}

// Cards are aspect-[4/5] — crop every photo to match via Sanity's hotspot,
// so everyone renders at the same size regardless of their source photo's
// original framing. Adjust the crop per-person in the Studio (Media tab on
// the image field) rather than in code.
function Portrait({ person, className }) {
  if (person.photo) {
    return (
      <img
        src={urlFor(person.photo).width(640).height(800).fit('crop').auto('format').url()}
        alt={person.name}
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-current/25 text-current/40">
      <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
      <span className="text-xs font-semibold uppercase tracking-wider">Add photo</span>
    </div>
  )
}

function PersonCard({ person, center }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary text-ink">
        <Portrait person={person} />
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold text-navy">{person.name}</h3>
      <p className="mt-0.5 text-sm font-semibold text-royal">{person.role}</p>
      {person.chapter && <p className="text-xs font-medium text-ink/50">{person.chapter}</p>}
      <p className={cn('mt-2.5 text-sm leading-relaxed text-ink/70', center && 'mx-auto max-w-xs')}>{person.bio}</p>
    </div>
  )
}

/**
 * Navy-band variant: the portrait fills the tile and the bio slides up over it
 * on hover or keyboard focus. Bio stays readable on touch, where there is no
 * hover — it is revealed by tapping (focus) and always announced to screen
 * readers via the visually-present text.
 */
function RevealCard({ person }) {
  return (
    <div
      tabIndex={0}
      className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-navy-soft text-white outline-none ring-flag-red/60 transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2"
    >
      <Portrait person={person} className="transition-transform duration-500 group-hover:scale-105" />

      {/* Resting state: name + role over a gradient */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-dark via-navy-dark/80 to-transparent px-4 pb-4 pt-14 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
        <h3 className="font-serif text-lg font-semibold leading-tight">{person.name}</h3>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-royal-light">{person.role}</p>
      </div>

      {/* Hover / focus state: full bio */}
      <div className="absolute inset-0 flex translate-y-3 flex-col justify-end bg-navy-dark/92 px-4 pb-4 pt-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="h-0.5 w-8 bg-flag-red" aria-hidden />
        <h3 className="mt-3 font-serif text-lg font-semibold leading-tight">{person.name}</h3>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-royal-light">{person.role}</p>
        <p className="mt-2.5 text-[0.8rem] leading-relaxed text-white/75">{person.bio}</p>
      </div>
    </div>
  )
}
