'use client'

import { useState } from 'react'
import SOURCING_DATA from '@/lib/sourcing'
import { useLang } from '@/lib/LangContext'
import { getText, LANG_CODES, LANG_NAMES } from '@/lib/locales'

function LangSwitcher({ langIndex, onSwitch }) {
  return (
    <div className="flex gap-1 justify-end mb-4">
      {LANG_CODES.map((code, i) => (
        <button key={code} onClick={() => onSwitch(code)}
          className={`text-xs px-2 py-0.5 rounded ${i === langIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
        >{LANG_NAMES[i]}</button>
      ))}
    </div>
  )
}

export default function SourcingPage() {
  const { langIndex, changeLang, mounted } = useLang()
  const t = (key, p) => getText(key, langIndex, p)
  const [activeCat, setActiveCat] = useState(null)

  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <LangSwitcher langIndex={langIndex} onSwitch={changeLang} />

      <div className="flex items-center gap-3 mb-6">
        <a href="/" className="text-blue-600 hover:underline text-sm">← {t('continue_ordering')}</a>
        <h1 className="text-2xl font-bold">📦 {t('src_tip')}</h1>
      </div>

      {/* 大分类 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SOURCING_DATA.map(cat => (
          <button key={cat.id}
            onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeCat === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >{t(cat.labelKey)}</button>
        ))}
      </div>

      {/* 细分类 */}
      {activeCat && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SOURCING_DATA.find(c => c.id === activeCat)?.subcategories.map(sub => (
            <a key={sub.labelKey} href={sub.url} target="_blank" rel="noreferrer"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:border-blue-400 hover:shadow-md transition block"
            >
              <div className="text-blue-600 font-medium text-sm">{t(sub.labelKey)}</div>
              <div className="text-xs text-gray-400 mt-1">🔗 {t('src_visit')}</div>
            </a>
          ))}
        </div>
      )}

      {!activeCat && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">👆</div>
          <p>{t('src_select_category')}</p>
        </div>
      )}
    </div>
  )
}
