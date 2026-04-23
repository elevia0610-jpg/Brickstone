import { MapPin, BedDouble, Bath, Maximize, CheckCircle, X } from "lucide-react";
import type { Property, Project } from "@/lib/data";
import Modal from "@/components/Modal";
import MediaSlider from "@/components/MediaSlider";

type DetailsModalProps =
  | { open: boolean; onClose: () => void; kind: "property"; item: Property | null }
  | { open: boolean; onClose: () => void; kind: "project"; item: Project | null };

function resolveImages(item: { images?: string[]; image?: string } | null) {
  if (!item) return [];
  if (Array.isArray(item.images) && item.images.length > 0) return item.images;
  if (item.image) return [item.image];
  return [];
}

export default function DetailsModal({ open, onClose, kind, item }: DetailsModalProps) {
  if (!item) return null;

  const images = resolveImages(item);
  const video = item.video;

  return (
    <Modal open={open} onClose={onClose} title="Details">
      <div style={{ position: "relative" }}>
        <div style={{ position: "relative" }}>
          <MediaSlider images={images} video={video} alt={item.title} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(0,0,0,0.45)",
              color: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {kind === "property" ? (
            (() => {
              const p = item as Property;
              return (
                <>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {p.propertyType}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: "#111827",
                        color: "#fff",
                      }}
                    >
                      {p.type}
                    </span>
                    {p.featured ? (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "#f3f4f6",
                          color: "#111827",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <h2 style={{ margin: "10px 0 6px", fontSize: 22, fontWeight: 800 }}>
                    {p.title}
                  </h2>

                  <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
                    <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
                    {p.location}
                  </p>

                  <p style={{ margin: "14px 0 0", fontSize: 20, fontWeight: 800 }}>
                    {p.price}
                  </p>

                  {p.description ? (
                    <p
                      style={{
                        margin: "12px 0 0",
                        color: "#374151",
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {p.description}
                    </p>
                  ) : null}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      marginTop: 16,
                    }}
                  >
                    {p.bedrooms > 0 ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <BedDouble size={16} /> <span>{p.bedrooms} Bedrooms</span>
                      </div>
                    ) : null}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Bath size={16} /> <span>{p.bathrooms} Bathrooms</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Maximize size={16} /> <span>{p.area}</span>
                    </div>
                  </div>

                  {p.highlights?.length ? (
                    <div style={{ marginTop: 14 }}>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Highlights
                      </p>
                      <div style={{ display: "grid", gap: 8 }}>
                        {p.highlights.map((h) => (
                          <div
                            key={h}
                            style={{ display: "flex", gap: 8, alignItems: "center" }}
                          >
                            <CheckCircle size={16} />
                            <span style={{ fontSize: 14 }}>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              );
            })()
          ) : (
            (() => {
              const p = item as Project;
              return (
                <>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {p.type}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: p.status === "Ongoing" ? "#111827" : "#4b5563",
                        color: "#fff",
                      }}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h2 style={{ margin: "10px 0 6px", fontSize: 22, fontWeight: 800 }}>
                    {p.title}
                  </h2>

                  <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
                    <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
                    {p.location}
                  </p>

                  <p
                    style={{
                      margin: "14px 0 0",
                      color: "#111827",
                      fontSize: 14,
                      lineHeight: 1.55,
                    }}
                  >
                    {p.description}
                  </p>

                  {p.highlights?.length ? (
                    <div style={{ marginTop: 14 }}>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Highlights
                      </p>
                      <div style={{ display: "grid", gap: 8 }}>
                        {p.highlights.map((h) => (
                          <div
                            key={h}
                            style={{ display: "flex", gap: 8, alignItems: "center" }}
                          >
                            <CheckCircle size={16} />
                            <span style={{ fontSize: 14 }}>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              );
            })()
          )}
        </div>
      </div>
    </Modal>
  );
}

