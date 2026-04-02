import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Property, Project } from "@/lib/data";

export default function AdminDashboard() {
  const { data: properties, isLoading: lp } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data } = await api.get<Property[]>("/api/properties");
      return data;
    },
  });

  const { data: projects, isLoading: lj } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get<Project[]>("/api/projects");
      return data;
    },
  });

  const loading = lp || lj;

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-muted" style={{ marginBottom: "1.5rem" }}>
        Overview of listings in MongoDB.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e4e4e7",
            borderRadius: 8,
            padding: "1.25rem",
          }}
        >
          <p className="admin-muted" style={{ margin: "0 0 0.25rem" }}>
            Properties
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
            {loading ? "—" : properties?.length ?? 0}
          </p>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e4e4e7",
            borderRadius: 8,
            padding: "1.25rem",
          }}
        >
          <p className="admin-muted" style={{ margin: "0 0 0.25rem" }}>
            Projects
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
            {loading ? "—" : projects?.length ?? 0}
          </p>
        </div>
      </div>
    </>
  );
}
