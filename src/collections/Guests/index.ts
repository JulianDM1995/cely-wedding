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
    components: {
      beforeList: [
        '/collections/Guests/components/DownloadInvitationsButton/index.tsx#DownloadInvitationsButton',
      ],
    },
    preview: (doc) => {
      if (doc?.token && typeof doc.token === 'string') {
        return `/invitation?token=${encodeURIComponent(doc.token)}`
      }
      return null
    },
    hideAPIURL: true,
  },
// Endpoints removed as we moved to Server Actions called from UI components directly.
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        es: 'Nombre',
        en: 'Name',
      },
      required: true,
      admin: {
        components: {
          Cell: '/collections/Guests/cells/GuestProfile/index.tsx#GuestProfileCell',
        },
      },
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
        components: {
          Cell: '/collections/Guests/cells/StatusCell/index.tsx#StatusCell',
        },
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
          async ({ value, req }) => {
            if (value) return value
            const { generateGuestCode } = await import('../../utilities/guestToken')
            return generateGuestCode()
          },
        ],
      },
    },
    {
      name: 'viewInvitation',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/collections/Guests/components/ViewInvitationButton.tsx#ViewInvitationButton',
        },
      },
    },
    {
       name: 'statusField',
       type: 'ui',
       label: {
            es: 'Panel de Estado',
            en: 'Status Panel',
       },
       admin: {
         position: 'sidebar',
         components: {
            Field: '/collections/Guests/fields/InvitationStatus/index.tsx#InvitationStatusField'
         }
       }
    },
    {
      name: 'qrInvitation',
      type: 'ui',
      label: {
        es: 'Invitación QR',
        en: 'QR Invitation',
      },
      admin: {
        position: 'sidebar',
        components: {
          Field: '/collections/Guests/fields/Invitation/index.tsx#QRCode',
        },
      },
    },
  ],
}
