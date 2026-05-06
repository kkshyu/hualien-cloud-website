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
      label: '內文',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          LinkFeature({}),
        ],
      }),
    },
    {
      name: 'legacyHtml',
      type: 'textarea',
      label: '舊版內容原始碼（匯入用，遷移完成後可清空）',
      localized: true,
      admin: {
        description: '只在尚未用編輯器重建內文時使用；上方「內文」已填寫時會優先顯示內文',
        rows: 6,
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
