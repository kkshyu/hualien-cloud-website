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
