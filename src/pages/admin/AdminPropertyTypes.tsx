import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response
      ?.data?.message;
    if (r) return r;
  }
  return "Something went wrong";
}

export default function AdminPropertyTypes() {
  const queryClient = useQueryClient();

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["propertyTypes"],
    queryFn: async () => {
      const { data } = await api.get("/api/property-types");
      return data;
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) {
        toast.error("Property type is required");
        return;
      }

      await api.post("/api/property-types", {
        name: name.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
      toast.success("Property type added");
      setDialogOpen(false);
      setName("");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/property-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
      toast.success("Deleted successfully");
      setDeleteId(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  function openCreate() {
    setName("");
    setDialogOpen(true);
  }

  return (
    <>
      {/* HEADER */}
      <div className="admin-toolbar">
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Property Types
        </h1>
        <button type="button" className="admin-btn" onClick={openCreate}>
          Add Property Type
        </button>
      </div>

      {/* TABLE */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={2} className="admin-muted">
                  Loading…
                </td>
              </tr>
            )}

            {!isLoading && list.length === 0 && (
              <tr>
                <td colSpan={2} className="admin-muted">
                  No property types yet. Add one to get started.
                </td>
              </tr>
            )}

            {list.map((type: any) => (
              <tr key={type._id}>
                <td>{type.name}</td>
                <td>
                  <button
                    className="admin-btn admin-btn-danger"
                    style={{ padding: "0.35rem 0.65rem" }}
                    onClick={() => setDeleteId(type._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Property Type</DialogTitle>
          </DialogHeader>

          <div>
            <label className="admin-label">Property Type Name</label>
            <input
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apartment, Villa"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete property type?
            </AlertDialogTitle>
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