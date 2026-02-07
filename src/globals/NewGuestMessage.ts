import type { GlobalConfig } from 'payload'

export const NewGuestMessage: GlobalConfig = {
  slug: 'new-guest-message',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'lastTimeRead',
      type: 'date',
      label: 'Last Time Read',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'guests',
      label: 'Owner',
    },
    {
      name: 'lastMessage',
      type: 'relationship',
      relationTo: 'guest-messages',
      label: 'Last Message',
    },
  ],
}
