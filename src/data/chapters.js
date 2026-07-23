// Chapters / partner schools. Logos in /public/img (real logos from voteofteens.org
// for the original 12). New schools use a colored monogram until a logo is added.
// `directors` powers the click-to-open popup — add real names + photos over time.

const PLACEHOLDER_DIRECTORS = [
  { name: 'Chapter Director', role: 'Add name & photo', photo: null },
  { name: 'Chapter Director', role: 'Add name & photo', photo: null },
]

export const CHAPTERS = [
  {
    name: 'The Bronx High School of Science',
    short: 'Bronx Science',
    logo: '/img/bronx-science.jpeg',
    directors: [
      { name: 'Cooper Halpern', role: 'Chapter Director', photo: '/img/cooper.jpg' },
      { name: 'Joshua Isaacs', role: 'Chapter Director', photo: '/img/joshua.jpg' },
      { name: 'Rachel Tan', role: 'Chapter Director', photo: '/img/rachel.jpg' },
    ],
  },
  { name: 'Stuyvesant High School', short: 'Stuyvesant', logo: '/img/stuyvesant.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Brooklyn Technical High School', short: 'Brooklyn Tech', logo: '/img/brooklyn-tech.jpeg', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Townsend Harris High School', short: 'Townsend Harris', logo: '/img/townsend-harris.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Hunter College High School', short: 'Hunter College HS', logo: '/img/hunter.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Francis Lewis High School', short: 'Francis Lewis', logo: '/img/francis-lewis.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Fiorello H. LaGuardia High School of Music & Art', short: 'LaGuardia Arts', logo: '/img/laguardia.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'The Beacon School', short: 'Beacon', logo: '/img/beacon.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'High School for Math, Science & Engineering at CCNY', short: 'HSMSE at CCNY', logo: '/img/hsmse.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Bard High School Early College Manhattan', short: 'Bard Manhattan', logo: '/img/bard-manhattan.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Bard High School Early College Queens', short: 'Bard Queens', logo: '/img/bard-queens.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Avenues: The World School', short: 'Avenues', logo: '/img/avenues.png', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Benjamin N. Cardozo High School', short: 'Cardozo', logo: null, monogram: 'CZ', directors: PLACEHOLDER_DIRECTORS },
  { name: 'Queens High School for the Sciences at York College', short: 'Queens HS for the Sciences', logo: null, monogram: 'QS', directors: PLACEHOLDER_DIRECTORS },
  { name: 'NEST+m (New Explorations into Science, Technology & Math)', short: 'NEST+m', logo: null, monogram: 'NE', directors: PLACEHOLDER_DIRECTORS },
]
