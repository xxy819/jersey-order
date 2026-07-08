import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      return NextResponse.json({ success: false, error: '未上传文件' }, { status: 400 })
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: '仅支持 JPG/PNG/WebP 格式' }, { status: 400 })
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: '文件不能超过 5MB' }, { status: 400 })
    }

    // 生成唯一文件名
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    const filePath = `orders/${fileName}`

    let supabase
    try {
      supabase = getSupabase()
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ success: false, error: '图片上传失败: ' + error.message }, { status: 500 })
    }

    // 获取公共 URL — 改为返回代理路径
    // 使用代理路径存储，通过 /api/image 代理访问
    const proxyPath = filePath

    return NextResponse.json({ success: true, url: `/api/image?path=${encodeURIComponent(proxyPath)}` })
  } catch (err) {
    console.error('POST /api/upload error:', err)
    return NextResponse.json({ success: false, error: '服务器内部错误' }, { status: 500 })
  }
}
