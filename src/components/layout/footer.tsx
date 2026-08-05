/**Day la component tao ra phan chan trang (Footer) cua website,
 thuong nam o phan duoi cung cua cac trang. 
 No chua thong tin gioi thieu ve cau lac bo (HIEC Club), 
 cac lien ket mang xa hoi, danh sach dieu huong nhanh den cac trang chinh,
  thong tin lien he (email, dien thoai, dia chi) va nam ban quyen. */
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Music2, Phone, Sparkles } from "lucide-react";

import { contactInfo } from "@/services/hiec-service";
// Define social media links and their corresponding icons
const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "TikTok", href: "https://tiktok.com", icon: Music2 },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
];

export function Footer() {
  return (
    // Footer container with anchor link id and background styling
    <footer id="lien-he" className="border-t border-border/60 bg-gradient-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        {/* Column 1: Organization brand info, description, and social media icons */}
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display text-lg font-bold">HIEC.vn</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Câu lạc bộ Khởi nghiệp & Đổi mới sáng tạo HIEC — nơi sinh viên biến ý tưởng thành dự án
            có tác động thật.
          </p>
          <div className="mt-5 flex gap-2">
            {/* Map through social items to render social buttons */}
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick navigation links to different pages */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Điều hướng
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="text-foreground/80 hover:text-primary">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/projects" className="text-foreground/80 hover:text-primary">
                Dự án & dấu ấn
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-foreground/80 hover:text-primary">
                Đăng ký tham gia
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard" className="text-foreground/80 hover:text-primary">
                Khu vực quản trị
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact information (email, phone, address) */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Liên hệ nhanh
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                {contactInfo.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">
                {contactInfo.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-primary" />
              <span className="text-muted-foreground">{contactInfo.address}</span>
            </li>
          </ul>
        </div>
      </div>
      {/* Bottom copyright notice bar with dynamic current year */}
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HIEC Club. All rights reserved.
      </div>
    </footer>
  );
}
