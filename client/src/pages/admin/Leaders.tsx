import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Leader {
  id: number;
  name: string;
  position: string;
  bio?: string;
  photoUrl?: string;
  order: number;
  state?: string;
}

export default function AdminLeaders() {
  const { toast } = useToast();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    photoUrl: "",
    bio: "",
    order: 0,
  });

  const fetchLeaders = async () => {
    try {
      const res = await apiRequest("GET", "/api/leaders");
      const data = await res.json();
      setLeaders(data);
    } catch (error) {
      console.error("Failed to fetch leaders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.position) {
      toast({
        title: "Validation Error",
        description: "Name and position are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const method = editingLeader ? "PATCH" : "POST";
      const url = editingLeader ? `/api/leaders/${editingLeader.id}` : "/api/leaders";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const savedLeader = await res.json();

      if (editingLeader) {
        setLeaders(items => items.map(item => 
          item.id === editingLeader.id ? savedLeader : item
        ));
      } else {
        setLeaders(items => [savedLeader, ...items]);
      }

      toast({
        title: editingLeader ? "Leader Updated" : "Leader Added",
        description: "Leader profile saved successfully!",
      });
      setOpen(false);
      setEditingLeader(null);
      setForm({ name: "", position: "", photoUrl: "", bio: "", order: 0 });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save leader.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this leader?")) return;

    try {
      const res = await fetch(`/api/leaders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      setLeaders(items => items.filter(item => item.id !== id));
      toast({
        title: "Leader Deleted",
        description: "The leader profile has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete leader.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setForm({
      name: leader.name,
      position: leader.position,
      photoUrl: leader.photoUrl || "",
      bio: leader.bio || "",
      order: leader.order || 0,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leaders Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage federation leaders — Add, Edit, or Delete leadership profiles
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingLeader(null); setForm({ name: "", position: "", photoUrl: "", bio: "", order: 0 }); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Leader
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLeader ? "Edit Leader" : "Add Leader"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <Label>Position *</Label>
                <Input name="position" value={form.position} onChange={handleChange} />
              </div>
              <ImageUpload label="Leader Photo" value={form.photoUrl || ""} onChange={(url) => setForm({ ...form, photoUrl: url })} />
              <div>
                <Label>Biography</Label>
                <Textarea name="bio" value={form.bio} onChange={handleChange} rows={5} />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" name="order" value={form.order} onChange={handleChange} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave}>{editingLeader ? "Update" : "Add"}</Button>
                <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-center py-12">Loading leaders...</p>
      ) : leaders.length === 0 ? (
        <Card><CardContent className="py-12 text-center">No leaders added yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <Card key={leader.id}>
              <CardContent>
                <img src={leader.photoUrl || "https://placehold.co/400x400/009739/ffffff?text=NRSA"} alt={leader.name} className="w-full h-48 object-cover object-top rounded-md" />
                <h3 className="font-bold">{leader.name}</h3>
                <p className="text-primary font-semibold">{leader.position}</p>
                <p>Order: {leader.order}</p>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleEdit(leader)}><Edit2 /></Button>
                  <Button onClick={() => handleDelete(leader.id)} variant="destructive"><Trash2 /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
