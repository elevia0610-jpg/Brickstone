import { MapPin, BedDouble, Bath, Maximize, CheckCircle, X } from "lucide-react";
import type { Property, Project } from "@/lib/data";
import Modal from "@/components/Modal";

type DetailsModalProps =
  | { open: boolean; onClose: () => void; kind: "property"; item: Property | null }
  | { open: boolean; onClose: () => void; kind: "project"; item: Project | null };

export default function DetailsModal(props: DetailsModalProps) {
  const { open, onClose } = props;
  const item = props.item;

  return (
    <Modal open={open} onClose={onClose} title="Details">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr" }}>
        <div style={{ background: "#111827" }}>
          {item ? (
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: 520,
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div style={{ height: 420 }} />
          )}
        </div>

        <div style={{ padding: 20, position: "relative" }}>
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
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={18} />
          </button>

          {item && props.kind === "property" ? (
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
                  {item.propertyType}
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
                  {item.type}
                </span>
                {item.featured ? (
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
                {item.title}
              </h2>
              <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
                <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
                {item.location}
              </p>

              <p style={{ margin: "14px 0 0", fontSize: 20, fontWeight: 800 }}>
                {item.price}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {item.bedrooms > 0 ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <BedDouble size={16} /> <span>{item.bedrooms} Bedrooms</span>
                  </div>
                ) : null}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Bath size={16} /> <span>{item.bathrooms} Bathrooms</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Maximize size={16} /> <span>{item.area}</span>
                </div>
              </div>
            </>
          ) : null}

          {item && props.kind === "project" ? (
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
                  {item.type}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 999,
                    background: item.status === "Ongoing" ? "#111827" : "#4b5563",
                    color: "#fff",
                  }}
                >
                  {item.status}
                </span>
              </div>

              <h2 style={{ margin: "10px 0 6px", fontSize: 22, fontWeight: 800 }}>
                {item.title}
              </h2>
              <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
                <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
                {item.location}
              </p>

              <p style={{ margin: "14px 0 0", color: "#111827", fontSize: 14, lineHeight: 1.55 }}>
                {item.description}
              </p>

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
                  {item.highlights.map((h) => (
                    <div key={h} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <CheckCircle size={16} />
                      <span style={{ fontSize: 14 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

