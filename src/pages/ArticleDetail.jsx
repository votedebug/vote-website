import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { Container } from '@/components/Container'
import { LinkButton } from '@/components/Bits'
import { useSanityQuery } from '@/lib/useSanity'
import { articleBySlugQuery, articlesListQuery } from '@/lib/queries'
import NotFound from '@/pages/NotFound'

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

// Thin red bar pinned right under the sticky nav, filling left-to-right as
// you scroll through the article — a quick visual sense of how much is left.
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="sticky top-[84px] z-40 h-1 w-full bg-navy/10" aria-hidden>
      <div className="h-full bg-flag-red transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

// Sanity's default block schema includes a "link" annotation out of the box,
// but @portabletext/react doesn't render annotations unless told how —
// without this, links typed in the Studio silently rendered as plain text.
const portableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
          className="text-royal underline-offset-2 hover:underline"
        >
          {children}
        </a>
      )
    },
  },
}

export default function ArticleDetail() {
  const { slug } = useParams()
  const { data: article, loading } = useSanityQuery(articleBySlugQuery, { slug }, [slug])
  const { data: allArticles } = useSanityQuery(articlesListQuery)

  if (loading || !allArticles) return null
  if (!article) return <NotFound />

  const more = allArticles.filter((a) => a.slug !== slug).slice(0, 3)

  return (
    <article className="pb-24">
      <ReadingProgress />

      {/* Header */}
      <Container className="pt-12">
        <Link to="/articles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline">
          <ArrowLeft className="h-4 w-4" /> All Stories
        </Link>
      </Container>

      <Container className="max-w-3xl pt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
          <span className="rounded-full bg-flag-red px-2.5 py-1 text-white">{article.category}</span>
        </div>
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-navy text-balance sm:text-5xl">
          {article.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed text-ink/70 text-pretty">{article.dek}</p>
        <p className="mt-6 text-sm font-medium text-ink/55">
          By {article.author}{article.role ? `, ${article.role}` : ''} · {fmtDate(article.date)} · {article.readTime}
        </p>
      </Container>

      {/* Hero image */}
      <Container className="max-w-4xl pt-10">
        <div className="overflow-hidden rounded-2xl">
          <img src={article.image} alt="" className="aspect-[16/9] w-full object-cover" />
        </div>
      </Container>

      {/* Body */}
      <Container className="max-w-2xl pt-12">
        <div className="space-y-6 font-serif text-lg leading-[1.75] text-ink/85 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-6xl [&>p:first-child]:first-letter:font-semibold [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-flag-red">
          <PortableText value={article.body} components={portableTextComponents} />
        </div>

        {article.bibliography?.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="eyebrow text-flag-red">Bibliography</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink/70 marker:text-ink/40">
              {article.bibliography.map((b, i) => (
                <li key={i}>
                  {b.url ? (
                    <a href={b.url} target="_blank" rel="noreferrer" className="text-royal underline-offset-2 hover:underline">
                      {b.text}
                    </a>
                  ) : (
                    b.text
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8">
          <LinkButton to="/get-involved" className="bg-flag-red text-white hover:bg-flag-red-dark">
            Get Involved <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton to="/articles" variant="outline" className="border-navy/20 text-navy hover:bg-navy hover:text-white">
            Back to all articles
          </LinkButton>
        </div>
      </Container>

      {/* More */}
      <Container className="pt-20">
        <h2 className="font-serif text-2xl font-semibold text-navy">Keep reading</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {more.map((a) => (
            <Link key={a.slug} to={`/articles/${a.slug}`} className="group block">
              <div className="overflow-hidden rounded-xl">
                <img src={a.image} alt="" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <span className="eyebrow mt-3 block text-royal">{a.category}</span>
              <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-royal">
                {a.title}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </article>
  )
}
