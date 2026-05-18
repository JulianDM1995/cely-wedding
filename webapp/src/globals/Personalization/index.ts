import type { GlobalConfig } from 'payload'

export const Personalization: GlobalConfig = {
  slug: 'personalization',
  label: {
    es: 'Personalización',
    en: 'Personalization',
  },
  admin: {
    group: 'Admin',
    hideAPIURL: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            es: 'La Boda',
            en: 'The Wedding',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'weddingDate',
                  type: 'date',
                  label: {
                    es: 'Fecha de la Boda',
                    en: 'Wedding Date',
                  },
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'giftType',
                  type: 'text',
                  label: {
                    es: 'Tipo de Regalo',
                    en: 'Gift Type',
                  },
                  admin: {
                    width: '50%',
                    description: {
                      es: 'Ej: "Lluvia de Sobres", "Lista de Regalos", etc.',
                      en: 'E.g: "Monetary Gift", "Gift Registry", etc.',
                    },
                  },
                },
              ]
            },
            {
              name: 'couple',
              type: 'group',
              label: {
                es: 'Novios',
                en: 'Couple',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'groom',
                      type: 'text',
                      label: { es: 'Nombre del Novio', en: 'Groom Name' },
                      defaultValue: 'Juan',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'bride',
                      type: 'text',
                      label: { es: 'Nombre de la Novia', en: 'Bride Name' },
                      defaultValue: 'Tatiana',
                      admin: { width: '50%' },
                    },
                  ],
                }
              ],
            },
          ],
        },
        {
          label: {
            es: 'Textos & Detalles',
            en: 'Texts & Details',
          },
          fields: [
            {
              name: 'headerCopy',
              type: 'text',
              label: {
                es: 'Texto de Cabecera',
                en: 'Header Copy',
              },
              admin: {
                description: {
                  es: 'Texto que aparece en la parte superior de la invitación (ej. "Estás invitado")',
                  en: 'Text appearing at the top of the invitation (e.g. "You are invited")',
                },
              },
            },
            {
              name: 'greetings',
              type: 'textarea',
              label: {
                es: 'Saludo',
                en: 'Greetings',
              },
              admin: {
                description: {
                  es: 'Texto de bienvenida o saludo inicial.',
                  en: 'Welcome text or initial greetings.',
                },
              },
            },
          ]
        },
        {
          label: {
            es: 'Eventos',
            en: 'Events',
          },
          fields: [
            {
              name: 'ceremony',
              type: 'group',
              label: {
                es: 'Ceremonia',
                en: 'Ceremony',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'time',
                      type: 'text',
                      label: { es: 'Hora', en: 'Time' },
                      admin: { width: '100%' },
                    },
                  ],
                },
                {
                  name: 'placeName',
                  type: 'text',
                  label: { es: 'Nombre del Lugar', en: 'Place Name' },
                },
                {
                  name: 'gpsCoordinates',
                  type: 'group',
                  label: { es: 'Coordenadas GPS', en: 'GPS Coordinates' },
                  fields: [
                    {
                      name: 'map',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/fields/LocationMapField#LocationMapField',
                        },
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'latitude',
                          type: 'number',
                          label: { es: 'Latitud', en: 'Latitude' },
                          admin: { width: '50%' },
                        },
                        {
                          name: 'longitude',
                          type: 'number',
                          label: { es: 'Longitud', en: 'Longitude' },
                          admin: { width: '50%' },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'placePhoto',
                      type: 'upload',
                      relationTo: 'media',
                      label: { es: 'Foto del Lugar', en: 'Place Photo' },
                      admin: { width: '50%' },
                    },
                    {
                      name: 'mapPhoto',
                      type: 'upload',
                      relationTo: 'media',
                      label: { es: 'Foto del Mapa', en: 'Map Photo' },
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'reception',
              type: 'group',
              label: {
                es: 'Recepción',
                en: 'Reception',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'time',
                      type: 'text',
                      label: { es: 'Hora', en: 'Time' },
                      admin: { width: '100%' },
                    },
                  ],
                },
                {
                  name: 'placeName',
                  type: 'text',
                  label: { es: 'Nombre del Lugar', en: 'Place Name' },
                },
                {
                  name: 'gpsCoordinates',
                  type: 'group',
                  label: { es: 'Coordenadas GPS', en: 'GPS Coordinates' },
                  fields: [
                    {
                      name: 'map',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/fields/LocationMapField#LocationMapField',
                        },
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'latitude',
                          type: 'number',
                          label: { es: 'Latitud', en: 'Latitude' },
                          admin: { width: '50%' },
                        },
                        {
                          name: 'longitude',
                          type: 'number',
                          label: { es: 'Longitud', en: 'Longitude' },
                          admin: { width: '50%' },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'placePhoto',
                      type: 'upload',
                      relationTo: 'media',
                      label: { es: 'Foto del Lugar', en: 'Place Photo' },
                      admin: { width: '50%' },
                    },
                    {
                      name: 'mapPhoto',
                      type: 'upload',
                      relationTo: 'media',
                      label: { es: 'Foto del Mapa', en: 'Map Photo' },
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'dressCode',
              type: 'group',
              label: {
                es: 'Código de Vestimenta',
                en: 'Dress Code',
              },
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  label: { es: 'Descripción', en: 'Description' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'femaleImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: { es: 'Imagen Mujeres', en: 'Female Image' },
                      admin: { width: '50%' },
                    },
                    {
                      name: 'maleImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: { es: 'Imagen Hombres', en: 'Male Image' },
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: {
            es: 'Multimedia',
            en: 'Media',
          },
          fields: [
            {
              name: 'carousel',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: {
                es: 'Carrusel de Fotos',
                en: 'Photo Carousel',
              },
              admin: {
                custom: {
                  relationTo: 'media',
                },
                components: {
                  Field: '@/components/fields/PhotosArrayField#default',
                },
              },
            },
          ],
        },
        {
          label: {
            es: 'Comunicaciones',
            en: 'Communications',
          },
          fields: [
            {
              name: 'whatsappMessage',
              type: 'textarea',
              label: {
                es: 'Mensaje de WhatsApp',
                en: 'WhatsApp Message',
              },
              admin: {
                description: {
                  es: 'Puedes usar {{name}} para el nombre, {{slug}} para el identificador único.',
                  en: 'You can use {{name}} for the name, {{slug}} for the unique identifier.',
                },
              },
              defaultValue: '¡Hola {{name}}! Queremos invitarte a nuestra boda. Puedes ver tu invitación y confirmar tu asistencia aquí: https://boda.com/invitacion/{{slug}}',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'emailSubject',
                  type: 'text',
                  label: {
                    es: 'Asunto del Email',
                    en: 'Email Subject',
                  },
                  admin: { width: '100%' },
                  defaultValue: '¡Estás invitado a nuestra boda!',
                },
              ],
            },
            {
              name: 'emailMessage',
              type: 'textarea',
              label: {
                es: 'Mensaje del Email (Texto Enriquecido)',
                en: 'Email Message (Rich Text)',
              },
              admin: {
                components: {
                  Field: '@/components/fields/RichHTMLEditor#default',
                },
                description: {
                  es: 'Puedes usar {{name}} para el nombre y {{slug}} para el identificador único.',
                  en: 'You can use {{name}} for the name and {{slug}} for the unique identifier.',
                },
              },
              defaultValue: '<p>¡Hola <b>{{name}}</b>!</p><p>Queremos invitarte a nuestra boda.</p><p><a href="https://boda.com/invitacion/{{slug}}">Haz clic aquí para ver tu invitación</a></p>',
            },
          ],
        },
        {
          label: {
            es: 'Diseño QR',
            en: 'QR Design',
          },
          fields: [
            {
              name: 'qrDesigner',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/QRDesigner#default',
                },
              },
            },
            {
              name: 'qrLayout',
              type: 'group',
              label: false,
              admin: { hidden: true },
              fields: [
                { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
                { name: 'dotsType', type: 'text', defaultValue: 'square' },
                { name: 'color', type: 'text', defaultValue: '#000000' },
                { name: 'cornersSquareType', type: 'text', defaultValue: 'square' },
                { name: 'cornersDotType', type: 'text', defaultValue: 'square' },
                { name: 'errorCorrectionLevel', type: 'text', defaultValue: 'Q' },
                {
                  name: 'logo',
                  type: 'group',
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media' },
                    { name: 'size', type: 'number', defaultValue: 3 },
                    { name: 'strokeWidth', type: 'number', defaultValue: 3 },
                  ],
                },
                { name: 'qrSize', type: 'number', defaultValue: 300 },
                { name: 'qrX', type: 'number', defaultValue: 0 },
                { name: 'qrY', type: 'number', defaultValue: 0 },
                { name: 'qrRotation', type: 'number', defaultValue: 0 },
                { name: 'includeProductPhoto', type: 'checkbox', defaultValue: true },
                { name: 'productPhotoWidth', type: 'number', defaultValue: 150 },
                { name: 'productPhotoHeight', type: 'number', defaultValue: 150 },
                { name: 'productPhotoX', type: 'number', defaultValue: 0 },
                { name: 'productPhotoY', type: 'number', defaultValue: -200 },
                { name: 'productPhotoRoundness', type: 'number', defaultValue: 100 },
                { name: 'includeGarmentName', type: 'checkbox', defaultValue: true },
                { name: 'garmentNameWidth', type: 'number', defaultValue: 300 },
                { name: 'garmentNameHeight', type: 'number', defaultValue: 50 },
                { name: 'garmentNameX', type: 'number', defaultValue: 0 },
                { name: 'garmentNameY', type: 'number', defaultValue: 150 },
                { name: 'garmentNameRotation', type: 'number', defaultValue: 0 },
                { name: 'garmentNameFontFamily', type: 'text', defaultValue: 'Inter, sans-serif' },
                { name: 'garmentNameFontSize', type: 'number', defaultValue: 48 },
                { name: 'garmentNameFontWeight', type: 'text', defaultValue: '600' },
                { name: 'garmentNameFontColor', type: 'text', defaultValue: '#000000' },
                { name: 'garmentNameTextAlign', type: 'text', defaultValue: 'center' },
                { name: 'garmentNameTextVerticalAlign', type: 'text', defaultValue: 'middle' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
