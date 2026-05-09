/**
 * Minimal HTML → Lexical (Payload richText) converter.
 *
 * Built to migrate the existing `legacyHtml` content (paragraphs, headings,
 * lists, links, basic emphasis, line breaks, simple tables) into the WYSIWYG
 * editor's serialized state so editors can edit pages visually instead of
 * touching raw HTML. Uses htmlparser2 for the HTML parse — DOM-free, runs in
 * Node and the browser.
 */

import { Parser } from 'htmlparser2'

// ---------- Lexical node shapes (what we actually emit) ----------
type LexicalText = {
  type: 'text'
  text: string
  format: number
  mode: 'normal'
  style: ''
  detail: 0
  version: 1
}

type LexicalLineBreak = { type: 'linebreak'; version: 1 }

type LexicalLink = {
  type: 'link'
  fields: { linkType: 'custom'; url: string; newTab: boolean }
  children: LexicalNode[]
  version: 3
  format: ''
  indent: 0
  direction: 'ltr'
}

type LexicalParagraph = {
  type: 'paragraph'
  children: LexicalNode[]
  version: 1
  format: ''
  indent: 0
  direction: 'ltr'
  textFormat: 0
  textStyle: ''
}

type LexicalHeading = {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: LexicalNode[]
  version: 1
  format: ''
  indent: 0
  direction: 'ltr'
}

type LexicalListItem = {
  type: 'listitem'
  value: number
  checked?: boolean
  children: LexicalNode[]
  version: 1
  format: ''
  indent: 0
  direction: 'ltr'
}

type LexicalList = {
  type: 'list'
  listType: 'bullet' | 'number' | 'check'
  tag: 'ul' | 'ol'
  start: number
  children: LexicalNode[]
  version: 1
  format: ''
  indent: 0
  direction: 'ltr'
}

type LexicalQuote = {
  type: 'quote'
  children: LexicalNode[]
  version: 1
  format: ''
  indent: 0
  direction: 'ltr'
}

type LexicalNode =
  | LexicalText
  | LexicalLineBreak
  | LexicalLink
  | LexicalParagraph
  | LexicalHeading
  | LexicalListItem
  | LexicalList
  | LexicalQuote

export type LexicalEditorState = {
  root: {
    type: 'root'
    children: LexicalNode[]
    version: 1
    format: ''
    indent: 0
    direction: 'ltr'
  }
}

// ---------- Helpers ----------
const FMT = { bold: 1, italic: 2, strike: 4, underline: 8, code: 16 } as const

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
const BLOCK_TAGS = new Set([
  'p',
  'div',
  'section',
  'article',
  'aside',
  'header',
  'footer',
  'main',
])

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
}

function makeText(text: string, format = 0): LexicalText {
  return { type: 'text', text, format, mode: 'normal', style: '', detail: 0, version: 1 }
}

function makeParagraph(children: LexicalNode[] = []): LexicalParagraph {
  return {
    type: 'paragraph',
    children,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
  }
}

function makeHeading(tag: LexicalHeading['tag'], children: LexicalNode[] = []): LexicalHeading {
  return { type: 'heading', tag, children, version: 1, format: '', indent: 0, direction: 'ltr' }
}

function makeList(tag: 'ul' | 'ol', children: LexicalNode[] = []): LexicalList {
  return {
    type: 'list',
    listType: tag === 'ol' ? 'number' : 'bullet',
    tag,
    start: 1,
    children,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
  }
}

function makeListItem(children: LexicalNode[] = [], value = 1): LexicalListItem {
  return {
    type: 'listitem',
    value,
    children,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
  }
}

function makeLink(rawUrl: string, children: LexicalNode[] = []): LexicalLink {
  // Lexical's link validator rejects URLs with leading/trailing whitespace.
  const url = (rawUrl ?? '').trim() || '#'
  const newTab = url.startsWith('http') || url.startsWith('//')
  return {
    type: 'link',
    fields: { linkType: 'custom', url, newTab },
    children,
    version: 3,
    format: '',
    indent: 0,
    direction: 'ltr',
  }
}

// ---------- Parser ----------
type StackFrame =
  | { kind: 'block'; node: LexicalParagraph | LexicalHeading | LexicalQuote | LexicalListItem }
  | { kind: 'list'; node: LexicalList }
  | { kind: 'inline'; node: LexicalLink }
  | { kind: 'fmt'; flag: number }

