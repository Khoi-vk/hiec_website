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
  Zap,
} from "lucide-react";

import { PublicLayout } from "@/components/layout/public-layout";
import { MovementGallery } from "@/components/home/movement-gallery";
import { Button } from "@/components/ui/button";
import { contactInfo, history } from "@/services/hiec-service";

const departments = [
  { 
    code: "01", 
    title: "Ban Phát triển chiến lược", 
    text: "Tiền trạm dẫn dắt tầm nhìn HIEC. Ban chịu trách nhiệm nghiên cứu xu hướng thị trường, xây dựng khung chương trình học thuật và đo lường tác động xã hội để đảm bảo mọi dự án luôn đi đúng quỹ đạo và tạo giá trị thực chất.", 
    icon: Network 
  },
  { 
    code: "02", 
    title: "Ban Truyền thông", 
    text: "Tiếng nói và diện mạo của HIEC. Nơi biến những thông điệp khởi nghiệp khô khan thành những câu chuyện truyền cảm hứng thông qua thiết kế sáng tạo, sản xuất nội dung đa phương tiện và quản lý các kênh truyền thông chuyên nghiệp.", 
    icon: Megaphone 
  },
  { 
    code: "03", 
    title: "Ban Đối ngoại", 
    text: "Cầu nối giữa sinh viên và hệ sinh thái doanh nghiệp. Ban phụ trách thiết lập mạng lưới mentor đầu ngành, tìm kiếm nhà tài trợ và đàm phán các quan hệ hợp tác chiến lược, mở rộng cơ hội cho toàn bộ thành viên.", 
    icon: BriefcaseBusiness 
  },
  { 
    code: "04", 
    title: "Ban Nhân sự Sự kiện", 
    text: "Linh hồn của văn hóa nội bộ và những sự kiện bùng nổ. Vừa là hậu phương chăm sóc trải nghiệm, gắn kết thành viên, vừa là đội ngũ trực tiếp vận hành các workshop, bootcamp chuyên nghiệp mang thương hiệu HIEC.", 
    icon: Users 
  },
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
      { title: "HIEC — Câu lạc bộ Sáng tạo và Khởi nghiệp HUST" },
      { name: "description", content: "Câu lạc bộ Sáng tạo và Khởi nghiệp HUST — nơi những người trẻ học bằng cách làm, kết nối bằng giá trị." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <PublicLayout>
      <main className="text-left font-sans">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-white px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full border-[40px] border-cyan-500/5" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative z-10 animate-fade-up">
              <p className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#0f3d3e]">
                <Sparkles className="size-4 text-cyan-500" /> HIEC HUST / Since 2019
              </p>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-tighter sm:text-6xl lg:text-8xl uppercase text-[#0f3d3e]">
                Ý tưởng sinh viên,<br />
                <span className="text-cyan-500">tác động thật</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-500 sm:text-lg font-medium">
                <strong>Câu lạc bộ Sáng tạo và Khởi nghiệp HUST</strong> — nơi những người trẻ học bằng cách làm, kết nối bằng giá trị và cùng nhau tạo ra điều đáng tự hào.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-8 py-7 bg-[#0f3d3e] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/10 transition-all hover:scale-105">
                  <Link to="/signup">Tham gia HIEC <ArrowUpRight className="ml-2 size-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-7 border-slate-200 font-bold uppercase tracking-widest text-xs hover:bg-slate-50">
                  <a href="#lich-su">Khám phá câu chuyện <ArrowDownRight className="ml-2 size-4" /></a>
                </Button>
              </div>
              <div className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-slate-100 pt-8 sm:grid-cols-4">
                {highlights.map((item) => (
                  <div key={item.label}>
                    <p className="text-3xl font-black text-[#0f3d3e]">{item.number}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <MovementGallery />
          </div>
        </section>

        {/* --- SECTION 01: LỊCH SỬ --- */}
        <section id="lich-su" className="border-b border-slate-50 bg-[#fafafa] px-5 py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl text-left">
            <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-600 mb-4">01 / Lịch sử</p>
                <h2 className="text-4xl font-black leading-tight sm:text-5xl uppercase tracking-tighter text-[#0f3d3e]">Mỗi chặng đường <br /> là một lần <br /> trưởng thành.</h2>
                <p className="mt-8 max-w-sm leading-7 text-slate-500 font-medium">Từ nhóm sinh viên Gen 1 đầy hoài bão, HIEC lớn lên nhờ những người dám bắt đầu, dám thử và dám làm lại.</p>
              </div>
              <div className="grid gap-0 border-l-2 border-cyan-500/10">
                {history.map((item) => (
                  <article key={item.year} className="group relative border-b border-slate-100 px-8 py-10 last:border-b-0 transition-colors hover:bg-white/50">
                    <span className="absolute -left-[6px] top-12 size-2.5 rounded-full bg-cyan-500 ring-4 ring-white" />
                    <p className="text-3xl font-black text-cyan-600/30 group-hover:text-cyan-600 transition-colors italic mb-2">{item.year}</p>
                    <h3 className="text-xl font-black uppercase tracking-tight text-[#0f3d3e]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500 font-medium max-w-xl">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 02: CƠ CẤU PHÒNG BAN --- */}
        <section id="co-cau" className="px-5 py-20 lg:px-8 lg:py-32 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 flex flex-wrap items-end justify-between gap-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-600 mb-4">02 / Cơ cấu phòng ban</p>
                <h2 className="text-4xl font-black sm:text-6xl uppercase tracking-tighter text-[#0f3d3e]">Một đội ngũ.<br />Bốn cách tạo giá trị.</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-slate-500 font-medium border-l-2 border-cyan-500/20 pl-6">Mỗi ban vận hành như những startup nhỏ trong lòng HIEC để tạo nên một hệ sinh thái hành động vững chắc.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {departments.map((department) => {
                const Icon = department.icon;
                return (
                  <article key={department.code} className="group rounded-[3rem] border border-slate-100 bg-slate-50/30 p-10 transition-all hover:border-cyan-500/30 hover:bg-white hover:shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-5">
                      <span className="grid size-14 place-items-center rounded-2xl bg-white shadow-sm text-[#0f3d3e] group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                        <Icon className="size-6" />
                      </span>
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{department.code} / Dept</span>
                    </div>
                    <h3 className="mt-8 text-2xl font-black uppercase tracking-tight text-[#0f3d3e]">{department.title}</h3>
                    <p className="mt-5 text-sm text-slate-500 leading-7 font-medium text-justify">{department.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- SECTION 03: HIEC IN ACTION (BENTO GRID) --- */}
        <section id="action" className="border-y border-slate-100 bg-[#fafafa] px-5 py-20 lg:px-8 lg:py-32 relative overflow-hidden text-left">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.03),transparent)] pointer-events-none" />
          
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-600 mb-4">03 / HIEC in action</p>
                <h2 className="text-4xl font-black sm:text-6xl uppercase tracking-tighter text-[#0f3d3e]">Học bằng cách làm.</h2>
              </div>
              <Button asChild variant="link" className="font-black text-[#0f3d3e] p-0 h-auto hover:text-cyan-600 transition-colors uppercase tracking-widest text-xs">
                <Link to="/projects" className="flex items-center gap-2">Xem tất cả dự án <ArrowUpRight className="size-4" /></Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-2">
              <article className="lg:col-span-7 lg:row-span-2 relative rounded-[3.5rem] bg-[#0f3d3e] p-12 text-white overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,255,255,0.12),transparent)]" />
                <div className="relative z-10 h-full flex flex-col items-start text-left">
                  <div className="size-16 rounded-2xl bg-cyan-400/20 flex items-center justify-center border border-cyan-400/30 mb-20">
                    <Building2 className="size-8 text-cyan-400" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-4">Flagship program</p>
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">HIEC Startup <br /> Bootcamp</h3>
                  <p className="max-w-md text-blue-50/60 text-lg font-medium leading-relaxed mb-10">Hành trình 6 tuần thực chiến, biến những ý tưởng công nghệ thô sơ thành dự án có thể gọi vốn.</p>
                  <Button asChild variant="shimmer" className="bg-cyan-500 hover:bg-cyan-400 text-[#0f3d3e] font-black uppercase tracking-widest px-10 py-8 rounded-2xl text-xs cursor-pointer">
                    <Link to="/activities">KHÁM PHÁ NGAY</Link>
                  </Button>
                </div>
              </article>

              <article className="lg:col-span-5 lg:row-span-1 rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm flex flex-col group hover:shadow-xl transition-all">
                <div className="size-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-16">
                  <CalendarDays className="size-7 text-amber-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Monthly Event</p>
                <h3 className="text-3xl font-black uppercase tracking-tight text-[#0f3d3e]">HIEC Talk</h3>
                <p className="mt-4 text-slate-500 font-medium">Đối thoại trực diện với các Founders và chuyên gia thực chiến.</p>
              </article>

              <article className="lg:col-span-5 lg:row-span-1 rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm flex flex-col group hover:shadow-xl transition-all">
                <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-16">
                  <ShieldCheck className="size-7 text-blue-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Community</p>
                <h3 className="text-3xl font-black uppercase tracking-tight text-[#0f3d3e]">Mentor Connect</h3>
                <p className="mt-4 text-slate-500 font-medium">Mạng lưới cố vấn chuyên môn đồng hành cùng dự án.</p>
              </article>
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA (4 DÒNG) --- */}
        <section className="px-5 py-20 lg:px-8 lg:py-40 bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 rounded-[4rem] border border-slate-100 bg-white p-10 sm:p-20 lg:grid-cols-[1.2fr_auto] lg:items-end relative overflow-hidden shadow-2xl shadow-slate-200/50">
            <div className="absolute -top-24 -right-24 size-96 bg-cyan-100/40 blur-[120px] rounded-full" />
            <div className="relative z-10 text-left">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-600 mb-10">Make your move</p>
              <h2 className="text-6xl font-black leading-[0.85] sm:text-7xl lg:text-[110px] uppercase tracking-tighter text-[#0f3d3e]">
                Đừng chỉ có <br />
                <span className="text-cyan-500">ý tưởng.</span> <br />
                Hãy biến nó <br />
                <span className="text-cyan-500">thành thật.</span>
              </h2>
              <p className="mt-12 max-w-md text-slate-400 font-medium text-lg md:text-xl italic leading-relaxed border-l-4 border-cyan-500/20 pl-8">
                HIEC không hứa hẹn một hành trình dễ dàng, <br />
                nhưng chúng tôi hứa hẹn một hành trình rực rỡ nhất.
              </p>
            </div>

            <div className="flex flex-col gap-6 relative z-10 w-full sm:max-w-[340px]">
              <Button asChild size="lg" className="rounded-[2rem] px-12 py-14 text-2xl font-black uppercase tracking-widest bg-cyan-400 text-[#0f3d3e] hover:bg-cyan-300 shadow-[0_20px_50px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95 border-none cursor-pointer">
                <Link to="/signup" className="flex items-center justify-between w-full">
                  ĐĂNG KÝ NGAY <ArrowUpRight className="size-10" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-[2rem] px-12 py-10 text-lg font-bold uppercase tracking-widest border-2 border-slate-100 bg-slate-50/50 text-[#0f3d3e] hover:bg-white transition-all shadow-sm">
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}`} target="_blank" className="flex items-center justify-center gap-3">
                  <Mail className="size-6" /> LIÊN HỆ GMAIL
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}