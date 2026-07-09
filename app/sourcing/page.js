'use client'

import { useState } from 'react'
import SOURCING_DATA from '@/lib/sourcing'
import { useLang } from '@/lib/LangContext'
import { getText, LANG_CODES, LANG_NAMES } from '@/lib/locales'

// 翻译键 → 实际文本
const TRANSLATIONS = {
  src_jerseys: ['球衣类', 'Jerseys', 'Camisetas', 'Camisetas'],
  src_training: ['训练服/运动套装', 'Training Wear', 'Ropa de Entrenamiento', 'Roupas de Treino'],
  src_apparel: ['服装类', 'Apparel', 'Ropa', 'Vestuário'],
  src_shoes: ['鞋类', 'Shoes', 'Zapatos', 'Calçados'],
  src_accessories: ['配件/其他', 'Accessories', 'Accesorios', 'Acessórios'],

  src_fan_player: ['球迷版/球员版', 'Fan/Player Version', 'Versión Hincha/Jugador', 'Versão Torcedor/Jogador'],
  src_thai: ['泰版', 'Thai Version', 'Versión Tailandesa', 'Versão Tailandesa'],
  src_retro: ['复古球衣', 'Retro Jerseys', 'Camisetas Retro', 'Camisetas Retro'],
  src_cold: ['冷门款', 'Rare/Niche', 'Equipos Minoritarios', 'Times Raros'],
  src_kids_jersey: ['儿童球衣', 'Kids Jerseys', 'Camisetas Infantiles', 'Camisetas Infantis'],
  src_baby: ['婴儿装', 'Baby Wear', 'Ropa de Bebé', 'Roupas de Bebê'],
  src_pants: ['球衣配套长裤', 'Match Pants', 'Pantalones', 'Calções'],
  src_long_sleeve: ['长袖球衣', 'Long Sleeve Jerseys', 'Camisetas Manga Larga', 'Camisetas Manga Longa'],

  src_train_suit: ['训练服套装', 'Training Suits', 'Conjuntos de Entrenamiento', 'Conjuntos de Treino'],
  src_yoga: ['瑜伽服', 'Yoga Wear', 'Ropa de Yoga', 'Roupas de Yoga'],

  src_windbreaker: ['风衣/外套', 'Windbreakers', 'Cortavientos', 'Corta-Ventos'],
  src_hoodie: ['卫衣', 'Hoodies', 'Sudadera', 'Moletons'],
  src_racing: ['赛车服', 'Racing Suits', 'Trajes de Carreras', 'Macacões de Corrida'],
  src_brand_tee: ['品牌T恤/Polo', 'Brand Tees/Polo', 'Camisetas de Marca', 'Camisetas de Marca'],
  src_nba: ['NBA球衣', 'NBA Jerseys', 'Camisetas NBA', 'Camisetas NBA'],
  src_down: ['棉服/羽绒服', 'Down Jackets', 'Chaquetas de Plumas', 'Jaquetas de Penas'],
  src_shorts: ['运动短裤', 'Sports Shorts', 'Pantalones Cortos', 'Shorts Esportivos'],
  src_other_apparel: ['其他服饰', 'Other Apparel', 'Otra Ropa', 'Outras Roupas'],

  src_adult_shoes: ['成人运动鞋', 'Adult Sports Shoes', 'Zapatos Deportivos Adulto', 'Tênis Adulto'],
  src_football_boots: ['足球鞋', 'Football Boots', 'Botas de Fútbol', 'Chuteiras'],
  src_kids_shoes: ['童鞋', 'Kids Shoes', 'Zapatos Infantiles', 'Sapatos Infantis'],

  src_football_acc: ['足球配件', 'Football Accessories', 'Accesorios de Fútbol', 'Acessórios de Futebol'],
  src_hat: ['帽子', 'Hats', 'Gorras', 'Bonés'],
  src_glasses: ['眼镜', 'Glasses', 'Gafas', 'Óculos'],
  src_electronics: ['电子产品', 'Electronics', 'Electrónicos', 'Eletrônicos'],
  src_bag: ['书包/背包', 'Bags', 'Mochilas', 'Mochilas'],
  src_luxury: ['奢侈品鞋服', 'Luxury Shoes/Clothes', 'Zapatos/Ropa de Lujo', 'Sapatos/Roupas de Luxo'],

  src_primary: ['主推', 'Primary', 'Principal', 'Principal'],
  src_backups: ['备选', 'Backups', 'Alternativos', 'Alternativos'],
  src_visit: ['查看图片', 'Browse Images', 'Ver Imágenes', 'Ver Imagens'],
}

function t(key, langIndex) {
  const texts = TRANSLATIONS[key]
  if (!texts) return key
  return texts[langIndex] || texts[0]
}

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
  const [activeCat, setActiveCat] = useState(null)

  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <LangSwitcher langIndex={langIndex} onSwitch={changeLang} />

      <div className="flex items-center gap-3 mb-6">
        <a href="/" className="text-blue-600 hover:underline text-sm">← 返回下单</a>
        <h1 className="text-2xl font-bold">📦 商品图片查找</h1>
      </div>
      <p className="text-gray-500 mb-6 text-sm">
        点击分类查看对应 Yupoo 商品相册，找图后回到下单页提交订单
      </p>

      {/* 大分类按钮 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SOURCING_DATA.map(cat => (
          <button key={cat.id}
            onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeCat === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >{t(cat.labelKey, langIndex)}</button>
        ))}
      </div>

      {/* 选中大分类的细分类 */}
      {activeCat && (
        <div className="space-y-4">
          {SOURCING_DATA.find(c => c.id === activeCat)?.subcategories.map(sub => (
            <div key={sub.id} className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="text-lg font-semibold mb-2">{t(sub.labelKey, langIndex)}</h3>

              {sub.note && <p className="text-xs text-gray-400 mb-3">{sub.note}</p>}

              {/* 主链接 */}
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium mb-1">
                  {t('src_primary', langIndex)}
                </span>
                <a href={sub.primary.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span>🔗</span>
                  <span>{sub.primary.label}</span>
                  <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded">
                    {t('src_visit', langIndex)} →
                  </span>
                </a>
              </div>

              {/* 备用链接 */}
              {sub.backups.length > 0 && (
                <div>
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded font-medium mb-1">
                    {t('src_backups', langIndex)}
                  </span>
                  <div className="space-y-1">
                    {sub.backups.map((b, i) => (
                      <a key={i} href={b.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 ml-2"
                      >
                        <span className="text-gray-300">└</span>
                        <span>{b.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 没选分类时的提示 */}
      {!activeCat && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">👆</div>
          <p>点击上方分类，查看对应货源链接</p>
        </div>
      )}
    </div>
  )
}
