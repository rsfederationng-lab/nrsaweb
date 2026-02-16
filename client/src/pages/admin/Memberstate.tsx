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
import type { MemberState, InsertMemberState } from "@/types/schema";
import { apiRequest } from "@/lib/queryClient";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function AdminMemberState() {
  const { toast } = useToast();
  const [states, setStates] = useState<MemberState[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStates = async () => {
    try {
      const res = await apiRequest("GET", "/api/member-states");
      const data = await res.json();
      setStates(data);
    } catch (error) {
      console.error("Failed to fetch member states:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleSubmitAdd = async () => {
    if (!form.name || !form.representativeName || !form.contactEmail || !form.contactPhone) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    try {
      const { useUpload, ...stateData } = form;
      const res = await fetch("/api/member-states", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(stateData),
      });
      const savedState = await res.json();
      setStates(items => [savedState, ...items]);
      toast({ title: "Success", description: "Member state added successfully!" });
      setForm({ name: "", logoUrl: "", representativeName: "", contactEmail: "", contactPhone: "", isRegistered: true, useUpload: true });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingId || !editForm) return;
    if (!editForm.name || !editForm.representativeName || !editForm.contactEmail || !editForm.contactPhone) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    try {
      const { useUpload, ...dataToSave } = editForm;
      const res = await fetch(`/api/member-states/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(dataToSave),
      });
      const savedState = await res.json();
      setStates(items => items.map(item => item.id === parseInt(editingId) ? savedState : item));
      toast({ title: "Success", description: "Member state updated successfully!" });
      setEditOpen(false);
      setEditingId(null);
      setEditForm(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this member state? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/member-states/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      setStates(items => items.filter(item => item.id !== id));
      toast({ title: "Success", description: "Member state deleted successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };
  // -------------------------------------

  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    representativeName: "",
    contactEmail: "",
    contactPhone: "",
    isRegistered: true,
    useUpload: true,
  });

  // State for editing modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof form | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }));
  };



  const startEdit = (state: MemberState) => {
    setEditingId(String(state.id));
    setEditForm({
      name: state.name ?? "",
      logoUrl: state.logoUrl ?? "",
      representativeName: state.representativeName ?? "",
      contactEmail: state.contactEmail ?? "",
      contactPhone: state.contactPhone ?? "",
      isRegistered: Boolean(state.isRegistered),
      // The logoUrl determines if the image input or URL input should be shown in edit.
      useUpload: !state.logoUrl || state.logoUrl.startsWith("http") === false, 
    });
    setEditOpen(true);
  };

  const handleEditChange = (key: keyof typeof form, value: string | boolean) => {
    if (!editForm) return;
    setEditForm((p) => (p ? { ...p, [key]: value } : null)); // Use functional update
  };



  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Member States Management</h1>
          <p className="text-muted-foreground mt-2">Manage registered member states</p>
        </div>

        {/* ADD Member State Dialog (OK) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Member State
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Member State</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* ... (Add form fields - OK) ... */}
              <div>
                <Label>State Name *</Label>
                <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={form.useUpload}
                  onCheckedChange={(v) => handleChange("useUpload", v)}
                />
                <Label>{form.useUpload ? "Upload Logo" : "Use Logo URL"}</Label>
              </div>

              {form.useUpload ? (
                <ImageUpload
                  label="State Logo"
                  value={form.logoUrl}
                  onChange={(url) => handleChange("logoUrl", url)}
                />
              ) : (
                <div>
                  <Label>Logo URL</Label>
                  <Input value={form.logoUrl} onChange={(e) => handleChange("logoUrl", e.target.value)} />
                </div>
              )}

              <div>
                <Label>State Representative *</Label>
                <Input value={form.representativeName} onChange={(e) => handleChange("representativeName", e.target.value)} />
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
                Save Member State
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Member States List */}
      {loading ? (
        <div className="text-center py-20">Loading member states...</div>
      ) : states.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No member states registered yet. Click "Add Member State" to register one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => (
            <Card key={state.id} className="p-6 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(state)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(state.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent>
    <h3 className="font-bold text-xl mb-2">{state.name}</h3>
    <p className="text-sm text-muted-foreground mb-1">{state.representativeName}</p>
    <p className="text-sm text-muted-foreground mb-1">{state.contactEmail}</p>
    <p className="text-sm text-muted-foreground">{state.contactPhone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🐛 FIX: Edit Dialog moved outside the map loop to be a single component */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Member State</DialogTitle>
          </DialogHeader>

          {editForm ? (
            <div className="space-y-4 mt-4">
              <div>
                <Label>State Name *</Label>
                <Input value={editForm.name} onChange={(e) => handleEditChange("name", e.target.value)} />
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={editForm.useUpload}
                  onCheckedChange={(v) => handleEditChange("useUpload", v)}
                />
                <Label>{editForm.useUpload ? "Upload Logo" : "Use Logo URL"}</Label>
              </div>

              {editForm.useUpload ? (
                <ImageUpload
                  label="State Logo"
                  value={editForm.logoUrl}
                  onChange={(url) => handleEditChange("logoUrl", url)}
                />
              ) : (
                <div>
                  <Label>Logo URL</Label>
                  <Input value={editForm.logoUrl} onChange={(e) => handleEditChange("logoUrl", e.target.value)} />
              </div>
              )}

              <div>
                <Label>State Representative *</Label>
                <Input value={editForm.representativeName} onChange={(e) => handleEditChange("representativeName", e.target.value)} />
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

              <div className="flex gap-2 justify-end">
                <Button onClick={() => { setEditOpen(false); setEditingId(null); setEditForm(null); }} variant="ghost">Cancel</Button>
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
