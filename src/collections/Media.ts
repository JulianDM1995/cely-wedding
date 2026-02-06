import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    hidden: true,
  },
  access: {
    read: () => true,
  },
  fields: [],
  upload: true,
}
