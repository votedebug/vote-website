// Calendar events for the Chapters page.
// type: 'drive' = a chapter registration drive · 'national' = a national civic date.
// Chapter drives below are PLACEHOLDERS — edit dates/chapters as they get scheduled.
// National dates are for the 2026 cycle — verify before publicizing.

export const EVENTS = [
  // National civic dates (2026)
  { date: '2026-09-17', title: 'Constitution Day & Citizenship Day', type: 'national', note: 'A natural anchor for civics programming in schools.' },
  { date: '2026-09-15', title: 'National Voter Registration Day', type: 'national', note: 'The biggest single day for registration drives nationwide.' },

  // Chapter drives (placeholders)
  { date: '2026-09-15', title: 'Registration Drive', type: 'drive', chapter: 'Bronx Science', note: 'National Voter Registration Day drive in homerooms.' },
]

export function upcomingEvents(from = new Date()) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return [...EVENTS]
    .filter((e) => new Date((e.end || e.date) + 'T23:59:59') >= start)
    .sort((a, b) => a.date.localeCompare(b.date))
}
