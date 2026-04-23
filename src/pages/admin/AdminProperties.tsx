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
import type { Property } from "@/lib/data";

const emptyForm: Omit<Property, "id"> = {
  title: "",
  price: "",
  location: "",
  type: "Buy",
  propertyType: "",
  bedrooms: 0,
  bathrooms: 0,
  area: "",
  image: "",
  images: [],
  video: "",
  featured: false,
  description: "",
  highlights: [] as string[],
};

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response
      ?.data?.message;
    if (r) return r;
  }
  return "Something went wrong";
}

export default function AdminProperties() {
  const queryClient = useQueryClient();
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data } = await api.get<Property[]>("/api/properties");
      return data;
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Property, "id">>(emptyForm);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: propertyTypesData = [], isLoading: typesLoading } = useQuery({
    queryKey: ["propertyTypes"],
    queryFn: async () => {
      const { data } = await api.get("/api/property-types");
      return data;
    },
  });
  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => p.startsWith("blob:") && URL.revokeObjectURL(p));
      if (videoPreview.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreviews, videoPreview]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("price", form.price);
      fd.append("location", form.location);
      fd.append("type", form.type);
      fd.append("propertyType", form.propertyType);
      fd.append("bedrooms", String(form.bedrooms));
      fd.append("bathrooms", String(form.bathrooms));
      fd.append("area", form.area);
      fd.append("featured", String(!!form.featured));
      fd.append("description", form.description);
      fd.append("highlights", JSON.stringify(form.highlights));
      fd.append("existingImages", JSON.stringify(existingImages));
      if (form.video && typeof form.video === "string") {
        fd.append("existingVideo", form.video);
      }

      newImages.forEach((f) => fd.append("images", f));
      if (videoFile) fd.append("video", videoFile);

      // Backwards compatible: allow URL-only create if no files selected.
      if (newImages.length === 0 && existingImages.length === 0 && form.image) {
        fd.append("image", form.image);
      }

      if (!editingId && newImages.length === 0 && existingImages.length === 0 && !form.image) {
        toast.error("Please upload at least one image");
        return;
      }
      if (editingId) {
        await api.put(`/api/properties/${editingId}`, fd);
      } else {
        await api.post("/api/properties", fd);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(editingId ? "Property updated" : "Property created");
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setNewImages([]);
      setExistingImages([]);
      setImagePreviews([]);
      setVideoFile(null);
      setVideoPreview("");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property deleted");
      setDeleteId(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setNewImages([]);
    setExistingImages([]);
    setImagePreviews([]);
    setVideoFile(null);
    setVideoPreview("");
    setDialogOpen(true);
  }

  function openEdit(p: Property) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: p.price,
      location: p.location,
      type: p.type,
      propertyType: p.propertyType,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area,
      image: p.image || "",
      images: p.images || (p.image ? [p.image] : []),
      video: p.video || "",
      featured: p.featured ?? false,
      description: p.description || "",
      highlights: p.highlights || [],
    });
    const imgs = p.images || (p.image ? [p.image] : []);
    setExistingImages(imgs);
    setImagePreviews(imgs);
    setNewImages([]);
    setVideoFile(null);
    setVideoPreview(p.video || "");
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
          Properties
        </h1>
        <button type="button" className="admin-btn" onClick={openCreate}>
          Add property
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="admin-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && list.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-muted">
                  No properties yet. Add one or run the server seed script.
                </td>
              </tr>
            )}
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    className="admin-thumb"
                    src={(p.images && p.images[0]) || p.image || ""}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                </td>
                <td>{p.title}</td>
                <td>{p.location}</td>
                <td>{p.type}</td>
                <td>{p.price}</td>
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
              {editingId ? "Edit property" : "Add property"}
            </DialogTitle>
          </DialogHeader>
          <div className="admin-form-grid cols-2">
            <div style={{ gridColumn: "1 / -1" }}>
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
              <label className="admin-label">Price</label>
              <input
                className="admin-input"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
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
              <label className="admin-label">Listing type</label>
              <select
                className="admin-select"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as Property["type"],
                  }))
                }
              >
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
                <option value="Lease">Lease</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Property type</label>
              <input
                className="admin-input"
                placeholder="e.g. Apartment"
                value={form.propertyType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, propertyType: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="admin-label">Bedrooms</label>
              <input
                type="number"
                min={0}
                className="admin-input"
                value={form.bedrooms}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    bedrooms: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <label className="admin-label">Bathrooms</label>
              <input
                type="number"
                min={0}
                className="admin-input"
                value={form.bathrooms}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    bathrooms: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="admin-label">Area</label>
              <input
                className="admin-input"
                value={form.area}
                onChange={(e) =>
                  setForm((f) => ({ ...f, area: e.target.value }))
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="admin-label">Description</label>
              <input
                className="admin-input"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="admin-label">
                Highlights
              </label>
              <textarea
                className="admin-textarea"
                value={(form.highlights || []).join("\n")}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    highlights: e.target.value
                      .split("\n")
                      .map((h) => h.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder={"Highlight 1\nHighlight 2"}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="admin-label">Images (max 10)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="admin-input"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  // Revoke old blob previews
                  imagePreviews.forEach((p) => {
                    if (p.startsWith("blob:")) URL.revokeObjectURL(p);
                  });
                  setNewImages(files);
                  const blobs = files.map((f) => URL.createObjectURL(f));
                  setImagePreviews([...existingImages, ...blobs]);
                }}
              />
              {imagePreviews.length ? (
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 10,
                  }}
                >
                  {imagePreviews.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: 90,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #e4e4e7",
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="admin-label">Video (optional)</label>
              <input
                type="file"
                accept="video/*"
                className="admin-input"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (videoPreview.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
                  setVideoFile(file);
                  setVideoPreview(file ? URL.createObjectURL(file) : form.video || "");
                }}
              />
              {videoPreview ? (
                <div style={{ marginTop: 10 }}>
                  <video
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      maxHeight: 240,
                      borderRadius: 10,
                      border: "1px solid #e4e4e7",
                      background: "#111827",
                    }}
                  >
                    <source src={videoPreview} />
                  </video>
                </div>
              ) : null}
            </div>
            <div style={{ gridColumn: "1 / -1" }} className="admin-checkbox-row">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured ?? false}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
              />
              <label htmlFor="featured">Featured on homepage</label>
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
            <AlertDialogTitle>Delete property?</AlertDialogTitle>
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
