import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) {
    return new NextResponse('Missing path', { status: 400 })
  }

  try {
    const supabase = getSupabase()

    // Sanitize path to prevent directory traversal
    const safePath = path.replace(/\.\.\//g, '').replace(/\.\.\\/g, '')

    const { data, error } = await supabase.storage
      .from('product-images')
      .download(safePath)

    if (error || !data) {
      console.error('Image download error:', error)
      return new NextResponse('Image not found', { status: 404 })
    }

    // Determine content type
    const ext = safePath.split('.').pop()?.toLowerCase()
    const mimeTypes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('Image proxy error:', err)
    return new NextResponse('Server error', { status: 500 })
  }
}
