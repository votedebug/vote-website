import { cn } from '@/lib/utils'

// A rough, torn-paper edge laid over the top or bottom of a coloured band.
// `className` sets the colour of the paper being torn (the neighbouring
// section's background), e.g. "text-white".
const W = 1440
const STEP = 18
// Fixed offsets so the edge looks hand-torn but renders the same on the
// server prerender and in the browser.
const JAGS = [
  6, 11, 4, 9, 14, 7, 3, 10, 13, 5, 8, 12, 2, 9, 6, 15, 10, 4, 7, 12, 3, 8, 14, 6, 11, 5, 9, 13, 4, 10,
  7, 2, 12, 8, 5, 14, 9, 3, 11, 6, 13, 7, 4, 10, 15, 8, 5, 12, 3, 9, 6, 11, 14, 4, 8, 13, 7, 2, 10, 5,
  12, 9, 3, 14, 6, 11, 8, 4, 13, 7, 10, 5, 9, 12, 3, 8, 15, 6, 11, 4, 9,
]

function tornPath(seedOffset = 0) {
  const at = (i) => JAGS[(i + seedOffset) % JAGS.length]
  let d = `M0 0 L0 ${at(0)}`
  let x = 0
  for (let i = 1; x < W; i++) {
    // Uneven step widths keep the tear from looking like a saw blade.
    x = Math.min(W, x + STEP * 0.4 + at(i * 7) * 1.6)
    d += ` L${x.toFixed(1)} ${at(i)}`
  }
  return `${d} L${W} 0 Z`
}

export function TornEdge({ position = 'top', seed = 0, className }) {
  return (
    <svg
      viewBox={`0 0 ${W} 16`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 z-10 block h-2 w-full fill-current sm:h-2.5',
        position === 'top' ? 'top-0' : 'bottom-0 rotate-180',
        className,
      )}
    >
      <path d={tornPath(seed)} />
    </svg>
  )
}

// Die-cut vinyl stickers: a thick white border and a soft shadow so they read
// as physical objects stuck onto the page.
const stickerBase = 'pointer-events-none absolute z-20 select-none drop-shadow-[0_6px_10px_rgba(11,42,107,0.28)]'

export function LogoButtonSticker({ className }) {
  return (
    <div className={cn(stickerBase, className)} aria-hidden>
      <div className="flex h-full w-full items-center justify-center rounded-full border-[5px] border-white bg-white ring-[6px] ring-inset ring-flag-red">
        <img src="/img/logo.png" alt="" className="h-[58%] w-[58%] object-contain" draggable={false} />
      </div>
    </div>
  )
}

export function FutureVoterSticker({ className }) {
  return (
    <svg viewBox="0 0 220 120" className={cn(stickerBase, className)} aria-hidden>
      <ellipse cx="110" cy="60" rx="106" ry="56" fill="#fff" />
      <ellipse cx="110" cy="60" rx="97" ry="47" fill="var(--color-navy)" />
      <ellipse cx="110" cy="60" rx="88" ry="38" fill="none" stroke="var(--color-flag-red)" strokeWidth="3" />
      <text x="110" y="56" textAnchor="middle" fill="#fff" fontFamily="'Hanken Grotesk', sans-serif" fontWeight="800" fontSize="24" letterSpacing="2">
        FUTURE
      </text>
      <text x="110" y="82" textAnchor="middle" fill="#fff" fontFamily="'Hanken Grotesk', sans-serif" fontWeight="800" fontSize="24" letterSpacing="2">
        VOTER
      </text>
    </svg>
  )
}

export function PreRegisterSticker({ className }) {
  return (
    <svg viewBox="0 0 230 80" className={cn(stickerBase, className)} aria-hidden>
      <rect x="2" y="2" width="226" height="76" rx="14" fill="#fff" />
      <rect x="10" y="10" width="210" height="60" rx="8" fill="var(--color-flag-red)" />
      <text x="115" y="34" textAnchor="middle" fill="#fff" fontFamily="'Hanken Grotesk', sans-serif" fontWeight="700" fontSize="13" letterSpacing="2.5">
        PRE-REGISTER AT
      </text>
      <text x="115" y="61" textAnchor="middle" fill="#fff" fontFamily="'Hanken Grotesk', sans-serif" fontWeight="900" fontSize="26">
        16
      </text>
    </svg>
  )
}

export function FirstTimeVoterSticker({ className }) {
  return (
    <svg viewBox="0 0 140 140" className={cn(stickerBase, className)} aria-hidden>
      <defs>
        <path id="ftv-arc" d="M 70 70 m -44 0 a 44 44 0 1 1 88 0 a 44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="70" cy="70" r="68" fill="#fff" />
      <circle cx="70" cy="70" r="60" fill="var(--color-flag-red)" />
      <text fill="#fff" fontFamily="'Hanken Grotesk', sans-serif" fontWeight="800" fontSize="12" letterSpacing="1">
        <textPath href="#ftv-arc" textLength="272" lengthAdjust="spacing">FIRST-TIME VOTER · FIRST-TIME VOTER ·</textPath>
      </text>
      <path
        d="M70 48 l6.4 13 14.3 2.1 -10.4 10.1 2.5 14.2 -12.8-6.7 -12.8 6.7 2.5-14.2 -10.4-10.1 14.3-2.1z"
        fill="#fff"
      />
    </svg>
  )
}
