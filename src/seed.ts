import type { Payload } from 'payload'

export const seed = async (payload: Payload, options?: { reset?: boolean }): Promise<void> => {
  payload.logger.info('Seeding database...')

  if (options?.reset) {
    payload.logger.info('Resetting data...')
    await payload.delete({
      collection: 'guests',
      where: {},
    })
  }

  const guests = await payload.find({
    collection: 'guests',
    limit: 1,
  })

  if (guests.totalDocs > 0) {
    payload.logger.info('Guests already exist, skipping seed.')
    return
  }

  const guestsToCreate = [
    {
      name: 'Juan Pérez',
      email: 'juan@ejemplo.com',
    },
    {
      name: 'María García',
      email: 'maria@ejemplo.com',
    },
    {
      name: 'Carlos López',
      email: 'carlos@ejemplo.com',
    },
  ]

  for (const guest of guestsToCreate) {
    await payload.create({
      collection: 'guests',
      data: guest,
    })
  }

  payload.logger.info(`Seeded ${guestsToCreate.length} guests.`)
}
