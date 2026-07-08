# 球衣订购网站 - 技术规格文档

## 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | Next.js (React) + Tailwind CSS | 单页应用，响应式 |
| 后端 | Next.js API Routes | 前后端同一项目 |
| 数据库 | Supabase (PostgreSQL) | 免费层 500MB |
| 图片存储 | Supabase Storage | 免费层 1GB |
| 部署 | Vercel | 免费层，自动部署 |

## 项目结构

```
jersey-order-site/
├── app/
│   ├── page.js              # 下单首页（公开）
│   ├── layout.js             # 全局布局
│   ├── admin/
│   │   ├── page.js           # 后台登录 + 订单列表
│   │   └── api/
│   │       └── login.js      # 后台登录验证（简单密码）
│   ├── api/
│   │   ├── order.js          # POST - 创建订单 / GET - 查询订单
│   │   └── upload.js         # POST - 上传图片
│   └── globals.css           # 全局样式
├── components/
│   ├── ProductSelector.js    # 商品选择区块
│   ├── CartList.js           # 购物车清单
│   ├── CustomerForm.js       # 客户信息表单
│   └── OrderList.js          # 后台订单列表表格
├── lib/
│   ├── supabase.js           # Supabase 客户端初始化
│   └── config.js             # 配置（价格、PayPal邮箱等）
└── package.json
```

## 数据库表结构

### 表：orders

| 字段 | 类型 | 说明 |
|---|---|---|
| id | UUID (PK) | 自动生成 |
| created_at | TIMESTAMP | 下单时间 |
| customer_name | TEXT | 客户姓名 |
| customer_email | TEXT | 客户邮箱 |
| customer_phone | TEXT | 客户电话（可选） |
| customer_address | TEXT | 收货地址 |
| items | JSONB | 商品列表（见下方结构） |
| total_amount | DECIMAL(10,2) | 订单总金额 |
| note | TEXT | 客户备注（可选） |
| status | TEXT | 默认 'pending' |

### items 字段的 JSON 结构

```json
[
  {
    "image_url": "https://xxx.supabase.co/...",
    "product_name": "2024-25 主场球衣",
    "style": "球员版",
    "size": "M",
    "quantity": 2,
    "custom_name": "MESSI",
    "custom_number": "10",
    "has_custom": true,
    "unit_price": 89.00,
    "subtotal": 178.00
  }
]
```

## 商品数据配置（定义在 lib/config.js）

### 款式选项
- 球迷版
- 球员版
- 儿童版

### 尺寸选项
- XS, S, M, L, XL, 2XL, 3XL

### 定制服务说明
- 定制印字（名字 + 号码）：固定加收 15 元/件
- 如果客户填写了 custom_name 或 custom_number，该商品视为定制，单价自动 +15

无论实际卖什么球衣，商品名称由客户填，价格由你统一设。但在 config.js 里留一个产品目录接口，方便以后扩展。

## 价格计算逻辑

```
单品单价 = 基础价格（取决于款式）
球迷版 = 69 元
球员版 = 89 元  
儿童版 = 59 元

如果该商品填写了定制信息（名字或号码不为空）：
  单品单价 += 15 元

单品小计 = 单品单价 × 数量

订单总价 = 所有单品小计之和
```

以上价格在 config.js 中配置，方便修改。

## API 接口

### POST /api/order

创建订单。

请求体：
```json
{
  "customer_name": "",
  "customer_email": "",
  "customer_phone": "",
  "customer_address": "",
  "items": [
    {
      "image_url": "",
      "product_name": "",
      "style": "球员版",
      "size": "M",
      "quantity": 1,
      "custom_name": "",
      "custom_number": ""
    }
  ],
  "note": ""
}
```

后端验证必填字段，计算总价，写入 orders 表，返回 { success: true, order_id: "..." }。

### GET /api/order

查询订单列表。需要验证 admin 身份（通过 Header 传密码 token）。

查询参数：?page=1&limit=20&search=关键词

返回：
```json
{
  "orders": [ ... ],
  "total": 100,
  "page": 1
}
```

### POST /api/upload

上传商品图片。

请求：multipart/form-data，文件字段名 image

返回：
```json
{
  "url": "https://xxx.supabase.co/..."
}
```

限制：单文件最大 5MB，格式 jpg/png/webp。

## 前端功能规格

### 下单页面（首页）

分为几个区域，垂直排列：

**区域 1：添加商品**
- 上传图片按钮（预览）
- 商品名称输入框
- 款式下拉选择（球迷版/球员版/儿童版）
- 尺码下拉选择（XS ~ 3XL）
- 数量 +/- 按钮（最小 1）
- 定制服务开关：勾选后出现定制输入框
  - 名字输入（限 20 字符）
  - 号码输入（限 2 位数字）
- 实时显示该商品单价 + 小计
- "加入清单"按钮

**区域 2：购物清单**
- 已加入商品列表卡片
- 每张卡片显示：缩略图、名称、款式、尺码、数量、定制信息、单价、小计
- 每张卡片有"删除"按钮
- 清单为空时显示"暂无商品"

**区域 3：总价与客户信息**
- 订单总计金额（大字醒目）
- 表单字段：
  - 姓名（必填）
  - 邮箱（必填，用于接收确认）
  - 电话（可选）
  - 地址（必填，用于发货）
  - 备注（可选）
- "提交订单"按钮

**区域 4：提交成功**
- 显示订单编号
- 显示 PayPal 付款信息：
  - PayPal 邮箱（从 config.js 读取）
  - 付款金额
  - 提示文字："请将总金额通过 PayPal 发送至以上邮箱，并在备注中填写订单编号。我们确认收款后尽快发货。"
- 一个"复制订单编号"按钮方便客户操作

### 后台页面（/admin）

**登录验证**
- 简单密码输入（密码写在 config.js 中，明文即可，因为是免费方案）
- 密码正确显示订单列表，错误提示"密码错误"

**订单列表**
- 表格形式
- 列：下单时间、客户姓名、邮箱、商品总数、总金额、状态、操作
- 点击行展开详情：
  - 完整客户信息
  - 每个商品的完整信息（包含大图查看）
  - 定制详情
  - 备注
- 顶部搜索框输入关键词，实时筛选
- 导出 CSV 按钮

## Supabase 配置步骤

1. 注册 supabase.com（免费）
2. 创建新项目，选择区域
3. SQL Editor 中执行以下 SQL 建表：

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  note TEXT DEFAULT '',
  status TEXT DEFAULT 'pending'
);
```

4. Storage 中创建 bucket `product-images`，设置为 public
5. Project Settings > API 中复制 URL 和 anon key，写到 .env.local

## Vercel 部署

1. 代码推送到 GitHub
2. vercel.com 导入该仓库
3. 设置环境变量（同 .env.local）
4. 部署完成，获得 `xxx.vercel.app` 域名

## 环境变量 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
ADMIN_PASSWORD=你的后台密码
PAYPAL_EMAIL=你的PayPal邮箱
```

---

这份规格已经完整到可以直接翻译成代码。你把它扔给 Claude、GPT-4、Cursor 或者 Codex 都行，说"根据这份规格生成完整项目代码"。

需要我补充什么或者调整价格逻辑，直接说。
