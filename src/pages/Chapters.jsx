import { useState } from 'react'
import { ArrowRight, ImagePlus } from 'lucide-react'
import { Container } from '@/components/Container'
import { PageHero, SectionHeading, LinkButton, Eyebrow } from '@/components/Bits'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { NycChapterMap } from '@/components/NycChapterMap'
import { ChapterCalendar } from '@/components/ChapterCalendar'
import { cn } from '@/lib/utils'

export default function Chapters() {
  const [active, setActive] = useState(null)

  return (
    <>
      <PageHero
        eyebrow="Our Chapters"
        title="One school became fifteen."
        intro="Each VOTE chapter is a student-run team registering voters inside their own high school. Find one on the map — click a pin to meet its directors."
      />

      {/* The map is the chapter directory */}
      <section className="py-14 sm:py-20">
        <Container>
          <NycChapterMap onSelect={setActive} />
        </Container>
      </section>

      <CalendarSection />

      {/* CTA — verbatim from original site */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">Your school next</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-semibold uppercase tracking-tight text-navy text-balance sm:text-4xl">
              Join our mission and start your own chapter today
            </h2>
            <div className="mt-8">
              <LinkButton to="/get-involved" size="lg" className="bg-flag-red text-white hover:bg-flag-red-dark">
                Start a chapter <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      <ChapterDialog chapter={active} onClose={() => setActive(null)} />
    </>
  )
}

function CalendarSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-20">
      <div className="absolute inset-0 navy-grid" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-royal/25 blur-3xl" aria-hidden />
      <Container className="relative">
        <SectionHeading
          light
          eyebrow="Calendar"
          title="Upcoming drives & civic dates"
          intro="When our chapters are registering voters, plus the national days worth building around. Pick a day to see what’s on."
        />
        <div className="mt-12">
          <ChapterCalendar />
        </div>
        <p className="mt-10 text-sm text-white/45">
          Chapter drive dates are placeholders — edit them in <code className="text-xs">src/data/events.js</code>.
          National dates reflect the 2026 cycle; verify before publicizing.
        </p>
      </Container>
    </section>
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
                <span className="eyebrow text-flag-red">VOTE Chapter · {chapter.borough}</span>
                <DialogTitle className="mt-1 font-serif text-2xl font-semibold leading-tight text-navy">
                  {chapter.name}
                </DialogTitle>
                <p className="mt-1 text-xs text-ink/50">{chapter.address}</p>
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
