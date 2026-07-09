# Next.js + Supabase Ordering Platform

Build a multi-lingual, multi-product ordering website with admin dashboard, customer auth, image upload, and order tracking, deployed free on Vercel + Supabase.

## When to Use This Skill

Use this when the user wants to build a "下单网站" (ordering/order-taking website) with:
- Product catalog with categories, sizes, add-ons, and custom pricing
- Shopping cart with real-time price calculation (including size surcharges, add-ons, shipping)
- File/image uploads
- Customer registration and login
- Admin dashboard to manage orders (confirm payment, add tracking numbers)
- Multi-language support (Chinese, English, Spanish, Portuguese)
- Deployment to Vercel (free tier)

Do NOT use this for: fully integrated payment gateways, complex inventory management, or platforms requiring PCI compliance.

## Architecture Overview

```
frontend (Next.js App Router) → API Routes → Supabase (PostgreSQL + Storage)
                      ↓
                Vercel (deployment)
```

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Free on Vercel, API routes + frontend in one project |
| Database | Supabase PostgreSQL | Free 500MB tier, JSONB for flexible item data |
| Storage | Supabase Storage | Free 1GB tier, image uploads |
| Auth | Custom (token-based) | Simple phone + password, no external provider needed |
| Styling | Tailwind CSS | Responsive by default, mobile-friendly |
| Deployment | Vercel (GitHub) | Free tier, auto-deploys on push |

### Project Structure

```
project/
├── app/
│   ├── page.js                # Public ordering page
│   ├── admin/page.js          # Admin order management
│   ├── login/page.js          # Customer login/register
│   ├── my-orders/page.js      # Customer order history
│   ├── layout.js              # Root layout with LangProvider
│   ├── globals.css            # Tailwind base styles
│   └── api/
│       ├── order/route.js     # POST (create), GET (query), PATCH (update)
│       ├── upload/route.js    # Image upload to Supabase Storage
│       ├── auth/route.js      # POST (register), PUT (login), GET (verify)
│       └── image/route.js     # Image proxy (serves from Supabase)
├── lib/
│   ├── config.js              # Product catalog, sizes, pricing, add-ons
│   ├── locales.js             # Multi-language translations (zh/en/es/pt)
│   ├── supabase.js            # Supabase client init
│   └── LangContext.js         # Language selection context
├── scripts/init.sql           # Database schema SQL
└── package.json               # next, react, @supabase/supabase-js, tailwindcss
```

## Setup Workflow

### Phase 1: Project Scaffolding

1. Create a Next.js project with Tailwind CSS
2. Set up the project structure (app/, lib/, scripts/, components/)
3. Create the database schema SQL (orders table with JSONB items, users table)

### Phase 2: Core Ordering Flow

Build these in order:

1. **Lib layer**: config.js (products, sizes, pricing), locales.js (4 languages), supabase.js
2. **Product selector**: Category buttons → Product cards (show name + price)
3. **Customization**: Size selector (dynamic per size chart), name/number printing, add-ons (patches with image upload, socks, hood)
4. **Shopping cart**: Add/remove items, real-time price calculation
5. **Customer form**: Name, email, phone, country, region, city, address, postal code, notes
6. **Shipping**: Free for 5+ items, flat fee otherwise
7. **Order submission**: Upload images → Create order in Supabase → Show success page with PayPal instructions + payment screenshot upload

### Phase 3: Admin Dashboard

1. Password-protected login (simple env var check)
2. Order list with search and expandable details
3. Action buttons: Confirm payment (status → "paid"), Add tracking number + save
4. Logistics link to external tracking site
5. CSV export

### Phase 4: Customer Features

1. Register/login with phone + password
2. "My Orders" page showing order history with tracking info
3. Order submission associates with logged-in user

### Phase 5: Deployment

1. Push to GitHub
2. Import to Vercel (auto-detects Next.js)
3. Configure environment variables in Vercel dashboard
4. Create Supabase tables via SQL Editor or management API

## Critical Database Schema

