# Image Proxy API Route

When Supabase Storage public URLs don't work (returns 400 "Bucket not found"), use this proxy approach instead.

## The Problem

`supabase.storage.from('bucket').getPublicUrl(path)` returns a URL that doesn't work for some Supabase projects, even when the bucket is set to public.

## The Solution

Create a Next.js API route that acts as a proxy, downloading the image server-side and serving it to the client.

## Implementation

`app/api/image/route.js`:

```javascript
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
    // Sanitize to prevent directory traversal
    const safePath = path.replace(/\.\.\//g, '').replace(/\.\.\\/g, '')
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .download(safePath)

    if (error || !data) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const ext = safePath.split('.').pop()?.toLowerCase()
    const mimeTypes = {
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
      webp: 'image/webp', gif: 'image/gif'
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    return new NextResponse('Server error', { status: 500 })
  }
}
```

## Upload API Modification

When returning the URL after upload, use the proxy path instead of the public URL:

```javascript
// Instead of:
// const { data: { publicUrl } } = supabase.storage.from('bucket').getPublicUrl(filePath)
// return { url: publicUrl }

// Use:
const proxyPath = filePath
return { url: `/api/image?path=${encodeURIComponent(proxyPath)}` }
```

## Stored URL Format

Images stored in order items use this path format:
`/api/image?path=orders/filename.png`

This works both in `<img src="...">` tags and when accessed directly in a browser.
