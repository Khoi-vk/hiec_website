import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  Megaphone,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { MovementGallery } from "@/components/home/movement-gallery";
import { Button } from "@/components/ui/button";
import { contactInfo, history } from "@/services/hiec-service";

const departments = [
  { code: "01", title: "Ban Phát triển chiến lược", text: "Định hình hướng đi, nghiên cứu cơ hội và biến tầm nhìn HIEC thành những chương trình có mục tiêu rõ ràng.", icon: Network },
  { code: "02", title: "Ban Truyền thông", text: "Kể câu chuyện HIEC bằng nội dung, hình ảnh và những chiến dịch khiến cộng đồng muốn cùng tham gia.", icon: Megaphone },
  { code: "03", title: "Ban Đối ngoại", text: "Mở rộng mạng lưới mentor, doanh nghiệp và đối tác để mỗi thành viên có thêm một cánh cửa bước ra thế giới.", icon: BriefcaseBusiness },
  { code: "04", title: "Ban Nhân sự Sự kiện", text: "Xây văn hóa nội bộ, chăm sóc con người và tạo ra những trải nghiệm sự kiện đáng nhớ.", icon: Users },
];

const highlights = [
  { number: "06+", label: "năm xây cộng đồng" },
  { number: "04", label: "ban chuyên môn" },
  { number: "24", label: "dự án đã triển khai" },
  { number: "∞", label: "ý tưởng được lắng nghe" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HIEC — Câu lạc bộ Sáng tạo & Khởi nghiệp HUST" },
      { name: "description", content: "HIEC là cộng đồng sinh viên học bằng cách làm, kết nối bằng giá trị và tạo tác động thật." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <PublicLayout>
      <main>
        <section className="relative overflow-hidden border-b border-border px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full border-[40px] border-primary/20" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative z-10 animate-fade-up">
              <p className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-primary-deep dark:text-primary"><Sparkles className="size-4" /> HIEC / Since 2019</p>
              <h1 className="max-w-3xl font-sans text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Khởi nguồn sáng tạo,{" "}
                <span className="text-primary-deep dark:text-primary">
                  Dẫn lối thành công
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">Câu lạc bộ Sáng tạo & Khởi nghiệp HUST — nơi những người trẻ học bằng cách làm, kết nối bằng giá trị và cùng nhau tạo ra điều đáng tự hào.</p>
              <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-full px-7"><Link to="/signup">Tham gia HIEC <ArrowUpRight className="ml-2 size-4" /></Link></Button><Button asChild size="lg" variant="outline" className="rounded-full px-7"><a href="#lich-su">Khám phá câu chuyện <ArrowDownRight className="ml-2 size-4" /></a></Button></div>
              <div className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">{highlights.map((item) => <div key={item.label}><p className="text-2xl font-black">{item.number}</p><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{item.label}</p></div>)}</div>
            </div>
            <MovementGallery />
          </div>
        </section>

        <section id="lich-su" className="border-b border-border bg-card px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">01 / Lịch sử</p><h2 className="mt-4 max-w-md text-4xl font-black leading-tight sm:text-5xl">Mỗi chặng đường là một lần trưởng thành.</h2><p className="mt-6 max-w-sm leading-7 text-muted-foreground">Từ một nhóm sinh viên có chung sự tò mò, HIEC lớn lên nhờ những người dám bắt đầu, dám thử và dám làm lại.</p></div><div className="grid gap-0 border-l border-border">{history.map((item, index) => <article key={item.year} className="group relative border-b border-border px-7 py-6 last:border-b-0 sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4"><span className="absolute -left-[5px] top-8 size-2.5 rounded-full bg-primary ring-8 ring-card" /><p className="text-2xl font-black text-primary-deep dark:text-primary">{item.year}</p><div><h3 className="text-xl font-black group-hover:text-primary-deep dark:group-hover:text-primary">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></div></article>)}</div></div></div></section>

        <section id="co-cau" className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">02 / Cơ cấu phòng ban</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Một đội ngũ.<br />Bốn cách tạo giá trị.</h2></div><p className="max-w-sm text-sm leading-7 text-muted-foreground">Mỗi ban là một mảnh ghép độc lập, nhưng cùng vận hành để HIEC trở thành một hệ sinh thái học tập và hành động.</p></div><div className="grid gap-4 md:grid-cols-2">{departments.map((department) => { const Icon = department.icon; return <article key={department.code} className="group rounded-[2rem] border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-elevated"><div className="flex items-start justify-between"><span className="text-sm font-black text-primary-deep dark:text-primary">{department.code}</span><span className="grid size-11 place-items-center rounded-2xl bg-primary/20 text-primary-deep dark:text-primary"><Icon className="size-5" /></span></div><h3 className="mt-9 max-w-xs text-2xl font-black leading-tight">{department.title}</h3><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{department.text}</p></article>; })}</div></div></section>

        <section className="border-y border-border bg-card px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">03 / HIEC in action</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Học bằng cách làm.</h2></div><Link to="/projects" className="flex items-center gap-2 text-sm font-black text-primary-deep hover:underline dark:text-primary">Xem tất cả dự án <ArrowUpRight className="size-4" /></Link></div><div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]"><article className="min-h-[20rem] rounded-[2rem] bg-primary p-8 text-primary-foreground"><Building2 className="size-7" /><p className="mt-20 text-xs font-black uppercase tracking-widest opacity-70">Flagship program</p><h3 className="mt-3 max-w-md text-3xl font-black">HIEC Startup Bootcamp</h3><p className="mt-3 max-w-md text-sm leading-6 opacity-80">6 tuần biến một ý tưởng còn thô thành một câu chuyện có thể pitching.</p></article><article className="rounded-[2rem] border border-border bg-background p-7"><CalendarDays className="size-6 text-primary-deep dark:text-primary" /><p className="mt-16 text-xs font-black uppercase tracking-widest text-muted-foreground">Monthly</p><h3 className="mt-3 text-2xl font-black">HIEC Talk</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Đối thoại với người đang làm thật.</p></article><article className="rounded-[2rem] border border-border bg-background p-7"><ShieldCheck className="size-6 text-primary-deep dark:text-primary" /><p className="mt-16 text-xs font-black uppercase tracking-widest text-muted-foreground">Community</p><h3 className="mt-3 text-2xl font-black">Mentor Connect</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Kết nối đúng người, đúng thời điểm.</p></article></div></div></section>

        <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-border bg-primary/20 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">Make your move</p><h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">Ý tưởng thành tiền thật<br />Gia nhập HIEC ngay!</h2><p className="mt-5 max-w-xl text-muted-foreground">Nếu bạn muốn thử sức trong một môi trường nhiều năng lượng, HIEC đang chờ bạn.</p></div><div className="flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-full"><Link to="/signup">Đăng ký tham gia <ArrowUpRight className="ml-2 size-4" /></Link></Button><Button asChild size="lg" variant="outline" className="rounded-full"><a href={`mailto:${contactInfo.email}`}><Mail className="mr-2 size-4" /> Liên hệ</a></Button></div></div></section>
      </main>
    </PublicLayout>
  );
}
