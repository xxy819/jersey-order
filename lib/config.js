// ============ 双价格体系 ============
// Price Set A (邀请码 198888) — 原价
// Price Set B (邀请码 196666) — 新价

const PRICE_A = {
  fan_shirt: 6, player: 10, retro_short: 9, retro_long: 12,
  adult_set: 12, kids_set: 8.5, retro_kids: 11.5,
  baby: 5, windbreaker: 22.8, sweatshirt: 18,
  nba: 15, racing: 15, coat: 30,
  half_zip: 20.8, full_zip: 23.8, hooded_sport: 29.8, down_jacket: 48,
  custom: 3, patch: 1, socks: 3, hood: 2,
}

const PRICE_B = {
  fan_shirt: 7, player: 10, retro_short: 10, retro_long: 13,
  adult_set: 12, kids_set: 12, retro_kids: 15,
  baby: 5, windbreaker: 23.8, sweatshirt: 18,
  nba: 18, racing: 18, coat: 38,
  half_zip: 23.8, full_zip: 26.8, hooded_sport: 35, down_jacket: 48,
  custom: 3, patch: 1.5, socks: 3, hood: 2,
}

// 邀请码 → 价格映射
const INVITE_CODES = {
  '198888': PRICE_A,
  '196666': PRICE_B,
}

export const VALID_CODES = Object.keys(INVITE_CODES)

// 获取当前价格表（从 localStorage 读取邀请码）
export function getCurrentPriceSet() {
  if (typeof window === 'undefined') return PRICE_A // SSR fallback
  const code = localStorage.getItem('invite_code') || '198888'
  return INVITE_CODES[code] || PRICE_A
}

// 获取商品基础价格
export function getBasePrice(productId) {
  const prices = getCurrentPriceSet()
  return prices[productId] || 0
}

// 获取附加项价格
export function getAddonPrice(addonId) {
  const prices = getCurrentPriceSet()
  return prices[addonId] || 0
}

export const CUSTOM_PRICE = 3 // 定制印字统一3€，两套价格相同

// ============ 商品目录 ============
export const PRODUCTS = [
  // --- 成人球衣/套装类 ---
  { id: 'fan_shirt',    labelKey: 'p_fan_shirt',    chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'player',       labelKey: 'p_player',       chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'retro_short',  labelKey: 'p_retro_short',  chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'retro_long',   labelKey: 'p_retro_long',   chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_adult' },
  { id: 'adult_set',    labelKey: 'p_adult_set',    chartId: 'men',   allowCustom: false, addonIds: ['patch', 'socks'], categoryKey: 'cat_adult' },

  // --- 儿童套装类 ---
  { id: 'kids_set',     labelKey: 'p_kids_set',     chartId: 'kids',  allowCustom: false, addonIds: ['patch', 'socks'], categoryKey: 'cat_kids' },
  { id: 'retro_kids',   labelKey: 'p_retro_kids',   chartId: 'kids',  allowCustom: false, addonIds: ['patch', 'socks'], categoryKey: 'cat_kids' },

  // --- 服装类 ---
  { id: 'baby',         labelKey: 'p_baby',         chartId: 'baby',  allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'windbreaker',  labelKey: 'p_windbreaker',  chartId: 'men',   allowCustom: false, addonIds: ['patch', 'hood'],  categoryKey: 'cat_apparel' },
  { id: 'sweatshirt',   labelKey: 'p_sweatshirt',   chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'nba',          labelKey: 'p_nba',          chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'racing',       labelKey: 'p_racing',       chartId: 'men',   allowCustom: true,  addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'coat',         labelKey: 'p_coat',         chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'half_zip',     labelKey: 'p_half_zip',     chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'full_zip',     labelKey: 'p_full_zip',     chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'hooded_sport', labelKey: 'p_hooded_sport', chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },
  { id: 'down_jacket',  labelKey: 'p_down_jacket',  chartId: 'men',   allowCustom: false, addonIds: ['patch'],          categoryKey: 'cat_apparel' },

  // --- 无标价商品 ---
  { id: 'other',        labelKey: 'p_other',        chartId: null,    allowCustom: false, addonIds: [],               categoryKey: 'cat_other' },
]

export const CATEGORIES = [
  { id: 'cat_adult',   labelKey: 'cat_adult' },
  { id: 'cat_kids',    labelKey: 'cat_kids' },
  { id: 'cat_apparel', labelKey: 'cat_apparel' },
  { id: 'cat_other',   labelKey: 'cat_other' },
]

// ============ 附加选项 ============
export const ADDONS = {
  patch: { id: 'patch', labelKey: 'addon_patch', getPrice: () => getAddonPrice('patch'), requiresImage: true },
  socks: { id: 'socks', labelKey: 'addon_socks', getPrice: () => getAddonPrice('socks'), requiresImage: false },
  hood:  { id: 'hood',  labelKey: 'addon_hood',  getPrice: () => getAddonPrice('hood'),  requiresImage: false },
}

// ============ 运费 ============
export const SHIPPING_THRESHOLD = 5
export const SHIPPING_FEE = 5

export function calcShipping(totalQuantity) {
  return totalQuantity >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

// ============ 尺码数据 ============
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

// ============ 尺寸加价 ============
const SIZE_SURCHARGE_MAP = { '3XL': 1, '4XL': 2, '5XL': 3, '6XL': 4 }

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

export function calcPatchPrice(patchCount) {
  return (patchCount || 0) * getAddonPrice('patch')
}

export const PAYPAL_EMAIL = process.env.PAYPAL_EMAIL || '2598750264@qq.com'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
