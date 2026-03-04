import type { Field } from 'payload'
import { nameGroup } from './strings.js'

export const isHiddenField = (field: Field | undefined) => {
  return field?.type !== 'ui' && Boolean(field?.hidden)
}

export const flatFilterFields = (fields: Field[], groupPrefix = ''): Field[] =>
  fields
    .filter(({ type }) =>
      [
        'number',
        'text',
        'email',
        'date',
        'radio',
        'checkbox',
        'select',
        'row',
        'group',
        'tabs',
      ].includes(type),
    )
    .flatMap((field: Field) =>
      field.type === 'row'
        ? flatFilterFields(field.fields, groupPrefix)
        : field.type === 'group' && 'name' in field
          ? flatFilterFields(field.fields, nameGroup(groupPrefix, field.name))
          : field.type === 'tabs'
            ? field.tabs
                .filter(tab => 'name' in tab)
                .flatMap(tab => flatFilterFields(tab.fields, nameGroup(groupPrefix, tab.name)))
            : groupPrefix && 'name' in field
              ? { ...field, name: nameGroup(groupPrefix, field.name) }
              : field,
    )
