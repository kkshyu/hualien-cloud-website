import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    group: '內容',
    description: '圖片、影片、文件等媒體檔案，集中存放於物件儲存空間',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: '替代文字',
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: '說明',
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
      label: '來源 / 攝影者',
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'feature', width: 1280, height: 720, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
}
