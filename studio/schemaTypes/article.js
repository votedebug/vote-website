import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({name: 'dek', title: 'Dek (subhead)', type: 'text', rows: 2}),
    defineField({name: 'author', title: 'Author name', type: 'string'}),
    defineField({name: 'role', title: 'Author role', type: 'string'}),
    defineField({name: 'date', title: 'Publish date', type: 'date'}),
    defineField({name: 'category', title: 'Category', type: 'string'}),
    defineField({name: 'readTime', title: 'Read time', type: 'string', description: 'e.g. "6 min read"'}),
    defineField({name: 'image', title: 'Cover image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'feature', title: 'Feature on Articles page', type: 'boolean', initialValue: false}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'bibliography',
      title: 'Bibliography',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'text', type: 'string', title: 'Citation text'},
            {name: 'url', type: 'url', title: 'URL'},
          ],
          preview: {select: {title: 'text'}},
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'image'},
  },
})
