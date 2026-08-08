import { createClient } from '@supabase/supabase-js'

// Sử dụng ngoặc vuông ['...'] để truy cập biến môi trường
const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Thiếu cấu hình Supabase trong file .env!");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
)