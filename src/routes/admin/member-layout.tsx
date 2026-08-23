import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Layers,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  RotateCcw,
  Eye,
  Edit3,
  GripVertical,
  User,
  Search,
  Check,
  X,
  ArrowRight,
  Columns2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  getAllMembers,
  getMemberLayoutConfig,
  saveMemberLayoutConfig,
  type Member,
  type MemberTier,
  type MemberBoard,
  type MemberLayoutConfig,
  DEFAULT_MEMBER_LAYOUT,
  sanitizeTiersForDisplay,
  sanitizeBoards,
} from "@/services/member-layout-service";
import { MemberOrgBoard } from "@/components/members/member-org-board";

type PickerTarget =
  | { kind: "tier"; id: string }
  | { kind: "board-featured"; id: string }
  | { kind: "board-members"; id: string };

export const Route = createFileRoute("/admin/member-layout")({
  head: () => ({
    meta: [
      { title: "Giao diện thành viên — HIEC Admin" },
      {
        name: "description",
        content: "Tùy chỉnh cơ cấu phân tầng và cách hiển thị thành viên trên website HIEC.",
      },
    ],
  }),
  component: MemberLayoutAdminPage,
});

function MemberLayoutAdminPage() {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [tiers, setTiers] = React.useState<MemberTier[]>([]);
  const [boards, setBoards] = React.useState<MemberBoard[]>([]);
  const [showUnassigned, setShowUnassigned] = React.useState(true);
  const [unassignedTitle, setUnassignedTitle] = React.useState("Thành viên & Cộng tác viên");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPreviewMode, setIsPreviewMode] = React.useState(true);

  // Drag & drop state
  const [draggedMemberId, setDraggedMemberId] = React.useState<string | null>(null);
  const [dragOverTierId, setDragOverTierId] = React.useState<string | null>(null);
  const [dragOverBoardSlot, setDragOverBoardSlot] = React.useState<{
    boardId: string;
    slot: "featured" | "members";
  } | null>(null);

  // Quick picker modal state
  const [pickerTarget, setPickerTarget] = React.useState<PickerTarget | null>(null);

  // Load initial data
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedMembers, config] = await Promise.all([
        getAllMembers(),
        getMemberLayoutConfig(),
      ]);
      setMembers(fetchedMembers);
      const validIds = new Set(fetchedMembers.map((m) => m.id));
      setTiers(
        (config.tiers || DEFAULT_MEMBER_LAYOUT.tiers).map((t) => ({
          ...t,
          memberIds: (t.memberIds || []).filter((id) => validIds.has(id)).slice(0, 4),
        })),
      );
      setBoards(sanitizeBoards(config.boards, fetchedMembers));
      setShowUnassigned(config.showUnassigned ?? true);
      setUnassignedTitle(config.unassignedTitle || "Thành viên & Cộng tác viên");
    } catch (err) {
      console.error("Lỗi tải dữ liệu giao diện:", err);
      toast.error("Không thể tải cấu hình thành viên");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper: map memberId to Member object
  const memberMap = React.useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  // Helper: check which tier a member belongs to
  const memberTierMap = React.useMemo(() => {
    const map = new Map<string, string>(); // memberId -> tierId
    tiers.forEach((t) => {
      t.memberIds.forEach((mId) => map.set(mId, t.id));
    });
    return map;
  }, [tiers]);

  // Filtered members for sidebar search
  const filteredMembers = React.useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q),
    );
  }, [members, searchQuery]);

  // Add new tier
  const handleAddTier = () => {
    const newTierNumber = tiers.length + 1;
    const newTier: MemberTier = {
      id: `tier-${Date.now()}`,
      name: `Tầng ${newTierNumber}: Ban chuyên môn`,
      subtitle: "Mô tả vai trò hoặc nhóm trách nhiệm",
      memberIds: [],
    };
    setTiers((prev) => [...prev, newTier]);
    toast.success(`Đã thêm Tầng ${newTierNumber}`);
  };

  // Delete tier
  const handleDeleteTier = (tierId: string) => {
    setTiers((prev) => prev.filter((t) => t.id !== tierId));
    toast.info("Đã xóa tầng");
  };

  // Move tier up/down
  const handleMoveTier = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === tiers.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newTiers = [...tiers];
    const temp = newTiers[index]!;
    newTiers[index] = newTiers[targetIndex]!;
    newTiers[targetIndex] = temp;
    setTiers(newTiers);
  };

  // Update tier fields
  const handleUpdateTier = (tierId: string, field: "name" | "subtitle", value: string) => {
    setTiers((prev) => prev.map((t) => (t.id === tierId ? { ...t, [field]: value } : t)));
  };

  // Remove member from tier
  const handleRemoveMemberFromTier = (tierId: string, memberId: string) => {
    setTiers((prev) =>
      prev.map((t) => {
        if (t.id !== tierId) return t;
        return {
          ...t,
          memberIds: t.memberIds.filter((id) => id !== memberId),
        };
      }),
    );
  };

  // Add member to tier (enforce max 4)
  const handleAddMemberToTier = (tierId: string, memberId: string) => {
    const targetTier = tiers.find((t) => t.id === tierId);
    if (!targetTier) return;

    if (targetTier.memberIds.includes(memberId)) {
      toast.info("Thành viên này đã có trong tầng này.");
      return;
    }

    if (targetTier.memberIds.length >= 4) {
      toast.error("Mỗi tầng chỉ được có tối đa 4 card thành viên!");
      return;
    }

    // Remove from other tiers first if present
    setTiers((prev) =>
      prev.map((t) => {
        const filtered = t.memberIds.filter((id) => id !== memberId);
        if (t.id === tierId) {
          return {
            ...t,
            memberIds: [...filtered, memberId].slice(0, 4),
          };
        }
        return {
          ...t,
          memberIds: filtered,
        };
      }),
    );

    toast.success("Đã thêm thành viên vào tầng");
    setPickerTarget(null);
  };

  const handleAddBoard = () => {
    const newBoard: MemberBoard = {
      id: `board-${Date.now()}`,
      name: `Bảng ${boards.length + 1}`,
      featuredMemberId: null,
      memberIds: [],
    };
    setBoards((prev) => [...prev, newBoard]);
    toast.success("Đã thêm bảng mới");
  };

  const handleDeleteBoard = (boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    toast.info("Đã xóa bảng");
  };

  const handleMoveBoard = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === boards.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const next = [...boards];
    const temp = next[index]!;
    next[index] = next[targetIndex]!;
    next[targetIndex] = temp;
    setBoards(next);
  };

  const handleUpdateBoardName = (boardId: string, name: string) => {
    setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, name } : b)));
  };

  const placeMemberOnBoards = (
    current: MemberBoard[],
    boardId: string,
    memberId: string,
    slot: "featured" | "members",
  ): MemberBoard[] => {
    return current.map((b) => {
      const featured = b.featuredMemberId === memberId ? null : b.featuredMemberId;
      const memberIds = b.memberIds.filter((id) => id !== memberId);
      if (b.id !== boardId) {
        return { ...b, featuredMemberId: featured, memberIds };
      }
      if (slot === "featured") {
        return { ...b, featuredMemberId: memberId, memberIds };
      }
      return { ...b, featuredMemberId: featured, memberIds: [...memberIds, memberId] };
    });
  };

  const handleAddMemberToBoard = (
    boardId: string,
    memberId: string,
    slot: "featured" | "members",
  ) => {
    setBoards((prev) => placeMemberOnBoards(prev, boardId, memberId, slot));
    toast.success(slot === "featured" ? "Đã đặt card cột trái" : "Đã thêm thành viên vào bảng");
    setPickerTarget(null);
  };

  const handleRemoveMemberFromBoard = (
    boardId: string,
    memberId: string,
    slot: "featured" | "members",
  ) => {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        if (slot === "featured") {
          return { ...b, featuredMemberId: b.featuredMemberId === memberId ? null : b.featuredMemberId };
        }
        return { ...b, memberIds: b.memberIds.filter((id) => id !== memberId) };
      }),
    );
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, memberId: string) => {
    e.dataTransfer.setData("text/plain", memberId);
    setDraggedMemberId(memberId);
  };

  const handleDragEnd = () => {
    setDraggedMemberId(null);
    setDragOverTierId(null);
    setDragOverBoardSlot(null);
  };

  const handleDragOver = (e: React.DragEvent, tierId: string) => {
    e.preventDefault();
    if (dragOverTierId !== tierId) {
      setDragOverTierId(tierId);
    }
  };

  const handleDragLeave = () => {
    setDragOverTierId(null);
  };

  const handleDropOnTier = (e: React.DragEvent, tierId: string) => {
    e.preventDefault();
    setDragOverTierId(null);
    const memberId = e.dataTransfer.getData("text/plain") || draggedMemberId;
    if (!memberId) return;

    const targetTier = tiers.find((t) => t.id === tierId);
    if (!targetTier) return;

    if (targetTier.memberIds.includes(memberId)) {
      return; // Already there
    }

    if (targetTier.memberIds.length >= 4) {
      toast.error("Mỗi tầng chỉ được có tối đa 4 card thành viên!");
      return;
    }

    // Move to this tier
    setTiers((prev) =>
      prev.map((t) => {
        const withoutMember = t.memberIds.filter((id) => id !== memberId);
        if (t.id === tierId) {
          return {
            ...t,
            memberIds: [...withoutMember, memberId].slice(0, 4),
          };
        }
        return {
          ...t,
          memberIds: withoutMember,
        };
      }),
    );
    toast.success("Đã thêm thành viên vào tầng");
  };

  const handleDropOnBoard = (
    e: React.DragEvent,
    boardId: string,
    slot: "featured" | "members",
  ) => {
    e.preventDefault();
    setDragOverBoardSlot(null);
    const memberId = e.dataTransfer.getData("text/plain") || draggedMemberId;
    if (!memberId) return;
    handleAddMemberToBoard(boardId, memberId, slot);
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const config: MemberLayoutConfig = {
        tiers,
        boards,
        showUnassigned,
        unassignedTitle,
      };
      await saveMemberLayoutConfig(config);
      toast.success("Đã lưu cấu hình giao diện thành viên thành công!");
    } catch (err: any) {
      toast.error("Không thể lưu cấu hình: " + (err.message || "Lỗi không xác định"));
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (!confirm("Bạn có chắc chắn muốn đặt lại cấu hình phân tầng về mặc định?")) return;
    setTiers(sanitizeTiersForDisplay(DEFAULT_MEMBER_LAYOUT.tiers, members));
    setBoards(sanitizeBoards(DEFAULT_MEMBER_LAYOUT.boards, members));
    setShowUnassigned(DEFAULT_MEMBER_LAYOUT.showUnassigned);
    setUnassignedTitle(DEFAULT_MEMBER_LAYOUT.unassignedTitle);
    toast.info("Đã đặt lại cấu hình mẫu.");
  };

  // Find unassigned members
  const unassignedMembers = React.useMemo(() => {
    const assigned = new Set<string>();
    tiers.forEach((t) => t.memberIds.forEach((id) => assigned.add(id)));
    boards.forEach((b) => {
      if (b.featuredMemberId) assigned.add(b.featuredMemberId);
      b.memberIds.forEach((id) => assigned.add(id));
    });
    return members.filter((m) => !assigned.has(m.id));
  }, [members, tiers, boards]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-cyan-600 dark:text-cyan-400">
          <div className="size-10 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold">Đang tải cấu hình giao diện...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-up max-w-[1400px] mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Giao diện thành viên</h1>
          <p className="text-sm text-muted-foreground mt-1">
                Tùy chỉnh các tầng (tối đa 4 card/tầng) và các bảng hai cột cho trang{" "}
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">Cơ cấu CLB</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="rounded-xl font-bold gap-2 text-xs border-slate-200 dark:border-slate-800"
          >
            {isPreviewMode ? <Edit3 className="size-3.5" /> : <Eye className="size-3.5" />}
            {isPreviewMode ? "Chế độ chỉnh sửa" : "Xem trước trang công khai"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-xl font-bold gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border-slate-200 dark:border-slate-800"
          >
            <RotateCcw className="size-3.5" /> Đặt lại mẫu
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl font-black uppercase tracking-wider text-xs px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition-all active:scale-95"
          >
            {saving ? (
              <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
            ) : (
              <Save className="size-3.5 mr-2" />
            )}
            LƯU GIAO DIỆN
          </Button>
        </div>
      </div>

      {/* PREVIEW MODE */}
      {isPreviewMode ? (
        <div className="space-y-8 bg-slate-50/50 dark:bg-slate-950 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="text-center max-w-xl mx-auto mb-8">
            <Badge className="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
              Xem trước thực tế (Live Preview)
            </Badge>
            <h2 className="text-3xl font-bold text-[#0f3d3e] dark:text-white uppercase tracking-tight">
              Cơ cấu tổ chức HIEC
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Giao diện các tầng thành viên hiển thị căn giữa, tối đa 4 người mỗi dòng cách đều
              nhau.
            </p>
          </div>

          <div className="flex flex-col">
            {tiers
              .map((tier) => ({
                tier,
                members: tier.memberIds
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
                  key={tier.id}
                  className={[
                    "text-center",
                    hasHeader ? "space-y-4" : "",
                    tIndex > 0 ? (hasHeader ? "mt-12" : "mt-6") : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {hasHeader ? (
                    <div className="inline-flex flex-col items-center">
                      {name ? (
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                          {name}
                        </h3>
                      ) : null}
                      {subtitle ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Centered Row with evenly distributed cards (Max 4 per row) */}
                  <div className="w-full flex justify-center items-stretch gap-6 md:gap-8 max-w-6xl mx-auto px-4">
                    {tierMembers.map((member) => (
                        <div
                          key={member.id}
                          className="w-full max-w-[240px] sm:max-w-[260px] md:w-64 shrink-0 transition-all duration-300 hover:-translate-y-1"
                        >
                          <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[1.4rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-left">
                            <div className="aspect-square overflow-hidden m-1.5 rounded-[1.1rem] shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.fullName}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <div className="size-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                  <User className="size-10" />
                                </div>
                              )}
                            </div>
                            <CardContent className="flex flex-col grow p-4 pt-2">
                              <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1 line-clamp-1">
                                {member.fullName}
                              </h4>
                              <p className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-1 line-clamp-1">
                                {member.position}
                              </p>
                              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium line-clamp-1 mb-2">
                                {member.department}
                              </p>
                              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                <span className="text-[8px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                                  Xem hồ sơ
                                </span>
                                <div className="size-5 rounded-md bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
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

            {boards.some((b) => b.featuredMemberId || b.memberIds.length > 0) ? (
              <div className="mt-12 space-y-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                {boards.map((board) => (
                  <MemberOrgBoard
                    key={board.id}
                    name={board.name}
                    featured={
                      board.featuredMemberId ? memberMap.get(board.featuredMemberId) ?? null : null
                    }
                    members={board.memberIds
                      .map((id) => memberMap.get(id))
                      .filter(Boolean) as Member[]}
                  />
                ))}
              </div>
            ) : null}

            {showUnassigned && unassignedMembers.length > 0 && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center space-y-6">
                <div>
                  <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Danh sách mở rộng
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {unassignedTitle}
                  </h3>
                </div>
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                  {unassignedMembers.map((m) => (
                    <div
                      key={m.id}
                      className="w-48 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3 text-left"
                    >
                      <div className="size-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} className="size-full object-cover" />
                        ) : (
                          <User className="size-5 m-auto text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {m.fullName}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {m.position}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* EDITING MODE: TIERS MANAGEMENT BOARD */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Danh sách các tầng ({tiers.filter((t) => t.memberIds.some((id) => memberMap.has(id)) || t.memberIds.length === 0).length} tầng)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mỗi tầng chứa <strong>tối đa 4 card</strong> và tự động căn đều chính giữa. Nhấn vào
                ô trống để chọn thêm thành viên vào tầng.
              </p>
            </div>
            <Button
              onClick={handleAddTier}
              className="rounded-2xl font-black uppercase tracking-wider text-xs px-4 py-2.5 bg-[#0f3d3e] dark:bg-cyan-700 hover:bg-[#1a4d4f] text-white shadow-sm self-start sm:self-auto"
            >
              <Plus className="size-4 mr-1.5 text-cyan-300" /> THÊM TẦNG MỚI
            </Button>
          </div>

          {tiers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <Layers className="size-10 mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300">
                Chưa có tầng cơ cấu nào
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Hãy nhấn nút "Thêm tầng mới" hoặc "Đặt lại mẫu" để bắt đầu thiết lập bố cục.
              </p>
              <Button
                onClick={handleAddTier}
                variant="outline"
                className="rounded-xl mt-2 text-xs font-bold"
              >
                <Plus className="size-4 mr-1" /> Tạo tầng đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {tiers.map((tier, index) => {
                const resolvedMembers = tier.memberIds
                  .map((id) => memberMap.get(id))
                  .filter(Boolean) as Member[];
                // Ẩn tầng trống giống trang công khai; tầng mới tạo (chưa gán ai) vẫn hiện để chỉnh.
                if (resolvedMembers.length === 0 && tier.memberIds.length > 0) {
                  return null;
                }

                const isHovered = dragOverTierId === tier.id;
                const currentCount = resolvedMembers.length;
                const isFull = currentCount >= 4;

                return (
                  <Card
                    key={tier.id}
                    onDragOver={(e) => handleDragOver(e, tier.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropOnTier(e, tier.id)}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isHovered
                        ? "ring-2 ring-cyan-500 border-cyan-400 bg-cyan-50/10 shadow-lg scale-[1.01]"
                        : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Tier Header Controls */}
                    <div className="p-4 px-6 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block mb-0.5">
                            Tên tầng #{index + 1}
                          </span>
                          <Input
                            value={tier.name}
                            onChange={(e) => handleUpdateTier(tier.id, "name", e.target.value)}
                            className="h-8 text-xs font-bold bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800"
                            placeholder="VD: Tầng 1: Ban Chủ Nhiệm"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                            Mô tả phụ (Tùy chọn)
                          </span>
                          <Input
                            value={tier.subtitle || ""}
                            onChange={(e) => handleUpdateTier(tier.id, "subtitle", e.target.value)}
                            className="h-8 text-xs bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 text-slate-500"
                            placeholder="VD: Định hướng chiến lược & Điều hành"
                          />
                        </div>
                      </div>

                      {/* Actions: Reorder, Count, Delete */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                            isFull
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                              : "bg-cyan-100/60 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300"
                          }`}
                        >
                          {currentCount} / 4 thẻ
                        </Badge>

                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 bg-white dark:bg-slate-900">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveTier(index, "up")}
                            title="Di chuyển lên"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 disabled:opacity-30 disabled:hover:text-slate-500"
                          >
                            <MoveUp className="size-3.5" />
                          </button>
                          <button
                            disabled={index === tiers.length - 1}
                            onClick={() => handleMoveTier(index, "down")}
                            title="Di chuyển xuống"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 disabled:opacity-30 disabled:hover:text-slate-500"
                          >
                            <MoveDown className="size-3.5" />
                          </button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTier(tier.id)}
                          className="size-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Xóa tầng này"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex flex-wrap md:flex-nowrap justify-center items-stretch gap-4 sm:gap-6">
                        {resolvedMembers.map((member, slotIndex) => {
                          return (
                            <div
                              key={member.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, member.id)}
                              onDragEnd={handleDragEnd}
                              className="group relative w-full sm:w-48 shrink-0 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 shadow-sm hover:shadow-md hover:border-cyan-500 transition-all cursor-grab active:cursor-grabbing text-left flex flex-col justify-between"
                            >
                              <button
                                type="button"
                                onClick={() => handleRemoveMemberFromTier(tier.id, member.id)}
                                className="absolute top-2 right-2 size-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/60 text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-colors z-10"
                                title="Gỡ khỏi tầng"
                              >
                                <X className="size-3.5" />
                              </button>

                              <div>
                                <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5 relative border border-slate-100 dark:border-slate-800">
                                  {member.avatarUrl ? (
                                    <img
                                      src={member.avatarUrl}
                                      alt={member.fullName}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    <div className="size-full flex items-center justify-center text-slate-300">
                                      <User className="size-8" />
                                    </div>
                                  )}
                                  <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                    Vị trí {slotIndex + 1}
                                  </span>
                                </div>

                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {member.fullName}
                                </h4>
                                <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold truncate">
                                  {member.position}
                                </p>
                                <p className="text-[9px] text-slate-400 truncate">
                                  {member.department}
                                </p>
                              </div>

                              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400 uppercase font-black">
                                <span>Kéo để đổi vị trí</span>
                                <GripVertical className="size-3" />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {currentCount < 4 && (
                        <div className="mt-4 flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPickerTarget({ kind: "tier", id: tier.id })}
                            className="rounded-xl text-xs font-bold gap-1.5"
                          >
                            <Plus className="size-4" />
                            Thêm thành viên
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Các bảng cơ cấu ({boards.length} bảng)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mỗi bảng có tên riêng, cột trái đủ chỗ cho <strong>1 card</strong>, cột phải chứa
                nhiều card thành viên.
              </p>
            </div>
            <Button
              onClick={handleAddBoard}
              variant="outline"
              className="rounded-2xl font-black uppercase tracking-wider text-xs px-4 py-2.5 border-cyan-600/40 text-cyan-800 dark:text-cyan-300 self-start sm:self-auto"
            >
              <Columns2 className="size-4 mr-1.5" /> THÊM BẢNG
            </Button>
          </div>

          {boards.length === 0 ? (
            <div className="p-10 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <Columns2 className="size-9 mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Chưa có bảng nào</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tạo bảng để nhóm thành viên theo khối (ví dụ Hội đồng cố vấn) với card nổi bật bên
                trái.
              </p>
              <Button
                onClick={handleAddBoard}
                variant="outline"
                className="rounded-xl mt-2 text-xs font-bold"
              >
                <Plus className="size-4 mr-1" /> Tạo bảng đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {boards.map((board, index) => {
                const featured = board.featuredMemberId
                  ? memberMap.get(board.featuredMemberId)
                  : undefined;
                const rightMembers = board.memberIds
                  .map((id) => memberMap.get(id))
                  .filter(Boolean) as Member[];
                const featuredHover =
                  dragOverBoardSlot?.boardId === board.id && dragOverBoardSlot.slot === "featured";
                const membersHover =
                  dragOverBoardSlot?.boardId === board.id && dragOverBoardSlot.slot === "members";

                return (
                  <Card
                    key={board.id}
                    className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                  >
                    <div className="p-4 px-6 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block mb-0.5">
                          Tên bảng #{index + 1}
                        </span>
                        <Input
                          value={board.name}
                          onChange={(e) => handleUpdateBoardName(board.id, e.target.value)}
                          className="h-8 text-xs font-bold bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 max-w-md"
                          placeholder="VD: Hội đồng quản trị"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {(featured ? 1 : 0) + rightMembers.length} thẻ
                        </Badge>
                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 bg-white dark:bg-slate-900">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveBoard(index, "up")}
                            title="Di chuyển lên"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 disabled:opacity-30"
                          >
                            <MoveUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === boards.length - 1}
                            onClick={() => handleMoveBoard(index, "down")}
                            title="Di chuyển xuống"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 disabled:opacity-30"
                          >
                            <MoveDown className="size-3.5" />
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBoard(board.id)}
                          className="size-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Xóa bảng này"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)]">
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverBoardSlot({ boardId: board.id, slot: "featured" });
                          }}
                          onDragLeave={() => setDragOverBoardSlot(null)}
                          onDrop={(e) => handleDropOnBoard(e, board.id, "featured")}
                          className={`rounded-2xl border-2 border-dashed p-3 min-h-[220px] transition-colors ${
                            featuredHover
                              ? "border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20"
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Cột trái — 1 card
                          </p>
                          {featured ? (
                            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveMemberFromBoard(board.id, featured.id, "featured")
                                }
                                className="absolute top-2 right-2 size-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-600 flex items-center justify-center"
                                title="Gỡ khỏi cột trái"
                              >
                                <X className="size-3.5" />
                              </button>
                              <div className="size-20 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                                {featured.avatarUrl ? (
                                  <img
                                    src={featured.avatarUrl}
                                    alt={featured.fullName}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <User className="size-8 m-auto text-slate-300" />
                                )}
                              </div>
                              <p className="text-sm font-bold text-cyan-700 dark:text-cyan-400">
                                {featured.fullName}
                              </p>
                              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                                {featured.position}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{featured.department}</p>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setPickerTarget({ kind: "board-featured", id: board.id })
                              }
                              className="flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-xl text-slate-400 hover:text-cyan-600 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20"
                            >
                              <Plus className="size-6" />
                              <span className="text-xs font-bold">Chèn card cột trái</span>
                            </button>
                          )}
                        </div>

                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverBoardSlot({ boardId: board.id, slot: "members" });
                          }}
                          onDragLeave={() => setDragOverBoardSlot(null)}
                          onDrop={(e) => handleDropOnBoard(e, board.id, "members")}
                          className={`rounded-2xl border-2 border-dashed p-3 min-h-[220px] transition-colors ${
                            membersHover
                              ? "border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20"
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Cột phải — nhiều card
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                            {rightMembers.map((member) => (
                              <div
                                key={member.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, member.id)}
                                onDragEnd={handleDragEnd}
                                className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-center cursor-grab"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveMemberFromBoard(board.id, member.id, "members")
                                  }
                                  className="absolute top-1.5 right-1.5 size-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-600 flex items-center justify-center"
                                >
                                  <X className="size-3" />
                                </button>
                                <div className="size-14 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                                  {member.avatarUrl ? (
                                    <img
                                      src={member.avatarUrl}
                                      alt={member.fullName}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    <User className="size-6 m-auto text-slate-300" />
                                  )}
                                </div>
                                <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 truncate">
                                  {member.fullName}
                                </p>
                                <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {member.position}
                                </p>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                setPickerTarget({ kind: "board-members", id: board.id })
                              }
                              className="flex min-h-[140px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:text-cyan-600 hover:border-cyan-400"
                            >
                              <Plus className="size-5" />
                              <span className="text-[10px] font-bold">Thêm card</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QUICK MEMBER PICKER MODAL */}
      <Modal
        open={!!pickerTarget}
        onOpenChange={(open) => !open && setPickerTarget(null)}
        title={
          pickerTarget?.kind === "board-featured"
            ? "Chọn card cột trái"
            : pickerTarget?.kind === "board-members"
              ? "Chọn thành viên thêm vào bảng"
              : "Chọn thành viên thêm vào tầng"
        }
        description={
          pickerTarget?.kind === "tier"
            ? "Chọn thành viên để đưa vào tầng này (tối đa 4 người)."
            : pickerTarget?.kind === "board-featured"
              ? "Card này sẽ hiển thị ở cột trái của bảng."
              : "Các card này sẽ nằm ở cột phải, có thể thêm nhiều người."
        }
      >
        <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên hoặc chức vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {filteredMembers.map((m) => {
              const currentTierId = memberTierMap.get(m.id);
              const isAlreadyInThisTier =
                pickerTarget?.kind === "tier" && currentTierId === pickerTarget.id;
              const targetBoard =
                pickerTarget?.kind === "board-featured" || pickerTarget?.kind === "board-members"
                  ? boards.find((b) => b.id === pickerTarget.id)
                  : undefined;
              const isAlreadyFeatured =
                pickerTarget?.kind === "board-featured" && targetBoard?.featuredMemberId === m.id;
              const isAlreadyInBoardMembers =
                pickerTarget?.kind === "board-members" && targetBoard?.memberIds.includes(m.id);
              const isDisabled = isAlreadyInThisTier || isAlreadyFeatured || isAlreadyInBoardMembers;

              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (!pickerTarget) return;
                    if (pickerTarget.kind === "tier") {
                      handleAddMemberToTier(pickerTarget.id, m.id);
                      return;
                    }
                    handleAddMemberToBoard(
                      pickerTarget.id,
                      m.id,
                      pickerTarget.kind === "board-featured" ? "featured" : "members",
                    );
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all ${
                    isDisabled
                      ? "opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent cursor-not-allowed"
                      : "bg-white dark:bg-slate-900 hover:border-cyan-500 hover:bg-cyan-50/30 dark:hover:bg-cyan-950/30 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} className="size-full object-cover" />
                      ) : (
                        <User className="size-4 m-auto text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {m.fullName}
                      </p>
                      <p className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate">
                        {m.position}
                      </p>
                    </div>
                  </div>
                  {isDisabled ? (
                    <Check className="size-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Plus className="size-4 text-slate-400 group-hover:text-cyan-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
