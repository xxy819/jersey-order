'use client'

import { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { LANG_CODES } from './locales'

const STORAGE_KEY = 'jersey_lang'
const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [langIndex, setLangIndex] = useState(-1) // -1 = 未选择
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const idx = LANG_CODES.indexOf(saved)
      if (idx >= 0) setLangIndex(idx)
    }
    // 如果没保存过语言，保持 -1，由页面展示语言选择器
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
  const ctx = useContext(LangContext)
  if (!ctx) return { langIndex: -1, changeLang: () => {}, mounted: false }
  return ctx
}