The `orders` table uses JSONB for flexible item storage:

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT DEFAULT '',
  customer_country TEXT DEFAULT '',
  customer_region TEXT DEFAULT '',
  customer_city TEXT DEFAULT '',
  customer_address TEXT NOT NULL,
  customer_postal_code TEXT DEFAULT '',
  items JSONB NOT NULL,  -- Array of item objects (see below)
  payment_screenshot TEXT DEFAULT '',
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  note TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  tracking_number TEXT DEFAULT '',
  user_id UUID DEFAULT NULL
);

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);
```

Each item in the `items` JSONB array follows this structure:

```json
{
  "image_url": "/api/image?path=orders/xxx.png",
  "product_id": "fan_shirt",
  "product_name": "Fan Shirt",
  "size": "L",
  "quantity": 2,
  "custom_name": "MESSI",
  "custom_number": "10",
  "has_custom": true,
  "addons": ["patch"],
  "patch_count": 2,
  "patch_position": "both",
  "patch_url": "/api/image?path=orders/patch.png",
  "custom_price": "",
  "custom_note": "",
  "unit_price": 8.0,
  "subtotal": 16.0
}
```

## Known Pitfalls & Fixes

### 1. Image Upload: RLS Policy Blocking

**Problem**: Supabase Storage returns "new row violates row-level security policy" when the anon key tries to upload.

**Fix**: Add RLS policies for the storage bucket:

```sql
CREATE POLICY "anon_upload" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "anon_select" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'product-images');
```

Or use the service_role key in server-side API routes.

### 2. Image Display: Public URL Returns 404/400

**Problem**: `supabase.storage.from('bucket').getPublicUrl(path)` returns a URL that gives "Bucket not found" or 400 errors. The bucket exists but public access may not work with new Supabase projects.

**Fix**: Instead of public URLs, create a proxy API endpoint (`app/api/image/route.js`) that:
1. Takes `?path=` parameter
2. Uses the Supabase client to `download()` the file
3. Returns it with proper Content-Type and Cache-Control headers

Store proxy URLs (`/api/image?path=orders/file.png`) instead of direct public URLs.

### 3. Addons Field Type Mismatch

**Problem**: When orders are created via PowerShell `Invoke-RestMethod`, the `addons` array gets serialized as a string `"patch"` instead of `["patch"]`. Calling `.map()` on a string crashes the admin page.

**Fix**: In the admin page, always normalize:
```js
const addonArr = typeof item.addons === 'string' ? [item.addons] : (item.addons || [])
```

### 4. PowerShell `&&` Not Supported

**Problem**: PowerShell uses `;` for command chaining, not `&&`. This causes errors when running multi-step git commands.

**Fix**: Use separate commands or semicolons:
```powershell
git add .; git commit -m "message"; git push
```

### 5. Vercel Environment Variable Timing

**Problem**: Adding env vars AFTER the first deployment doesn't trigger a redeploy. The site loads but crashes because the API routes can't connect to Supabase.

**Fix**: Either:
- Add env vars during the initial Vercel import flow, OR
- Push a new commit after adding env vars via the dashboard to trigger redeployment
- A simple empty commit works: `git commit --allow-empty -m "redeploy"`

### 6. Supabase API Key Rotation

**Problem**: The legacy anon key (`eyJhbGciOiJ...`) gets disabled during JWT secret rotation. The Supabase dashboard shows "JWT secret is being updated" and the old keys stop working.

**Fix**: Use the new key format. Check the API Keys page for:
- `sb_publishable_xxxx` (replaces anon key, safe for client)
- `sb_secret_xxxx` (replaces service_role key, server-side only)
Update `.env.local` with the publishable key.

## Price Calculation Logic

### Size Surcharge (Men's Sizes)

| Size | Surcharge |
|------|-----------|
| S, M, L, XL, 2XL | +0€ |
| 3XL | +1€ |
| 4XL | +2€ |
| 5XL | +3€ |
| 6XL | +4€ |

Implementation: `calcSizeSurcharge(size, chartId)` — only applies to `chartId === 'men'`.

### Add-on Pricing

- Patch: 1€ per patch (quantity can be 1 or 2)
- Socks: 3€
- Hood: 2€
- Custom print (name+number): 3€

### Shipping

- 5+ items: free
- Less than 5 items: flat 5€

### Final Unit Price Formula

```
unitPrice = baseProductPrice + sizeSurcharge + addonCosts + customPrintCost
```

## Multi-Language System

Use a flat key-value dictionary with 4-element arrays:

```js
const LOCALES = {
  site_title: ['球衣订购', 'Jersey Order', 'Pedido de Camisetas', 'Pedido de Camisetas'],
  add_product: ['添加商品', 'Add Product', 'Añadir Producto', 'Adicionar Produto'],
  // ... zh, en, es, pt
}
```

The `getText(key, langIndex, params)` function looks up the key and returns the language-appropriate text, with optional `{param}` substitution.

Language selection is stored in `localStorage` and a React context (`LangContext.js`).

## Admin Auth

Simple password-based auth using an environment variable:

```js
// In admin page
if (password === process.env.ADMIN_PASSWORD) { /* grant access */ }

// In API route
const token = request.headers.get('authorization')?.replace('Bearer ', '')
if (token !== ADMIN_PASSWORD) { return 401 }
```

No session or JWT needed for admin — the password is checked on each page load and each API request.

## Auth Flow (Customer)

1. **Register**: POST `/api/auth` with `{ name, phone, password }` → creates user in `users` table, returns token
2. **Login**: PUT `/api/auth` with `{ phone, password }` → verifies password hash, returns token
3. **Verify**: GET `/api/auth` with `Authorization: Bearer <token>` → returns user info
4. Token is stored in `localStorage` for subsequent requests
5. Password is hashed with SHA-256 (using a server-side secret)

## Vercel Deployment Steps

1. `git init && git add . && git commit -m "init"`
2. Push to GitHub
3. Go to vercel.com/new, import the GitHub repo
4. Vercel auto-detects Next.js
5. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
   - `PAYPAL_EMAIL`
6. Deploy happens automatically
7. For subsequent updates: `git push origin main` triggers auto-deploy

## Useful Scripts

### Check Supabase connection from Node

```js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(URL, ANON_KEY);
supabase.from('orders').select('count').limit(1).then(r => console.log(r));
```

### List files in storage bucket

```js
supabase.storage.from('product-images').list('orders').then(r => console.log(r));
```

### Create signed URL (alternative to proxy)

```js
supabase.storage.from('bucket').createSignedUrl('path/to/file.png', 3600).then(r => console.log(r));
```
