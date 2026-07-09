# Multi-Language System Patterns

## Architecture

The translation system uses a flat key-value dictionary with 4-element arrays (zh, en, es, pt).

## Implementation

### Translation Data (`lib/locales.js`)

```javascript
const LOCALES = {
  site_title: ['球衣订购', 'Jersey Order', 'Pedido de Camisetas', 'Pedido de Camisetas'],
  add_product: ['添加商品', 'Add Product', 'Añadir Producto', 'Adicionar Produto'],
  // ...
}

export function getText(key, langIndex, params = {}) {
  const texts = LOCALES[key]
  if (!texts) return key
  let text = texts[langIndex] || texts[0]
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(`{${k}}`, v)
  }
  return text
}

export const LANG_CODES = ['zh', 'en', 'es', 'pt']
export const LANG_NAMES = ['中文', 'English', 'Español', 'Português']
```

### Context Provider (`lib/LangContext.js`)

```jsx
'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { LANG_CODES } from './locales'

const LangContext = createContext(null)
const STORAGE_KEY = 'jersey_lang'

export function LangProvider({ children }) {
  const [langIndex, setLangIndex] = useState(-1) // -1 = not selected
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const idx = LANG_CODES.indexOf(saved)
      if (idx >= 0) setLangIndex(idx)
    }
    setMounted(true)
  }, [])

  const changeLang = useCallback((code) => {
    const idx = LANG_CODES.indexOf(code)
    if (idx >= 0) {
      setLangIndex(idx)
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [])

  return (
    <LangContext.Provider value={{ langIndex, changeLang, mounted }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext) || { langIndex: -1, changeLang: () => {}, mounted: false }
}
```

### Usage in Components

```jsx
import { useLang } from '@/lib/LangContext'
import { getText } from '@/lib/locales'

function MyComponent() {
  const { langIndex } = useLang()
  const t = useCallback((key, p) => getText(key, langIndex, p), [langIndex])
  
  return <h1>{t('site_title')}</h1>
}
```

### Layout Wrapping

```jsx
// app/layout.js
import { LangProvider } from '@/lib/LangContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LangProvider>
          <main>{children}</main>
        </LangProvider>
      </body>
    </html>
  )
}
```

## Language Selector Pattern

First-time visitors see a full-screen language selection overlay. Subsequent visits auto-restore from localStorage.

```jsx
// First visit: langIndex === -1
if (!mounted) return null
if (langIndex < 0) {
  return <LangSelector onSelect={changeLang} />
}
// Normal page render
```

A compact language switcher is shown at the top of every page:

```jsx
<div className="flex gap-1">
  {LANG_CODES.map((code, i) => (
    <button key={code} onClick={() => changeLang(code)}
      className={i === langIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'}
    >{LANG_NAMES[i]}</button>
  ))}
</div>
```

## Adding a New Language

1. Add the language code to `LANG_CODES` and name to `LANG_NAMES`
2. Add a 5th element to every translation key array in `LOCALES`
3. Add a button in the language selector and switcher
4. Test with real users from that locale

## Key Pattern: Parameterized Translations

Use `{param}` placeholders for dynamic values:

```javascript
admin_total_orders: ['共 {n} 条订单', '{n} orders total', ...]
```

Call with: `t('admin_total_orders', { n: '5' })`
