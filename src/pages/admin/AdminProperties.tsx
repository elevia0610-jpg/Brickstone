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
  featured: false,
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
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        await api.put(`/api/properties/${editingId}`, form);
      } else {
        await api.post("/api/properties", form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(editingId ? "Property updated" : "Property created");
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
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
      image: p.image,
      featured: p.featured ?? false,
    });
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
                    src={p.image}
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
              <label className="admin-label">Image URL</label>
              <input
                className="admin-input"
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
              />
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
