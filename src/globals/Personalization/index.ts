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
      label: {
        es: 'Diseño QR',
        en: 'QR Layout',
      },
      type: 'collapsible',
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
}
