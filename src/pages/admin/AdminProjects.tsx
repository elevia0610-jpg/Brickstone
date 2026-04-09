import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { Project } from "@/lib/data";

const emptyForm: Omit<Project, "id"> = {
  title: "",
  location: "",
  status: "Ongoing",
  type: "",
  description: "",
  highlights: [""],
  image: "",
};

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response
      ?.data?.message;
    if (r) return r;
  }
  return "Something went wrong";
}

function highlightsToText(h: string[]) {
  return h.filter(Boolean).join("\n");
}

function textToHighlights(t: string) {
  return t
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminProjects() {
  const queryClient = useQueryClient();
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get<Project[]>("/api/projects");
      return data;
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyForm);
  const [highlightsText, setHighlightsText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const highlights = textToHighlights(highlightsText);
      if (highlights.length === 0) {
        throw new Error("Add at least one highlight");
      }
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("location", form.location);
      fd.append("status", form.status);
      fd.append("type", form.type);
      fd.append("description", form.description);
      fd.append("highlights", JSON.stringify(highlights));

      if (!imageFile && !editingId) {
        toast.error("Image is required");
        return;
      }

      if (imageFile instanceof File) {
        fd.append("image", imageFile);
      }

      if (editingId) {
        await api.put(`/api/projects/${editingId}`, fd);
      } else {
        await api.post("/api/projects", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(editingId ? "Project updated" : "Project created");
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setHighlightsText("");
      setImageFile(null);
      setImagePreview("");
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : getErrorMessage(err)
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
      setDeleteId(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setHighlightsText("");
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  }

  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      location: p.location,
      status: p.status,
      type: p.type,
      description: p.description,
      highlights: p.highlights,
      image: p.image,
    });
    setHighlightsText(highlightsToText(p.highlights));
    setImageFile(null);
    setImagePreview(p.image);
    setDialogOpen(true);
  }

  useEffect(() => {
    if (!dialogOpen) {
      setEditingId(null);
    }
  }, [dialogOpen]);

  return (
    <>
      <div className="admin-toolbar">
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Projects
        </h1>
        <button type="button" className="admin-btn" onClick={openCreate}>
          Add project
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Location</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="admin-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && list.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-muted">
                  No projects yet. Add one or run the server seed script.
                </td>
              </tr>
            )}
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    className="admin-thumb"
                    src={p.image}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                </td>
                <td>{p.title}</td>
                <td>{p.location}</td>
                <td>{p.status}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    style={{ padding: "0.35rem 0.65rem", marginRight: 8 }}
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    style={{ padding: "0.35rem 0.65rem" }}
                    onClick={() => setDeleteId(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit project" : "Add project"}
            </DialogTitle>
          </DialogHeader>
          <div className="admin-form-grid">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="admin-label">Location</label>
              <input
                className="admin-input"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select
                className="admin-select"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as Project["status"],
                  }))
                }
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Type</label>
              <input
                className="admin-input"
                placeholder="e.g. Residential"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="admin-label">
                Highlights (one per line)
              </label>
              <textarea
                className="admin-textarea"
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                placeholder="Line 1&#10;Line 2"
              />
            </div>
            <div>
              <label className="admin-label">Image</label>
              <input
                type="file"
                accept="image/*"
                className="admin-input"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImagePreview(url);
                  } else {
                    setImagePreview(form.image || "");
                  }
                }}
              />
              <input type="hidden" value={form.image} readOnly />
              {imagePreview ? (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 240,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid #e4e4e7",
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
