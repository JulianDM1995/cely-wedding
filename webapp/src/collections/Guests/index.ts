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
      edit: {
        beforeDocumentControls: [
          '@/collections/Guests/ui/ViewGuestPageButton#default',
        ],
      },
    },
    hideAPIURL: true,
  },
  endpoints: [
    {
      path: '/:id/send-email',
      method: 'post',
      handler: async (req) => {
        const { id } = req.routeParams as { id: string }
        const { payload } = req

        try {
          const guest = await payload.findByID({
            collection: 'guests',
            id,
          })
          
          if (!guest || !guest.email) {
            return Response.json({ error: 'Guest not found or no email provided' }, { status: 400 })
          }

          const personalization = await payload.findGlobal({
            slug: 'personalization',
          })

          const subjectTemplate = (personalization as any).emailSubject || '¡Estás invitado!'
          const messageTemplate = (personalization as any).emailMessage || 'Hola {{name}}'

          const subject = subjectTemplate
            .replace(/{{name}}/g, guest.name)
            .replace(/{{slug}}/g, guest.slug)

          const html = messageTemplate
            .replace(/{{name}}/g, guest.name)
            .replace(/{{slug}}/g, guest.slug)

          const { emailService } = await import('@/email/EmailService')

          await emailService.send({
            to: guest.email,
            subject,
            html,
          })

          return Response.json({ success: true })
        } catch (error: any) {
          console.error('Error sending email:', error)
          return Response.json({ error: error.message }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            es: 'Información Personal',
            en: 'Personal Info',
          },
          fields: [
            {
              name: 'profilePicture',
              type: 'upload',
              relationTo: 'media',
              label: {
                es: 'Foto de Perfil',
                en: 'Profile Picture',
              },
              required: false,
              admin: {
                components: {
                  Field: '@/components/fields/ProfilePhotoField#default',
                },
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: {
                    es: 'Nombre',
                    en: 'Name',
                  },
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'email',
                  type: 'email',
                  label: {
                    es: 'Correo Electrónico',
                    en: 'Email',
                  },
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'phoneNumber',
              type: 'text',
              label: {
                es: 'Teléfono',
                en: 'Phone Number',
              },
              admin: {
                components: {
                  Field: '@/components/fields/PhoneField#PhoneField',
                },
              },
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
          ]
        },
        {
          label: {
            es: 'Acompañantes',
            en: 'Companions',
          },
          fields: [
            {
              name: 'guestNames',
              type: 'array',
              label: {
                es: 'Lista de Nombres',
                en: 'Names List',
              },
              labels: {
                singular: {
                  es: 'Acompañante',
                  en: 'Companion',
                },
                plural: {
                  es: 'Acompañantes',
                  en: 'Companions',
                },
              },
              admin: {
                description: {
                  es: 'Agrega los nombres de las personas asociadas a esta invitación.',
                  en: 'Add the names of the people associated with this invitation.',
                },
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
            },
          ]
        },
        {
          label: {
            es: 'Invitación & QR',
            en: 'Invitation & QR',
          },
          fields: [
            {
              name: 'qrCode',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/collections/Guests/ui/QRCode#default'
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.name) {
              return (data.name as string)
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'communicationActions',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/collections/Guests/ui/CommunicationActions#default'
        }
      }
    },
    {
      name: 'status',
      type: 'select',
      label: {
        es: 'Estado de la Invitación',
        en: 'Invitation Status',
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
          Field: '@/components/fields/StatusPillField#default',
        },
      },
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
        readOnly: true,
        position: 'sidebar',
        description: {
          es: 'Calculado automáticamente basado en la lista de acompañantes.',
          en: 'Calculated automatically based on the companions list.',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return siblingData?.guestNames?.length || 1
          },
        ],
      },
    },
  ],
}
