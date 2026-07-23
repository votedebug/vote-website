# Vote of Teens — Website

A redesigned site for **Vote of Teens (VOTE)**, a student-led, non-partisan movement
registering the next generation of voters. Built with **React + Vite + Tailwind CSS v4** and
**shadcn/ui**, with an interactive state-by-state legislation map.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploy (free, static)

The build output in `dist/` is fully static. Easiest options:

- **Netlify** — drag `dist/` into the dashboard, or connect the repo (build: `npm run build`,
  publish: `dist`). SPA routing handled by `public/_redirects`.
- **Vercel** — import the repo; framework auto-detected. SPA routing handled by `vercel.json`.
- **GitHub Pages** — works, but needs a hash-router or 404 fallback for deep links; ask if you
  want this set up.

## Project structure

```
src/
├─ pages/           Home, About, Team, Chapters, Articles, ArticleDetail, Legislation, GetInvolved
├─ components/      Navbar, Footer, LegislationMap, Bits (headings/buttons), Container, ui/ (shadcn)
├─ data/            site.js, team.js, chapters.js, articles.js, states.js (+ states-10m.json)
└─ index.css        Design tokens (red/white/blue theme, fonts)
public/img/         Logo, headshots, chapter logos, drive photos
```

## Editing content

Almost everything is data-driven — edit these files, no component changes needed:

- **Team** — `src/data/team.js` (Board bios are the site's original text, verbatim; Editorial &
  Media are **placeholders** — swap in real names/photos).
- **Chapters** — `src/data/chapters.js`.
- **Articles** — `src/data/articles.js` (currently **placeholder** posts; replace titles, bodies,
  authors, images).
- **Legislation map** — `src/data/states.js`. Pre-registration rules sourced from
  [The Civics Center](https://www.thecivicscenter.org/prereg) for the 2026 cycle.
  **Verify against official state sources before relying on it.**
- **Site info / nav / stats** — `src/data/site.js`.

## Notes / to-dos

- Article content and the Editorial & Media team roster are placeholders.
- The Get Involved contact form opens the visitor's email app (mailto). To capture submissions
  without email, wire it to Formspree or a small backend.
- Design system reference lives in `design-system/vote-of-teens/MASTER.md`.

## Credits

Logo, team headshots, chapter logos, and drive photos pulled from the existing voteofteens.org.
Typography: Newsreader (serif) + Public Sans. Map: d3-geo + us-atlas.
