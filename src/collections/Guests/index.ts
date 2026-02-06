import type { CollectionConfig } from 'payload'

export const Guests: CollectionConfig = {
  slug: 'guests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'qrInvitation',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/collections/Guests/fields/QrInvitation/index.tsx#QrInvitation',
        },
      },
    },
  ],
}
