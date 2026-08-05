// One-off: sets the `order` field on already-migrated chapter documents to
// match the original src/data/chapters.js array order.
import {getCliClient} from 'sanity/cli'
import {CHAPTERS} from '../../src/data/chapters.js'

const client = getCliClient({apiVersion: '2024-01-01'})

async function main() {
  const docs = await client.fetch(`*[_type == "chapter"]{_id, name}`)
  const byName = new Map(docs.map((d) => [d.name, d._id]))

  const tx = client.transaction()
  CHAPTERS.forEach((c, i) => {
    const id = byName.get(c.name)
    if (!id) {
      console.warn(`  ! no doc found for ${c.name}`)
      return
    }
    tx.patch(id, (p) => p.set({order: i}))
  })
  await tx.commit()
  console.log(`Set order on ${CHAPTERS.length} chapters.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
