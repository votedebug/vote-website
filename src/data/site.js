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

// Home hero carousel. PLACEHOLDERS — these reuse existing drive photography.
// Swap `src` and `caption` for the real rotating shots when you have them.
export const HERO_SLIDES = [
  { src: '/img/drive-2.jpg', caption: 'Registering voters at Bronx Science', alt: 'Vote of Teens students running a voter registration drive' },
  { src: '/img/drive-1.jpg', caption: 'A drive table between class periods', alt: 'Students at a Vote of Teens registration table' },
  { src: '/img/drive-3.jpg', caption: 'Student organizers on the ground', alt: 'A Vote of Teens organizer talking with a student' },
  { src: '/img/drive-4.jpg', caption: 'Chapter directors after a drive', alt: 'Vote of Teens chapter directors together after a drive' },
]

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
      { label: 'Founders', to: '/team#founders' },
    ],
  },
  { label: 'Our Chapters', to: '/chapters' },
  { label: 'Articles', to: '/articles' },
  { label: 'Legislation', to: '/legislation' },
]
