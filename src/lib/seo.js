export const SITE_URL = 'https://vote-of-teens.org'
export const OG_IMAGE = `${SITE_URL}/img/og-cover.png`
export const SITE_NAME = 'Vote of Teens'

const DEFAULT_DESCRIPTION =
  'Vote of Teens (VOTE) is a student-led, non-partisan movement registering the next generation of voters across New York City high schools — for teens, by teens.'

// Static routes. Titles lead with the page and close with the brand so every
// result in a search page carries "Vote of Teens".
export const STATIC_ROUTES = {
  '/': {
    title: 'Vote of Teens — Student-Led Voter Registration | For Teens, By Teens',
    description: DEFAULT_DESCRIPTION,
  },
  '/about': {
    title: 'About Vote of Teens — A Student-Led Voter Registration Movement',
    description:
      'How Vote of Teens started, what the movement stands for, and why high school students are the ones registering the next generation of American voters.',
  },
  '/team': {
    title: 'Our Team — Vote of Teens',
    description:
      'Meet the student directors, editorial team, media team, and founders running Vote of Teens across New York City high schools.',
  },
  '/chapters': {
    title: 'Our Chapters — Vote of Teens High School Chapters in NYC',
    description:
      'Vote of Teens chapters registering student voters at high schools across all five New York City boroughs.',
  },
  '/articles': {
    title: 'Articles — Vote of Teens',
    description:
      'Reporting and analysis from the Vote of Teens editorial team on youth voting, pre-registration, and student-run registration drives.',
  },
  '/legislation': {
    title: 'Youth Voting Legislation Tracker — Vote of Teens',
    description:
      'A state-by-state tracker of pre-registration ages, 17-year-old primary voting, and the laws shaping when young Americans can register and vote.',
  },
  '/get-involved': {
    title: 'Get Involved — Start a Vote of Teens Chapter at Your School',
    description:
      'Register to vote, volunteer at a drive, or start a Vote of Teens chapter at your high school. Here is how to join the movement.',
  },
}

const NOT_FOUND = {
  title: 'Page Not Found — Vote of Teens',
  description: DEFAULT_DESCRIPTION,
  noindex: true,
}

/**
 * Resolve metadata for a pathname.
 *
 * Article titles live in Sanity, so `articles` is passed in rather than
 * imported: the prerender script supplies the build-time fetch, and the
 * runtime <Seo> component supplies whatever the page already loaded. With no
 * articles available we still return a correct canonical and a brand title.
 */
export function metaForPath(pathname, articles = null) {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/'
  const canonical = `${SITE_URL}${path}`

  if (STATIC_ROUTES[path]) return { ...STATIC_ROUTES[path], canonical }

  const match = path.match(/^\/articles\/([^/]+)$/)
  if (match) {
    const article = (articles || []).find((a) => a.slug === match[1])
    if (article) {
      return {
        title: `${article.title} — ${SITE_NAME}`,
        description: article.dek || DEFAULT_DESCRIPTION,
        canonical,
        article,
      }
    }
    // Article exists but its data hasn't loaded yet — never emit a noindex.
    return { title: SITE_NAME, description: DEFAULT_DESCRIPTION, canonical }
  }

  return { ...NOT_FOUND, canonical }
}

/** Every URL to prerender and list in the sitemap. */
export function allRoutes(articles = []) {
  return [...Object.keys(STATIC_ROUTES), ...articles.map((a) => `/articles/${a.slug}`)]
}

/** JSON-LD for the organisation — the entity signal behind brand search. */
export function organizationSchema(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: SITE_NAME,
    alternateName: ['VOTE', 'Vote of Teens in Elections'],
    url: SITE_URL,
    logo: `${SITE_URL}/img/logo.png`,
    image: OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    areaServed: { '@type': 'City', name: 'New York City' },
    ...(site?.email ? { email: site.email } : {}),
    ...(site?.tagline ? { slogan: site.tagline } : {}),
    ...(site?.founded ? { foundingDate: String(site.founded) } : {}),
    ...(site?.address ? { address: site.address } : {}),
    sameAs: [site?.instagram, site?.linkedin].filter(Boolean),
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'VOTE',
    url: SITE_URL,
  }
}

/**
 * Person entries for the team page. Google reads /team as "a team page", not
 * as a page about any one member, so naming each person explicitly and tying
 * them to the organisation is what makes an individual findable by name.
 */
export function personSchema(person) {
  return {
    '@type': 'Person',
    name: person.name,
    ...(person.role ? { jobTitle: person.role } : {}),
    ...(person.bio ? { description: person.bio } : {}),
    ...(person.image ? { image: person.image } : {}),
    ...(person.chapter ? { affiliation: { '@type': 'Organization', name: person.chapter } } : {}),
    worksFor: { '@type': 'NGO', name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}/team`,
  }
}

export function teamSchema(team) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} team`,
    itemListElement: (team || []).map((person, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: personSchema(person),
    })),
  }
}

export function articleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    ...(article.dek ? { description: article.dek } : {}),
    ...(article.date ? { datePublished: article.date } : {}),
    url: `${SITE_URL}/articles/${article.slug}`,
    ...(article.image ? { image: article.image } : {}),
    ...(article.author ? { author: { '@type': 'Person', name: article.author } } : {}),
    publisher: {
      '@type': 'NGO',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/logo.png` },
    },
  }
}
