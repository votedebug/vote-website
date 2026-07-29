import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { EVENTS } from '@/data/events'
import { cn } from '@/lib/utils'

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const parse = (s) => new Date(s + 'T00:00:00')

/** Expand each event across every day it covers, keyed by YYYY-MM-DD. */
function buildIndex() {
  const map = new Map()
  for (const e of EVENTS) {
    const start = parse(e.date)
    const end = e.end ? parse(e.end) : start
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const k = iso(d)
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(e)
    }
  }
  return map
}

export function ChapterCalendar() {
  const byDate = useMemo(buildIndex, [])

  // Open on the month of the next upcoming event, so the calendar is never
  // empty on arrival.
  const firstMonth = useMemo(() => {
    const today = new Date()
    const next = [...EVENTS]
      .map((e) => parse(e.end || e.date))
      .filter((d) => d >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      .sort((a, b) => a - b)[0]
    const anchor = next || parse(EVENTS[0].date)
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  }, [])

  const [month, setMonth] = useState(firstMonth)
  const [selected, setSelected] = useState(null)

  const modifiers = useMemo(() => {
    const drive = []
    const national = []
    for (const [k, list] of byDate) {
      const d = parse(k)
      if (list.some((e) => e.type === 'drive')) drive.push(d)
      if (list.some((e) => e.type === 'national')) national.push(d)
    }
    return { drive, national }
  }, [byDate])

  // Stable custom day cell: date number with a dot per event type below it.
  const DayButton = useMemo(() => {
    return function EventDayButton({ className, day, modifiers: mods, ...props }) {
      const list = byDate.get(iso(day.date)) || []
      const hasDrive = list.some((e) => e.type === 'drive')
      const hasNational = list.some((e) => e.type === 'national')
      return (
        <button
          {...props}
          className={cn(
            'relative flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg text-sm font-medium transition-colors',
            mods.outside ? 'text-white/25' : 'text-white/80',
            list.length && !mods.selected && 'text-white',
            mods.selected ? 'bg-flag-red text-white' : 'hover:bg-white/10',
            mods.today && !mods.selected && 'ring-1 ring-inset ring-white/35',
            className,
          )}
        >
          <span className="leading-none">{day.date.getDate()}</span>
          <span className="flex h-1.5 items-center gap-1">
            {hasDrive && <span className={cn('h-1.5 w-1.5 rounded-full', mods.selected ? 'bg-white' : 'bg-flag-red')} />}
            {hasNational && <span className={cn('h-1.5 w-1.5 rounded-full', mods.selected ? 'bg-white/70' : 'bg-royal-light')} />}
          </span>
        </button>
      )
    }
  }, [byDate])

  // Events shown alongside: the selected day, else everything in this month.
  const monthEvents = useMemo(() => {
    const out = []
    for (const e of EVENTS) {
      const s = parse(e.date)
      const en = e.end ? parse(e.end) : s
      if (en >= new Date(month.getFullYear(), month.getMonth(), 1) &&
          s <= new Date(month.getFullYear(), month.getMonth() + 1, 0)) {
        out.push(e)
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date))
  }, [month])

  const listed = selected ? byDate.get(iso(selected)) || [] : monthEvents

  return (
    <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
      <div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          month={month}
          onMonthChange={(m) => { setMonth(m); setSelected(null) }}
          modifiers={modifiers}
          showOutsideDays
          className="w-full bg-transparent p-0 [--cell-size:--spacing(11)]"
          classNames={{
            month_caption: 'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
            caption_label: 'font-serif text-xl font-semibold text-white',
            button_previous:
              'size-(--cell-size) rounded-lg p-0 text-white/70 hover:bg-white/10 hover:text-white aria-disabled:opacity-40',
            button_next:
              'size-(--cell-size) rounded-lg p-0 text-white/70 hover:bg-white/10 hover:text-white aria-disabled:opacity-40',
            weekday: 'flex-1 text-[0.7rem] font-bold uppercase tracking-wider text-white/40',
            today: '',
            outside: '',
          }}
          components={{ DayButton }}
        />

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="h-2.5 w-2.5 rounded-full bg-flag-red" />Chapter drive
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="h-2.5 w-2.5 rounded-full bg-royal-light" />National date
          </span>
        </div>
      </div>

      {/* Agenda */}
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-2xl font-semibold text-white">
            {selected
              ? selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="shrink-0 text-xs font-semibold text-flag-red hover:underline"
            >
              Show whole month
            </button>
          )}
        </div>

        {listed.length === 0 ? (
          <p className="mt-6 text-white/50">
            {selected ? 'Nothing scheduled this day.' : 'Nothing scheduled this month yet.'}
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-white/10">
            {listed.map((e, i) => {
              const drive = e.type === 'drive'
              return (
                <li key={i} className="flex gap-4 py-4">
                  <div className="w-14 shrink-0 text-center">
                    <div className={cn('text-[0.65rem] font-bold uppercase', drive ? 'text-flag-red' : 'text-royal-light')}>
                      {parse(e.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="font-serif text-2xl font-semibold leading-tight text-white">
                      {parse(e.date).getDate()}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif text-lg font-semibold text-white">{e.title}</h4>
                      {drive && e.chapter ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-flag-red/20 px-2 py-0.5 text-xs font-semibold text-flag-red">
                          <MapPin className="h-3 w-3" /> {e.chapter}
                        </span>
                      ) : (
                        <span className="rounded-full bg-royal/30 px-2 py-0.5 text-xs font-semibold text-royal-light">
                          National
                        </span>
                      )}
                    </div>
                    {e.note && <p className="mt-1 text-sm leading-relaxed text-white/60">{e.note}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
