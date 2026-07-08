// ============ 商品目录 ============
export const PRODUCTS = [
  // --- 成人球衣/套装类 ---
  { id: 'fan_shirt',    labelKey: 'p_fan_shirt',    price: 6,    chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'player',       labelKey: 'p_player',       price: 10,   chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'retro_short',  labelKey: 'p_retro_short',  price: 9,    chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'retro_long',   labelKey: 'p_retro_long',   price: 12,   chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'adult_set',    labelKey: 'p_adult_set',    price: 12,   chartId: 'men',   allowCustom: false, addonIds: ['patch', 'socks'], categoryKey: 'cat_adult' },

  // --- 儿童套装类 ---
  { id: 'kids_set',     labelKey: 'p_kids_set',     price: 8.5,  chartId: 'kids',  allowCustom: false, addonIds: ['patch', 'socks'], categoryKey: 'cat_kids' },
  { id: 'retro_kids',   labelKey: 'p_retro_kids',   price: 11.5, chartId: 'kids',  allowCustom: false, addonIds: ['patch', 'socks'], categoryKey: 'cat_kids' },

  // --- 服装类 ---
  { id: 'baby',         labelKey: 'p_baby',         price: 5,    chartId: 'baby',  allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'windbreaker',  labelKey: 'p_windbreaker',  price: 22.8, chartId: 'men',   allowCustom: false, addonIds: ['patch', 'hood'],  categoryKey: 'cat_apparel' },
  { id: 'sweatshirt',   labelKey: 'p_sweatshirt',   price: 18,   chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'nba',          labelKey: 'p_nba',          price: 15,   chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'racing',       labelKey: 'p_racing',       price: 15,   chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'coat',         labelKey: 'p_coat',         price: 30,   chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'half_zip',     labelKey: 'p_half_zip',     price: 20.8, chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'full_zip',     labelKey: 'p_full_zip',     price: 23.8, chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'hooded_sport', labelKey: 'p_hooded_sport', price: 29.8, chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'down_jacket',  labelKey: 'p_down_jacket',  price: 48,   chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },

  // --- 其他商品（自定义价格 + 备注） ---
  { id: 'other',        labelKey: 'p_other',        price: 0,    chartId: null,    allowCustom: false, addonIds: [],               categoryKey: 'cat_other' },
]

// 分类
export const CATEGORIES = [
  { id: 'cat_adult',   labelKey: 'cat_adult' },
  { id: 'cat_kids',    labelKey: 'cat_kids' },
  { id: 'cat_apparel', labelKey: 'cat_apparel' },
  { id: 'cat_other',   labelKey: 'cat_other' },
]

// ============ 附加选项 ============
export const ADDONS = {
  patch: { id: 'patch', labelKey: 'addon_patch', price: 1, requiresImage: true },
  socks: { id: 'socks', labelKey: 'addon_socks', price: 3, requiresImage: false },
  hood:  { id: 'hood',  labelKey: 'addon_hood',  price: 2, requiresImage: false },
}

// ============ 运费 ============
export const SHIPPING_THRESHOLD = 5
export const SHIPPING_FEE = 5

export function calcShipping(totalQuantity) {
  return totalQuantity >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

// ============ 尺码数据（含6XL） ============
const MEN_SIZES = [
  ['S',   '69-71', '53-55', '162-170', '50-62'],
  ['M',   '71-73', '55-57', '170-176', '62-78'],
  ['L',   '73-75', '57-58', '176-182', '78-83'],
  ['XL',  '75-78', '58-60', '182-190', '83-90'],
  ['2XL', '78-81', '60-62', '190-195', '90-97'],
  ['3XL', '81-83', '62-64', '192-197', '97-104'],
  ['4XL', '83-85', '64-66', '194-199', '100-108'],
  ['5XL', '85-88', '66-68', '196-202', '105-115'],
  ['6XL', '88-91', '68-70', '198-205', '110-125'],
]

const WOMEN_SIZES = [
  ['S',  '61-63', '40-41', '150-160'],
  ['M',  '63-66', '41-44', '160-165'],
  ['L',  '66-69', '44-47', '165-170'],
  ['XL', '69-71', '47-50', '170-175'],
]

const KIDS_SIZES = [
  ['16', '95-105', '3~4岁',  '44', '35', '20-37'],
  ['18', '105-115', '4~5岁', '47', '37', '21-39'],
  ['20', '115-125', '5~6岁', '50', '39', '22-41'],
  ['22', '125-135', '6~7岁', '53', '41', '23-42'],
  ['24', '135-145', '8~9岁', '56', '43', '24-44'],
  ['26', '145-155', '10~11岁', '59', '45', '25-47'],
  ['28', '155-165', '12~13岁', '62', '47', '26-50'],
]

const BABY_SIZES = [
  ['9M',  '67-72', '7.5-9.3',  '6-12个月'],
  ['12M', '72-78', '9.3-11.1', '12-18个月'],
]

export const SIZE_CHARTS = {
  men: {
    titleKey: 'size_chart_men',
    headers: ['size_col', 'length_col', 'width_col', 'height_col', 'weight_col'],
    rows: MEN_SIZES,
  },
  women: {
    titleKey: 'size_chart_women',
    headers: ['size_col', 'length_col', 'width_col', 'height_col'],
    rows: WOMEN_SIZES,
  },
  kids: {
    titleKey: 'size_chart_kids',
    headers: ['size_col', 'height_col', 'age_col', 'length_col', 'width_col', 'waist_col'],
    rows: KIDS_SIZES,
  },
  baby: {
    titleKey: 'size_chart_baby',
    headers: ['size_col', 'height_col', 'weight_col', 'age_col'],
    rows: BABY_SIZES,
  },
}

// ============ 尺寸加价计算 ============
// 男士尺码: 2XL及以下不加价, 3XL起每加一码+1€
const SIZE_SURCHARGE_MAP = {
  '3XL': 1, '4XL': 2, '5XL': 3, '6XL': 4,
}

export function calcSizeSurcharge(size, chartId) {
  if (chartId !== 'men') return 0
  return SIZE_SURCHARGE_MAP[size] || 0
}

// ============ 辅助函数 ============
export function getProduct(id) {
  return PRODUCTS.find(p => p.id === id)
}

export function getProductsByCategory(catId) {
  return PRODUCTS.filter(p => p.categoryKey === catId)
}

export function getSizeOptions(chartId) {
  const chart = SIZE_CHARTS[chartId]
  return chart ? chart.rows.map(r => r[0]) : []
}

// 计算总单价（含尺寸加价、附加项、定制）
export function calcItemPrice(productId, size, addonIds, hasCustom) {
  const prod = getProduct(productId)
  if (!prod) return 0
  let price = prod.price
  // 尺寸加价
  price += calcSizeSurcharge(size, prod.chartId)
  // 附加项
  if (addonIds && addonIds.length) {
    for (const aid of addonIds) {
      if (aid === 'patch') continue // 补丁按数量计算
      const addon = ADDONS[aid]
      if (addon) price += addon.price
    }
  }
  // 定制
  if (hasCustom) price += CUSTOM_PRICE
  return price
}

// 计算补丁价格（按数量）
export function calcPatchPrice(patchCount) {
  return (patchCount || 0) * (ADDONS.patch?.price || 1)
}

export const CUSTOM_PRICE = 3
export const PAYPAL_EMAIL = process.env.PAYPAL_EMAIL || '2598750264@qq.com'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
