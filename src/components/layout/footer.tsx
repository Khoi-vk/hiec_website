/**
 * Component Footer - Chân trang website HIEC.
 * Đã cập nhật Logo đồng bộ bằng Component HiecLogo.
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

import { getFooterSettings, type FooterData } from '@/services/setting';
import { HiecLogo } from "@/components/ui/hiec-logo"; // Import Logo mới

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
      <footer className="border-t border-border/60 bg-background">
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
    <footer id="lien-he" className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        
        {/* Cột 1: Logo & Giới thiệu ngắn */}
        <div>
          {/* SỬA: Dùng HiecLogo thay cho icon Sparkles cũ */}
          <div className="mb-6">
            <HiecLogo className="scale-110 origin-left" />
          </div>
          
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          <div className="mt-6 flex gap-3">
            {socials.map((s) => {
              const IconComponent = iconMap[s.icon];
              return IconComponent ? (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-glow hover:-translate-y-1"
                >
                  <IconComponent className="size-5" />
                </a>
              ) : null;
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

        {/* Cột 3: Thông tin liên hệ */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-6">
            Liên hệ nhanh
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3 group">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail className="size-4" />
              </div>
              <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone className="size-4" />
              </div>
              <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <MapPin className="size-4" />
              </div>
              <span className="text-muted-foreground leading-relaxed">{contact.address}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="border-t border-border/40 py-6 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
        © {new Date().getFullYear()} {brand}. All rights reserved. 
        <span className="mx-2">|</span> 
        Design for Impact
      </div>
    </footer>
  );
}
