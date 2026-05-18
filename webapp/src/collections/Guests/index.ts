import type { CollectionConfig } from 'payload'

export const Guests: CollectionConfig = {
  slug: 'guests',
  labels: {
    singular: {
      es: 'Invitado',
      en: 'Guest',
    },
    plural: {
      es: 'Invitados',
      en: 'Guests',
    },
  },
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'email', 'updatedAt'],
    // Components removed to avoid errors until we migrate them
    hideAPIURL: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        es: 'Nombre',
        en: 'Name',
      },
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: {
        es: 'Correo Electrónico',
        en: 'Email',
      },
      required: true,
    },
    {
      name: 'guestsCount',
      type: 'number',
      label: {
        es: 'Número de Invitados',
        en: 'Number of Guests',
      },
      defaultValue: 1,
      admin: {
        hidden: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return siblingData?.guestNames?.length || 1
          },
        ],
      },
    },
    {
      type: 'collapsible',
      label: {
        es: 'Nombres de los Invitados',
        en: 'Guest Names',
      },
      fields: [
        {
          name: 'guestNames',
          type: 'array',
          label: {
            es: 'Lista de Nombres',
            en: 'Names List',
          },
          fields: [
            {
              name: 'fullName',
              type: 'text',
              label: {
                es: 'Nombre Completo',
                en: 'Full Name',
              },
            },
          ],
          admin: {
            initCollapsed: false,
          },
        },
      ],
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      label: {
        es: 'Foto de Perfil',
        en: 'Profile Picture',
      },
      required: false,
    },
    {
      name: 'message',
      type: 'textarea',
      label: {
        es: 'Mensaje Personalizado',
        en: 'Custom Message',
      },
      admin: {
        hidden: true,
        description: {
          es: 'Mensaje personalizado para la invitación. Si se deja vacío, se usará el mensaje por defecto.',
          en: 'Custom message for the invitation. If empty, uses the default message.',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      label: {
        es: 'Estado',
        en: 'Status',
      },
      options: [
        { label: { es: 'No Enviado', en: 'Not Sent' }, value: 'not_sent' },
        { label: { es: 'Enviado', en: 'Sent' }, value: 'sent' },
        { label: { es: 'Confirmado', en: 'Confirmed' }, value: 'confirmed' },
        { label: { es: 'Declinado', en: 'Declined' }, value: 'declined' },
      ],
      defaultValue: 'not_sent',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'token',
      type: 'text',
      virtual: true,
      admin: {
        hidden: true,
      },
      access: {
        read: () => true,
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            return data?.code || null
          },
        ],
      },
    },
    {
      name: 'code',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          async ({ value }) => {
            if (value) return value
            const { generateGuestCode } = await import('../../utilities/guestToken')
            return generateGuestCode()
          },
        ],
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: {
        es: 'Teléfono',
        en: 'Phone Number',
      },
    },
  ],
}
