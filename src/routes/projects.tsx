import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ArrowRight, ChevronLeft, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("displayOrder", { ascending: true });
      if (data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <PublicLayout>
      {/* 1. BANNER - CĂN CHỈNH LẠI LỀ ĐỒNG NHẤT */}
      <section className="relative overflow-hidden bg-white pt-16 pb-10 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-50/50 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            
            <div className="flex-shrink-0 animate-fade-up">
              <Badge className="bg-cyan-100/50 text-cyan-700 border-none mb-4 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]">
                Showcase
              </Badge>
              <h1 className="font-sans text-5xl md:text-6xl font-bold text-[#0f3d3e] uppercase tracking-[-0.04em] leading-[0.9]">
                Dự án
              </h1>
            </div>

            <div className="max-w-md md:border-l-2 border-cyan-500/20 md:pl-10 animate-fade-up [animation-delay:200ms] pb-2">
              <h2 className="text-[#0f3d3e] text-lg font-black uppercase tracking-tight mb-3">
                Hành trình sáng tạo tại HIEC HUST
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Nơi hiện thực hóa những ý tưởng đột phá của sinh viên Bách Khoa thành các giải pháp thực tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH - DÙNG CHUNG CONTAINER VỚI BANNER */}
      <section className="py-8 md:py-12 bg-slate-50/30 min-h-screen">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          {loading ? (
            <div className="flex justify-center py-10 text-cyan-600">
              <Loader2 className="animate-spin size-8" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => (
                <div key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer">
                  <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white border border-slate-100">
                    <div className="aspect-[16/10] overflow-hidden relative m-1.5 rounded-[1.5rem]">
                      <img 
                        src={project.imageUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={project.title}
                      />
                    </div>
                    <CardContent className="p-6 pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded">{project.year}</span>
                        <Sparkles className="size-3 text-cyan-200" />
                      </div>
                      <h3 className="font-display text-base font-black text-[#1a2e35] group-hover:text-cyan-600 transition-colors leading-tight uppercase tracking-tighter mb-2 line-clamp-2 min-h-[2.5rem]">
                        {project.title}
                      </h3>
                      <p className="text-slate-500 text-[11px] line-clamp-2 font-medium mb-5">{project.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                         <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Chi tiết</span>
                         <div className="size-8 rounded-lg bg-cyan-100/50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
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

      {/* 3. MODAL - GIỮ NGUYÊN */}
      <Modal open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)} title={selectedProject?.title}>
        {selectedProject && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar text-left font-sans">
            <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
               <img src={selectedProject.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Calendar className="size-4" /> Dự án: {selectedProject.year}
               </div>
               <div className="text-[#1a2e35]/80 leading-relaxed whitespace-pre-wrap font-medium text-sm md:text-base">
                 {selectedProject.content}
               </div>
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button variant="shimmer" className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border-none rounded-2xl px-6 py-5 font-bold uppercase text-[10px] tracking-widest" onClick={() => setSelectedProject(null)}>
                <ChevronLeft className="mr-2 size-4" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
