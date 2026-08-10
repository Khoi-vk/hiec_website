import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ArrowRight, ChevronLeft, Calendar, Rocket } from "lucide-react";
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
      {/* 1. BANNER SIÊU MỎNG & FONT ĐỒNG BỘ LOGO */}
      <section className="relative overflow-hidden bg-[#0047AB] py-6 md:py-8 border-b border-white/10">
        {/* Hiệu ứng nền lóng lánh (Mesh Gradient) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.2),transparent),radial-gradient(circle_at_70%_80%,rgba(79,70,229,0.25),transparent)]"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/10 blur-[80px] rounded-full"></div>
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Dự án
              </h1>
              <p className="mt-2 text-blue-100/60 text-xs md:text-sm font-medium tracking-tight">
                Hành trình hiện thực hóa các ý tưởng đột phá của sinh viên HIEC.
              </p>
            </div>
            <Badge className="w-fit bg-white/10 text-cyan-300 border-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-black tracking-widest uppercase">
              Showcase 2025
            </Badge>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH DỰ ÁN */}
      <section className="py-12 bg-[#fafafa] min-h-[600px]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary size-8" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đang kết nối dữ liệu...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer"
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={project.imageUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={project.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                         <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           Nhấn để xem chi tiết <ArrowRight className="size-3" />
                         </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{project.year}</span>
                        <Rocket className="size-3.5 text-primary/20" />
                      </div>
                      <h3 className="font-display text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tighter">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-muted-foreground text-xs line-clamp-2 leading-relaxed font-medium">
                        {project.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. CỬA SỔ CHI TIẾT (MODAL) */}
      <Modal
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="w-full aspect-video rounded-2xl overflow-hidden border shadow-sm">
               <img 
                 src={selectedProject.imageUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070"} 
                 className="w-full h-full object-cover"
               />
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                  <Calendar className="size-4" /> 
                  Dự án năm {selectedProject.year}
               </div>
               
               <div className="prose prose-sm max-w-none">
                  <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium text-sm md:text-base">
                    {selectedProject.content}
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <Button 
                variant="shimmer" 
                className="rounded-xl px-6 font-bold uppercase text-xs tracking-widest"
                onClick={() => setSelectedProject(null)}
              >
                <ChevronLeft className="mr-2 size-4" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}