import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'
import { NAV, SITE } from '@/data/site'

function Brand({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3 group">
      <img
        src="/img/logo.png"
        alt="Vote of Teens logo"
        className="h-11 w-11 rounded-md object-contain transition-transform duration-200 group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg font-semibold tracking-tight text-navy">Vote of Teens</span>
        <span className="eyebrow text-[0.6rem] text-flag-red">{SITE.tagline}</span>
      </span>
    </Link>
  )
}

const linkBase =
  'relative rounded-md px-3 py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-flag-red after:transition-transform after:duration-200'

function DesktopItem({ item }) {
  const location = useLocation()
  if (!item.children) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          cn(linkBase, isActive ? 'text-navy after:scale-x-100' : 'text-ink/70 hover:text-navy hover:after:scale-x-100')
        }
      >
        {item.label}
      </NavLink>
    )
  }
  const active = location.pathname === item.to
  return (
    <div className="group relative">
      <Link
        to={item.to}
        className={cn(
          linkBase,
          'flex items-center gap-1',
          active ? 'text-navy after:scale-x-100' : 'text-ink/70 hover:text-navy group-hover:text-navy',
        )}
      >
        {item.label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </Link>
      {/* Dropdown */}
      <div className="invisible absolute left-0 top-full z-50 min-w-52 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-lg">
          {item.children.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-secondary hover:text-navy"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  return (
    <header className="sticky top-0 z-50">
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-flag-red" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-royal" />
      </div>

      <div
        className={cn(
          'border-b transition-all duration-300',
          scrolled
            ? 'border-border bg-white/85 shadow-[0_2px_20px_-8px_rgba(11,42,107,0.25)] backdrop-blur-md'
            : 'border-transparent bg-white',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Brand />

          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <DesktopItem key={item.to} item={item} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="lg"
              className="hidden bg-flag-red px-6 text-[0.95rem] font-bold text-white hover:bg-flag-red-dark sm:inline-flex"
            >
              <Link to="/get-involved">Get Involved</Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm border-l-4 border-l-flag-red p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="border-b px-6 py-5">
                    <Brand onClick={() => setOpen(false)} />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
                    {NAV.map((item) => (
                      <div key={item.to}>
                        <SheetClose asChild>
                          <NavLink
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                              cn(
                                'block rounded-lg px-4 py-3 font-serif text-xl tracking-tight transition-colors',
                                isActive ? 'bg-secondary text-navy' : 'text-ink hover:bg-secondary/60',
                              )
                            }
                          >
                            {item.label}
                          </NavLink>
                        </SheetClose>
                        {item.children && (
                          <div className="mb-1 ml-4 flex flex-col border-l-2 border-border pl-3">
                            {item.children.map((c) => (
                              <SheetClose asChild key={c.to}>
                                <Link to={c.to} className="rounded-md px-3 py-2 text-sm font-medium text-ink/65 hover:text-navy">
                                  {c.label}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <SheetClose asChild>
                      <Button asChild size="lg" className="w-full bg-flag-red font-bold text-white hover:bg-flag-red-dark">
                        <Link to="/get-involved">Get Involved</Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
