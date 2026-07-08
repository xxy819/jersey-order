'use client'

import { useCallback, useState, useEffect } from 'react'
import { LANG_CODES } from './locales'

const STORAGE_KEY = 'jersey_lang'

export function useLocale() {
  const [langIndex, setLangIndex] = useState(-1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || ''
    const idx = LANG_CODES.indexOf(saved)
    setLangIndex(idx >= 0 ? idx : -1)
    setMounted(true)
  }, [])

  const changeLang = useCallback((code) => {
    const idx = LANG_CODES.indexOf(code)
    if (idx >= 0) {
      setLangIndex(idx)
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [])

  const t = useCallback((key, params = {}) => {
    // 动态 import locales 避免 SSR 问题
    if (typeof window === 'undefined') return key
    // 懒加载翻译数据
    const LOCALES = window.__LOCALES__
    if (!LOCALES) return key
    const texts = LOCALES[key]
    if (!texts) return key
    let text = langIndex >= 0 ? (texts[langIndex] || texts[0]) : texts[0]
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v)
    }
    return text
  }, [langIndex])

  // 将翻译数据挂到 window 上供 t() 使用
  useEffect(() => {
    import('./locales').then(mod => {
      window.__LOCALES__ = mod.default
    })
  }, [])

  return { langIndex, changeLang, t, isLangSelected: langIndex >= 0, mounted }
}
