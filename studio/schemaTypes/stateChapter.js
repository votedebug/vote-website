import {defineField, defineType} from 'sanity'

/**
 * A state-level organisation: the directors who run VOTE across a whole state.
 *
 * Chapters are the schools; this is the layer above them. A state only needs a
 * document here once it has state directors — the chapters map highlights any
 * state that has chapters regardless, and adds the darker "has state directors"
 * treatment when a document like this exists.
 */
export default defineType({
  name: 'stateChapter',
  title: 'State',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'State code',
      type: 'string',
      description: 'Two-letter postal code, e.g. "NY" or "MA". This is the URL: /chapters/ny.',
      validation: (r) =>
        r.required()
          .uppercase()
          .length(2)
          .regex(/^[A-Z]{2}$/, {name: 'two-letter state code'}),
    }),
    defineField({name: 'name', title: 'State name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'blurb',
      title: 'Intro line',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown beside the state map.',
    }),
    defineField({name: 'order', title: 'Sort order', type: 'number'}),
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
            {name: 'bio', type: 'text', title: 'Bio', rows: 4},
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        },
      ],
    }),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'code'},
  },
})
