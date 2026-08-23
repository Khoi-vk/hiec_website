import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, User, ChevronLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PublicLayout } from "@/components/layout/public-layout";
import { MemberOrgBoard } from "@/components/members/member-org-board";
import {
  getAllMembers,
  getMemberLayoutConfig,
  sanitizeBoards,
  type Member,
  type MemberLayoutConfig,
  type MemberTier,
  DEFAULT_MEMBER_LAYOUT,
} from "@/services/member-layout-service";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Cơ cấu CLB — HIEC HUST" },
      {
        name: "description",
        content:
          "Cơ cấu tổ chức và nhân sự nòng cốt Câu lạc bộ Khởi nghiệp & Đổi mới Sáng tạo HIEC.",
      },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [layoutConfig, setLayoutConfig] = React.useState<MemberLayoutConfig>(DEFAULT_MEMBER_LAYOUT);
  const [loading, setLoading] = React.useState(true);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [fetchedMembers, fetchedConfig] = await Promise.all([
          getAllMembers(),
          getMemberLayoutConfig(),
        ]);
        setMembers(fetchedMembers);
        setLayoutConfig(fetchedConfig);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu thành viên và cơ cấu:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Map for O(1) lookup
  const memberMap = React.useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  const displayBoards = React.useMemo(
    () => sanitizeBoards(layoutConfig.boards, members),
    [layoutConfig.boards, members],
  );

  return (
    <PublicLayout>
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-10 pb-8 md:pt-16 md:pb-12 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/40 dark:bg-cyan-900/15 blur-[120px] rounded-full -z-10 transition-colors" />
        <div className="absolute -bottom-10 left-10 w-[350px] h-[350px] bg-sky-100/40 dark:bg-sky-900/10 blur-[100px] rounded-full -z-10 transition-colors" />

        <div className="max-w-[1300px] mx-auto px-6 md:px-12 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
            <div className="flex-shrink-0 animate-fade-up">
              <Badge className="bg-cyan-100/80 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 border-none mb-3 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                Organizational Structure
              </Badge>
              <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d3e] dark:text-white uppercase tracking-[-0.04em] leading-[0.95] transition-colors">
                Cơ cấu <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500 dark:from-cyan-400 dark:to-sky-300">
                  Câu Lạc Bộ
                </span>
              </h1>
            </div>

            <div className="max-w-md md:border-l-2 border-cyan-500/20 dark:border-cyan-500/10 md:pl-8 animate-fade-up [animation-delay:200ms]">
              <h2 className="text-[#0f3d3e] dark:text-slate-100 text-sm md:text-lg font-black uppercase tracking-tight mb-2 leading-tight transition-colors">
                Đội ngũ nòng cốt <br /> dẫn dắt HIEC HUST
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium leading-relaxed transition-colors">
                Mỗi vị trí là một mảnh ghép quan trọng xây dựng hệ sinh thái khởi nghiệp đổi mới
                sáng tạo cho sinh viên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CƠ CẤU PHÂN TẦNG (TIERS STRUCTURE) */}
      <section className="py-12 md:py-20 bg-slate-50/40 dark:bg-slate-900/60 min-h-[650px] transition-colors">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 text-cyan-600 dark:text-cyan-400">
              <Loader2 className="animate-spin size-10 mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Đang tải sơ đồ cơ cấu...
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {layoutConfig.tiers
                .map((tier: MemberTier) => ({
                  tier,
                  members: tier.memberIds
                    .slice(0, 4)
                    .map((id) => memberMap.get(id))
                    .filter(Boolean) as Member[],
                }))
                .filter((row) => row.members.length > 0)
                .map(({ tier, members: tierMembers }, tIndex) => {
                  const name = tier.name?.trim() ?? "";
                  const subtitle = tier.subtitle?.trim() ?? "";
                  const hasHeader = Boolean(name || subtitle);

                  return (
                    <div
                      key={tier.id || tIndex}
                      className={[
                        "animate-fade-up",
                        hasHeader ? "space-y-8" : "",
                        tIndex > 0 ? (hasHeader ? "mt-16 md:mt-24" : "mt-8 md:mt-10") : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {hasHeader ? (
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                          {name ? (
                            <h2 className="text-2xl sm:text-3xl font-black text-[#0f3d3e] dark:text-white tracking-tight">
                              {name}
                            </h2>
                          ) : null}

                          {subtitle ? (
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                              {subtitle}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      {/* TIER CARDS: HIỂN THỊ CÙNG 1 DÒNG, TỐI ĐA 4 CARD, CĂN CHÍNH GIỮA VÀ CÁCH ĐỀU LỀ */}
                      <div className="w-full flex flex-wrap md:flex-nowrap justify-center items-stretch gap-6 md:gap-8 lg:gap-10 max-w-[1300px] mx-auto">
                        {tierMembers.map((member) => (
                          <div
                            key={member.id}
                            onClick={() => setSelectedMember(member)}
                            className="w-full max-w-[240px] sm:max-w-[260px] md:w-64 shrink-0 cursor-pointer group"
                          >
                            <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[1.6rem] overflow-hidden bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 group-hover:-translate-y-1.5">
                              {/* CONTAINER ẢNH VUÔNG BO TRÒN */}
                              <div className="aspect-square overflow-hidden m-2 rounded-[1.2rem] shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                                {member.avatarUrl ? (
                                  <img
                                    src={member.avatarUrl}
                                    alt={member.fullName}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="size-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                    <User className="size-12" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>

                              {/* NỘI DUNG CARD */}
                              <CardContent className="flex flex-col grow p-4 pt-2 text-left">
                                <h3 className="font-sans text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight mb-1 line-clamp-1">
                                  {member.fullName}
                                </h3>

                                <p className="text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1 line-clamp-1">
                                  {member.position}
                                </p>

                                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium line-clamp-1 mb-3">
                                  {member.department}
                                </p>

                                {/* FOOTER NẰM DƯỚI CÙNG */}
                                <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-slate-100 dark:border-slate-800/60 transition-colors">
                                  <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    Xem hồ sơ
                                  </span>
                                  <div className="size-6 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500 dark:group-hover:text-white transition-all">
                                    <ArrowRight className="size-3" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {displayBoards.some((b) => b.featuredMemberId || b.memberIds.length > 0) ? (
                <div className="mt-16 space-y-12 md:mt-24">
                  {displayBoards.map((board) => (
                    <MemberOrgBoard
                      key={board.id}
                      name={board.name}
                      featured={
                        board.featuredMemberId
                          ? (memberMap.get(board.featuredMemberId) ?? null)
                          : null
                      }
                      members={
                        board.memberIds.map((id) => memberMap.get(id)).filter(Boolean) as Member[]
                      }
                      onSelectMember={setSelectedMember}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* 4. MODAL CHI TIẾT THÀNH VIÊN */}
      <Modal
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
        title="Hồ sơ thành viên"
      >
        {selectedMember && (
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto text-center custom-scrollbar">
            <div className="relative size-36 mx-auto">
              <div className="absolute inset-0 bg-cyan-500/20 dark:bg-cyan-400/20 rounded-full blur-2xl transition-colors" />
              {selectedMember.avatarUrl ? (
                <img
                  src={selectedMember.avatarUrl}
                  alt={selectedMember.fullName}
                  className="relative size-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl transition-colors"
                />
              ) : (
                <div className="relative size-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl">
                  <User className="size-16 text-slate-400" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f3d3e] dark:text-white uppercase tracking-tight transition-colors">
                {selectedMember.fullName}
              </h2>
              <p className="text-cyan-600 dark:text-cyan-400 font-bold uppercase text-xs tracking-[0.2em] mt-1 transition-colors">
                {selectedMember.position}
              </p>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mt-0.5">
                {selectedMember.department}
              </p>
            </div>

            <div className="max-w-md mx-auto pt-5 border-t border-slate-100 dark:border-slate-800 transition-colors">
              <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed transition-colors">
                "{selectedMember.bio || "Thành viên nhiệt huyết của CLB Khởi nghiệp HIEC."}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end transition-colors">
              <Button
                variant="shimmer"
                className="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 rounded-2xl px-6 py-4 font-bold uppercase text-[10px] transition-colors"
                onClick={() => setSelectedMember(null)}
              >
                <ChevronLeft className="mr-1.5 size-4" /> Quay lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
