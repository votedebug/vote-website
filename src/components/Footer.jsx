import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'
import { InstagramIcon, LinkedinIcon } from '@/components/SocialIcons'
import { Container } from '@/components/Container'
import { StarRow } from '@/components/Bits'
import { NAV, SITE } from '@/data/site'

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy text-white">
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-flag-red" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-royal-light" />
      </div>

      <Container className="py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/img/logo.png" alt="" className="h-12 w-12 rounded-md object-contain" />
              <div className="leading-none">
                <div className="font-serif text-xl font-semibold">Vote of Teens</div>
                <div className="eyebrow mt-1 text-[0.6rem] text-white/60">{SITE.tagline}</div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              A student-led movement registering the next generation of voters — one high school
              hallway at a time.
            </p>
            <StarRow className="mt-6 text-flag-red" />
          </div>

          <div>
            <h3 className="eyebrow text-white/60">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/get-involved" className="font-semibold text-white transition-colors hover:text-white/80">
                  Get Involved →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-white/60">Connect</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-start gap-2.5 text-white/80 transition-colors hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-royal-light" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal-light" />
                {SITE.address}
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-flag-red">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-flag-red">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Vote of Teens. For teens, by teens.</p>
          <p>Made with civic spirit in New York City.</p>
        </div>
      </Container>
    </footer>
  )
}
