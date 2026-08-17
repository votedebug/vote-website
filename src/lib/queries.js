// GROQ queries + projections. Images are projected straight to their asset
// URL so components can keep using them as plain `src` strings — the same
// shape the old src/data/*.js files provided.

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  name, short, tagline, email, address, instagram, linkedin, founded,
  "featuredArticleSlug": featuredArticle->slug.current,
  stats[]{ value, label },
  heroSlides[]{ _key, "src": image.asset->url, caption, alt }
}`

export const teamQuery = `*[_type == "teamMember"] | order(order asc) {
  _id, name, role, chapter, bio, category, photo
}`

// Build-time only: same people, but with the photo projected to a plain URL so
// scripts/prerender.mjs can emit Person JSON-LD without the image builder.
export const teamSchemaQuery = `*[_type == "teamMember"] | order(order asc) {
  name, role, chapter, bio, "image": photo.asset->url
}`

export const chaptersQuery = `*[_type == "chapter"] | order(order asc, name asc) {
  _id, name, short, "logo": logo.asset->url, monogram, borough, address,
  "coords": [coords.lng, coords.lat],
  directors[]{ name, role, photo }
}`

export const statesQuery = `*[_type == "state"] | order(order asc, name asc) {
  _id, name, chapters,
  directors[]{ name, role, photo }
}`

export const articlesListQuery = `*[_type == "article"] | order(date desc) {
  _id, title, "slug": slug.current, dek, author, role, date, category,
  readTime, "image": image.asset->url
}`

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, dek, author, role, date, category,
  readTime, "image": image.asset->url, body,
  bibliography[]{ text, url }
}`
