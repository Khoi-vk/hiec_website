import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ArrowRight, ChevronLeft, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { HiecLogo } from "@/components/ui/hiec-logo";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/activities")({
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAct, setSelectedAct] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchActivities() {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setActivities(data);
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <PublicLayout>
      {/* 1. BANNER - TỰ ĐỘNG ĐỔI MÀU NỀN VÀ CHỮ */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 pb-10 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-shrink-0 animate-fade-up">
              <Badge className="bg-cyan-100/50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-none mb-4 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]">
                Latest Events
              </Badge>
              {/* CHỮ LỚN: Sáng đen (slate-900) - Tối trắng (white) */}
              <h1 className="font-display text-7xl md:text-9xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.75]">
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
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin size-8 text-primary" /></div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activities.map((act) => (
                <div key={act.id} onClick={() => setSelectedAct(act)} className="group cursor-pointer">
                  <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800">
                    <div className="aspect-[16/10] overflow-hidden m-1.5 rounded-[1.5rem]">
                      <img src={act.imageUrl} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                    </div>
                    <CardContent className="p-6 pt-2">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-primary bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded">{act.date}</span>
                        <Sparkles className="size-3 text-primary/20" />
                      </div>
                      
                      {/* TIÊU ĐỀ CARD: Sáng đen - Tối trắng */}
                      <h3 className="font-display text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-tight uppercase tracking-tighter mb-2 line-clamp-2 min-h-[2.5rem]">
                        {act.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2 font-medium mb-5">{act.excerpt}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
                         <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase group-hover:text-primary transition-colors">Chi tiết</span>
                         <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="size-3.5" />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                  <Calendar className="size-4" /> Thời gian: {selectedAct.date}
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