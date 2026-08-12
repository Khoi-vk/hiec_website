/**
 * Service quản lý các thiết lập chung (Footer, Branding, v.v.)
 * Kết nối trực tiếp với Supabase để lấy dữ liệu động.
 */
import { supabase } from '@/utils/supabase'; // SỬA: Nối đúng "dây điện" vào file supabase hiện có

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

// Dữ liệu mặc định cho HIEC (Dùng khi Database trống hoặc lỗi kết nối)
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
  ],
  contact: {
    email: 'hiec.hust@gmail.com',
    phone: '0336873705',
    address: 'Đại học Bách khoa Hà Nội, 1 Đ. Đại Cồ Việt',
  },
};

/**
 * Lấy cấu hình Footer từ bảng 'settings'
 */
export async function getFooterSettings(): Promise<FooterData> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'footer')
      .maybeSingle(); // Dùng maybeSingle để tránh lỗi Crash nếu chưa tạo bảng

    if (error || !data) {
      // Nếu chưa có Database, trả về dữ liệu mẫu để web không bị trắng trang
      return defaultFooterData;
    }

    return { ...defaultFooterData, ...data.value };
  } catch (error) {
    console.error('Lỗi tải footer:', error);
    return defaultFooterData;
  }
}

/**
 * Cập nhật cấu hình Footer (Dành cho trang Admin)
 */
export async function updateFooterSettings(data: FooterData): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({ 
      key: 'footer', 
      value: data,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });

  if (error) {
    console.error('Không thể cập nhật footer:', error);
    throw new Error('Không thể cập nhật cấu hình Footer');
  }
}
