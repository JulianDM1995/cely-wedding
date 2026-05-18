import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
        es: 'Usuario',
        en: 'User',
    },
    plural: {
        es: 'Usuarios',
        en: 'Users',
    },
  },
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
    hidden: true,
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
