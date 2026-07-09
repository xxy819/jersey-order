'use client'

import { useState, useCallback, useEffect } from 'react'
import { PRODUCTS, CATEGORIES, getProductsByCategory, ADDONS, CUSTOM_PRICE, calcShipping, SHIPPING_THRESHOLD, SHIPPING_FEE, getSizeOptions, getSizeChart, SIZE_CHARTS, PAYPAL_EMAIL, getProduct, calcItemPrice, calcPatchPrice, calcSizeSurcharge } from '@/lib/config'
import { getText, getStyleLabel, LANG_CODES, LANG_NAMES } from '@/lib/locales'
import { useLang } from '@/lib/LangContext'

function emptyItem() {
  return {
    image: null, imagePreview: null, imageUrl: null,
    productId: '', size: '', quantity: 1,
    customName: '', customNumber: '', hasCustom: false,
    addons: [],
    patchCount: 1, patchPosition: 'left',
    patchImage: null, patchPreview: null, patchUrl: null,
    customPrice: '',   // 其他商品自定义价格
    customNote: '',    // 其他商品备注
  }
}

function emptyCustomer() {
  return { name: '', email: '', phone: '', country: '', region: '', city: '', street: '', postalCode: '', note: '' }
}

// ======== 语言选择器 ========
function LangSelector({ onSelect }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      <div className="text-5xl mb-2">⚽</div>
      <h1 className="text-3xl font-bold mb-1">Jersey Order</h1>
      <p className="text-gray-400 text-sm mb-10">球衣及足球周边订购平台</p>
      <h2 className="text-lg font-semibold mb-6 text-gray-700">
        选择语言 / Select Language / Seleccionar Idioma / Selecionar Idioma
      </h2>
      <div className="grid grid-cols-2 gap-4 w-72">
        {[
          { code: 'zh', label: '中文', flag: '🇨🇳' },
          { code: 'en', label: 'English', flag: '🇬🇧' },
          { code: 'es', label: 'Español', flag: '🇪🇸' },
          { code: 'pt', label: 'Português', flag: '🇵🇹' },
        ].map(lang => (
          <button key={lang.code} onClick={() => onSelect(lang.code)}
            className="flex flex-col items-center gap-1 p-5 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition border-gray-200"
          >
            <span className="text-3xl">{lang.flag}</span>
            <span className="font-medium text-gray-800">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LangSwitcher({ langIndex, onSwitch }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const u = localStorage.getItem('jersey_user')
      if (u) setUser(JSON.parse(u))
    } catch {}
  }, [])

  const logout = () => {
    localStorage.removeItem('jersey_token')
    localStorage.removeItem('jersey_user')
    setUser(null)
  }

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {user ? (
          <span className="text-xs text-gray-500">
            {user.name} · <a href="/my-orders" className="text-blue-600 hover:underline">我的订单</a> · <button onClick={logout} className="text-gray-400 hover:text-gray-600">退出</button>
          </span>
        ) : (
          <a href="/login" className="text-xs text-blue-600 hover:underline">登录 / 注册</a>
        )}
      </div>
      <div className="flex gap-1">
        {LANG_CODES.map((code, i) => (
          <button key={code} onClick={() => onSwitch(code)}
            className={`text-xs px-2 py-0.5 rounded ${i === langIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
          >{LANG_NAMES[i]}</button>
        ))}
      </div>
    </div>
  )
}

// ======== 主页面 ========
export default function OrderPage() {
  const { langIndex, changeLang, mounted } = useLang()
  const t = useCallback((key, p) => getText(key, langIndex, p), [langIndex])
  const styleLabel = useCallback((id) => getStyleLabel(id, langIndex), [langIndex])

  const [cart, setCart] = useState([])
  const [current, setCurrent] = useState(emptyItem())
  const [customer, setCustomer] = useState(emptyCustomer())
  const [submitted, setSubmitted] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  // 付款截图上传
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState(null)
  const [proofUploading, setProofUploading] = useState(false)
  const [proofUploaded, setProofUploaded] = useState(false)

  // 当前选中商品
  const curProduct = getProduct(current.productId)
  const curChartId = curProduct?.chartId
  const curSizeOpts = curProduct ? getSizeOptions(curChartId) : []
  // 当前选中附加项的总价（不含补丁，补丁单独按数量算）
  const curAddonCost = (current.addons || []).reduce((sum, aid) => {
    if (aid === 'patch') return sum
    const a = ADDONS[aid]; return sum + (a ? a.price : 0)
  }, 0)
  const curCustomCost = current.hasCustom ? CUSTOM_PRICE : 0
  const curSizeSurcharge = curProduct && curProduct.chartId ? calcSizeSurcharge(current.size, curProduct.chartId) : 0
  const curPatchCost = (current.addons || []).includes('patch') ? calcPatchPrice(current.patchCount || 1) : 0
  const curUnitPrice = curProduct
    ? (curProduct.id === 'other' ? (parseFloat(current.customPrice) || 0)
      : curProduct.price + curSizeSurcharge + curAddonCost + curPatchCost + curCustomCost)
    : 0
  const curSubtotal = curUnitPrice * current.quantity

  // 购物车统计
  const cartSubtotal = cart.reduce((sum, item) => {
    const prod = getProduct(item.productId)
    if (!prod) return sum
    if (prod.id === 'other') {
      return sum + (parseFloat(item.customPrice) || 0) * item.quantity
    }
    let up = prod.price
    up += calcSizeSurcharge(item.size, prod.chartId)
    for (const aid of (item.addons || [])) {
      if (aid === 'patch') up += calcPatchPrice(item.patchCount || 1)
      else { const a = ADDONS[aid]; if (a) up += a.price }
    }
    if (item.hasCustom) up += CUSTOM_PRICE
    return sum + up * item.quantity
  }, 0)
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = calcShipping(totalQuantity)
  const grandTotal = cartSubtotal + shipping

  // ---- 图片处理 ----
  const handleImage = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError(t('error_image_size')); return }
    setError('')
    const reader = new FileReader()
    reader.onload = (ev) => setCurrent(p => ({ ...p, image: file, imagePreview: ev.target.result }))
    reader.readAsDataURL(file)
  }, [t])

  const handlePatchImage = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError(t('error_image_size')); return }
    setError('')
    const reader = new FileReader()
    reader.onload = (ev) => setCurrent(p => ({ ...p, patchImage: file, patchPreview: ev.target.result }))
    reader.readAsDataURL(file)
  }, [t])

  // ---- 附加项切换 ----
  const toggleAddon = (addonId) => {
    setCurrent(p => {
      const has = p.addons.includes(addonId)
      const addons = has ? p.addons.filter(a => a !== addonId) : [...p.addons, addonId]
      if (addonId === 'patch') {
        if (has) return { ...p, addons, patchImage: null, patchPreview: null, patchUrl: null }
        return { ...p, addons, patchCount: 1, patchPosition: 'left' }
      }
      return { ...p, addons }
    })
  }

  // ---- 加入购物车 ----
  const addToCart = () => {
    if (!current.productId) { setError(t('error_select_product')); return }
    if (curChartId && !current.size) { setError(t('error_select_size')); return }
    if (!current.imagePreview) { setError(t('error_upload_image')); return }
    setError('')
    setCart(prev => [...prev, { ...current }])
    setCurrent(emptyItem())
  }

  const removeItem = (idx) => setCart(prev => prev.filter((_, i) => i !== idx))

  // ---- 选择语言 ----
  if (!mounted) return null
  if (langIndex < 0) return <LangSelector onSelect={changeLang} />

  // ---- 提交订单 ----
  const submitOrder = async () => {
    if (cart.length === 0) { setError(t('error_cart_empty')); return }
    if (!customer.name.trim()) { setError(t('error_name_required')); return }
    if (!customer.email.trim() || !customer.email.includes('@')) { setError(t('error_email_invalid')); return }
    if (!customer.country.trim()) { setError(t('error_country_required')); return }
    if (!customer.city.trim()) { setError(t('error_city_required')); return }
    if (!customer.street.trim()) { setError(t('error_street_required')); return }
    if (!customer.postalCode.trim()) { setError(t('error_postal_required')); return }
    setError('')
    setSubmitting(true)

    try {
      const items = await Promise.all(cart.map(async (item) => {
        const prod = getProduct(item.productId)
        // 上传商品图片
        let imageUrl = ''
        if (item.image) {
          const fd = new FormData(); fd.append('image', item.image)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (data.url) imageUrl = data.url
        }
        // 上传补丁图片
        let patchUrl = ''
        if (item.patchImage) {
          const fd = new FormData(); fd.append('image', item.patchImage)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (data.url) patchUrl = data.url
        }
        let up = prod ? prod.price : 0
        if (prod?.id === 'other') {
          up = parseFloat(item.customPrice) || 0
        } else {
          up += calcSizeSurcharge(item.size, prod?.chartId)
          for (const aid of (item.addons || [])) {
            if (aid === 'patch') up += calcPatchPrice(item.patchCount || 1)
            else { const a = ADDONS[aid]; if (a) up += a.price }
          }
          if (item.hasCustom) up += CUSTOM_PRICE
        }
        return {
          image_url: imageUrl,
          product_id: item.productId,
          product_name: prod ? styleLabel(item.productId) : '',
          size: item.size,
          quantity: item.quantity,
          custom_name: item.customName,
          custom_number: item.customNumber,
          has_custom: item.hasCustom,
          addons: item.addons || [],
          patch_count: item.patchCount || 1,
          patch_position: item.patchPosition || 'left',
          patch_url: patchUrl,
          custom_price: item.customPrice || '',
          custom_note: item.customNote || '',
          unit_price: up,
          subtotal: up * item.quantity,
        }
      }))

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_country: customer.country,
          customer_region: customer.region,
          customer_city: customer.city,
          customer_address: customer.street,
          customer_postal_code: customer.postalCode,
          user_id: (() => { try { const u = JSON.parse(localStorage.getItem('jersey_user') || '{}'); return u.id || '' } catch { return '' } })(),
          note: customer.note,
          items,
          subtotal: cartSubtotal,
          shipping,
          total_amount: grandTotal,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setSubmitted({ id: result.order_id, total: grandTotal })
      } else {
        setError(result.error || t('error_submit'))
      }
    } catch (_) { setError(t('error_network')) }
    setSubmitting(false)
  }

  // ---- 付款截图上传 ----
  const uploadProof = async () => {
    if (!proofFile) return
    setProofUploading(true)
    try {
      const fd = new FormData(); fd.append('image', proofFile)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        // 保存截图URL到订单
        await fetch('/api/order', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: submitted.id, payment_screenshot: data.url }),
        })
        setProofUploaded(true)
      }
    } catch (_) {}
    setProofUploading(false)
  }

  const handleProofImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = (ev) => { setProofFile(file); setProofPreview(ev.target.result) }
    reader.readAsDataURL(file)
  }

  // ---- 提交成功页 ----
  if (submitted) {
    const copyId = () => navigator.clipboard.writeText(submitted.id)
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">{t('order_success')}</h1>
        <p className="text-gray-500 mb-6">{t('thanks_message')}</p>
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 text-left">
          <div className="mb-4">
            <span className="text-sm text-gray-400">{t('order_id')}</span>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">{submitted.id}</code>
              <button onClick={copyId} className="text-sm text-blue-600 hover:text-blue-800 shrink-0">{t('copy')}</button>
            </div>
          </div>
          <div className="border-t pt-4">
            <span className="text-sm text-gray-400">{t('payment_amount')}</span>
            <div className="text-3xl font-bold mt-1">{submitted.total.toFixed(2)} €</div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-2xl shrink-0">⚠️</span>
                <div>
                  <p className="text-sm font-bold text-red-700 mb-1">{t('paypal_instruction')}</p>
                  <div className="text-base font-bold text-red-800 bg-white rounded-lg px-3 py-2 border border-red-200 inline-block mb-2">
                    {PAYPAL_EMAIL}
                  </div>
                  <p className="text-sm text-red-600 font-semibold leading-relaxed">{t('paypal_note')}</p>
                </div>
              </div>
            </div>
          </div>
          {/* 付款截图上传 */}
          <div className="border-t pt-4 mt-4">
            {proofUploaded ? (
              <div className="text-center py-4">
                <span className="text-green-600 font-medium">✅ {t('upload_success')}</span>
              </div>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-700">{t('upload_payment_proof')}</span>
                <p className="text-xs text-gray-400 mt-1 mb-3">{t('upload_payment_hint')}</p>
                <div className="flex items-center gap-3">
                  {proofPreview ? (
                    <img src={proofPreview} alt="proof" className="h-16 w-16 object-cover rounded border" />
                  ) : (
                    <div onClick={() => document.getElementById('proofInput').click()}
                      className="border-2 border-dashed rounded-lg px-4 py-3 text-xs text-gray-400 cursor-pointer hover:bg-gray-50">
                      点击选择截图
                    </div>
                  )}
                  <input id="proofInput" type="file" accept="image/*" className="hidden" onChange={handleProofImage} />
                  {proofPreview && !proofUploaded && (
                    <button onClick={uploadProof} disabled={proofUploading}
                      className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      {proofUploading ? '上传中...' : t('upload_payment_proof')}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <button onClick={() => { setSubmitted(null); setCart([]); setCustomer(emptyCustomer()); setProofFile(null); setProofPreview(null); setProofUploaded(false) }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{t('continue_ordering')}</button>
      </div>
    )
  }

  // ---- 尺码指南弹窗 ----
  if (showSizeGuide && curChartId) {
    const chart = SIZE_CHARTS[curChartId]
    const close = () => setShowSizeGuide(false)
    if (chart) return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={close}>
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t(chart.titleKey)}</h2>
            <button onClick={close} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {chart.headers.map((h, i) => (<th key={i} className="border px-3 py-2 text-left whitespace-nowrap">{t(h)}</th>))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border px-3 py-2 font-medium">{row[0]}</td>
                    {row.slice(1).map((cell, ci) => (<td key={ci} className="border px-3 py-2">{cell}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={close} className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">{t('close')}</button>
        </div>
      </div>
    )
  }

  // ============ 主页面 ============
  return (
    <div className="space-y-8">
      <LangSwitcher langIndex={langIndex} onSwitch={changeLang} />
      <div className="text-center">
        <h1 className="text-3xl font-bold">Jersey Order</h1>
        <p className="text-gray-500">{t('site_subtitle')}</p>
      </div>

      {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>)}

      {/* ======== 添加商品 ======== */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">{t('add_product')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 图片上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_image')}</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition"
              onClick={() => document.getElementById('imageInput').click()}>
              {current.imagePreview ? (
                <img src={current.imagePreview} alt="preview" className="max-h-40 mx-auto rounded" />
              ) : (
                <div className="py-6 text-gray-400"><div className="text-3xl mb-1">📸</div><span className="text-sm">{t('click_to_upload')}</span></div>
              )}
              <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>
          </div>

          {/* 商品信息 */}
          <div className="space-y-3">
            {/* 商品选择：分类 + 商品 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('select_product')}</label>
              {/* 分类按钮 */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {CATEGORIES.map(cat => (
                  <button key={cat.id}
                    onClick={() => setCurrent(p => ({ ...p, productId: '', size: '' }))}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      current.productId && getProduct(current.productId)?.categoryKey === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >{t(cat.labelKey)}</button>
                ))}
              </div>
              {/* 商品按钮 */}
              {(() => {
                const selectedCat = current.productId ? getProduct(current.productId)?.categoryKey : null
                const catProducts = selectedCat ? getProductsByCategory(selectedCat) : []
                if (!selectedCat) {
                  // 没选分类时显示所有商品
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRODUCTS.map(p => (
                        <button key={p.id}
                          onClick={() => setCurrent(prev => ({ ...prev, productId: p.id, size: '' }))}
                          className={`border rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            current.productId === p.id
                              ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">{styleLabel(p.id)}</div>
                          <div className="text-blue-600 font-semibold mt-0.5">{p.price}€</div>
                        </button>
                      ))}
                    </div>
                  )
                }
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {getProductsByCategory(selectedCat).map(p => (
                      <button key={p.id}
                        onClick={() => setCurrent(prev => ({ ...prev, productId: p.id, size: '' }))}
                        className={`border rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          current.productId === p.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{styleLabel(p.id)}</div>
                        <div className="text-blue-600 font-semibold mt-0.5">{p.price}€</div>
                      </button>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* 其他商品：自定义价格 + 备注 */}
            {curProduct?.id === 'other' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格 € *</label>
                  <input type="number" step="0.01" min="0" value={current.customPrice}
                    onChange={e => setCurrent(p => ({ ...p, customPrice: e.target.value }))}
                    placeholder="输入商品价格"
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea value={current.customNote}
                    onChange={e => setCurrent(p => ({ ...p, customNote: e.target.value }))}
                    placeholder="填写规格、尺寸等说明"
                    rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
                </div>
              </>
            )}

            {/* 尺码 */}
            {curProduct && curChartId && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">{t('size')}</label>
                  <button onClick={() => setShowSizeGuide(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline">{t('size_guide')}</button>
                </div>
                <select value={current.size}
                  onChange={e => setCurrent(p => ({ ...p, size: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">{t('select_placeholder')}</option>
                  {curSizeOpts.map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            )}

            {/* 数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity')}</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrent(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                  className="w-8 h-8 rounded border text-lg leading-none hover:bg-gray-100">−</button>
                <span className="w-10 text-center font-medium">{current.quantity}</span>
                <button onClick={() => setCurrent(p => ({ ...p, quantity: Math.min(99, p.quantity + 1) }))}
                  className="w-8 h-8 rounded border text-lg leading-none hover:bg-gray-100">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* ====== 定制印字 ====== */}
        {curProduct?.allowCustom && (
          <div className="mt-4 border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={current.hasCustom}
                onChange={e => setCurrent(p => ({ ...p, hasCustom: e.target.checked, customName: '', customNumber: '' }))}
                className="w-4 h-4" />
              <span className="text-sm font-medium">{t('custom_service')}<span className="text-orange-500"> +{CUSTOM_PRICE}€</span></span>
            </label>
            {current.hasCustom && (
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">{t('custom_name')}</label>
                  <input type="text" value={current.customName} maxLength={20}
                    onChange={e => setCurrent(p => ({ ...p, customName: e.target.value.toUpperCase() }))}
                    placeholder={t('custom_name_placeholder')}
                    className="w-full border rounded-lg px-3 py-2 text-sm uppercase" />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-500 mb-1">{t('custom_number')}</label>
                  <input type="text" value={current.customNumber} maxLength={2}
                    onChange={e => setCurrent(p => ({ ...p, customNumber: e.target.value.replace(/\D/g, '') }))}
                    placeholder="10" className="w-full border rounded-lg px-3 py-2 text-sm text-center" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====== 附加选项 ====== */}
        {curProduct && curProduct.addonIds?.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <span className="text-sm font-medium">{t('addon_title')}</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {curProduct.addonIds.map(aid => {
                const a = ADDONS[aid]
                if (!a) return null
                const checked = current.addons.includes(aid)
                return (
                  <label key={aid} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={checked}
                      onChange={() => toggleAddon(aid)} className="w-4 h-4" />
                    <span>{t(a.labelKey)}<span className="text-orange-500"> +{a.price}€</span></span>
                  </label>
                )
              })}
            </div>
            {/* 补丁数量 + 位置 + 上传 */}
            {current.addons.includes('patch') && (
              <div className="mt-3 space-y-3 bg-gray-50 rounded-lg p-3">
                {/* 数量选择 */}
                <div>
                  <span className="text-xs font-medium text-gray-600 mr-3">数量：</span>
                  <label className="inline-flex items-center gap-1 mr-4 text-sm cursor-pointer">
                    <input type="radio" name="patchCount" checked={current.patchCount === 1}
                      onChange={() => setCurrent(p => ({ ...p, patchCount: 1, patchPosition: p.patchPosition === 'both' ? 'left' : p.patchPosition }))}
                      className="w-3.5 h-3.5" />
                    <span>1 个补丁 (1€)</span>
                  </label>
                  <label className="inline-flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="patchCount" checked={current.patchCount === 2}
                      onChange={() => setCurrent(p => ({ ...p, patchCount: 2, patchPosition: 'both' }))}
                      className="w-3.5 h-3.5" />
                    <span>2 个补丁 (2€)</span>
                  </label>
                </div>
                {/* 位置选择 */}
                <div>
                  <span className="text-xs font-medium text-gray-600 mr-3">位置：</span>
                  {current.patchCount === 1 ? (
                    <>
                      <label className="inline-flex items-center gap-1 mr-4 text-sm cursor-pointer">
                        <input type="radio" name="patchPos" checked={current.patchPosition === 'left'}
                          onChange={() => setCurrent(p => ({ ...p, patchPosition: 'left' }))}
                          className="w-3.5 h-3.5" />
                        <span>左袖</span>
                      </label>
                      <label className="inline-flex items-center gap-1 text-sm cursor-pointer">
                        <input type="radio" name="patchPos" checked={current.patchPosition === 'right'}
                          onChange={() => setCurrent(p => ({ ...p, patchPosition: 'right' }))}
                          className="w-3.5 h-3.5" />
                        <span>右袖</span>
                      </label>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">左袖 + 右袖</span>
                  )}
                </div>
                {/* 上传补丁图片 */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('addon_patch_upload')}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => document.getElementById('patchInput').click()}
                      className="border border-dashed rounded-lg px-4 py-2 text-xs text-gray-500 hover:bg-gray-50">
                      {current.patchPreview ? '✅ ' + t('addon_patch_upload') : '📎 ' + t('addon_patch_upload')}
                    </button>
                    {current.patchPreview && (
                      <img src={current.patchPreview} alt="patch" className="h-10 w-10 object-cover rounded border" />
                    )}
                    <input id="patchInput" type="file" accept="image/*" className="hidden" onChange={handlePatchImage} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 实时价格 */}
        {curProduct && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('unit_price')}：{curUnitPrice.toFixed(2)}€ × {current.quantity}</span>
            <span className="text-xl font-bold">{curSubtotal.toFixed(2)}€</span>
          </div>
        )}

        <button onClick={addToCart}
          className="mt-4 w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition">{t('add_to_cart')}</button>

        {/* 商品图片参考入口 */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <a href="/sourcing" className="text-sm text-blue-700 hover:text-blue-900 font-medium">
            {t('src_tip')}
          </a>
        </div>
      </section>

      {/* ======== 购物清单 ======== */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">{t('cart_title')} ({cart.length})</h2>
        {cart.length === 0 ? (
          <p className="text-gray-400 text-center py-8">{t('cart_empty')}</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item, idx) => {
              const prod = getProduct(item.productId)
              let up = 0
              if (prod?.id === 'other') {
                up = parseFloat(item.customPrice) || 0
              } else {
                up = prod ? prod.price : 0
                up += calcSizeSurcharge(item.size, prod?.chartId)
                for (const aid of (item.addons || [])) {
                  if (aid === 'patch') up += calcPatchPrice(item.patchCount || 1)
                  else { const a = ADDONS[aid]; if (a) up += a.price }
                }
                if (item.hasCustom) up += CUSTOM_PRICE
              }
              const st = up * item.quantity
              const sl = prod ? styleLabel(item.productId) : ''
              const addonLabels = (item.addons || []).map(aid => {
                if (aid === 'patch') {
                  const pos = item.patchPosition === 'both' ? '左+右' : (item.patchPosition === 'left' ? '左袖' : '右袖')
                  return `${item.patchCount || 1}补丁(${pos})`
                }
                const a = ADDONS[aid]; return a ? t(a.labelKey) : aid
              }).join(' + ')
              const otherNote = item.customNote ? `📝 ${item.customNote}` : ''
              return (
                <div key={idx} className="flex gap-3 items-center border rounded-lg p-3">
                  {item.imagePreview && <img src={item.imagePreview} alt="" className="w-16 h-16 object-cover rounded" />}
                  <div className="flex-1 min-w-0 text-sm">
                    <div className="font-medium truncate">{sl}</div>
                    <div className="text-gray-500">
                      {item.size && `${item.size} / `}×{item.quantity}
                      {item.hasCustom && ` / ${item.customName || '?'} #${item.customNumber || '?'}`}
                      {addonLabels && ` / ${addonLabels}`}
                      {otherNote && <div className="text-gray-400 text-xs mt-0.5">{otherNote}</div>}
                    </div>
                    <div className="font-semibold">{st.toFixed(2)}€</div>
                  </div>
                  <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ======== 客户信息 ======== */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">{t('customer_info')}</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
              <input type="text" value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
                placeholder="John Smith" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <input type="email" value={customer.email} onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))}
                placeholder="john@example.com" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
            <input type="text" value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
              placeholder="+34 612 345 678" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('country')}</label>
              <input type="text" value={customer.country} onChange={e => setCustomer(p => ({ ...p, country: e.target.value }))}
                placeholder="Spain" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('region')}</label>
              <input type="text" value={customer.region} onChange={e => setCustomer(p => ({ ...p, region: e.target.value }))}
                placeholder="Madrid" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
              <input type="text" value={customer.city} onChange={e => setCustomer(p => ({ ...p, city: e.target.value }))}
                placeholder="Madrid" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('postal_code')}</label>
              <input type="text" value={customer.postalCode} onChange={e => setCustomer(p => ({ ...p, postalCode: e.target.value }))}
                placeholder="28001" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('street')}</label>
            <input type="text" value={customer.street} onChange={e => setCustomer(p => ({ ...p, street: e.target.value }))}
              placeholder={t('street_placeholder')} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('note')}</label>
            <textarea value={customer.note} onChange={e => setCustomer(p => ({ ...p, note: e.target.value }))}
              rows={2} placeholder={t('note_placeholder')}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
        </div>

        {/* 价格汇总 */}
        <div className="mt-6 border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>{t('order_total')}</span><span>{cartSubtotal.toFixed(2)}€</span></div>
          <div className="flex justify-between text-gray-500">
            <span>
              {totalQuantity >= SHIPPING_THRESHOLD
                ? t('shipping_free')
                : t('shipping_fee', { n: String(SHIPPING_THRESHOLD), fee: String(SHIPPING_FEE) })}
            </span>
            <span>{shipping === 0 ? '0.00€' : `${shipping.toFixed(2)}€`}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>{t('grand_total')}</span><span>{grandTotal.toFixed(2)}€</span>
          </div>
        </div>

        <button onClick={submitOrder} disabled={submitting}
          className="mt-4 w-full bg-green-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-green-700 disabled:opacity-50 transition">
          {submitting ? t('submitting') : t('submit_order')}</button>
      </section>

      <div className="text-center text-xs text-gray-400 pb-8">{t('we_accept_paypal')}</div>
    </div>
  )
}
