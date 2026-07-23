import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'
import { StarRow, LinkButton } from '@/components/Bits'

export default function NotFound() {
  return (
    <section className="py-28">
      <Container className="flex flex-col items-center text-center">
        <StarRow />
        <p className="mt-6 font-serif text-7xl font-semibold text-navy">404</p>
        <h1 className="mt-3 font-serif text-2xl font-semibold text-navy">This page didn’t make the ballot.</h1>
        <p className="mt-3 max-w-md text-ink/65">
          The page you’re looking for isn’t here. Let’s get you back to something that counts.
        </p>
        <div className="mt-8 flex gap-3">
          <LinkButton to="/" className="bg-flag-red text-white hover:bg-flag-red-dark">Back home</LinkButton>
          <LinkButton to="/legislation" variant="outline" className="border-navy/20 text-navy hover:bg-navy hover:text-white">
            Explore the map
          </LinkButton>
        </div>
      </Container>
    </section>
  )
}
