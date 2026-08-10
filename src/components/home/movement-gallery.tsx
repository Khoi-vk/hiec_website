import * as React from "react";

const gallery = [
  { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85", label: "Cộng tác" },
  { src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85", label: "Tăng trưởng" },
  { src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=85", label: "Thực chiến" },
  { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=85", label: "Kết nối" },
  { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=85", label: "Bứt phá" },
];

export function MovementGallery() {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => setActive((index) => (index + 1) % gallery.length), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const getIndex = (offset: number) => (active + offset + gallery.length) % gallery.length;

  return (
    <div className="relative mx-auto h-[27rem] w-full max-w-xl md:h-[34rem]">
      <div className="absolute left-1/2 top-1/2 size-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 md:size-[25rem]" />
      <div className="absolute left-1/2 top-1/2 size-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/50 md:size-[33rem]" />
      <span className="absolute left-[15%] top-[23%] size-3 rounded-full bg-primary shadow-glow" />
      <span className="absolute right-[13%] top-[35%] size-2 rounded-full bg-primary/70" />
      <span className="absolute bottom-[22%] left-[22%] size-2 rounded-full bg-foreground/40" />
      <GalleryCard item={gallery[getIndex(-1)]!} position="previous" />
      <GalleryCard item={gallery[getIndex(1)]!} position="following" />
      <div key={active} className="absolute left-1/2 top-1/2 z-10 w-[15rem] -translate-x-1/2 -translate-y-1/2 animate-[gallery-in_0.45s_ease-out] md:w-[20rem]">
        <div className="overflow-hidden rounded-[2rem] border-8 border-card bg-card shadow-elevated">
          <img src={gallery[active]!.src} alt={gallery[active]!.label} className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-full border border-border bg-card px-4 py-2 text-xs font-bold shadow-sm">
          <span>{gallery[active]!.label}</span><span className="text-primary">0{active + 1} / 0{gallery.length}</span>
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ item, position }: { item: (typeof gallery)[number]; position: "previous" | "following" }) {
  return <div className={`absolute top-1/2 z-0 w-24 -translate-y-1/2 opacity-65 md:w-32 ${position === "previous" ? "left-0" : "right-0"}`}><div className="overflow-hidden rounded-2xl border-4 border-card bg-card shadow-lg"><img src={item.src} alt="" className="aspect-[4/5] w-full object-cover" /></div></div>;
}
