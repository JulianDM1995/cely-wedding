import type { TextField } from 'payload';

type SingleTextField = Extract<TextField, { type: 'text'; hasMany?: false }>

export function colorField(
  opts: { updateOnFinish?: boolean; includeAlpha?: boolean } & Omit<
    SingleTextField,
    'type' | 'hasMany'
  >,
): SingleTextField {
  const updateOnFinish = opts.updateOnFinish ?? false
  const includeAlpha = opts.includeAlpha ?? false

  return {
    ...opts,
    type: 'text',
    hasMany: false,
    admin: {
      ...opts.admin,
      components: {
        Cell: '/fields/ColorField/ui/Cell.tsx',
        Field: {
          path: '/fields/ColorField/ui/Field.tsx',
          clientProps: {
            updateOnFinish,
            includeAlpha,
          },
        },
      },
    },
  }
}
