import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { WeddingDashboardClient } from './WeddingDashboardClient'

export const WeddingDashboard = async () => {
  const payload = await getPayload({ config: configPromise })
  
  // Fetch real data from Payload
  const guests = await payload.find({
    collection: 'guests',
    limit: 1000, // Fetch all guests for the dashboard metrics
    depth: 0,
  })

  return <WeddingDashboardClient guests={guests.docs} />
}
