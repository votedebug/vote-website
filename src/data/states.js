// Pre-registration / early voter-registration rules by state.
// Source: The Civics Center (thecivicscenter.org/prereg), captured for the 2026 cycle.
// NOTE: Election laws change. Verify against your state's official election site
// (linked per state) before relying on this for outreach.

// Categories drive the map coloring + legend.
export const CATEGORIES = {
  early: {
    key: 'early',
    label: 'Pre-register at 16 or younger',
    color: 'var(--color-navy)',
    blurb: 'Teens can lock in their registration well before turning 18.',
  },
  seventeen: {
    key: 'seventeen',
    label: 'Pre-register at 17',
    color: 'var(--color-royal)',
    blurb: 'Teens can pre-register partway through their 17th year.',
  },
  eighteen: {
    key: 'eighteen',
    label: 'Register once 18 by Election Day',
    color: '#9fb4e0',
    blurb: 'No early pre-registration — register as soon as you turn 18 (or will be by Election Day).',
  },
  none: {
    key: 'none',
    label: 'No registration required',
    color: '#c9cfdd',
    blurb: 'This state does not require voter registration.',
  },
}

// id = 2-digit FIPS string used by us-atlas topojson.
export const STATES = {
  '01': { name: 'Alabama', abbr: 'AL', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '02': { name: 'Alaska', abbr: 'AK', category: 'seventeen', rule: 'Register if you turn 18 within 90 days' },
  '04': { name: 'Arizona', abbr: 'AZ', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '05': { name: 'Arkansas', abbr: 'AR', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '06': { name: 'California', abbr: 'CA', category: 'early', rule: 'Pre-register at 16' },
  '08': { name: 'Colorado', abbr: 'CO', category: 'early', rule: 'Pre-register at 15' },
  '09': { name: 'Connecticut', abbr: 'CT', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '10': { name: 'Delaware', abbr: 'DE', category: 'early', rule: 'Pre-register at 16' },
  '11': { name: 'District of Columbia', abbr: 'DC', category: 'early', rule: 'Pre-register at 16' },
  '12': { name: 'Florida', abbr: 'FL', category: 'early', rule: 'Pre-register at 16' },
  '13': { name: 'Georgia', abbr: 'GA', category: 'seventeen', rule: 'Pre-register at 17 years, 6 months' },
  '15': { name: 'Hawaii', abbr: 'HI', category: 'early', rule: 'Pre-register at 16' },
  '16': { name: 'Idaho', abbr: 'ID', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '17': { name: 'Illinois', abbr: 'IL', category: 'early', rule: 'Pre-register at 16' },
  '18': { name: 'Indiana', abbr: 'IN', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '19': { name: 'Iowa', abbr: 'IA', category: 'seventeen', rule: 'Pre-register at 17' },
  '20': { name: 'Kansas', abbr: 'KS', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '21': { name: 'Kentucky', abbr: 'KY', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '22': { name: 'Louisiana', abbr: 'LA', category: 'early', rule: 'Pre-register at 16' },
  '23': { name: 'Maine', abbr: 'ME', category: 'early', rule: 'Pre-register at 16' },
  '24': { name: 'Maryland', abbr: 'MD', category: 'early', rule: 'Pre-register at 16' },
  '25': { name: 'Massachusetts', abbr: 'MA', category: 'early', rule: 'Pre-register at 16' },
  '26': { name: 'Michigan', abbr: 'MI', category: 'early', rule: 'Pre-register at 16' },
  '27': { name: 'Minnesota', abbr: 'MN', category: 'early', rule: 'Pre-register at 16' },
  '28': { name: 'Mississippi', abbr: 'MS', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '29': { name: 'Missouri', abbr: 'MO', category: 'seventeen', rule: 'Pre-register at 17 years, 6 months' },
  '30': { name: 'Montana', abbr: 'MT', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '31': { name: 'Nebraska', abbr: 'NE', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '32': { name: 'Nevada', abbr: 'NV', category: 'seventeen', rule: 'Pre-register at 17' },
  '33': { name: 'New Hampshire', abbr: 'NH', category: 'eighteen', rule: 'Register when 18 by Election Day' },
  '34': { name: 'New Jersey', abbr: 'NJ', category: 'seventeen', rule: 'Pre-register at 17' },
  '35': { name: 'New Mexico', abbr: 'NM', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '36': { name: 'New York', abbr: 'NY', category: 'early', rule: 'Pre-register at 16' },
  '37': { name: 'North Carolina', abbr: 'NC', category: 'early', rule: 'Pre-register at 16' },
  '38': { name: 'North Dakota', abbr: 'ND', category: 'none', rule: 'No voter registration required' },
  '39': { name: 'Ohio', abbr: 'OH', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '40': { name: 'Oklahoma', abbr: 'OK', category: 'seventeen', rule: 'Pre-register at 17 years, 6 months' },
  '41': { name: 'Oregon', abbr: 'OR', category: 'early', rule: 'Pre-register at 16' },
  '42': { name: 'Pennsylvania', abbr: 'PA', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '44': { name: 'Rhode Island', abbr: 'RI', category: 'early', rule: 'Pre-register at 16' },
  '45': { name: 'South Carolina', abbr: 'SC', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '46': { name: 'South Dakota', abbr: 'SD', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '47': { name: 'Tennessee', abbr: 'TN', category: 'eighteen', rule: 'Register when 18 by Aug 6, 2026' },
  '48': { name: 'Texas', abbr: 'TX', category: 'seventeen', rule: 'Pre-register at 17 years, 10 months' },
  '49': { name: 'Utah', abbr: 'UT', category: 'early', rule: 'Pre-register at 16' },
  '50': { name: 'Vermont', abbr: 'VT', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '51': { name: 'Virginia', abbr: 'VA', category: 'early', rule: 'Pre-register at 16' },
  '53': { name: 'Washington', abbr: 'WA', category: 'early', rule: 'Pre-register at 16' },
  '54': { name: 'West Virginia', abbr: 'WV', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
  '55': { name: 'Wisconsin', abbr: 'WI', category: 'eighteen', rule: 'Register when 18 by Aug 11, 2026' },
  '56': { name: 'Wyoming', abbr: 'WY', category: 'eighteen', rule: 'Register when 18 by Nov 3, 2026' },
}

// Official "register / check status" portal per state (vote.gov links out to these).
export const STATE_PORTAL = (abbr) =>
  `https://www.vote.org/register-to-vote/${abbr.toLowerCase()}/`

/**
 * Postal code → { id (FIPS), name, abbr }. Lives here rather than alongside the
 * map helpers so modules that only need a state's name — the SEO metadata, for
 * one — do not have to pull in the topojson to get it.
 */
export const STATE_BY_ABBR = Object.fromEntries(
  Object.entries(STATES).map(([id, s]) => [s.abbr, { id, name: s.name, abbr: s.abbr }]),
)

export function getStateById(id) {
  const s = STATES[id]
  if (!s) return null
  return { id, ...s, cat: CATEGORIES[s.category] }
}
