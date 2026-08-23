import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Member } from "@/services/member-layout-service";

function BoardAvatar({
  member,
  sizeClass,
}: {
  member: Member;
  sizeClass: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700",
        sizeClass,
      )}
    >
      {member.avatarUrl ? (
        <img src={member.avatarUrl} alt={member.fullName} className="size-full object-cover" />
      ) : (
        <div className="size-full flex items-center justify-center text-slate-300 dark:text-slate-600">
          <User className="size-[40%]" />
        </div>
      )}
    </div>
  );
}

function BoardMemberCard({
  member,
  featured,
  onSelect,
}: {
  member: Member;
  featured?: boolean;
  onSelect?: (member: Member) => void;
}) {
  const clickable = Boolean(onSelect);
  return (
    <button
      type="button"
      onClick={() => onSelect?.(member)}
      className={cn(
        "flex h-full w-full flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950",
        featured ? "gap-3 px-5 py-7" : "gap-2",
        clickable
          ? "cursor-pointer transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-md"
          : "cursor-default",
      )}
    >
      <BoardAvatar member={member} sizeClass={featured ? "size-28 md:size-36" : "size-16 md:size-20"} />
      <div className="min-w-0 w-full">
        <p
          className={cn(
            "font-bold text-cyan-700 dark:text-cyan-400 leading-snug",
            featured ? "text-lg md:text-xl" : "text-sm",
          )}
        >
          {member.fullName}
        </p>
        <p
          className={cn(
            "mt-1 font-semibold text-slate-900 dark:text-slate-100",
            featured ? "text-sm md:text-base" : "text-xs",
          )}
        >
          {member.position}
        </p>
        {member.department ? (
          <p className={cn("mt-1 text-slate-500 dark:text-slate-400", featured ? "text-xs" : "text-[11px]")}>
            {member.department}
          </p>
        ) : null}
      </div>
    </button>
  );
}

export function MemberOrgBoard({
  name,
  featured,
  members,
  onSelectMember,
  className,
}: {
  name: string;
  featured: Member | null;
  members: Member[];
  onSelectMember?: (member: Member) => void;
  className?: string;
}) {
  if (!featured && members.length === 0) return null;

  return (
    <section className={cn("w-full text-left", className)}>
      {name.trim() ? (
        <h3 className="mb-4 text-xl font-bold tracking-tight text-red-600 dark:text-red-400 md:text-2xl">
          {name.trim()}
        </h3>
      ) : null}

      <div
        className={cn(
          "grid items-start gap-4",
          featured
            ? "grid-cols-1 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]"
            : "grid-cols-1",
        )}
      >
        {featured ? (
          <div className="min-w-0">
            <BoardMemberCard member={featured} featured onSelect={onSelectMember} />
          </div>
        ) : null}

        {members.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <BoardMemberCard key={member.id} member={member} onSelect={onSelectMember} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
