import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import crypto from 'crypto'

const SECRET = process.env.ADMIN_PASSWORD || 'admin123'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SECRET).digest('hex')
}

function createToken(userId) {
  const payload = `${userId}|${Date.now()}|${SECRET}`
  return Buffer.from(payload).toString('base64')
}

function verifyToken(token) {
  try {
    const payload = Buffer.from(token, 'base64').toString()
    const parts = payload.split('|')
    if (parts.length !== 3) return null
    const [userId, ts, secret] = parts
    if (secret !== SECRET) return null
    // Token valid for 30 days
    if (Date.now() - parseInt(ts) > 30 * 24 * 60 * 60 * 1000) return null
    return userId
  } catch { return null }
}

export { hashPassword, createToken, verifyToken }

// POST /api/auth/register
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, phone, password } = body

    if (!name?.trim() || !phone?.trim() || !password?.trim()) {
      return NextResponse.json({ success: false, error: '请填写完整信息' }, { status: 400 })
    }
    if (phone.length < 5) {
      return NextResponse.json({ success: false, error: '手机号格式不正确' }, { status: 400 })
    }
    if (password.length < 4) {
      return NextResponse.json({ success: false, error: '密码至少4位' }, { status: 400 })
    }

    let supabase
    try { supabase = getSupabase() } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }

    // Check if phone already exists
    const { data: existing } = await supabase
      .from('users').select('id').eq('phone', phone.trim()).maybeSingle()

    if (existing) {
      return NextResponse.json({ success: false, error: '该手机号已注册' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ name: name.trim(), phone: phone.trim(), password_hash: hashPassword(password) })
      .select('id, name, phone')
      .single()

    if (error) {
      console.error('Register error:', error)
      return NextResponse.json({ success: false, error: '注册失败' }, { status: 500 })
    }

    const token = createToken(data.id)

    return NextResponse.json({
      success: true,
      token,
      user: { id: data.id, name: data.name, phone: data.phone }
    })
  } catch (err) {
    console.error('POST /api/auth error:', err)
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}

// GET /api/auth/me — 验证 token 获取用户信息
export async function GET(request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  const userId = verifyToken(token)

  if (!userId) {
    return NextResponse.json({ success: false, error: '未登录或登录已过期' }, { status: 401 })
  }

  try {
    let supabase
    try { supabase = getSupabase() } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('users').select('id, name, phone').eq('id', userId).single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (err) {
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}

// PUT /api/auth/login
export async function PUT(request) {
  try {
    const body = await request.json()
    const { phone, password } = body

    if (!phone?.trim() || !password?.trim()) {
      return NextResponse.json({ success: false, error: '请填写手机号和密码' }, { status: 400 })
    }

    let supabase
    try { supabase = getSupabase() } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('users').select('*').eq('phone', phone.trim()).single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: '账号未注册' }, { status: 400 })
    }

    if (data.password_hash !== hashPassword(password)) {
      return NextResponse.json({ success: false, error: '密码错误' }, { status: 401 })
    }

    const token = createToken(data.id)

    return NextResponse.json({
      success: true,
      token,
      user: { id: data.id, name: data.name, phone: data.phone }
    })
  } catch (err) {
    console.error('PUT /api/auth error:', err)
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}
