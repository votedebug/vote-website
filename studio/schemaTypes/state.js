import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'state',
  title: 'State',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'State name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'order', title: 'Sort order', type: 'number'}),
    defineField({
      name: 'chapters',
      title: 'School chapters',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Plain school names for this state’s chapters — these live outside the NYC map, so just the name, no address/logo.',
    }),
    defineField({
      name: 'directors',
      title: 'State directors',
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
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', chapters: 'chapters'},
    prepare: ({title, chapters}) => ({
      title,
      subtitle: chapters?.length ? `${chapters.length} chapter${chapters.length === 1 ? '' : 's'}` : undefined,
    }),
  },
})
