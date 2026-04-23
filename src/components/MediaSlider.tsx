import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type MediaSliderProps = {
  images?: string[];
  video?: string;
  alt?: string;
};

type Slide =
  | { kind: "image"; url: string }
  | { kind: "video"; url: string };

export default function MediaSlider({ images, video, alt }: MediaSliderProps) {
  const slides: Slide[] = useMemo(() => {
    const imgs = (images || []).filter(Boolean).map((url) => ({ kind: "image", url }) as const);
    const vid = video ? [{ kind: "video", url: video } as const] : [];
    return [...imgs, ...vid];
  }, [images, video]);

  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const count = slides.length;
  const current = slides[index] || null;

  function clamp(next: number) {
    if (count === 0) return 0;
    if (next < 0) return count - 1;
    if (next >= count) return 0;
    return next;
  }

  function prev() {
    setIndex((i) => clamp(i - 1));
  }
  function next() {
    setIndex((i) => clamp(i + 1));
  }

  if (count === 0) {
    return (
      <div
        style={{
          background: "#111827",
          height: 320,
          display: "grid",
          placeItems: "center",
          color: "#9ca3af",
          fontSize: 14,
        }}
      >
        No media
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        background: "#111827",
        height: 360,
        overflow: "hidden",
      }}
      onTouchStart={(e) => {
        startX.current = e.touches[0]?.clientX ?? null;
        moved.current = false;
      }}
      onTouchMove={(e) => {
        if (startX.current == null) return;
        const dx = (e.touches[0]?.clientX ?? 0) - startX.current;
        if (Math.abs(dx) > 8) moved.current = true;
      }}
      onTouchEnd={(e) => {
        if (startX.current == null || !moved.current) return;
        const endX = e.changedTouches[0]?.clientX ?? startX.current;
        const dx = endX - startX.current;
        if (dx > 40) prev();
        if (dx < -40) next();
        startX.current = null;
        moved.current = false;
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateX(${-index * 100}%)`,
          display: "flex",
          transition: "transform 220ms ease",
        }}
      >
        {slides.map((s, i) => (
          <div key={`${s.kind}-${s.url}-${i}`} style={{ flex: "0 0 100%", height: "100%" }}>
            {s.kind === "image" ? (
              <img
                src={s.url}
                alt={alt || "Media"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            ) : (
              <div style={{ width: "100%", height: "100%", position: "relative" }}>
                <video
                  controls
                  preload="metadata"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                >
                  <source src={s.url} />
                </video>
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    bottom: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Play size={14} /> Video
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ChevronRight />
          </button>
        </>
      ) : null}

      {count > 1 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 10,
            display: "flex",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {slides.map((s, i) => (
            <button
              key={`${s.kind}-dot-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.6)",
                background: i === index ? "#fff" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

