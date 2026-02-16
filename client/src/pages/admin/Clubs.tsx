import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { Club, InsertClub } from "@/types/schema";
import { apiRequest } from "@/lib/queryClient";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";

/**
 * AdminClubs — Admin UI for Clubs with Add / Edit / Delete
 *
 * Notes:
 * - Uses /api/clubs (GET, POST, PUT, DELETE)
 * - Non-destructive: keeps existing structure/styling
 * - Uses React Query to invalidate and refresh the clubs list after changes
 */

export default function AdminClubs() {
  const { toast } = useToast();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    try {
      const res = await apiRequest("GET", "/api/clubs");
      const data = await res.json();
      setClubs(data);
    } catch (error) {
      console.error("Failed to fetch clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleSubmitAdd = async () => {
    if (!form.name || !form.city || !form.state || !form.managerName || !form.contactEmail || !form.contactPhone) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const savedClub = await res.json();
      setClubs(items => [savedClub, ...items]);
      toast({ title: "Success", description: "Club added successfully!" });
      setForm({ name: "", logoUrl: "", city: "", state: "", managerName: "", contactEmail: "", contactPhone: "", isRegistered: true });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingClubId || !editForm) return;
    if (!editForm.name || !editForm.city || !editForm.state || !editForm.managerName || !editForm.contactEmail || !editForm.contactPhone) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`/api/clubs/${editingClubId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const savedClub = await res.json();
      setClubs(items => items.map(item => (item as any).id === parseInt(editingClubId) ? savedClub : item));
      toast({ title: "Success", description: "Club updated successfully!" });
      setEditOpen(false);
      setEditingClubId(null);
      setEditForm(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this club? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/clubs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      setClubs(items => items.filter(item => (item as any).id !== id));
      toast({ title: "Success", description: "Club deleted successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Form state for Add
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    city: "",
    state: "",
    managerName: "",
    contactEmail: "",
    contactPhone: "",
    isRegistered: true,
  });

  // Edit state: which club is being edited and its form
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof form | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }));
  };



  // Begin Edit for a club
  const startEdit = (club: Club) => {
    setEditingClubId(String((club as any).id));
    setEditForm({
      name: club.name ?? "",
      logoUrl: (club as any).logoUrl ?? (club as any).logo ?? "",
      city: club.city ?? "",
      state: club.state ?? "",
      managerName: club.managerName ?? "",
      contactEmail: club.contactEmail ?? "",
      contactPhone: club.contactPhone ?? "",
      isRegistered: Boolean((club as any).isRegistered),
    });
    setEditOpen(true);
  };

  const handleEditChange = (key: keyof typeof form, value: string | boolean) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [key]: value });
  };



  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clubs Management</h1>
          <p className="text-muted-foreground mt-2">Manage registered clubs</p>
        </div>

        {/* Add Club Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-club">
              <Plus className="w-4 h-4 mr-2" />
              Add Club
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Club</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label>Club Name *</Label>
                <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <ImageUpload
                label="Club Logo"
                value={form.logoUrl}
                onChange={(url) => handleChange("logoUrl", url)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input value={form.state} onChange={(e) => handleChange("state", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Manager Name *</Label>
                <Input value={form.managerName} onChange={(e) => handleChange("managerName", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email *</Label>
                  <Input value={form.contactEmail} onChange={(e) => handleChange("contactEmail", e.target.value)} />
                </div>
                <div>
                  <Label>Contact Phone *</Label>
                  <Input value={form.contactPhone} onChange={(e) => handleChange("contactPhone", e.target.value)} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.isRegistered} onCheckedChange={(v) => handleChange("isRegistered", v)} />
                <Label>Registered</Label>
              </div>

              <Button onClick={handleSubmitAdd} className="w-full bg-primary hover:bg-primary/90">
                Save Club
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clubs List */}
      {loading ? (
        <div className="text-center py-20">Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No clubs registered yet. Click "Add Club" to register one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={(club as any).id} className="p-6 relative">
              {/* Edit & Delete buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(club)}
                  aria-label={`Edit ${club.name}`}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete((club as any).id)}
                  aria-label={`Delete ${club.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <CardContent>
                <h3 className="font-bold text-xl mb-2">{club.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{club.city}, {club.state}</p>
                <p className="text-sm mb-2">{club.managerName}</p>
                <p className="text-sm text-muted-foreground mb-1">{club.contactEmail}</p>
                <p className="text-sm text-muted-foreground">{club.contactPhone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal (controlled) */}
      <Dialog open={editOpen} onOpenChange={(v) => setEditOpen(v)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Club</DialogTitle>
          </DialogHeader>

          {editForm ? (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Club Name *</Label>
                <Input value={editForm.name} onChange={(e) => handleEditChange("name", e.target.value)} />
              </div>

              <ImageUpload
                label="Club Logo"
                value={editForm.logoUrl}
                onChange={(url) => handleEditChange("logoUrl", url)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input value={editForm.city} onChange={(e) => handleEditChange("city", e.target.value)} />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input value={editForm.state} onChange={(e) => handleEditChange("state", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Manager Name *</Label>
                <Input value={editForm.managerName} onChange={(e) => handleEditChange("managerName", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email *</Label>
                  <Input value={editForm.contactEmail} onChange={(e) => handleEditChange("contactEmail", e.target.value)} />
                </div>
                <div>
                  <Label>Contact Phone *</Label>
                  <Input value={editForm.contactPhone} onChange={(e) => handleEditChange("contactPhone", e.target.value)} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={editForm.isRegistered} onCheckedChange={(v) => handleEditChange("isRegistered", v)} />
                <Label>Registered</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => { setEditOpen(false); setEditingClubId(null); setEditForm(null); }} variant="ghost">Cancel</Button>
                <Button onClick={handleSubmitEdit} className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
