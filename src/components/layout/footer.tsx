/**
 * Component Footer - Đã sửa để đồng bộ dữ liệu từ Supabase (hiec-service)
 */
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Music2, 
  Phone 
} from 'lucide-react';

// SỬA: Import từ hiec-service để lấy dữ liệu bạn đã chỉnh sửa
import { getHomeContent, type HomeContent, socialLinks } from '@/services/hiec-service';
import { HiecLogo } from "@/components/ui/hiec-logo";

const iconMap: Record<string, any> = {
  Facebook: Facebook,
  Instagram: Instagram,
  TikTok: Music2, // Map TikTok sang icon Music2
};

export function Footer() {
  const [data, setData] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFooter() {
      try {
        // Lấy đúng dữ liệu từ bảng hiec_settings (key: home_content)
        const homeData = await getHomeContent();
        setData(homeData);
      } catch (error) {
        console.error('Lỗi tải footer:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFooter();
  }, []);

  // Menu điều hướng mặc định (có thể chỉnh sửa ở đây nếu chưa có trong DB)
  const navigation = [
    { label: "Trang chủ", path: "/" },
    { label: "Dự án", path: "/projects" },
    { label: "Hoạt động", path: "/activities" },
    { label: "Thành viên", path: "/members" },
  ];

  if (loading) {
    return (
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 w-24 bg-primary/10 rounded animate-pulse" />
                <div className="h-3 w-full bg-primary/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  // Nếu không load được data, dùng dữ liệu mặc định để tránh crash
  if (!data) return null;

  const { hero, contact } = data;

  return (
    <footer id="lien-he" className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        
        {/* Cột 1: Logo & Giới thiệu */}
        <div>
          <div className="mb-6">
            <HiecLogo className="scale-110 origin-left" />
          </div>
          
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            {hero.description}
          </p>
          
          <div className="mt-6 flex gap-3">
            {socialLinks.map((s) => {
              const IconComponent = iconMap[s.label] || Facebook;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-glow hover:-translate-y-1"
                >
                  <IconComponent className="size-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Cột 2: Điều hướng nhanh */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-6">
            Điều hướng
          </h3>
          <ul className="space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.path}>
                <Link to={item.path as any} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="size-1 rounded-full bg-primary/40 group-hover:scale-150 transition-transform" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Liên hệ nhanh (DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ) */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-6">
            Liên hệ nhanh
          </h3>
          <ul className="space-y-4 text-sm text-left">
            <li className="flex items-center gap-3 group justify-start">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail className="size-4" />
              </div>
              <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3 group justify-start">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone className="size-4" />
              </div>
              <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-3 group justify-start">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <MapPin className="size-4" />
              </div>
              <span className="text-muted-foreground leading-relaxed text-left">
                {contact.address}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/40 py-6 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
        © {new Date().getFullYear()} HIEC. All rights reserved. 
        <span className="mx-2">|</span> 
        Design for Impact
      </div>
    </footer>
  );
}