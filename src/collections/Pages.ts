import type { CollectionConfig } from 'payload'
import { lexicalEditor, FixedToolbarFeature, HeadingFeature, LinkFeature } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: '頁面',
    plural: '頁面',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: '內容',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '標題',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: '網址代稱',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: '使用英數與連字號（首頁固定填 home）',
      },
    },
    {
      name: 'hero',
      type: 'group',
      label: '主視覺區塊',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: '主標題',
          localized: true,
        },
        {
          name: 'subheading',
          type: 'textarea',
          label: '副標題',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          label: '主視覺',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      label: '內文（所見即所得編輯器）',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures, rootFeatures }) => [
          ...(rootFeatures ?? []),
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          LinkFeature({}),
        ],
      }),
      admin: {
        description: '直接在編輯器中輸入內容，會自動排版。可使用標題、清單、連結、表格、圖片等。',
      },
    },
    {
      name: 'legacyHtml',
      type: 'textarea',
      label: '舊版 HTML 原始碼',
      localized: true,
      admin: {
        // Hidden from the admin UI: editors only interact with the WYSIWYG
        // editor above. Field retained in schema so existing data isn't lost
        // and the frontend can fall back to it when `body` is still empty.
        hidden: true,
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: '搜尋與分享資訊',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: '搜尋標題',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: '搜尋描述',
          localized: true,
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: '分享預覽圖',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: '狀態',
      defaultValue: 'draft',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已發佈', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
