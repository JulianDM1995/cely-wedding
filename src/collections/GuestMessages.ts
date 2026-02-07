import type { Access, CollectionConfig } from 'payload'

const authenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const GuestMessages: CollectionConfig = {
  slug: 'guest-messages',
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
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'style',
      type: 'json',
      required: false,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
