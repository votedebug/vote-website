import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type should ever exist.
  fields: [
    defineField({name: 'name', title: 'Site name', type: 'string'}),
    defineField({name: 'short', title: 'Short name', type: 'string'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'email', title: 'Contact email', type: 'string'}),
    defineField({name: 'address', title: 'Address', type: 'string'}),
    defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
    defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
    defineField({name: 'founded', title: 'Founded (year)', type: 'number'}),
    defineField({
      name: 'stats',
      title: 'Homepage stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', type: 'string', title: 'Value (e.g. "2,000+")'},
            {name: 'label', type: 'string', title: 'Label'},
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        },
      ],
    }),
    defineField({
      name: 'heroSlides',
      title: 'Home hero carousel',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'image', type: 'image', title: 'Image', options: {hotspot: true}},
            {name: 'caption', type: 'string', title: 'Caption'},
            {name: 'alt', type: 'string', title: 'Alt text'},
          ],
          preview: {select: {title: 'caption', media: 'image'}},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
