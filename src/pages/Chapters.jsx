import { useState } from 'react'
import { ArrowRight, CalendarDays, ImagePlus, MapPin } from 'lucide-react'
import { Container, Reveal } from '@/components/Container'
import { PageHeader, SectionHeading, LinkButton, Eyebrow } from '@/components/Bits'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { CHAPTERS } from '@/data/chapters'
import { upcomingEvents } from '@/data/events'
import { cn } from '@/lib/utils'

export default function Chapters() {
  const [active, setActive] = useState(null)

  return (
    <>
      <PageHeader
        eyebrow="Our Chapters"
        title="One school became fifteen."
        intro="Each VOTE chapter is a student-run team registering voters inside their own high school. Click a chapter to meet its directors."
      />

      {/* All chapters — equal, clickable */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.short} delay={(i % 4) * 50}>
                <button
                  onClick={() => setActive(c)}
                  className="group flex h-full w-full flex-col items-center rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-md"
                >
                  <div className="flex h-24 items-center justify-center">
                    <ChapterMark c={c} />
                  </div>
                  <h3 className="mt-4 font-serif text-base font-semibold leading-snug text-navy">{c.short}</h3>
                  <span className="mt-1 text-xs font-semibold text-royal opacity-0 transition-opacity group-hover:opacity-100">
                    View directors →
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Calendar */}
      <CalendarSection />

      {/* CTA — verbatim from original site */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center text-white sm:px-12">
            <div className="absolute inset-0 opacity-10 stripe-accent" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <Eyebrow light className="justify-center">Your school next</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl font-semibold uppercase tracking-tight text-balance sm:text-4xl">
                Join our mission and start your own chapter today
              </h2>
              <div className="mt-8">
                <LinkButton to="/get-involved" size="lg" className="btn-glow bg-flag-red text-white hover:bg-flag-red-dark">
                  Start a chapter <ArrowRight className="h-4 w-4" />
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ChapterDialog chapter={active} onClose={() => setActive(null)} />
    </>
  )
}

function ChapterMark({ c, large }) {
  if (c.logo) {
    return (
      <img
        src={c.logo}
        alt={c.name}
        className={cn('w-auto object-contain', large ? 'max-h-24 max-w-[150px]' : 'max-h-20 max-w-[120px]')}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-royal font-serif font-semibold text-white',
        large ? 'h-24 w-24 text-3xl' : 'h-16 w-16 text-xl',
      )}
    >
      {c.monogram}
    </div>
  )
}

function ChapterDialog({ chapter, onClose }) {
  return (
    <Dialog open={!!chapter} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        {chapter && (
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2">
                <ChapterMark c={chapter} />
              </div>
              <div>
                <span className="eyebrow text-flag-red">VOTE Chapter</span>
                <DialogTitle className="mt-1 font-serif text-2xl font-semibold leading-tight text-navy">
                  {chapter.name}
                </DialogTitle>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="eyebrow text-royal">Chapter Directors</h4>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {chapter.directors.map((d, i) => (
                  <div key={i} className="text-center">
                    <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl bg-secondary">
                      {d.photo ? (
                        <img src={d.photo} alt={d.name} className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-border text-ink/40">
                          <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
                          <span className="text-[0.6rem] font-semibold uppercase">Add</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-tight text-navy">{d.name}</p>
                    <p className="text-xs text-ink/55">{d.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              Want to lead this chapter or add your photo here?{' '}
              <a href="/get-involved" className="font-semibold text-royal hover:underline">Get involved</a>.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

const fmt = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

function CalendarSection() {
  const events = upcomingEvents()
  return (
    <section className="border-y border-border bg-cream py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Calendar"
            title="Upcoming drives & civic dates"
            intro="When our chapters are registering voters, plus the national days worth building around."
          />
          <div className="flex gap-4 pb-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-flag-red"><span className="h-2.5 w-2.5 rounded-full bg-flag-red" />Chapter drive</span>
            <span className="flex items-center gap-1.5 text-royal"><span className="h-2.5 w-2.5 rounded-full bg-royal" />National date</span>
          </div>
        </div>

        <ul className="mt-10 space-y-3">
          {events.map((e, i) => {
            const drive = e.type === 'drive'
            return (
              <Reveal key={i} delay={(i % 6) * 40}>
                <li className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:gap-6 sm:p-5">
                  <div
                    className={cn(
                      'flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg text-white',
                      drive ? 'bg-flag-red' : 'bg-royal',
                    )}
                  >
                    <span className="text-[0.65rem] font-bold uppercase leading-none opacity-90">
                      {new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="font-serif text-2xl font-semibold leading-tight">
                      {new Date(e.date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-semibold text-navy">{e.title}</h3>
                      {drive && e.chapter && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-flag-red/10 px-2 py-0.5 text-xs font-semibold text-flag-red">
                          <MapPin className="h-3 w-3" /> {e.chapter}
                        </span>
                      )}
                      {!drive && (
                        <span className="rounded-full bg-royal/10 px-2 py-0.5 text-xs font-semibold text-royal">National</span>
                      )}
                    </div>
                    {e.note && <p className="mt-1 text-sm text-ink/60">{e.note}</p>}
                  </div>
                  <CalendarDays className="hidden h-5 w-5 shrink-0 text-ink/30 sm:block" />
                </li>
              </Reveal>
            )
          })}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Chapter drive dates are placeholders — edit them in <code className="text-xs">src/data/events.js</code>. National dates reflect the 2026 cycle; verify before publicizing.
        </p>
      </Container>
    </section>
  )
}
