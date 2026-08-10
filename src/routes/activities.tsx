import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ArrowRight, ChevronLeft, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { supabase } from "@/utils/supabase";

// Sử dụng 'as any' để tránh lỗi treo Crawling nếu hệ thống chưa cập nhật kịp
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
        
        if (error) throw error;
        if (data) setActivities(data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <PublicLayout>
      {/* 1. BANNER SIÊU MỎNG & LÓNG LÁNH (MESH GRADIENT) */}
      <section className="relative overflow-hidden bg-[#0047AB] py-8 md:py-10 border-b border-white/10">
        {/* Hiệu ứng nền lấp lánh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.2),transparent),radial-gradient(circle_at_70%_80%,rgba(79,70,229,0.25),transparent)]"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/10 blur-[80px] rounded-full"></div>
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Hoạt động
              </h1>
              <p className="mt-2 text-blue-100/60 text-xs md:text-sm font-medium tracking-tight">
                Ghi lại những khoảnh khắc rực rỡ và hành trình kết nối của HIEC.
              </p>
            </div>
            <Badge className="w-fit bg-white/10 text-cyan-300 border-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              News & Events
            </Badge>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH THẺ HOẠT ĐỘNG */}
      <section className="py-12 bg-[#fafafa] min-h-[500px]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary size-8" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((act) => (
                <div 
                  key={act.id} 
                  onClick={() => setSelectedAct(act)}
                  className="group cursor-pointer"
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={act.imageUrl || "https://images.unsplash.com/photo-1523580494863-6f30312248f5?q=80&w=2070"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={act.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                         <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           Xem chi tiết <ArrowRight className="size-3" />
                         </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{act.date}</span>
                        <Sparkles className="size-3.5 text-primary/20" />
                      </div>
                      <h3 className="font-display text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tighter">
                        {act.title}
                      </h3>
                      <p className="mt-3 text-muted-foreground text-xs line-clamp-2 leading-relaxed font-medium">
                        {act.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {!loading && activities.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">Chưa có hoạt động nào được đăng tải.</div>
          )}
        </div>
      </section>

      {/* 3. CỬA SỔ CHI TIẾT (MODAL) */}
      <Modal
        open={!!selectedAct}
        onOpenChange={(open) => !open && setSelectedAct(null)}
        title={selectedAct?.title}
      >
        {selectedAct && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar text-left">
            <div className="w-full aspect-video rounded-2xl overflow-hidden border shadow-sm bg-muted">
               <img 
                 src={selectedAct.imageUrl || "https://images.unsplash.com/photo-1523580494863-6f30312248f5?q=80&w=2070"} 
                 className="w-full h-full object-cover"
                 alt={selectedAct.title}
               />
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                  <Calendar className="size-4" /> 
                  Ngày diễn ra: {selectedAct.date}
               </div>
               
               <div className="prose prose-sm max-w-none">
                  <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium text-sm md:text-base">
                    {selectedAct.content}
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <Button 
                variant="shimmer" 
                className="rounded-xl px-6 font-bold uppercase text-xs tracking-widest"
                onClick={() => setSelectedAct(null)}
              >
                <ChevronLeft className="mr-2 size-4" /> Đóng lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
