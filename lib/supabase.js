import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 仅在配置了环境变量时才创建客户端
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// 获取 Supabase 客户端，如果未配置则抛出提示
export function getSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase 未配置。请先在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY，\n' +
      '然后前往 https://supabase.com 注册免费账号并创建项目。'
    )
  }
  return supabase
}
