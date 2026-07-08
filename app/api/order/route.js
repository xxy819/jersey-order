import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { ADMIN_PASSWORD } from '@/lib/config'

// POST /api/order — 创建订单
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.customer_name?.trim()) {
      return NextResponse.json({ success: false, error: '姓名不能为空' }, { status: 400 })
    }
    if (!body.customer_email?.trim() || !body.customer_email.includes('@')) {
      return NextResponse.json({ success: false, error: '有效邮箱不能为空' }, { status: 400 })
    }
    if (!body.customer_country?.trim()) {
      return NextResponse.json({ success: false, error: '国家不能为空' }, { status: 400 })
    }
    if (!body.customer_city?.trim()) {
      return NextResponse.json({ success: false, error: '城市不能为空' }, { status: 400 })
    }
    if (!body.customer_address?.trim()) {
      return NextResponse.json({ success: false, error: '街道地址不能为空' }, { status: 400 })
    }
    if (!body.customer_postal_code?.trim()) {
      return NextResponse.json({ success: false, error: '邮政编码不能为空' }, { status: 400 })
    }
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: '至少需要一件商品' }, { status: 400 })
    }

    let supabase
    try {
      supabase = getSupabase()
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customer_name.trim(),
        customer_email: body.customer_email.trim(),
        customer_phone: body.customer_phone || '',
        customer_country: body.customer_country.trim(),
        customer_region: body.customer_region?.trim() || '',
        customer_city: body.customer_city.trim(),
        customer_address: body.customer_address.trim(),
        customer_postal_code: body.customer_postal_code.trim(),
        items: body.items,
        subtotal: body.subtotal || 0,
        shipping: body.shipping || 0,
        total_amount: body.total_amount || 0,
        note: body.note || '',
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ success: false, error: '数据库写入失败: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order_id: data.id })
  } catch (err) {
    console.error('POST /api/order error:', err)
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}

// PATCH /api/order — 更新订单（如付款截图）
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { order_id, payment_screenshot } = body

    if (!order_id || !payment_screenshot) {
      return NextResponse.json({ success: false, error: '参数不完整' }, { status: 400 })
    }

    let supabase
    try { supabase = getSupabase() } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }

    const { error } = await supabase
      .from('orders')
      .update({ payment_screenshot })
      .eq('id', order_id)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ success: false, error: '更新失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/order error:', err)
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}

// GET /api/order — 查询订单列表（需要验证）
export async function GET(request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')

  if (token !== ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: '未授权' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const search = searchParams.get('search') || ''
  const from = (page - 1) * limit
  const to = from + limit - 1

  try {
    let supabase
    try {
      supabase = getSupabase()
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }

    let query = supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false })

    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`
      )
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ success: false, error: '查询失败: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, orders: data, total: count, page })
  } catch (err) {
    console.error('GET /api/order error:', err)
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}
