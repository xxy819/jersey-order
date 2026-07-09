'use client'

import { useState, useEffect } from 'react'
import { VALID_CODES } from '@/lib/config'
import { useLang } from '@/lib/LangContext'
import { getText, LANG_CODES, LANG_NAMES } from '@/lib/locales'

export default function LoginPage() {
  const { langIndex, changeLang, mounted } = useLang()
  const t = (key, p) => getText(key, langIndex, p)

  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // 检查是否已有邀请码
  useEffect(() => {
    const saved = localStorage.getItem('invite_code')
    if (saved) setInviteCode(saved)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 验证邀请码
    const code = inviteCode.trim()
    if (!code || !VALID_CODES.includes(code)) {
      setError('邀请码无效，请输入 198888 或 196666')
      return
    }

    setLoading(true)

    try {
      const endpoint = '/api/auth'
      const method = mode === 'login' ? 'PUT' : 'POST'
      const body = mode === 'login'
        ? { phone: phone.trim(), password }
        : { name: name.trim(), phone: phone.trim(), password }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (data.success) {
        // 保存邀请码和登录信息
        localStorage.setItem('invite_code', code)
        localStorage.setItem('jersey_token', data.token)
        localStorage.setItem('jersey_user', JSON.stringify(data.user))
        window.location.href = '/'
      } else {
        setError(data.error || '操作失败')
      }
    } catch (_) {
      setError('网络错误')
    }
    setLoading(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Language switcher */}
      <div className="flex gap-1 justify-end mb-4 w-full max-w-sm">
        {LANG_CODES.map((code, i) => (
          <button key={code} onClick={() => changeLang(code)}
            className={`text-xs px-2 py-0.5 rounded ${i === langIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
          >{LANG_NAMES[i]}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Jersey Order</h1>
          <p className="text-sm text-gray-500">{t('site_subtitle')}</p>
        </div>

        <h2 className="text-lg font-semibold text-center mb-4">
          {mode === 'login' ? '登录' : '注册'}
        </h2>

        {success && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 text-center">
            注册成功，请登录
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 邀请码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邀请码 *<span className="text-xs text-gray-400 ml-1">（198888 或 196666）</span>
            </label>
            <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)}
              placeholder="请联系客服获取邀请码" required maxLength={6}
              className="w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest" />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="你的昵称" required
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="手机号码" required
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="密码（至少4位）" required minLength={4}
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <>没有账号？<button onClick={() => { setMode('register'); setError('') }} className="text-blue-600 underline">注册</button></>
          ) : (
            <>已有账号？<button onClick={() => { setMode('login'); setError('') }} className="text-blue-600 underline">登录</button></>
          )}
        </div>
      </div>
    </div>
  )
}
