// services/settings.service.ts
import { supabase } from '@/lib/supabase/client';

export interface FooterData {
  brand: string;
  description: string;
  socials: Array<{ label: string; href: string; icon: string }>;
  navigation: Array<{ label: string; path: string }>;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

// Dữ liệu mặc định (dùng khi chưa có database)
const defaultFooterData: FooterData = {
  brand: 'HIEC.vn',
  description: 'Câu lạc bộ Khởi nghiệp & Đổi mới sáng tạo HIEC — nơi sinh viên biến ý tưởng thành dự án có tác động thật.',
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/hiec.vn', icon: 'Facebook' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@hiec.hust', icon: 'Music2' },
    { label: 'Instagram', href: 'https://www.instagram.com/hiec.in.here/', icon: 'Instagram' },
  ],
  navigation: [
    { label: 'Trang chủ', path: '/' },
    { label: 'Dự án & dấu ấn', path: '/projects' },
    { label: 'Đăng ký tham gia', path: '/signup' },
    { label: 'Khu vực quản trị', path: '/admin/dashboard' },
  ],
  contact: {
    email: 'hiec@example.com',
    phone: '0123456789',
    address: 'Trường Đại học Khoa học Tự nhiên, Hà Nội',
  },
};

export async function getFooterSettings(): Promise<FooterData> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'footer')
      .single();

    if (error) {
      console.warn('Không tìm thấy footer settings, dùng dữ liệu mặc định');
      return defaultFooterData;
    }

    // Merge với default để đảm bảo đủ field
    return { ...defaultFooterData, ...data.value };
  } catch (error) {
    console.error('Lỗi tải footer:', error);
    return defaultFooterData;
  }
}

export async function updateFooterSettings(data: FooterData): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({ 
      key: 'footer', 
      value: data,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });

  if (error) throw new Error('Không thể cập nhật footer');
}
