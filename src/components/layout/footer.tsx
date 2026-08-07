/**
<<<<<<< HEAD
 * Component Footer - Chứa thông tin liên hệ và điều hướng chung.
=======
 * Day la component tao ra phan chan trang (Footer) cua website,
 * thuong nam o phan duoi cung cua cac trang. 
 * No chua thong tin gioi thieu ve cau lac bo (HIEC Club), 
 * cac lien ket mang xa hoi, danh sach dieu huong nhanh den cac trang chinh,
 * thong tin lien he (email, dien thoai, dia chi) va nam ban quyen.
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
 */
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Music2, 
  Phone, 
  Sparkles 
} from 'lucide-react';

<<<<<<< HEAD
// SỬA: Thay đổi đường dẫn import cho đúng với tên file thực tế là setting.ts
import { getFooterSettings, type FooterData } from '@/services/setting';

=======
import { getFooterSettings, type FooterData } from '@/services/settings.service';

// Map icon string to actual component
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
const iconMap: Record<string, any> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Music2: Music2,
<<<<<<< HEAD
=======
  // Có thể thêm các icon khác sau
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
};

export function Footer() {
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFooter() {
      try {
        const footerData = await getFooterSettings();
        setData(footerData);
      } catch (error) {
        console.error('Lỗi tải footer:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFooter();
  }, []);

<<<<<<< HEAD
=======
  // Hiển thị loading skeleton
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
  if (loading) {
    return (
      <footer className="border-t border-border/60 bg-gradient-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
<<<<<<< HEAD
                <div className="h-4 w-24 bg-primary/10 rounded animate-pulse" />
                <div className="h-3 w-full bg-primary/5 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-primary/5 rounded animate-pulse" />
=======
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

<<<<<<< HEAD
=======
  // Nếu không có dữ liệu thì không render
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
  if (!data) return null;

  const { brand, description, socials, navigation, contact } = data;

  return (
    <footer id="lien-he" className="border-t border-border/60 bg-gradient-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
<<<<<<< HEAD
        {/* Cột 1: Thương hiệu & MXH */}
=======
        {/* Column 1: Organization brand info, description, and social media icons */}
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display text-lg font-bold">{brand}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{description}</p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => {
              const IconComponent = iconMap[s.icon];
              return IconComponent ? (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
<<<<<<< HEAD
                  className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-glow"
=======
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
                >
                  <IconComponent className="size-4" />
                </a>
              ) : null;
            })}
          </div>
        </div>

<<<<<<< HEAD
        {/* Cột 2: Điều hướng */}
=======
        {/* Column 2: Quick navigation links to different pages */}
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Điều hướng
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navigation.map((item) => (
              <li key={item.path}>
<<<<<<< HEAD
                {/* SỬA: Ép kiểu 'as any' cho path để tránh lỗi TypeScript nghiêm ngặt của TanStack Router */}
                <Link to={item.path as any} className="text-foreground/80 hover:text-primary transition-colors">
=======
                <Link to={item.path} className="text-foreground/80 hover:text-primary">
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

<<<<<<< HEAD
        {/* Cột 3: Liên hệ */}
=======
        {/* Column 3: Contact information (email, phone, address) */}
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Liên hệ nhanh
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" />
<<<<<<< HEAD
              <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
=======
              <a href={`mailto:${contact.email}`} className="hover:text-primary">
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
<<<<<<< HEAD
              <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
=======
              <a href={`tel:${contact.phone}`} className="hover:text-primary">
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-primary" />
              <span className="text-muted-foreground">{contact.address}</span>
            </li>
          </ul>
        </div>
      </div>
<<<<<<< HEAD
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand}. Câu lạc bộ HIEC.
=======
      {/* Bottom copyright notice bar with dynamic current year */}
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand}. All rights reserved.
>>>>>>> 39cd77023537a057b237d7eb34914b8d94907603
      </div>
    </footer>
  );
}