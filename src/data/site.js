export const SITE = {
  name: 'Vote of Teens',
  short: 'VOTE',
  tagline: 'For Teens, By Teens',
  email: 'voteofteens@gmail.com',
  address: '75 W 205th St, Bronx, New York 10468',
  instagram: 'https://www.instagram.com/voteofteens/',
  linkedin: 'https://www.linkedin.com/company/voteofteens/',
  founded: 2024,
}

export const STATS = [
  { value: '2,000+', label: 'Voters registered' },
  { value: '30+', label: 'Student leaders' },
  { value: '15', label: 'School chapters' },
  { value: '15+', label: 'Registration drives' },
]

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Our Team',
    to: '/team',
    children: [
      { label: 'Directors', to: '/team#directors' },
      { label: 'Editorial Team', to: '/team#editorial' },
      { label: 'Media Team', to: '/team#media' },
    ],
  },
  { label: 'Our Chapters', to: '/chapters' },
  { label: 'Articles', to: '/articles' },
  { label: 'Legislation', to: '/legislation' },
]
