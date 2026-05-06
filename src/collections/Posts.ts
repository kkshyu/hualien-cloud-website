import type { CollectionConfig } from 'payload'
import { lexicalEditor, FixedToolbarFeature, HeadingFeature, LinkFeature } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: '最新消息',
    plural: '最新消息',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    group: '內容',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: { equals: 'published' },
      }
    },
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    // Legacy field — kept in schema to avoid destructive DB changes, but
    // hidden from the admin so editors only see one place to publish.
    {
      name: 'type',
      type: 'select',
      defaultValue: 'news',
      options: [
        { label: '最新消息', value: 'news' },
        { label: '活動（已併入最新消息）', value: 'event' },
      ],
      admin: { hidden: true },
    },
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
        description: '使用英數與連字號，會作為文章網址路徑',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: '摘要',
      localized: true,
    },
    {
      name: 'cover',
      type: 'upload',
      label: '封面圖',
      relationTo: 'media',
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
      name: 'categories',
      type: 'relationship',
      label: '分類',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: '發佈時間',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
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
