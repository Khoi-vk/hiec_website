import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ArrowRight, ChevronLeft, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { supabase } from "@/utils/supabase";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/activities")({
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAct, setSelectedAct] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState("Tất cả");
  const [selectedPeriod, setSelectedPeriod] = React.useState("Tất cả");

  React.useEffect(() => {
    async function fetchActivities() {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("status", "published")
          .order("event_date", { ascending: false });
        if (data) setActivities(data);
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const allTags = Array.from(
    new Set(
      activities.flatMap((activity) => activity.tags ?? [])
    )
  );

  const allPeriods = Array.from(
    new Set(
      activities
        .filter((activity) => activity.event_date)
        .flatMap((activity) => {
          const date = new Date(`${activity.event_date}T00:00:00`);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const quarter = Math.ceil(month / 3);
  
          return [
            `T${month}/${year}`,
            `Q${quarter}/${year}`,
          ];
        })
    )
  );

  const filteredActivities = activities.filter((activity) => {
    const keyword = searchTerm.trim().toLowerCase();
  
    const matchesSearch =
      !keyword ||
      activity.title?.toLowerCase().includes(keyword) ||
      activity.excerpt?.toLowerCase().includes(keyword);
  
    const matchesTag =
      selectedTag === "Tất cả" ||
      activity.tags?.includes(selectedTag);
  
    const matchesPeriod =
      selectedPeriod === "Tất cả" ||
      (() => {
        if (!activity.event_date) return false;
    
        const date = new Date(`${activity.event_date}T00:00:00`);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const quarter = Math.ceil(month / 3);
    
        return (
          selectedPeriod === `T${month}/${year}` ||
          selectedPeriod === `Q${quarter}/${year}`
        );
      })();
    
    return matchesSearch && matchesTag && matchesPeriod;
  });

  const timelineGroups = filteredActivities.reduce<
    Record<
      string,
      Record<
        string,
        Record<string, any[]>
      >
    >
  >((groups, activity) => {
    if (!activity.event_date) return groups;
  
    const date = new Date(`${activity.event_date}T00:00:00`);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
  
    const yearKey = `${year}`;
    const quarterKey = `Q${quarter}`;
    const monthKey = `Tháng ${month}`;
  
    if (!groups[yearKey]) {
      groups[yearKey] = {};
    }
  
    if (!groups[yearKey][quarterKey]) {
      groups[yearKey][quarterKey] = {};
    }
  
    if (!groups[yearKey][quarterKey][monthKey]) {
      groups[yearKey][quarterKey][monthKey] = [];
    }
  
    groups[yearKey][quarterKey][monthKey].push(activity);
  
    return groups;
  }, {});

  return (
    <PublicLayout>
      {/* 1. BANNER - TỰ ĐỘNG ĐỔI MÀU NỀN VÀ CHỮ */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 pb-10 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-shrink-0 animate-fade-up">
              
              {/* CHỮ LỚN: Sáng đen (slate-900) - Tối trắng (white) */}
              <h1 className="font-sans text-5xl md:text-6xl font-bold text-[#0f3d3e] dark:text-white uppercase tracking-[-0.04em] leading-[0.9] transition-colors">
                Hoạt động
              </h1>
            </div>
            <div className="max-w-md md:border-l-2 border-slate-200 dark:border-slate-800 md:pl-10 pb-2 animate-fade-up [animation-delay:200ms]">
              <h2 className="text-slate-800 dark:text-slate-200 text-lg font-black uppercase tracking-tight mb-3">Nhịp đập sáng tạo</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ghi lại những khoảnh khắc bùng nổ của cộng đồng HIEC.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH CARD */}
      <section className="py-12 bg-slate-50/30 dark:bg-slate-900/20 min-h-[600px] transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Tìm kiếm hoạt động..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 sm:max-w-md"
            />
          
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >

              <option value="Tất cả">
                Tất cả chuyên mục
              </option>
          
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="Tất cả">
                Tất cả thời gian
              </option>
            
              {allPeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
              </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin size-8 text-primary" /></div>
          ) : (
            <div className="space-y-14">
              {Object.entries(timelineGroups)
                .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                .map(([year, quarters]) => (
                <section key={year}>
                  {/* =========================
                      NĂM
                  ========================= */}
                  <div className="mb-8 flex items-center gap-4">
                    <h2 className="text-3xl font-black tracking-tight text-[#0f3d3e] dark:text-white">
                      {year}
                    </h2>
            
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  </div>
            
                  {/* =========================
                      CÁC QUÝ
                  ========================= */}
                  <div className="space-y-10">
                    {Object.entries(quarters)
                      .sort(
                        ([quarterA], [quarterB]) =>
                          Number(quarterB.replace("Q", "")) -
                          Number(quarterA.replace("Q", ""))
                      )
                      .map(([quarter, months]) => (
                      <div key={quarter}>
                        {/* QUÝ */}
                        <div className="mb-5 flex items-center gap-3">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-900 dark:bg-primary/10 dark:text-primary">
                            {quarter}
                          </span>
                        </div>
            
                        {/* =========================
                            CÁC THÁNG
                        ========================= */}
                        <div className="space-y-8">
                          {Object.entries(months)
                            .sort(
                              ([monthA], [monthB]) =>
                                Number(monthB.replace("Tháng ", "")) -
                                Number(monthA.replace("Tháng ", ""))
                            )
                            .map(([month, monthActivities]) => (
                              <div key={month}>
                                {/* THÁNG */}
                                <h3 className="mb-4 text-sm font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                                  {month}
                                </h3>
            
                                {/* =========================
                                    GRID CARD
                                ========================= */}
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                  {monthActivities.map((act) => (
                                    <div
                                      key={act.id}
                                      onClick={() => setSelectedAct(act)}
                                      className="group cursor-pointer"
                                    >
                                      {/* THẺ BÀI VIẾT - GIỮ NGUYÊN */}
                                      <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800">
            
                                        {/* ẢNH */}
                                        <div className="aspect-[16/10] overflow-hidden m-1.5 rounded-[1.5rem] shrink-0">
                                          <img
                                            src={act.imageUrl}
                                            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            alt=""
                                          />
                                        </div>
            
                                        {/* NỘI DUNG */}
                                        <CardContent className="flex flex-col grow p-6 pt-2">
            
                                          {/* NGÀY */}
                                          <div className="mb-3 flex items-center">
                                            <span className="text-[10px] font-bold text-slate-900 bg-white dark:bg-primary/10 dark:text-primary px-2 py-0.5 rounded">
                                              {act.event_date
                                                ? new Date(
                                                    `${act.event_date}T00:00:00`,
                                                  ).toLocaleDateString("vi-VN")
                                                : "—"}
                                            </span>
                                          </div>
            
                                          {/* TAG */}
                                          <div className="mb-3 flex flex-wrap gap-1">
                                            {(act.tags ?? []).map((tag: string) => (
                                              <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="text-[9px]"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
            
                                          {/* TIÊU ĐỀ */}
                                          <h3 className="font-display text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-tight uppercase tracking-tighter mb-2 line-clamp-2 min-h-[2.5rem]">
                                            {act.title}
                                          </h3>
            
                                          {/* MÔ TẢ */}
                                          <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2 font-medium mb-5">
                                            {act.excerpt}
                                          </p>
            
                                          {/* CHI TIẾT */}
                                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
                                            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase group-hover:text-primary transition-colors">
                                              Chi tiết
                                            </span>
            
                                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                              <ArrowRight className="size-3.5" />
                                            </div>
                                          </div>
            
                                        </CardContent>
                                      </Card>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. MODAL CHI TIẾT */}
      <Modal 
        open={!!selectedAct} 
        onOpenChange={(open) => !open && setSelectedAct(null)} 
        title={
          <div className="flex flex-col gap-4 text-left">
            {/* Logo tự động đổi màu theo mode */}
            <HiecLogo /> 
            <span className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black uppercase tracking-tighter mt-2 block">
              {selectedAct?.title}
            </span>
          </div>
        }
      >
        {selectedAct && (
          <div className="space-y-8 py-2 text-left bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-2xl">
               <img src={selectedAct.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400 font-black text-[11px] uppercase tracking-[0.3em] bg-slate-50 dark:bg-white/5 w-fit px-4 py-2 rounded-full border border-slate-100 dark:border-white/10">
                <Calendar className="size-4" />
                Thời gian:{" "}
                {selectedAct.event_date
                  ? new Date(`${selectedAct.event_date}T00:00:00`).toLocaleDateString(
                      "vi-VN"
                    )
                  : "Chưa cập nhật"}
              </div>
               
               {/* NỘI DUNG CHÍNH: Tự động đảo màu đen/trắng */}
               <div className="text-slate-800 dark:text-slate-100 text-lg md:text-xl leading-loose whitespace-pre-wrap font-medium">
                 {selectedAct.content}
               </div>
            </div>

            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button 
                variant="shimmer" 
                className="rounded-2xl px-12 py-7 font-black uppercase text-xs tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                onClick={() => setSelectedAct(null)}
              >
                <ChevronLeft className="mr-2 size-5" /> Đóng bài viết
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
