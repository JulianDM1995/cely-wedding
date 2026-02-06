import type { GlobalConfig } from 'payload'

export const Personalization: GlobalConfig = {
  slug: 'personalization',
  fields: [
    {
      name: 'preview',
      type: 'ui',
      admin: {
        components: {
          Field: '/globals/Personalization/fields/PersonalizationField/index.tsx#PersonalizationField',
        },
      },
    },
  ],
}
