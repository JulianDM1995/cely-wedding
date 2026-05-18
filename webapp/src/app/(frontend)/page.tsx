import ParallaxPhoto from "@/components/ParallaxPhoto"
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const personalization = await payload.findGlobal({
    slug: 'personalization',
  })

  const couple = {
    groom: personalization.couple?.groom || 'Juan',
    bride: personalization.couple?.bride || 'Tatiana'
  }

  return (
    <div style={{ height: '100dvh', width: '100dvw', overflow: 'hidden' }}>
      <ParallaxPhoto weddingDate={personalization.weddingDate} couple={couple} personalization={personalization} />
    </div>
  )
}
