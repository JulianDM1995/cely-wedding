import type { CollectionConfig } from 'payload'

export const Guests: CollectionConfig = {
  slug: 'guests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'updatedAt'],
    components: {
      beforeList: [
        '/collections/Guests/components/DownloadInvitationsButton/index.tsx#DownloadInvitationsButton',
      ],
    },
    preview: (doc) => {
      // Preview will likely fail or need to be updated to use a token if we want "Live Preview" to work for admin.
      // Since tokens are dynamic, maybe we can't easily preview without a persistent token field.
      // But for now, let's just use the ID and let the frontend handle it or disable preview if no token.
      // Actually, we can generate a temporary token for preview if we import the utility, 
      // but imports in config might be tricky if not careful with server/client boundaries.
      // For now, let's allow preview via ID and maybe the frontend can accept ID in dev mode or we update this later.
      // Wait, user asked to use hash.
      return null // Disable preview for now as it requires token generation which is better done in fields or endpoints.
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
        hidden: true,
        position: 'sidebar',
        components: {
          Cell: '/collections/Guests/cells/InvitationStatus/index.tsx#SendInvitationCell',
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
