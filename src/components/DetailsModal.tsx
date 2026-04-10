import { MapPin, BedDouble, Bath, Maximize, CheckCircle, X } from "lucide-react";
import type { Property, Project } from "@/lib/data";
import Modal from "@/components/Modal";

type DetailsModalProps =
| { open: boolean; onClose: () => void; kind: "property"; item: Property | null }
| { open: boolean; onClose: () => void; kind: "project"; item: Project | null };

export default function DetailsModal(props: DetailsModalProps) {
const { open, onClose } = props;
const item = props.item;

if (!item) return null;

return ( <Modal open={open} onClose={onClose} title="Details">
<div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr" }}>
<div style={{ background: "#111827" }}>
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
/> </div>

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

      {props.kind === "property" && (() => {
        const property = item as Property;

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
                {property.propertyType}
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
                {property.type}
              </span>

              {property.featured ? (
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
              {property.title}
            </h2>

            <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
              <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
              {property.location}
            </p>

            <p style={{ margin: "14px 0 0", fontSize: 20, fontWeight: 800 }}>
              {property.price}
            </p>

            {property.description ? (
              <p
                style={{
                  margin: "12px 0 0",
                  color: "#374151",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {property.description}
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
              {property.bedrooms > 0 ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <BedDouble size={16} /> <span>{property.bedrooms} Bedrooms</span>
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Bath size={16} /> <span>{property.bathrooms} Bathrooms</span>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Maximize size={16} /> <span>{property.area}</span>
              </div>
            </div>

            {property.highlights && property.highlights.length > 0 ? (
              <div style={{ marginTop: 16 }}>
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
                  {property.highlights.map((h) => (
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
      })()}

      {props.kind === "project" && (() => {
        const project = item as Project;

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
                {project.type}
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: 999,
                  background:
                    project.status === "Ongoing" ? "#111827" : "#4b5563",
                  color: "#fff",
                }}
              >
                {project.status}
              </span>
            </div>

            <h2 style={{ margin: "10px 0 6px", fontSize: 22, fontWeight: 800 }}>
              {project.title}
            </h2>

            <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
              <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
              {project.location}
            </p>

            <p
              style={{
                margin: "14px 0 0",
                color: "#111827",
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              {project.description}
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
                {project.highlights.map((h) => (
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
          </>
        );
      })()}
    </div>
  </div>
</Modal>

);
}
