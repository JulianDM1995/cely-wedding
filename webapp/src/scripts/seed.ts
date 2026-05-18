import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const seed = async () => {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('🧹 Limpiando base de datos...')
  const collections: string[] = ['users', 'guests', 'guest-messages', 'media']
  for (const slug of collections) {
    try {
      if (payload.db.collections[slug]) {
        await payload.db.collections[slug].deleteMany({})
      } else {
        await payload.delete({
          collection: slug as any,
          where: { id: { exists: true } },
        })
      }
    } catch (e) {
      payload.logger.error({ e }, `❌ Error limpiando la colección ${slug}`)
    }
  }

  payload.logger.info('👑 Creando usuario administrador...')
  const email = 'juliandm1995@gmail.com'
  const password = 'password'
  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
    },
  })

  payload.logger.info('🔄 Obteniendo usuarios aleatorios de la API...')
  try {
    const response = await fetch('https://randomuser.me/api/?results=10&nat=es')
    const { results } = await response.json()
    payload.logger.info('✅ Usuarios obtenidos exitosamente')

    for (const [index, user] of results.entries()) {
      try {
        const imageUrl = user.picture.large
        payload.logger.info(`🖼️  [${index + 1}/10] Procesando imagen para ${user.name.first} ${user.name.last}...`)
  
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
  
        const guestNamesCount = Math.floor(Math.random() * 3) + 1;
        const statuses = ['not_sent', 'sent', 'confirmed', 'declined'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as 'not_sent' | 'sent' | 'confirmed' | 'declined';

        const guestNames = [{ fullName: `${user.name.first} ${user.name.last}` }];
        
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
            message: 'Esperamos contar con tu presencia en este momento tan especial.',
          },
        })
        payload.logger.info(`👤 Invitado creado: ${guest.name} con ${guestNamesCount} acompañantes`)
      } catch (err) {
        payload.logger.error(`❌ Error creando usuario ${user.name.first}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  }

  payload.logger.info('📝 Configurando Personalización global...')
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
        color: '#000000',
        cornersSquareType: 'square',
        cornersSquareColor: '#000000',
        cornersDotType: 'square',
        cornersDotColor: '#000000',
        show: true,
        size: 20,
        qrSize: 300,
        qrX: 0,
        qrY: 0,
      }
    },
  })
  payload.logger.info('✅ Personalización global configurada.')

  payload.logger.info('🎉 Seed script finalizado exitosamente.')
  process.exit(0)
}

seed()
