import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Lightbulb,
  Mail,
  MessageCircle,
  Music2,
  Rocket,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hiec-hero.jpg";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactInfo, coreValues, history, projects } from "@/services/hiec-service";
// 1. Thêm dòng import này
import { MembersSection } from "@/components/members-section"; 

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HIEC Club — Câu lạc bộ Khởi nghiệp & Đổi mới sáng tạo" },
      {
        name: "description",
        content:
          "Tìm hiểu HIEC: banner, giá trị cốt lõi, lịch sử phát triển, dự án nổi bật và cách tham gia câu lạc bộ.",
      },
      { property: "og:title", content: "HIEC Club — Khởi nghiệp & Đổi mới sáng tạo" },
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
  const featured = projects.filter((p) => p.published).slice(0, 3);

  return (
    <PublicLayout>
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <img
          src={heroImage}
          alt="Thành viên HIEC tại sự kiện đổi mới sáng tạo"
          width={1600}
          height={900}
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-24 md:py-32">
          <div className="max-w-2xl animate-fade-up">
            <Badge className="border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground">
              HIEC · Since 2019
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl md:text-6xl">
              Ý tưởng sinh viên, <span className="text-gold">tác động thật</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
              HIEC là câu lạc bộ khởi nghiệp & đổi mới sáng tạo — nơi bạn được huấn luyện, kết nối
              mentor và triển khai dự án của chính mình.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">
                  Đăng ký tham gia <ArrowRight />
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
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Giới thiệu
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Một cộng đồng học bằng cách làm
            </h2>
            <p className="mt-5 text-muted-foreground">
              Từ 12 thành viên sáng lập, HIEC đã trở thành hệ sinh thái hơn 1.000 sinh viên với 4
              mảng chuyên môn: Nghiên cứu thị trường, Sản phẩm, Truyền thông và Đối ngoại. Chúng tôi
              tin rằng kỹ năng khởi nghiệp chỉ hình thành khi bạn thật sự bắt tay vào một dự án có
              người dùng thật.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "1.048", label: "Thành viên" },
                { value: "42", label: "Dự án" },
                { value: "45", label: "Mentor" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Lịch sử CLB
            </p>
            <ol className="mt-6 space-y-6 border-l border-border pl-6">
              {history.map((item) => (
                <li key={item.year} className="relative">
                  <span className="absolute -left-[31px] top-1 grid size-4 place-items-center rounded-full bg-gradient-brand ring-4 ring-background" />
                  <p className="font-display text-sm font-bold text-primary">{item.year}</p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section id="gia-tri" className="bg-gradient-surface py-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Giá trị cốt lõi
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Bốn nguyên tắc định hình HIEC
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, i) => {
              const Icon = valueIcons[i] ?? Lightbulb;
              return (
                <Card key={value.title} className="border-border/70 transition-shadow hover:shadow-elevated">
                  <CardHeader>
                    <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <CardTitle className="mt-3 font-display text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hoạt động nổi bật */}
      <section id="du-an" className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Hoạt động nổi bật
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Dự án & dấu ấn</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/projects">
              Xem tất cả <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-border/70">
              <div className="h-1.5 w-full bg-gradient-brand" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{project.category}</Badge>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <CardTitle className="mt-3 font-display text-xl group-hover:text-primary">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.excerpt}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Rocket className="size-4" /> {project.metric}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* Hoạt động nổi bật */}
      <section id="du-an" className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Dự án
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Dự án & dấu ấn</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/projects">
              Xem tất cả <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-border/70">
              <div className="h-1.5 w-full bg-gradient-brand" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{project.category}</Badge>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <CardTitle className="mt-3 font-display text-xl group-hover:text-primary">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.excerpt}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Rocket className="size-4" /> {project.metric}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* 2. CHÈN PHẦN THÀNH VIÊN VÀO ĐÂY */}
      <MembersSection />

      {/* CTA liên hệ nhanh + MXH */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-8 shadow-elevated sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="font-display text-3xl font-bold text-primary-foreground">
                Sẵn sàng bắt đầu cùng HIEC?
              </h2>
              <p className="mt-3 text-primary-foreground/85">
                Liên hệ nhanh với ban chủ nhiệm qua email hoặc Messenger, hoặc theo dõi HIEC trên
                mạng xã hội để không bỏ lỡ đợt tuyển thành viên.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="lg">
                  <a href={`mailto:${contactInfo.email}`}>
                    <Mail /> Gửi email
                  </a>
                </Button>
                <Button asChild variant="heroOutline" size="lg">
                  <a href={contactInfo.messenger} target="_blank" rel="noreferrer noopener">
                    <MessageCircle /> Chat Messenger
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Music2, href: "https://tiktok.com", label: "TikTok" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid size-12 place-items-center rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}