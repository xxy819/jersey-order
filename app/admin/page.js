'use client'

import { useState, useEffect, useCallback } from 'react'
import { ADMIN_PASSWORD } from '@/lib/config'
import { getText, LANG_CODES, LANG_NAMES } from '@/lib/locales'
import { useLang } from '@/lib/LangContext'

function LangSwitcher({ langIndex, onSwitch }) {
  return (
    <div className="flex gap-1 justify-end mb-2">
      {LANG_CODES.map((code, i) => (
        <button key={code} onClick={() => onSwitch(code)}
          className={`text-xs px-2 py-0.5 rounded ${i === langIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
        >{LANG_NAMES[i]}</button>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const { langIndex, changeLang, mounted } = useLang()
  const t = useCallback((key, p) => getText(key, langIndex, p), [langIndex])

  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const fetchOrders = useCallback(async (searchTerm = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: '1', limit: '100' })
      if (searchTerm) params.set('search', searchTerm)
      const res = await fetch(`/api/order?${params}`, {
        headers: { Authorization: `Bearer ${password}` },
      })
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
        setTotal(data.total || 0)
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }, [password])

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true)
      fetchOrders()
    } else {
      alert(t('admin_wrong_password'))
    }
  }

  const handleSearch = (e) => { e.preventDefault(); fetchOrders(search) }

  const exportCSV = () => {
    const headers = [
      t('order_id'), t('admin_time'), t('name'), t('email'), t('phone'),
      t('country'), t('region'), t('city'), t('street'), t('postal_code'),
      t('admin_subtotal'), t('admin_shipping'), t('admin_grand_total'), t('admin_status'), t('note')
    ]
    // Simple key-based export for sorting
    const keyMap = {
      [t('order_id')]: 'id', [t('admin_time')]: 'created_at',
      [t('name')]: 'customer_name', [t('email')]: 'customer_email',
      [t('phone')]: 'customer_phone', [t('country')]: 'customer_country',
      [t('region')]: 'customer_region', [t('city')]: 'customer_city',
      [t('street')]: 'customer_address', [t('postal_code')]: 'customer_postal_code',
      [t('admin_subtotal')]: 'subtotal', [t('admin_shipping')]: 'shipping',
      [t('admin_grand_total')]: 'total_amount', [t('admin_status')]: 'status', [t('note')]: 'note',
    }
    const rows = [headers]
    orders.forEach(o => {
      rows.push(headers.map(h => {
        const key = keyMap[h] || h
        let val = o[key]
        if (key === 'created_at') val = o.created_at
        if (val === null || val === undefined) val = ''
        return String(val)
      }))
    })
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const statusText = (s) => {
    switch(s) {
      case 'pending': return t('status_pending')
      case 'paid': return t('status_paid')
      case 'shipped': return t('status_shipped')
      default: return s
    }
  }

  const statusColor = (s) => {
    switch(s) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'paid': return 'bg-green-100 text-green-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (!mounted) return null

  if (!loggedIn) {
    return (
      <div className="max-w-sm mx-auto py-24">
        <LangSwitcher langIndex={langIndex} onSwitch={changeLang} />
        <h1 className="text-xl font-bold text-center mb-6">{t('admin_login')}</h1>
        <input type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder={t('admin_password')}
          className="w-full border rounded-lg px-4 py-2 mb-4 text-center" />
        <button onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">{t('admin_login_btn')}</button>
      </div>
    )
  }

  return (
    <div>
      <LangSwitcher langIndex={langIndex} onSwitch={changeLang} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">{t('admin_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin_total_orders', { n: String(total) })}</p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('admin_search')}
              className="border rounded-lg px-3 py-1.5 text-sm w-40" />
            <button type="submit"
              className="bg-gray-200 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-300">{t('admin_search_btn')}</button>
          </form>
          <button onClick={exportCSV}
            className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700">{t('admin_export_csv')}</button>
          <button onClick={() => { setLoggedIn(false); setPassword('') }}
            className="text-sm text-gray-400 hover:text-gray-600 px-2">{t('admin_logout')}</button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-gray-400">{t('admin_loading')}</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-12 text-gray-400">{t('admin_no_orders')}</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium">{order.customer_name}</span>
                    <span className="text-gray-400 ml-2">{order.customer_email}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleString()} · {t('admin_items_count', { n: String(order.items?.length || 0) })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{order.total_amount?.toFixed(2)}€</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusColor(order.status)}`}>{statusText(order.status)}</span>
                </div>
                <span className="text-gray-300 text-lg">{expandedId === order.id ? '▲' : '▼'}</span>
              </div>

              {expandedId === order.id && (
                <div className="border-t px-4 py-4 bg-gray-50 space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-400">{t('label_phone')}</span>{order.customer_phone || '-'}</div>
                    <div><span className="text-gray-400">{t('label_country')}</span>{order.customer_country || '-'}</div>
                    <div><span className="text-gray-400">{t('label_region')}</span>{order.customer_region || '-'}</div>
                    <div><span className="text-gray-400">{t('label_city')}</span>{order.customer_city || '-'}</div>
                    <div className="col-span-2"><span className="text-gray-400">{t('label_street')}</span>{order.customer_address}</div>
                    <div><span className="text-gray-400">{t('label_postal')}</span>{order.customer_postal_code || '-'}</div>
                    {order.note && <div className="col-span-2"><span className="text-gray-400">{t('label_note')}</span>{order.note}</div>}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">{t('admin_order_detail')}</h3>
                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => {
                        // 兼容 addons 可能是字符串或数组
                        const addonArr = typeof item.addons === 'string' ? [item.addons] : (item.addons || [])
                        let addonDesc = addonArr.map(aid => {
                          if (aid === 'patch') {
                            const pos = item.patch_position === 'both' ? '左+右' : (item.patch_position === 'left' ? '左袖' : '右袖')
                            return `${item.patch_count || 1}补丁(${pos})`
                          }
                          return aid
                        }).join(' + ')
                        return (
                          <div key={idx} className="bg-white rounded-lg p-3 flex gap-3 items-center text-sm">
                            {item.image_url && (
                              <a href={item.image_url} target="_blank" rel="noreferrer">
                                <img src={item.image_url} alt="" className="w-14 h-14 object-cover rounded border" />
                              </a>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{item.product_name || item.style}</div>
                              <div className="text-gray-500">
                                {item.style && `${item.style} / `}{item.size && `${item.size} / `}×{item.quantity}
                              </div>
                              {item.has_custom && (
                                <div className="text-orange-600 text-xs">{t('custom_info', { name: item.custom_name || '?', number: item.custom_number || '?' })}</div>
                              )}
                              {addonDesc && (
                                <div className="text-blue-600 text-xs">{t('addons_label')}{addonDesc}</div>
                              )}
                              {item.patch_url && (
                                <div className="mt-1">
                                  <span className="text-xs text-gray-400">{t('patch_image_label')}</span>
                                  <a href={item.patch_url} target="_blank" rel="noreferrer">
                                    <img src={item.patch_url} alt="patch" className="inline h-8 w-8 object-cover rounded border" />
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div>{item.unit_price?.toFixed(2)}€</div>
                              <div className="text-gray-500">{t('subtotal')} {item.subtotal?.toFixed(2)}€</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="border-t pt-2 text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-gray-400">{t('admin_subtotal')}</span><span>{order.subtotal?.toFixed(2) || '0.00'}€</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">{t('shipping_label')}</span><span>{order.shipping?.toFixed(2) || '0.00'}€</span></div>
                    <div className="flex justify-between font-bold border-t pt-1"><span>{t('admin_grand_total')}</span><span>{order.total_amount?.toFixed(2)}€</span></div>
                  </div>

                  {order.payment_screenshot && (
                    <div>
                      <span className="text-sm font-semibold">{t('upload_payment_proof')}</span>
                      <div className="mt-1">
                        <a href={order.payment_screenshot} target="_blank" rel="noreferrer">
                          <img src={order.payment_screenshot} alt="payment screenshot" className="max-h-40 rounded border" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-400 font-mono break-all">
                    {t('order_id')}：{order.id}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
