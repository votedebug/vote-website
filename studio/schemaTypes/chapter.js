import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'chapter',
  title: 'Chapter',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Full school name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'short', title: 'Short name', type: 'string'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'monogram',
      title: 'Monogram fallback',
      type: 'string',
      description: 'Two-letter fallback shown when no logo is set (e.g. "CZ").',
    }),
    defineField({name: 'borough', title: 'Borough', type: 'string'}),
    defineField({
      name: 'state',
      title: 'State code',
      type: 'string',
      description:
        'Two-letter postal code, e.g. "NY". Decides which state map the chapter appears on. ' +
        'Left blank, it is read off the end of the street address.',
      validation: (r) => r.uppercase().length(2),
    }),
    defineField({name: 'order', title: 'Sort order', type: 'number'}),
    defineField({name: 'address', title: 'Street address', type: 'string'}),
    defineField({
      name: 'coords',
      title: 'Map coordinates',
      type: 'geopoint',
      description: 'Used to place the pin on the NYC chapters map.',
    }),
    defineField({
      name: 'directors',
      title: 'Chapter leaders',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Name'},
            {name: 'role', type: 'string', title: 'Role'},
            {name: 'photo', type: 'image', title: 'Photo', options: {hotspot: true}},
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        },
      ],
    }),
  ],
  orderings: [
    {title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'borough', media: 'logo'},
  },
})
