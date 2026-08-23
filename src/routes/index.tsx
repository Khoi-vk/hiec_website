import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import * as Icons from "lucide-react";

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
  const departmentIcons = {
    "01": Icons.Network,
    "02": Icons.Megaphone,
    "03": Icons.BriefcaseBusiness,
    "04": Icons.Users,
  };

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
              <MovementGallery />
            </div>
          </section>

          <section id="lich-su" className="border-b border-border bg-card px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-deep dark:text-primary">{data.historySection.badge}</p>
                  <h2 className="mt-4 max-w-4xl text-2xl font-extrabold leading-[1.2] tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-[44px]">{data.historySection.title}</h2>
                  <p className="mt-6 max-w-sm leading-7 text-muted-foreground">{data.historySection.description}</p>
                </div>
                <div className="grid gap-0 border-l border-border">
                  {data.history.map((item) => (
                    <article key={item.year + item.title} className="group relative border-b border-border px-7 py-6 last:border-b-0 sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
                      <span className="absolute -left-1.25 top-8 size-2.5 rounded-full bg-primary ring-8 ring-card" />
                      <p className="text-2xl font-black text-primary-deep dark:text-primary">{item.year}</p>
                      <div>
                        <h3 className="text-xl font-black group-hover:text-primary-deep dark:group-hover:text-primary">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                    </article>
                  ))}
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
              <div className="grid gap-4 md:grid-cols-2">
                {data.departments.map((department, index) => {
                  const Icon = departmentIcons[department.code as keyof typeof departmentIcons] || Icons.Users;
                  return (
                    <article key={department.code} className="group rounded-[2rem] border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-elevated">
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-black text-primary-deep dark:text-primary">{String(index + 1).padStart(2, "0")}</span>
                        <span className="grid size-11 place-items-center rounded-2xl bg-primary/20 text-primary-deep dark:text-primary"><Icon className="size-5" /></span>
                      </div>
                      <h3 className="mt-9 max-w-xs text-2xl font-black leading-tight">{department.title}</h3>
                      <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{department.text}</p>
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
