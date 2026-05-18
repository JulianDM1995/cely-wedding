import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const clear = async () => {
  const payload = await getPayload({ config: configPromise })
  
  payload.logger.info('🧹 Limpiando base de datos...')

  // Limpiar todas las colecciones
  const collections: string[] = [
    'users', 
    'guests', 
    'guest-messages',
    'media'
  ]

  for (const slug of collections) {
    try {
      if (payload.db.collections[slug]) {
        await payload.db.collections[slug].deleteMany({})
      } else {
        await payload.delete({
          collection: slug as any,
          where: { id: { exists: true } }
        })
      }
      payload.logger.info(`✅ Limpiada colección: ${slug}`)
    } catch (error) {
      payload.logger.error({ error }, `❌ Error limpiando la colección ${slug}`)
    }
  }

  payload.logger.info('✨ Proceso de limpieza completado.')
  process.exit(0)
}

clear()
