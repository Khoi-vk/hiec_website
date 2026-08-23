import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";

import { ActionShowcase } from "@/components/home/action-showcase";
import { MovementGallery } from "@/components/home/movement-gallery";
import { NewsletterCard } from "@/components/home/newsletter-card";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { getHomeContent, type HomeContent } from "@/services/hiec-service";

export const Route = createFileRoute("/")({
  loader: async (): Promise<HomeContent> => await getHomeContent(),
  head: () => ({
    meta: [
      { title: "HIEC - Cau lac bo Sang tao & Khoi nghiep HUST" },
      {
        name: "description",
        content: "HIEC la cong dong sinh vien hoc bang cach lam, ket noi bang gia tri va tao tac dong that.",
      },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const data = Route.useLoaderData();
  const titleParts = data.hero.title.split(",");
  const timelinePoints = data.history.map((_, index) => ({
    x: ((index + 0.5) / Math.max(data.history.length, 1)) * 1000,
    y: index % 2 === 0 ? 70 : 130,
  }));
  const timelinePath = timelinePoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = timelinePoints[index - 1]!;
    const midpoint = (previous.x + point.x) / 2;
    return `${path} C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  return (
    <PublicLayout>
      <main className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#38bdf80d_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80d_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 z-0 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-500/10 via-primary/10 to-transparent blur-[120px] md:w-[900px]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[40%] z-0 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[140px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 z-[-10] size-[600px] select-none opacity-30 md:-right-40 md:-top-40 md:size-[900px] dark:opacity-20">
          <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full text-cyan-500/40">
            <circle cx="400" cy="400" r="280" stroke="currentColor" strokeWidth="36" className="text-cyan-500/20" />
            <circle cx="400" cy="400" r="340" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-cyan-400/40" />
            <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400/30" />
            <circle cx="400" cy="400" r="390" stroke="currentColor" strokeWidth="1" className="text-cyan-500/20" />
          </svg>
        </div>

        <div className="relative z-10">
          <section className="relative overflow-hidden border-b border-border px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
            <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full border-40 border-primary/20" />
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="relative z-10 animate-fade-up">
                <p className="mb-6 text-xs font-black uppercase tracking-[0.25em] text-primary-deep dark:text-primary">{data.hero.badge}</p>
                <h1 className="w-full max-w-4xl text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[56px]">
                  <span className="block whitespace-normal sm:whitespace-nowrap">{titleParts[0]},</span>
                  <span className="block whitespace-normal text-primary-deep sm:whitespace-nowrap dark:text-primary">{titleParts[1]?.trim()}</span>
                </h1>
                <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">{data.hero.description}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-full px-7">
                    <Link to="/signup">{data.hero.primaryBtnText} <ArrowUpRight className="ml-2 size-4" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                    <a href="#lich-su">{data.hero.secondaryBtnText} <ArrowDownRight className="ml-2 size-4" /></a>
                  </Button>
                </div>
                <div className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
                  {data.stats.map((item) => (
                    <div key={item.label}>
                      <p className="text-2xl font-black">{item.number}</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <MovementGallery gallery={data.gallery ?? []} />
            </div>
          </section>

          <section id="lich-su" className="border-b border-border bg-card px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">{data.historySection.badge}</p>
                  <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl">
                    {data.historySection.title}
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base md:pb-2">{data.historySection.description}</p>
              </div>
              <div className="-mx-5 touch-pan-x select-none overflow-x-auto px-5 pb-4 scrollbar-none md:mx-0 md:px-0">
                <div
                  className="relative h-[22rem] w-full"
                  style={{
                    minWidth: data.history.length > 5 ? `${data.history.length * 220}px` : undefined,
                  }}
                >
                  <svg aria-hidden="true" viewBox="0 0 1000 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-1/2 h-28 w-full -translate-y-1/2 overflow-visible md:h-36">
                    <defs>
                      <linearGradient id="timeline-road-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.3" />
                        <stop offset="0.5" stopColor="var(--color-primary)" stopOpacity="1" />
                        <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path d={timelinePath} fill="none" stroke="var(--color-primary)" strokeOpacity="0.15" strokeWidth="8" />
                    <path d={timelinePath} fill="none" stroke="url(#timeline-road-gradient)" strokeWidth="1.5" strokeDasharray="2 1.5" />
                  </svg>
                  <div
                    className="absolute inset-x-0 inset-y-0 grid grid-cols-5 gap-2 md:gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${Math.max(data.history.length, 5)}, minmax(0, 1fr))`,
                    }}
                  >
                  {data.history.map((item, index) => {
                    const point = timelinePoints[index]!;
                    const isAbove = index % 2 === 0;
                    return (
                      <article key={item.year + item.title} className="group relative min-w-0">
                        <div className={`absolute left-1/2 z-10 -translate-x-1/2 ${isAbove ? "top-[27%]" : "top-[53%]"}`}>
                          <span className="grid size-12 place-items-center rounded-full border-2 border-dashed border-primary bg-background/90 text-sm font-bold text-primary shadow-[0_0_0_8px_color-mix(in_oklab,var(--color-primary)_12%,transparent),0_0_28px_color-mix(in_oklab,var(--color-primary)_40%,transparent)] transition-transform group-hover:scale-110 md:size-16 md:text-base">
                            {item.year}
                          </span>
                        </div>
                        <span className={`absolute left-1/2 w-px -translate-x-1/2 bg-primary/50 ${isAbove ? "top-[18%] h-[9%]" : "top-[62%] h-[9%]"}`} />
                        <div className={`absolute left-0 right-0 rounded-xl border border-border bg-card/90 p-3.5 transition-all group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-elevated md:p-4 ${isAbove ? "top-0" : "bottom-0"}`}>
                          <h3 className="line-clamp-2 text-xs font-bold text-foreground group-hover:text-primary-deep md:text-sm dark:group-hover:text-primary">{item.title}</h3>
                          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground md:text-sm">{item.description}</p>
                        </div>
                      </article>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="co-cau" className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">{data.deptSection.badge}</p>
                  <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-5xl">{data.deptSection.title}</h2>
                </div>
                <p className="max-w-sm text-sm leading-7 text-muted-foreground">{data.deptSection.description}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {data.departments.map((department, index) => {
                  return (
                    <article key={department.code} className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-elevated">
                      <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                        <img src={department.imageUrl || ""} alt={department.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-sm font-bold text-white backdrop-blur-md">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="p-7">
                        <h3 className="text-xl font-bold text-foreground">{department.title}</h3>
                        <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{department.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="border-y border-border bg-card px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">{data.actionSection.badge}</p>
                  <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-5xl">{data.actionSection.title}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/activities" className="flex items-center gap-1.5 text-sm font-black text-primary-deep hover:underline dark:text-primary">{data.actionSection.allActivitiesText} <ArrowUpRight className="size-4" /></Link>
                  <span className="text-border">|</span>
                  <Link to="/projects" className="flex items-center gap-1.5 text-sm font-black text-primary-deep hover:underline dark:text-primary">{data.actionSection.allProjectsText} <ArrowUpRight className="size-4" /></Link>
                </div>
              </div>
              <ActionShowcase />
            </div>
          </section>

          <section className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-border bg-primary/20 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">{data.cta.tagline}</p>
                <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-5xl md:text-6xl">{data.cta.title}</h2>
                <p className="mt-5 max-w-xl text-muted-foreground">{data.cta.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full"><Link to="/signup">{data.cta.primaryBtnText} <ArrowUpRight className="ml-2 size-4" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="rounded-full"><a href={`mailto:${data.contact.email}`}><Mail className="mr-2 size-4" /> {data.cta.secondaryBtnText}</a></Button>
              </div>
            </div>
          </section>
          <NewsletterCard />
        </div>
      </main>
    </PublicLayout>
  );
}
