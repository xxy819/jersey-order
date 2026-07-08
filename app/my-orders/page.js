'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/lib/LangContext'
import { getText, LANG_CODES, LANG_NAMES } from '@/lib/locales'

export default function MyOrdersPage() {
  const { langIndex, changeLang, mounted } = useLang()
  const t = (key, p) => getText(key, langIndex, p)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('jersey_user') || '{}')
      if (!u.id) {
        window.location.href = '/login'
        return
      }
      setUser(u)
      fetchOrders(u.id)
    } catch { window.location.href = '/login' }
  }, [])

  const fetchOrders = async (userId) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/order?user_id=${userId}&limit=50`)
      const data = await res.json()
      if (data.success) setOrders(data.orders || [])
      else setError(data.error || '加载失败')
    } catch { setError('网络错误') }
    setLoading(false)
  }

  const statusText = (s) => {
    switch(s) {
      case 'pending': return '待付款'
      case 'paid': return '已付款'
      case 'shipped': return '已发货'
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">我的订单</h1>
          {user && <p className="text-sm text-gray-500">{user.name} · {user.phone}</p>}
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-blue-600 hover:underline">返回下单</a>
          <button onClick={() => {
            localStorage.removeItem('jersey_token')
            localStorage.removeItem('jersey_user')
            window.location.href = '/login'
          }} className="text-xs text-gray-400 hover:text-gray-600">退出</button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}

      {loading ? (
        <p className="text-center py-12 text-gray-400">加载中...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">暂无订单</p>
          <a href="/" className="text-blue-600 underline text-sm">去下单</a>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Summary */}
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString()} · {order.items?.length || 0} 件商品
                  </div>
                  <div className="text-sm mt-1">
                    {(order.items || []).map((item, i) => (
                      <span key={i} className="text-gray-600">
                        {item.product_name || item.style}{i < order.items.length - 1 ? '、' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{order.total_amount?.toFixed(2)}€</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusColor(order.status)}`}>{statusText(order.status)}</span>
                </div>
                <span className="text-gray-300">{expandedId === order.id ? '▲' : '▼'}</span>
              </div>

              {/* Expanded */}
              {expandedId === order.id && (
                <div className="border-t px-4 py-4 bg-gray-50 space-y-3">
                  {/* Items */}
                  <div className="space-y-2">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 text-sm flex gap-3 items-center">
                        {item.image_url && (
                          <a href={item.image_url} target="_blank" rel="noreferrer">
                            <img src={item.image_url} alt="" className="w-14 h-14 object-cover rounded border" />
                          </a>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.product_name || item.style}</div>
                          <div className="text-gray-500">
                            {item.size && `${item.size} / `}×{item.quantity}
                            {item.has_custom && ` / ${item.custom_name || '?'} #${item.custom_number || '?'}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div>{item.subtotal?.toFixed(2)}€</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fee */}
                  <div className="text-sm space-y-1 border-t pt-2">
                    <div className="flex justify-between"><span className="text-gray-400">商品小计</span><span>{order.subtotal?.toFixed(2)}€</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">运费</span><span>{order.shipping?.toFixed(2)}€</span></div>
                    <div className="flex justify-between font-bold"><span>总价</span><span>{order.total_amount?.toFixed(2)}€</span></div>
                  </div>

                  {/* Tracking */}
                  {order.tracking_number ? (
                    <div className="border-t pt-2">
                      <div className="text-sm">
                        <span className="text-gray-400">快递单号：</span>
                        <span className="font-mono">{order.tracking_number}</span>
                      </div>
                      <a href={`https://xxy819.github.io/track-website/?tracking=${encodeURIComponent(order.tracking_number)}`}
                        target="_blank" rel="noreferrer"
                        className="inline-block mt-1 text-sm text-blue-600 hover:underline"
                      >📦 查看物流</a>
                    </div>
                  ) : (
                    <div className="border-t pt-2 text-sm text-gray-400">
                      暂无物流信息
                    </div>
                  )}

                  <div className="text-xs text-gray-400 font-mono break-all">
                    订单编号：{order.id}
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
