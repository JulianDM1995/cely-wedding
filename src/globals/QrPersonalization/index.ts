import type { GlobalConfig } from 'payload'

export const QrPersonalization: GlobalConfig = {
  slug: 'qr-personalization',
  fields: [
    {
      name: 'preview',
      type: 'ui',
      admin: {
        components: {
          Field: '/globals/QrPersonalization/fields/QrPersonalizationField/index.tsx#QrPersonalizationField',
        },
      },
    },
  ],
}
