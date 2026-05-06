import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: '導覽選單',
  admin: { group: '網站設定' },
  access: { read: () => true },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: '主選單項目',
      labels: { singular: '項目', plural: '項目' },
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: '顯示名稱',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          label: '連結類型',
          defaultValue: 'page',
          options: [
            { label: '頁面', value: 'page' },
            { label: '自訂網址', value: 'url' },
          ],
        },
        {
          name: 'page',
          type: 'relationship',
          label: '對應頁面',
          relationTo: 'pages',
          admin: {
            condition: (_, sib) => sib?.type === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: '自訂網址',
          admin: {
            condition: (_, sib) => sib?.type === 'url',
          },
        },
        {
          name: 'children',
          type: 'array',
          label: '子選單',
          fields: [
            { name: 'label', type: 'text', required: true, label: '顯示名稱' },
            {
              name: 'type',
              type: 'select',
              defaultValue: 'page',
              options: [
                { label: '頁面', value: 'page' },
                { label: '自訂網址', value: 'url' },
              ],
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: { condition: (_, sib) => sib?.type === 'page' },
            },
            {
              name: 'url',
              type: 'text',
              admin: { condition: (_, sib) => sib?.type === 'url' },
            },
          ],
        },
      ],
    },
  ],
}
