import type { GlobalConfig } from 'payload'
import { colorField } from '../../fields/ColorField'

export const Personalization: GlobalConfig = {
  slug: 'personalization',
  fields: [

    {
      label: 'QR Layout',
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
              label: 'Background Image',
            },
            {
              name: 'designer',
              type: 'ui',
              admin: {
                components: {
                  Field: '/globals/Personalization/fields/QRDesigner/index.tsx#QRDesigner',
                },
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dotsType',
                  type: 'select',
                  options: [
                    { label: 'Rounded', value: 'rounded' },
                    { label: 'Dots', value: 'dots' },
                    { label: 'Classy', value: 'classy' },
                    { label: 'Classy Rounded', value: 'classy-rounded' },
                    { label: 'Square', value: 'square' },
                    { label: 'Extra Rounded', value: 'extra-rounded' },
                  ],
                  defaultValue: 'square',
                  admin: { width: '50%', hidden: true },
                },
                colorField({
                  name: 'color', // Main color (dots)
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
                  options: [
                    { label: 'Dot', value: 'dot' },
                    { label: 'Square', value: 'square' },
                    { label: 'Extra Rounded', value: 'extra-rounded' },
                  ],
                  defaultValue: 'square',
                  admin: { width: '50%', hidden: true },
                },
                colorField({
                  name: 'cornersSquareColor',
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
                  options: [
                    { label: 'Dot', value: 'dot' },
                    { label: 'Square', value: 'square' },
                  ],
                  defaultValue: 'square',
                  admin: { width: '50%', hidden: true },
                },
                colorField({
                  name: 'cornersDotColor',
                  admin: { width: '50%', hidden: true },
                }),
              ],
            },
            {
              name: 'show',
              type: 'checkbox',
              label: 'Show Logo',
              admin: { hidden: true },
            },
            {
              name: 'size',
              type: 'number',
              label: 'Logo Size (%)',
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
