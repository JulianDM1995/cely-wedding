import type { CollectionConfig } from 'payload'

export const Guests: CollectionConfig = {
  slug: 'guests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'updatedAt'],
    components: {
      beforeList: [
        '/collections/Guests/components/DownloadQRsButton/index.tsx#DownloadQRsButton',
      ],
    },
    preview: (doc) => {
      const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'
      const slug = doc?.slug || doc?.id
      if (slug) {
        return `${url}/${slug}`
      }
      return null
    },
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
                .normalize('NFD') // Split accents from letters
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/ñ/g, 'n') // Explicitly replace ñ if not handled by NFD (NFD splits ñ into n + ~, so regex removes ~)
                // Actually NFD splits ñ (u00f1) into n (u006e) + ◌̃ (u0303). The regex removes u0303.
                // However, let's be explicit for safety if string is already normalized or handled differently.
                // But normalize('NFD') followed by removing combining diacritics is the standard way.
                // Re-verification: 'ñ'.normalize('NFD') -> 'n\u0303'. Replace removes \u0303 -> 'n'. Correct.
                // 'ü'.normalize('NFD') -> 'u\u0308'. Replace removes \u0308 -> 'u'. Correct.
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
          Field: '/collections/Guests/fields/QRCode/index.tsx#QRCode',
        },
      },
    },
  ],
}
