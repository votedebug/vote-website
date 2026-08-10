import { useState } from 'react'
import { Flag, Landmark, Mail, Megaphone, Users } from 'lucide-react'
import { InstagramIcon, LinkedinIcon } from '@/components/SocialIcons'
import { Container, Reveal } from '@/components/Container'
import { SectionHeading } from '@/components/Bits'
import { Button } from '@/components/ui/button'
import { useSanityQuery } from '@/lib/useSanity'
import { siteSettingsQuery } from '@/lib/queries'
import { cn } from '@/lib/utils'

const WAYS = [
  {
    icon: Flag,
    title: 'Start a chapter',
    body: 'Bring VOTE to your high school. We’ll set you up with everything you need to run your first drive.',
    tag: 'Students',
  },
  {
    icon: Users,
    title: 'Volunteer at a drive',
    body: 'Already have a chapter nearby? Join a registration drive and help sign up your classmates.',
    tag: 'Volunteers',
  },
  {
    icon: Landmark,
    title: 'Lead a state chapter',
    body: 'Take VOTE beyond New York. State chapter leads recruit schools, support new chapter leaders, and coordinate drives across their state.',
    tag: 'Leads',
  },
  {
    icon: Megaphone,
    title: 'Advocate for legislation',
    body: 'Help expand pre-registration and youth-voting access in your state. We’ll connect you to the right people.',
    tag: 'Organizers',
  },
]

export default function GetInvolved() {
  const { data: SITE } = useSanityQuery(siteSettingsQuery)
  if (!SITE) return null

  return (
    <>
      {/* Ways to help */}
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-20">
        <Container>
          <span className="eyebrow text-flag-red">Get Involved</span>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-navy text-balance sm:text-5xl">
            Ways to help.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70 text-pretty">
            However you want to help — starting a chapter, volunteering at a drive, leading a state,
            or moving legislation — we’ll meet you where you are.
          </p>

          <div className="mt-14 grid gap-y-12 sm:grid-cols-2 sm:gap-x-0 lg:grid-cols-4">
            {WAYS.map((w, i) => (
              <Reveal
                key={w.title}
                delay={i * 80}
                className={cn(
                  'sm:px-7',
                  i % 2 === 1 && 'sm:border-l sm:border-border',
                  i > 0 && 'lg:border-l lg:border-border',
                )}
              >
                <div className="flex items-center justify-between">
                  <w.icon className="h-7 w-7 text-royal" strokeWidth={1.75} />
                  <span className="eyebrow text-flag-red">{w.tag}</span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-navy">{w.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{w.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact form + info */}
      <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
        <div className="absolute inset-0 navy-grid" aria-hidden />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-royal/25 blur-3xl" aria-hidden />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading light eyebrow="Say hello" title="Send us a message." intro="Tell us a little about you and what you’d like to do. We read every note." />
              <div className="mt-8 space-y-4">
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-white transition-colors hover:text-flag-red">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="font-semibold">{SITE.email}</span>
                </a>
                <div className="flex gap-3 pt-2">
                  <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-navy">
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                  <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-navy">
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                </div>
                <p className="pt-2 text-sm text-white/50">{SITE.address}</p>
              </div>
            </div>

            <ContactForm email={SITE.email} />
          </div>
        </Container>
      </section>
    </>
  )
}

function ContactForm({ email }) {
  const [form, setForm] = useState({ name: '', email: '', school: '', interest: 'Start a chapter', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[${form.interest}] Message from ${form.name || 'a student'}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nSchool: ${form.school}\nInterest: ${form.interest}\n\n${form.message}`,
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  const field = 'w-full rounded-lg border border-input bg-white px-4 py-2.5 text-sm text-navy shadow-sm placeholder:text-ink/40 focus-visible:border-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/25'
  const label = 'block text-sm font-semibold text-navy'

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Name</label>
          <input id="name" required value={form.name} onChange={set('name')} className={`mt-1.5 ${field}`} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" type="email" required value={form.email} onChange={set('email')} className={`mt-1.5 ${field}`} placeholder="you@email.com" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="school" className={label}>School (optional)</label>
        <input id="school" value={form.school} onChange={set('school')} className={`mt-1.5 ${field}`} placeholder="Your high school" />
      </div>
      <div className="mt-4">
        <label htmlFor="interest" className={label}>I want to…</label>
        <select id="interest" value={form.interest} onChange={set('interest')} className={`mt-1.5 ${field}`}>
          <option>Start a chapter</option>
          <option>Volunteer at a drive</option>
          <option>Lead a state chapter</option>
          <option>Advocate for legislation</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="message" className={label}>Message</label>
        <textarea id="message" required rows={4} value={form.message} onChange={set('message')} className={`mt-1.5 ${field} resize-none`} placeholder="Tell us what you have in mind…" />
      </div>
      <Button type="submit" className="mt-6 w-full bg-flag-red text-white hover:bg-flag-red-dark">
        Send message
      </Button>
    </form>
  )
}
