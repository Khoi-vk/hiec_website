import * as React from "react";
import type { HomeContent } from "@/services/hiec-service";

type GalleryItem = NonNullable<HomeContent["gallery"]>[number];

export function MovementGallery({ gallery = [] }: { gallery?: GalleryItem[] }) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (gallery.length < 2) return;

    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % gallery.length);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gallery.length]);

  React.useEffect(() => {
    setActive(0);
  }, [gallery.length]);

  if (gallery.length === 0) return null;

  const getIndex = (offset: number) =>
    (active + offset + gallery.length) % gallery.length;

  const currentItem = gallery[active]!;
  const previousItem = gallery[getIndex(-1)]!;
  const followingItem = gallery[getIndex(1)]!;

  return (
    <div className="relative mx-auto h-[27rem] w-full max-w-xl md:h-[34rem]">
      <div className="absolute left-1/2 top-1/2 size-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 md:size-[25rem]" />
      <div className="absolute left-1/2 top-1/2 size-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/50 md:size-[33rem]" />

      <span className="absolute left-[15%] top-[23%] size-3 rounded-full bg-primary shadow-glow" />
      <span className="absolute right-[13%] top-[35%] size-2 rounded-full bg-primary/70" />
      <span className="absolute bottom-[22%] left-[22%] size-2 rounded-full bg-foreground/40" />

      {gallery.length > 1 && (
        <>
          <GalleryCard item={previousItem} position="previous" />
          <GalleryCard item={followingItem} position="following" />
        </>
      )}

      <div
        key={currentItem.id}
        className="absolute left-1/2 top-1/2 z-10 w-[15rem] -translate-x-1/2 -translate-y-1/2 animate-[gallery-in_0.45s_ease-out] md:w-[20rem]"
      >
        <div className="overflow-hidden rounded-[2rem] border-8 border-card bg-card shadow-elevated">
          <img
            src={currentItem.imageUrl}
            alt={currentItem.caption || currentItem.tag}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold shadow-sm">
          <span className="min-w-0 truncate">
            {currentItem.tag}
            {currentItem.caption ? ` - ${currentItem.caption}` : ""}
          </span>
          <span className="text-primary">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(gallery.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

function GalleryCard({
  item,
  position,
}: {
  item: GalleryItem;
  position: "previous" | "following";
}) {
  return (
    <div
      className={`absolute top-1/2 z-0 w-24 -translate-y-1/2 opacity-65 md:w-32 ${
        position === "previous" ? "left-0" : "right-0"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border-4 border-card bg-card shadow-lg">
        <img
          src={item.imageUrl}
          alt=""
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
    </div>
  );
}