export function htmlToLexical(html: string): LexicalEditorState {
  const root: LexicalEditorState['root'] = {
    type: 'root',
    children: [],
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
  }

  // Stack of currently open elements; the top is where new content lands.
  const stack: StackFrame[] = []
  // Pending paragraph used to capture loose text/inline content at the root.
  let pendingPara: LexicalParagraph | null = null

  function activeContainer(): LexicalNode[] {
    // Walk back through inline frames to find the nearest block container.
    for (let i = stack.length - 1; i >= 0; i--) {
      const f = stack[i]
      if (f.kind === 'inline') return f.node.children
      if (f.kind === 'block') return f.node.children
      if (f.kind === 'list') return f.node.children
    }
    if (!pendingPara) {
      pendingPara = makeParagraph()
      root.children.push(pendingPara)
    }
    return pendingPara.children
  }

  function activeFormat(): number {
    let f = 0
    for (const frame of stack) {
      if (frame.kind === 'fmt') f |= frame.flag
    }
    return f
  }

  function flushPending() {
    if (pendingPara && pendingPara.children.length === 0) {
      // remove empty
      const idx = root.children.indexOf(pendingPara)
      if (idx >= 0) root.children.splice(idx, 1)
    }
    pendingPara = null
  }

  function popOpenBlocksDownTo(predicate: (f: StackFrame) => boolean) {
    // Close inline (link/fmt) frames and any open block frames until predicate matches.
    while (stack.length > 0) {
      const top = stack[stack.length - 1]
      if (predicate(top)) return
      stack.pop()
    }
  }

  function pushBlock(node: LexicalParagraph | LexicalHeading | LexicalQuote | LexicalListItem) {
    flushPending()
    // Block-level nodes (paragraph/heading/quote) cannot nest inside another
    // paragraph in Lexical. Close any open block-of-flow that isn't a list item
    // (which legitimately contains paragraphs/lists) before opening a new one.
    if (node.type !== 'listitem') {
      popOpenBlocksDownTo((f) => f.kind === 'list' || (f.kind === 'block' && f.node.type === 'listitem'))
    } else {
      // listitem only opens inside a list
      popOpenBlocksDownTo((f) => f.kind === 'list')
    }

    let parent: LexicalNode[] = root.children
    for (let i = stack.length - 1; i >= 0; i--) {
      const f = stack[i]
      if (f.kind === 'list') {
        parent = f.node.children
        break
      }
      if (f.kind === 'block') {
        // Only nest into a list item — never inside a paragraph/heading/quote.
        if (f.node.type === 'listitem') {
          parent = f.node.children
          break
        }
      }
    }
    parent.push(node)
    stack.push({ kind: 'block', node })
  }

  function pushList(node: LexicalList) {
    flushPending()
    // Lists are valid only at root or inside a list item — never inside a
    // paragraph/heading/quote.
    popOpenBlocksDownTo((f) => f.kind === 'list' || (f.kind === 'block' && f.node.type === 'listitem'))

    let parent: LexicalNode[] = root.children
    for (let i = stack.length - 1; i >= 0; i--) {
      const f = stack[i]
      if (f.kind === 'block' && f.node.type === 'listitem') {
        parent = f.node.children
        break
      }
    }
    parent.push(node)
    stack.push({ kind: 'list', node })
  }

  const parser = new Parser(
    {
      onopentag(name, attribs) {
        const tag = name.toLowerCase()
        if (tag === 'br') {
          activeContainer().push({ type: 'linebreak', version: 1 })
          return
        }
        if (HEADING_TAGS.has(tag)) {
          pushBlock(makeHeading(tag as LexicalHeading['tag']))
          return
        }
        if (tag === 'p' || BLOCK_TAGS.has(tag)) {
          pushBlock(makeParagraph())
          return
        }
        if (tag === 'blockquote') {
          pushBlock({
            type: 'quote',
            children: [],
            version: 1,
            format: '',
            indent: 0,
            direction: 'ltr',
          })
          return
        }
        if (tag === 'ul' || tag === 'ol') {
          pushList(makeList(tag))
          return
        }
        if (tag === 'li') {
          // Auto-determine value = current items + 1
          const top = stack[stack.length - 1]
          const value =
            top && top.kind === 'list' ? top.node.children.length + 1 : 1
          pushBlock(makeListItem([], value))
          return
        }
        if (tag === 'a') {
          // If we're not in a block, open a paragraph
          if (
            stack.length === 0 ||
            (stack[stack.length - 1].kind !== 'block' &&
              stack[stack.length - 1].kind !== 'inline')
          ) {
            if (!pendingPara) {
              pendingPara = makeParagraph()
              root.children.push(pendingPara)
            }
          }
          const link = makeLink(attribs.href ?? '#')
          activeContainer().push(link)
          stack.push({ kind: 'inline', node: link })
          return
        }
        if (tag === 'strong' || tag === 'b') {
          stack.push({ kind: 'fmt', flag: FMT.bold })
          return
        }
        if (tag === 'em' || tag === 'i') {
          stack.push({ kind: 'fmt', flag: FMT.italic })
          return
        }
        if (tag === 'u') {
          stack.push({ kind: 'fmt', flag: FMT.underline })
          return
        }
        if (tag === 's' || tag === 'del' || tag === 'strike') {
          stack.push({ kind: 'fmt', flag: FMT.strike })
          return
        }
        if (tag === 'code') {
          stack.push({ kind: 'fmt', flag: FMT.code })
          return
        }
        // Tables, images, iframes etc. are not handled in this minimal pass —
        // we keep their inner text but drop the structural wrapping. The
        // legacyHtml field stays in the schema as a backup.
      },
      ontext(rawText) {
        const text = decodeEntities(rawText)
        const inInlineOrBlock = stack.some((f) => f.kind === 'inline' || f.kind === 'block')
        if (!inInlineOrBlock && /^\s*$/.test(text)) {
          // Pure whitespace between top-level blocks is just HTML formatting noise.
          return
        }
        if (text === '') return
        const fmt = activeFormat()
        // Ensure we have a paragraph open if we're at root level (only fmt frames or empty).
        const hasOpenBlockOrInline = stack.some(
          (f) => f.kind === 'block' || f.kind === 'inline' || f.kind === 'list',
        )
        if (!hasOpenBlockOrInline && !pendingPara) {
          pendingPara = makeParagraph()
          root.children.push(pendingPara)
        }
        activeContainer().push(makeText(text, fmt))
      },
      onclosetag(name) {
        const tag = name.toLowerCase()
        if (tag === 'br') return
        const stripFmt = (flag: number) => {
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].kind === 'fmt' && (stack[i] as { flag: number }).flag === flag) {
              stack.splice(i, 1)
              return
            }
          }
        }
        if (tag === 'strong' || tag === 'b') return stripFmt(FMT.bold)
        if (tag === 'em' || tag === 'i') return stripFmt(FMT.italic)
        if (tag === 'u') return stripFmt(FMT.underline)
        if (tag === 's' || tag === 'del' || tag === 'strike') return stripFmt(FMT.strike)
        if (tag === 'code') return stripFmt(FMT.code)
        if (tag === 'a') {
          // Pop the inline frame
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].kind === 'inline') {
              stack.splice(i, 1)
              return
            }
          }
          return
        }
        if (
          HEADING_TAGS.has(tag) ||
          tag === 'p' ||
          BLOCK_TAGS.has(tag) ||
          tag === 'blockquote' ||
          tag === 'li'
        ) {
          // Pop the topmost block frame
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].kind === 'block') {
              stack.splice(i, 1)
              return
            }
          }
        }
        if (tag === 'ul' || tag === 'ol') {
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].kind === 'list') {
              stack.splice(i, 1)
              return
            }
          }
        }
      },
    },
    { decodeEntities: false, lowerCaseTags: true },
  )

  parser.write(html)
  parser.end()

  // Drop empty trailing paragraphs
  while (
    root.children.length > 0 &&
    (root.children[root.children.length - 1] as LexicalParagraph).type === 'paragraph' &&
    ((root.children[root.children.length - 1] as LexicalParagraph).children?.length ?? 0) === 0
  ) {
    root.children.pop()
  }

  // Lexical requires at least one block child
  if (root.children.length === 0) root.children.push(makeParagraph())

  return { root }
}

export function isLexicalEmpty(state: { root?: { children?: unknown[] } } | null | undefined): boolean {
  if (!state || !state.root) return true
  const children = state.root.children ?? []
  if (children.length === 0) return true
  return children.every((c) => {
    const node = c as { type?: string; children?: unknown[] }
    if (node.type === 'paragraph') {
      const ch = node.children ?? []
      if (ch.length === 0) return true
      return ch.every((t) => {
        const tn = t as { type?: string; text?: string }
        return tn.type === 'text' && (!tn.text || tn.text.trim() === '')
      })
    }
    return false
  })
}
