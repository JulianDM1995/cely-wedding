import type { Access, CollectionConfig } from 'payload'

const authenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const GuestMessages: CollectionConfig = {
  slug: 'guest-messages',
  labels: {
    singular: {
      es: 'Mensaje de Invitado',
      en: 'Guest Message',
    },
    plural: {
      es: 'Mensajes de Invitados',
      en: 'Guest Messages',
    },
  },
  admin: {
    group: 'Admin',
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'guests',
      label: {
        es: 'Invitado',
        en: 'Guest',
      },
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: {
        es: 'Mensaje',
        en: 'Message',
      },
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: {
        es: 'Multimedia',
        en: 'Media',
      },
      required: false,
    },
    {
      name: 'style',
      type: 'json',
      label: {
        es: 'Estilo',
        en: 'Style',
      },
      required: false,
    },
    {
      name: 'status',
      type: 'select',
      label: {
        es: 'Estado',
        en: 'Status',
      },
      defaultValue: 'draft',
      options: [
        { label: { es: 'Borrador', en: 'Draft' }, value: 'draft' },
        { label: { es: 'Publicado', en: 'Published' }, value: 'published' },
        { label: { es: 'Archivado', en: 'Archived' }, value: 'archived' },
      ],
    },
  ],
}
