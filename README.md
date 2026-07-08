# Jersey Order - 球衣订购网站

海外球衣及足球周边订购平台。客户选择商品款式尺码、上传图片、定制印字，提交订单后通过 PayPal 付款。

## 技术栈

Next.js 14 + Supabase (PostgreSQL + Storage) + Tailwind CSS
部署到 Vercel 免费层，数据库用 Supabase 免费层，运行成本 0 元。

## 本地运行

### 1. 注册 Supabase

前往 https://supabase.com 注册免费账号：

1. 创建新项目
2. SQL Editor 中执行 `scripts/init.sql`
3. Storage > New bucket > `product-images` > Public bucket: ON
4. Project Settings > API 复制 URL 和 anon key

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入 Supabase 的 URL 和 anon key。

### 3. 启动

```bash
npm run dev
```

浏览器访问 http://localhost:3000

### 4. 后台管理

访问 http://localhost:3000/admin
密码：admin123（可在 .env.local 中修改 ADMIN_PASSWORD）

## 部署到 Vercel

1. 代码推送到 GitHub
2. 前往 https://vercel.com 导入该仓库
3. 在 Vercel 项目设置中添加环境变量（与 .env.local 一致）
4. 部署完成，获得 `xxx.vercel.app` 域名

## 价格配置

所有价格在 `lib/config.js` 中修改：

| 款式 | 价格 |
|---|---|
| 球员版 | 9€ |
| 球迷版 | 6€ |
| 儿童版套装 | 8€ |
| 婴儿套 | 5€ |
| 复古款 | 8€ |
| 定制加价 | 3€ |
