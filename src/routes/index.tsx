import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Lightbulb,
  Mail,
  MessageCircle,
  Music2,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hiec-hero.jpg";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactInfo, coreValues } from "@/services/hiec-service";

// Dữ liệu lịch sử CLB (Timeline) mới
const hiecTimeline = [
  {
    year: "2019",
    title: "Đặt nền móng khởi đầu",
    description: "Thành lập HIEC dưới sự bảo trợ của Ban Học tập - Nghiên cứu Khoa học Đoàn Thanh niên Đại học Bách Khoa Hà Nội.",
  },
  {
    year: "2021 - 2022",
    title: "Chuẩn hóa & Tái cấu trúc",
    description: "Vượt qua đại dịch, chuyển đổi số mô hình sinh hoạt, hoàn thiện quy trình đào tạo nội bộ chuyên sâu về Marketing, Sản phẩm và Nghiên cứu thị trường.",
  },
  {
    year: "2023 - 2024",
    title: "Mở rộng hệ sinh thái",
    description: "Triển khai chuỗi chương trình thực chiến, nâng cao kết nối doanh nghiệp và mang đến các buổi training ứng dụng thực tế chất lượng cho thành viên.",
  },
  {
    year: "2025 - 2026",
    title: "Đột phá & Khẳng định vị thế",
    description: "Đồng hành tổ chức và bảo trợ truyền thông các sân chơi công nghệ lớn mang tầm quốc gia và khu vực (như cuộc thi BK Fintech Hackday).",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HIEC — Câu lạc bộ Sáng tạo và Khởi nghiệp HUST" },
      {
        name: "description",
        content:
          "Câu lạc bộ Sáng tạo và Khởi nghiệp HUST — Nơi kết nối công nghệ, đổi mới sáng tạo và tư duy kinh doanh thực chiến.",
      },
      { property: "og:title", content: "HIEC — Câu lạc bộ Sáng tạo và Khởi nghiệp HUST" },
      {
        property: "og:description",
        content: "Cộng đồng sinh viên biến ý tưởng thành dự án có tác động thật.",
      },
    ],
  }),
  component: HomePage,
});

const valueIcons = [Lightbulb, ShieldCheck, Users, Target];

function HomePage() {
  return (
    <PublicLayout>
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <img
          src={heroImage}
          alt="Thành viên HIEC HUST"
          width={1600}
          height={900}
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-24 md:py-32 text-center md:text-left">
          <div className="max-w-2xl animate-fade-up">
            <Badge className="border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground">
              HIEC · SINCE 2019
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl md:text-6xl">
              Ý tưởng sinh viên, <br />
              <span className="text-gold uppercase">tác động thật</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
              <strong>Câu lạc bộ Sáng tạo và Khởi nghiệp HUST</strong> — Nơi bạn được huấn luyện, kết nối
              mentor và hiện thực hóa ý tưởng khởi nghiệp thành những giải pháp có giá trị thực cho xã hội.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">
                  Đăng ký tham gia <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/projects">Xem dự án</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Giới thiệu + lịch sử */}
      <section id="gioi-thieu" className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="grid gap-16 md:grid-cols-2 items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Giới thiệu
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl leading-tight">
              Một cộng đồng <br /> học bằng cách làm
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed text-justify">
              Xuất phát từ nhóm sinh viên đầy hoài bão Gen 1, HIEC xây dựng một cộng đồng kết nối sâu sắc giữa 
              khoa học công nghệ, đổi mới sáng tạo và tư duy kinh doanh. Chúng tôi hoạt động thực chiến 
              với cấu trúc các ban nội bộ vững mạnh, tạo bệ phóng giúp sinh viên nâng cao chuyên môn, 
              rèn luyện kỹ năng mềm và hiện thực hóa các ý tưởng khởi nghiệp thành những giải pháp có giá trị thực cho xã hội.
            </p>
            <div className="mt-8 pt-8 border-t border-border/50">
                <div className="h-1.5 w-20 bg-primary rounded-full" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Hành trình phát triển
            </p>
            <ol className="mt-8 space-y-8 border-l-2 border-primary/20 pl-8 relative">
              {hiecTimeline.map((item) => (
                <li key={item.year} className="relative">
                  <span className="absolute -left-[41px] top-1 grid size-4 place-items-center rounded-full bg-primary ring-4 ring-background shadow-sm" />
                  <p className="font-display text-sm font-bold text-primary italic leading-none mb-1">{item.year}</p>
                  <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section id="gia-tri" className="bg-[#fafafa] py-20 border-y border-border/40">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="max-w-xl mb-12 text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Giá trị cốt lõi
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Bốn nguyên tắc định hình HIEC
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, i) => {
              const Icon = valueIcons[i] ?? Lightbulb;
              return (
                <Card key={value.title} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
                  <CardHeader>
                    <span className="grid size-12 place-items-center rounded-xl bg-primary/5 text-primary">
                      <Icon className="size-6" />
                    </span>
                    <CardTitle className="mt-4 font-display text-lg uppercase font-bold">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA liên hệ nhanh + MXH */}
      <section id="lien-he" className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-hero p-8 shadow-2xl sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-10">
            <div className="max-w-lg">
              <h2 className="font-display text-3xl font-bold text-primary-foreground leading-tight">
                Sẵn sàng bắt đầu <br /> cùng HIEC?
              </h2>
              <p className="mt-4 text-primary-foreground/85">
                Liên hệ nhanh với ban chủ nhiệm qua Gmail hoặc theo dõi HIEC trên
                mạng xã hội để không bỏ lỡ đợt tuyển thành viên mới nhất.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild variant="hero" size="lg" className="rounded-xl font-bold px-8">
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}`} 
                    target="_blank" 
                    rel="noreferrer noopener"
                  >
                    <Mail className="mr-2 size-5" /> Gửi Gmail
                  </a>
                </Button>
                <Button asChild variant="heroOutline" size="lg" className="rounded-xl font-bold px-8">
                  <a href={contactInfo.messenger} target="_blank" rel="noreferrer noopener">
                    <MessageCircle className="mr-2 size-5" /> Chat Messenger
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://facebook.com/hiec.hust", label: "Facebook" },
                { icon: Music2, href: "https://tiktok.com/@hiec.hust", label: "TikTok" },
                { icon: Instagram, href: "https://instagram.com/hiec.hust", label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid size-14 place-items-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-all hover:bg-primary-foreground/20 hover:scale-110 shadow-lg"
                >
                  <s.icon className="size-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}