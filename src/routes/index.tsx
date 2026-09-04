import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";

import { ActionShowcase } from "@/components/home/action-showcase";
import { MovementGallery } from "@/components/home/movement-gallery";
import { NewsletterCard } from "@/components/home/newsletter-card";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getHomeContent, type HomeContent } from "@/services/hiec-service";

export const Route = createFileRoute("/")({
  loader: async (): Promise<HomeContent> => await getHomeContent(),
  head: () => ({
    meta: [
      { title: "HIEC - Cau lac bo Sang tao & Khoi nghiep HUST" },
      {
        name: "description",
        content:
          "HIEC la cong dong sinh vien hoc bang cach lam, ket noi bang gia tri va tao tac dong that.",
      },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const data = Route.useLoaderData();
  const titleParts = data.hero.title.split(",");
  const [followOpen, setFollowOpen] = React.useState(false);

  return (
    <PublicLayout>
      <main className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#38bdf80d_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80d_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-0 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-500/10 via-primary/10 to-transparent blur-[120px] md:w-[900px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-[40%] z-0 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 z-[-10] size-[600px] select-none opacity-30 md:-right-40 md:-top-40 md:size-[900px] dark:opacity-20"
        >
          <svg
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-full text-cyan-500/40"
          >
            <circle
              cx="400"
              cy="400"
              r="280"
              stroke="currentColor"
              strokeWidth="36"
              className="text-cyan-500/20"
            />
            <circle
              cx="400"
              cy="400"
              r="340"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 8"
              className="text-cyan-400/40"
            />
            <circle
              cx="400"
              cy="400"
              r="200"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-cyan-400/30"
            />
            <circle
              cx="400"
              cy="400"
              r="390"
              stroke="currentColor"
              strokeWidth="1"
              className="text-cyan-500/20"
            />
          </svg>
        </div>

        <div className="relative z-10">
          <section className="relative overflow-hidden border-b border-border px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
            <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full border-40 border-primary/20" />
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="relative z-10 animate-fade-up">
                <p className="mb-6 text-xs font-black uppercase tracking-[0.25em] text-primary-deep dark:text-primary">
                  {data.hero.badge}
                </p>
                <h1 className="w-full max-w-4xl text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[56px]">
                  <span className="block whitespace-normal sm:whitespace-nowrap">
                    {titleParts[0]},
                  </span>
                  <span className="block whitespace-normal text-primary-deep sm:whitespace-nowrap dark:text-primary">
                    {titleParts[1]?.trim()}
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {data.hero.description}
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="rounded-full px-7"
                    onClick={() => setFollowOpen(true)}
                  >
                    {data.hero.primaryBtnText} <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                    <a href="#lich-su">
                      {data.hero.secondaryBtnText} <ArrowDownRight className="ml-2 size-4" />
                    </a>
                  </Button>
                </div>
                <div className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
                  {data.stats.map((item) => (
                    <div key={item.label}>
                      <p className="text-2xl font-black">{item.number}</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <MovementGallery gallery={data.gallery ?? []} />
            </div>
          </section>

          <section
            id="lich-su"
            className="border-b border-border bg-card px-5 py-10 lg:px-8 lg:py-10"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">
                    {data.historySection.badge}
                  </p>
                  <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl">
                    {data.historySection.title}
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base md:pb-2">
                  {data.historySection.description}
                </p>
              </div>
              <div className="-mx-5 touch-pan-x select-none overflow-x-auto px-5 pb-4 scrollbar-none md:mx-0 md:px-0">
                <div
                  className="relative min-w-[760px] py-8 md:min-w-0"
                  style={{
                    width: data.history.length > 5 ? `${data.history.length * 220}px` : "100%",
                  }}
                >
                  <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-[2px] -translate-y-1/2 bg-primary/30" />
                  <div
                    className="relative z-10 grid grid-cols-4 gap-4 md:grid-cols-5 md:gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${Math.max(data.history.length, 4)}, minmax(0, 1fr))`,
                    }}
                  >
                    {data.history.map((item, index) => {
                      const isAbove = index % 2 === 0;
                      return (
                        <article
                          key={item.year + item.title}
                          className="group flex min-h-[22rem] min-w-0 flex-col items-center text-center"
                        >
                          <div className="flex w-full flex-1 flex-col items-center justify-end">
                            {isAbove && (
                              <>
                                <div className="w-full rounded-xl border border-border bg-card/90 p-3.5 text-left shadow-md transition-all group-hover:-translate-y-1 group-hover:border-primary/50 md:p-4">
                                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary-deep md:text-base dark:group-hover:text-primary">
                                    {item.title}
                                  </h3>
                                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
                                    {item.description}
                                  </p>
                                </div>
                                <span className="h-5 w-[2px] shrink-0 bg-primary/50" />
                              </>
                            )}
                          </div>
                          <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-xs font-mono font-bold text-primary-deep dark:text-primary shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-transform group-hover:scale-110 md:size-14 md:text-sm">
                            {item.year}
                          </span>
                          <div className="flex w-full flex-1 flex-col items-center justify-start">
                            {!isAbove && (
                              <>
                                <span className="h-5 w-[2px] shrink-0 bg-primary/50" />
                                <div className="w-full rounded-xl border border-border bg-card/90 p-3.5 text-left shadow-md transition-all group-hover:translate-y-1 group-hover:border-primary/50 md:p-4">
                                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary-deep md:text-base dark:group-hover:text-primary">
                                    {item.title}
                                  </h3>
                                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
                                    {item.description}
                                  </p>
                                </div>
                              </>
                            )}
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
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">
                    {data.deptSection.badge}
                  </p>
                  <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-5xl">
                    {data.deptSection.title}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-7 text-muted-foreground">
                  {data.deptSection.description}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {data.departments.map((department, index) => {
                  return (
                    <article
                      key={department.code}
                      className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-elevated"
                    >
                      <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                        <img
                          src={department.imageUrl || ""}
                          alt={department.title}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-sm font-bold text-white backdrop-blur-md">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="p-7">
                        <h3 className="text-xl font-bold text-foreground">{department.title}</h3>
                        <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                          {department.text}
                        </p>
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
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">
                    {data.actionSection.badge}
                  </p>
                  <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-5xl">
                    {data.actionSection.title}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    to="/activities"
                    className="flex items-center gap-1.5 text-sm font-black text-primary-deep hover:underline dark:text-primary"
                  >
                    {data.actionSection.allActivitiesText} <ArrowUpRight className="size-4" />
                  </Link>
                  <span className="text-border">|</span>
                  <Link
                    to="/projects"
                    className="flex items-center gap-1.5 text-sm font-black text-primary-deep hover:underline dark:text-primary"
                  >
                    {data.actionSection.allProjectsText} <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
              <ActionShowcase />
            </div>
          </section>

          <section className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-border bg-primary/20 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">
                  {data.cta.tagline}
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-5xl md:text-6xl">
                  {data.cta.title}
                </h2>
                <p className="mt-5 max-w-xl text-muted-foreground">{data.cta.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <a href={`mailto:${data.contact.email}`}>
                    <Mail className="mr-2 size-4" /> {data.cta.secondaryBtnText}
                  </a>
                </Button>
              </div>
            </div>
          </section>
          <NewsletterCard />
        </div>
      </main>

      <Dialog open={followOpen} onOpenChange={setFollowOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-lg overflow-y-auto border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Đăng ký nhận thông tin</DialogTitle>
          <NewsletterCard popup />
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
