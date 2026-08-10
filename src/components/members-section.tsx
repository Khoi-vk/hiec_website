import * as React from "react";
import { supabase } from "@/utils/supabase";
import { User, Loader2 } from "lucide-react";

export function MembersSection() {
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("displayOrder", { ascending: true });
      
      if (!error && data) setMembers(data);
      setLoading(false);
    }
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  }
    return (
    <section id="thanh-vien" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* PHẦN TIÊU ĐỀ ĐÃ ĐƯỢC THỐNG NHẤT FONT CHỮ */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Nhân sự
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl uppercase">
            Thành viên
          </h2>
          <div className="mt-4 h-1.5 w-20 bg-primary mx-auto rounded-full" />
        </div>

      {/* ... (Phần danh sách members bên dưới giữ nguyên) ... */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div 
              key={member.id} 
              className="group bg-card/50 backdrop-blur-sm rounded-[2rem] p-6 border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-xl hover:-translate-y-2"
            >
              <div className="relative flex flex-col items-center">
                {/* Khung ảnh chân dung */}
                <div className="relative size-40 mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all duration-500" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
                    {member.avatarUrl ? (
                      <img 
                        src={member.avatarUrl} 
                        alt={member.fullName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <User className="size-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Nội dung thông tin */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {member.fullName}
                  </h3>
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      {member.position}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                    {member.department}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
