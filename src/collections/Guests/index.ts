import type { CollectionConfig } from 'payload'

export const Guests: CollectionConfig = {
  slug: 'guests',
  admin: {
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
      required: true,
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Not Sent', value: 'not_sent' },
        { label: 'Sent', value: 'sent' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Declined', value: 'declined' },
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
          async ({ data, req }) => {
            if (!data?.id) return null
            // We need to dynamically import or use a utility that uses the payload secret.
            // Since this config is shared, we should import the utility.
            // However, ensuring checking server-only code.
            const { encryptGuestId } = await import('../../utilities/guestToken')
            return encryptGuestId(data.id)
          },
        ],
      },
    },
    {
       name: 'statusField',
       type: 'ui',
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
      admin: {
        position: 'sidebar',
        components: {
          Field: '/collections/Guests/fields/Invitation/index.tsx#QRCode',
        },
      },
    },
  ],
}
