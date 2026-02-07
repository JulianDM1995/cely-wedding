import type { Payload } from 'payload'

export const seed = async (payload: Payload, options?: { reset?: boolean }): Promise<void> => {
  payload.logger.info('Seeding database...')

  if (options?.reset) {
    payload.logger.info('Resetting data...')
    await payload.delete({
      collection: 'guests',
      where: {},
    })
    await payload.delete({
      collection: 'media',
      where: {},
    })
  }

  const guests = await payload.find({
    collection: 'guests',
    limit: 1,
  })

  if (guests.totalDocs > 0 && !options?.reset) {
    payload.logger.info('Guests already exist, skipping seed.')
    return
  }

  try {
    payload.logger.info('🔄 Fetching random users from API...')
    const response = await fetch('https://randomuser.me/api/?results=10&nat=es')
    const { results } = await response.json()
    payload.logger.info('✅ Users fetched successfully')

    for (const [index, user] of results.entries()) {
      const imageUrl = user.picture.large
      payload.logger.info(`🖼️  [${index + 1}/10] Processing image for ${user.name.first} ${user.name.last}...`)
      
      const imageResponse = await fetch(imageUrl)
      const arrayBuffer = await imageResponse.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `${user.name.first} ${user.name.last}`,
        },
        file: {
          data: buffer,
          name: `${user.login.uuid}.jpg`,
          mimetype: 'image/jpeg',
          size: buffer.length,
        },
      })
      payload.logger.info(`✨ Media created: ${media.filename}`)

      const guest = await payload.create({
        collection: 'guests',
        data: {
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          profilePicture: media.id,
          status: 'not_sent',
        },
      })
      payload.logger.info(`👤 Guest created: ${guest.name}`)
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error)
  }

  payload.logger.info(`🎉 Seeded 10 guests with avatars.`)
}
