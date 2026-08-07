/**
 * Component Footer - Chứa thông tin liên hệ và điều hướng chung.
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

// SỬA: Thay đổi đường dẫn import cho đúng với tên file thực tế là setting.ts
import { getFooterSettings, type FooterData } from '@/services/setting';

const iconMap: Record<string, any> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Music2: Music2,
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

  if (loading) {
    return (
      <footer className="border-t border-border/60 bg-gradient-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 w-24 bg-primary/10 rounded animate-pulse" />
                <div className="h-3 w-full bg-primary/5 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-primary/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  if (!data) return null;

  const { brand, description, socials, navigation, contact } = data;

  return (
    <footer id="lien-he" className="border-t border-border/60 bg-gradient-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        {/* Cột 1: Thương hiệu & MXH */}
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
                  className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-glow"
                >
                  <IconComponent className="size-4" />
                </a>
              ) : null;
            })}
          </div>
        </div>

        {/* Cột 2: Điều hướng */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Điều hướng
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navigation.map((item) => (
              <li key={item.path}>
                {/* SỬA: Ép kiểu 'as any' cho path để tránh lỗi TypeScript nghiêm ngặt của TanStack Router */}
                <Link to={item.path as any} className="text-foreground/80 hover:text-primary transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Liên hệ nhanh
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
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
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand}. Câu lạc bộ HIEC.
      </div>
    </footer>
  );
}