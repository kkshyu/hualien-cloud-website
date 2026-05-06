import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '網站設定',
  admin: { group: '網站設定' },
  access: { read: () => true },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: '網站名稱',
      defaultValue: '花蓮雲基地',
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: '標語',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      label: '識別標誌',
      relationTo: 'media',
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      label: '預設分享預覽圖',
      relationTo: 'media',
    },
    {
      name: 'contact',
      type: 'group',
      label: '聯絡資訊',
      fields: [
        { name: 'email', type: 'email', label: '電子郵件' },
        { name: 'phone', type: 'text', label: '電話' },
        { name: 'address', type: 'textarea', label: '地址', localized: true },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: '社群連結',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Line', value: 'line' },
            { label: '其他', value: 'other' },
          ],
        },
        { name: 'url', type: 'text', required: true },
        { name: 'label', type: 'text', label: '顯示名稱（選填）' },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: '頁尾',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: '版權標示',
          localized: true,
          defaultValue: '© 花蓮雲基地',
        },
      ],
    },
  ],
}
