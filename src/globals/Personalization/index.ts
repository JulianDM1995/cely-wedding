import type { GlobalConfig } from 'payload'
import { colorField } from '../../fields/ColorField'

export const Personalization: GlobalConfig = {
  slug: 'personalization',
  label: {
    es: 'Personalización',
    en: 'Personalization',
  },
  admin: {
    group: 'Admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            es: 'General',
            en: 'General',
          },
          fields: [
            {
              name: 'weddingDate',
              type: 'date',
              label: {
                es: 'Fecha de la Boda',
                en: 'Wedding Date',
              },
              required: true,
              admin: {},
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
                  name: 'groom',
                  type: 'text',
                  label: { es: 'Nombre del Novio', en: 'Groom Name' },
                  defaultValue: 'Juan',
                },
                {
                  name: 'bride',
                  type: 'text',
                  label: { es: 'Nombre de la Novia', en: 'Bride Name' },
                  defaultValue: 'Tatiana',
                },
              ],
            },
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
            {
              name: 'giftType',
              type: 'text',
              label: {
                es: 'Tipo de Regalo',
                en: 'Gift Type',
              },
              admin: {
                description: {
                  es: 'Ej: "Lluvia de Sobres", "Lista de Regalos", etc.',
                  en: 'E.g: "Monetary Gift", "Gift Registry", etc.',
                },
              },
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
                      type: 'text', // Text allows "5:00 PM" flexibility
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
                  type: 'text',
                  label: { es: 'Coordenadas GPS / Link Mapa', en: 'GPS Coordinates / Map Link' },
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
                  type: 'text',
                  label: { es: 'Coordenadas GPS / Link Mapa', en: 'GPS Coordinates / Map Link' },
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
              type: 'array',
              label: {
                es: 'Carrusel de Fotos',
                en: 'Photo Carousel',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    es: 'Imagen',
                    en: 'Image',
                  },
                },
              ],
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
              name: 'qrLayout',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    es: 'Imagen de Fondo',
                    en: 'Background Image',
                  },
                },
                {
                  name: 'designer',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: '/globals/Personalization/fields/InvitationDesigner/index.tsx#InvitationDesigner',
                    },
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'dotsType',
                      type: 'select',
                      label: {
                        es: 'Tipo de Puntos',
                        en: 'Dots Type',
                      },
                      options: [
                        { label: { es: 'Redondeado', en: 'Rounded' }, value: 'rounded' },
                        { label: { es: 'Puntos', en: 'Dots' }, value: 'dots' },
                        { label: { es: 'Elegante', en: 'Classy' }, value: 'classy' },
                        { label: { es: 'Elegante Redondeado', en: 'Classy Rounded' }, value: 'classy-rounded' },
                        { label: { es: 'Cuadrado', en: 'Square' }, value: 'square' },
                        { label: { es: 'Extra Redondeado', en: 'Extra Rounded' }, value: 'extra-rounded' },
                      ],
                      defaultValue: 'square',
                      admin: { width: '50%', hidden: true },
                    },
                    colorField({
                      name: 'color', // Main color (dots)
                      label: {
                        es: 'Color Principal',
                        en: 'Main Color',
                      },
                      admin: { width: '50%', hidden: true },
                    }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cornersSquareType',
                      type: 'select',
                      label: {
                        es: 'Tipo de Esquinas (Cuadrado)',
                        en: 'Corners Type (Square)',
                      },
                      options: [
                        { label: { es: 'Punto', en: 'Dot' }, value: 'dot' },
                        { label: { es: 'Cuadrado', en: 'Square' }, value: 'square' },
                        { label: { es: 'Extra Redondeado', en: 'Extra Rounded' }, value: 'extra-rounded' },
                      ],
                      defaultValue: 'square',
                      admin: { width: '50%', hidden: true },
                    },
                    colorField({
                      name: 'cornersSquareColor',
                      label: {
                        es: 'Color de Esquinas (Cuadrado)',
                        en: 'Corners Color (Square)',
                      },
                      admin: { width: '50%', hidden: true },
                    }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cornersDotType',
                      type: 'select',
                      label: {
                        es: 'Tipo de Esquinas (Punto)',
                        en: 'Corners Type (Dot)',
                      },
                      options: [
                        { label: { es: 'Punto', en: 'Dot' }, value: 'dot' },
                        { label: { es: 'Cuadrado', en: 'Square' }, value: 'square' },
                      ],
                      defaultValue: 'square',
                      admin: { width: '50%', hidden: true },
                    },
                    colorField({
                      name: 'cornersDotColor',
                      label: {
                        es: 'Color de Esquinas (Punto)',
                        en: 'Corners Color (Dot)',
                      },
                      admin: { width: '50%', hidden: true },
                    }),
                  ],
                },
                {
                  name: 'show',
                  type: 'checkbox',
                  label: {
                    es: 'Mostrar Logo',
                    en: 'Show Logo',
                  },
                  admin: { hidden: true },
                },
                {
                  name: 'size',
                  type: 'number',
                  label: {
                    es: 'Tamaño del Logo (%)',
                    en: 'Logo Size (%)',
                  },
                  defaultValue: 20,
                  admin: { hidden: true },
                },
                {
                  name: 'qrSize',
                  type: 'number',
                  admin: { hidden: true },
                  defaultValue: 300,
                },
                {
                  name: 'qrX',
                  type: 'number',
                  admin: { hidden: true },
                  defaultValue: 0,
                },
                {
                  name: 'qrY',
                  type: 'number',
                  admin: { hidden: true },
                  defaultValue: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
