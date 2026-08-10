import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'chapter', title: 'Chapter line', type: 'string', description: 'e.g. "Chapter Leader — VOTE Bronx Science"'}),
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 4}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Board / Executive Director', value: 'board'},
          {title: 'Founder', value: 'founder'},
          {title: 'Editorial', value: 'editorial'},
          {title: 'Media', value: 'media'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Sort order', type: 'number'}),
  ],
  orderings: [
    {title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
