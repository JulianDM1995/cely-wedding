import type { Payload } from 'payload'

export const seed = async (payload: Payload, options?: { reset?: boolean }): Promise<void> => {
  payload.logger.info('Seeding database...')


  try {
    payload.logger.info('🗑️ Deleting existing guests...')
    await payload.delete({
      collection: 'guests',
      where: {},
    })
    payload.logger.info('✅ Existing guests deleted.')
    
    payload.logger.info('🔄 Fetching random users from API...')
    const response = await fetch('https://randomuser.me/api/?results=10&nat=es')
    const { results } = await response.json()
    payload.logger.info('✅ Users fetched successfully')

    for (const [index, user] of results.entries()) {
      try {
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
  
        const guestNamesCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 guests
        const statuses = ['not_sent', 'sent', 'confirmed', 'declined'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as 'not_sent' | 'sent' | 'confirmed' | 'declined';

        const guestNames = [{ fullName: `${user.name.first} ${user.name.last}` }];
        
        // Add companions
        for (let i = 1; i < guestNamesCount; i++) {
          guestNames.push({ fullName: `Acompañante ${i} de ${user.name.first}` });
        }

        const guest = await payload.create({
          collection: 'guests',
          data: {
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            profilePicture: media.id,
            status: randomStatus,
            guestsCount: guestNamesCount,
            guestNames,
            phoneNumber: '+573000000000',
            message: 'Esperamos contar con tu presencia en este momento tan especial.'
          },
        })
        payload.logger.info(`👤 Guest created: ${guest.name} with ${guestNamesCount} guests`)
      } catch (err) {
        payload.logger.error(`❌ Error seeding user ${user.name.first}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  }

  payload.logger.info('📝 Seeding Personalization global...')
  const createPlaceholderMedia = async (name: string) => {
    try {
      const response = await fetch('https://placehold.co/800x600/png')
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const media = await payload.create({
        collection: 'media',
        data: { alt: `Placeholder ${name}` },
        file: {
          data: buffer,
          name: `${name.replace(/\s+/g, '-').toLowerCase()}.png`,
          mimetype: 'image/png',
          size: buffer.length,
        },
      })
      return media.id as string
    } catch (e) {
      payload.logger.error(`Failed to create media ${name}: ${e instanceof Error ? e.message : String(e)}`)
      return null
    }
  }

  const femaleImage = await createPlaceholderMedia('dress-female')
  const maleImage = await createPlaceholderMedia('dress-male')
  const ceremonyPlacePhoto = await createPlaceholderMedia('ceremony-place')
  const ceremonyMapPhoto = await createPlaceholderMedia('ceremony-map')
  const receptionPlacePhoto = await createPlaceholderMedia('reception-place')
  const receptionMapPhoto = await createPlaceholderMedia('reception-map')
  const carouselImage1 = await createPlaceholderMedia('carousel-1')
  const carouselImage2 = await createPlaceholderMedia('carousel-2')
  const qrBgImage = await createPlaceholderMedia('qr-bg')

  await payload.updateGlobal({
    slug: 'personalization',
    data: {
      weddingDate: '2026-12-12T15:00:00.000Z',
      couple: {
        groom: 'Juan',
        bride: 'Tatiana',
      },
      headerCopy: '¡Nos Casamos!',
      greetings: 'Tenemos el gusto de invitarte a celebrar con nosotros este día tan especial.',
      giftType: 'Lluvia de Sobres',
      dressCode: {
        text: 'Traje Formal. Se reserva el uso exclusivo del color blanco para la novia.',
        femaleImage: femaleImage || undefined,
        maleImage: maleImage || undefined,
      },
      ceremony: {
        time: '3:00 PM',
        placeName: 'Parroquia Central',
        gpsCoordinates: {
          latitude: 4.60971,
          longitude: -74.08175,
        },
        placePhoto: ceremonyPlacePhoto || undefined,
        mapPhoto: ceremonyMapPhoto || undefined,
      },
      reception: {
        time: '5:00 PM',
        placeName: 'Hacienda Eventos',
        gpsCoordinates: {
          latitude: 4.60971,
          longitude: -74.08175,
        },
        placePhoto: receptionPlacePhoto || undefined,
        mapPhoto: receptionMapPhoto || undefined,
      },
      carousel: [
        { image: carouselImage1 || undefined },
        { image: carouselImage2 || undefined },
      ].filter(c => c.image !== undefined),
      qrLayout: {
        backgroundImage: qrBgImage || undefined,
        dotsType: 'square',
        cornersSquareType: 'square',
        cornersDotType: 'square',
        show: true,
        size: 20,
        qrSize: 300,
        qrX: 0,
        qrY: 0,
      }
    },
  })
  payload.logger.info('✅ Personalization global seeded successfully.')

  payload.logger.info(`🎉 Seed script finished.`)
}
