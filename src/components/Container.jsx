import { cn } from '@/lib/utils'

export function Container({ className, children, ...props }) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)} {...props}>
      {children}
    </div>
  )
}

// A reveal wrapper used across sections.
import { useReveal } from '@/lib/useReveal'

export function Reveal({ className, children, delay = 0, as: Tag = 'div' }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
