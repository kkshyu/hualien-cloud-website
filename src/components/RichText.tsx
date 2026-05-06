import sanitizeHtml from 'sanitize-html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

function isEmpty(data: SerializedEditorState | null | undefined): boolean {
  if (!data || !data.root) return true
  const children = (data.root as { children?: unknown[] }).children ?? []
  return children.length === 0
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1','h2','h3','h4','h5','h6',
    'p','br','hr','blockquote','pre','code',
    'ul','ol','li',
    'a','strong','em','b','i','u','s','span','small','sub','sup',
    'img','figure','figcaption','picture','source',
    'table','thead','tbody','tr','td','th',
    'div','section','article','aside','header','footer',
    'iframe','video','audio',
  ],
  allowedAttributes: {
    a: ['href','name','target','rel','title'],
    img: ['src','alt','title','width','height','loading','decoding','srcset','sizes'],
    iframe: ['src','width','height','frameborder','allow','allowfullscreen','title'],
    video: ['src','controls','poster','width','height','preload'],
    audio: ['src','controls','preload'],
    source: ['src','srcset','type','media','sizes'],
    '*': ['class','id','style'],
  },
  allowedSchemes: ['http','https','mailto','tel','data'],
  allowedSchemesByTag: { img: ['http','https','data'] },
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
}

export function RichText({
  data,
  legacyHtml,
}: {
  data?: SerializedEditorState | null
  legacyHtml?: string | null
}) {
  if (data && !isEmpty(data)) return <LexicalRichText data={data} />
  if (legacyHtml) {
    const cleaned = sanitizeHtml(legacyHtml, SANITIZE_OPTIONS)
    return <div dangerouslySetInnerHTML={{ __html: cleaned }} />
  }
  return null
}
