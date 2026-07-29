import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// Small uppercase label with a red tick — used above section titles.
export function Eyebrow({ children, className, light = false }) {
  return (
    <span className={cn('eyebrow inline-flex items-center gap-2', light ? 'text-white/80' : 'text-royal', className)}>
      <span className="h-px w-6 bg-flag-red" aria-hidden />
      {children}
    </span>
  )
}

export function SectionHeading({ eyebrow, title, intro, center, light, className }) {
  return (
    <div className={cn(center && 'mx-auto max-w-2xl text-center', 'max-w-3xl', className)}>
      {eyebrow && <Eyebrow light={light} className={cn(center && 'justify-center')}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'mt-4 font-serif text-3xl leading-[1.08] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]',
          light ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn('mt-4 text-base leading-relaxed sm:text-lg text-pretty', light ? 'text-white/75' : 'text-muted-foreground')}>
          {intro}
        </p>
      )}
    </div>
  )
}

// A row of small stars — patriotic accent used sparingly.
export function StarRow({ count = 5, className }) {
  return (
    <div className={cn('flex items-center gap-1.5 text-flag-red', className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3 w-3" />
      ))}
    </div>
  )
}

export function Star({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.26L21.8 9.2l-5 4.7 1.3 6.9L12 17.5 5.9 20.8l1.3-6.9-5-4.7 6.9-.94L12 2z" />
    </svg>
  )
}

// Navy hero band for interior pages.
import { Container } from '@/components/Container'

export function PageHero({ eyebrow, title, intro, children }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 opacity-[0.06] stripe-accent" aria-hidden />
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-royal/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-flag-red/20 blur-3xl" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75 text-pretty">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  )
}

// Internal link styled as a primary button.
export function LinkButton({ to, href, children, variant = 'default', size = 'default', className }) {
  if (href) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a>
      </Button>
    )
  }
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link to={to}>{children}</Link>
    </Button>
  )
}
