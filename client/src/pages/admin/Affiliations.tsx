import React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, forceRefresh } from "@/lib/queryClient";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Affiliation } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";

/**
 * Affiliations Admin Page
 * 
 * CRITICAL FIX: Connected to actual API endpoints
 * Affiliations are now saved to the database and appear on the live site
 */
export default function AdminAffiliations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rawAffiliations = [] } = useQuery<any[]>({
    queryKey: ["/api/affiliations"],
  });

  const affiliations: Affiliation[] = rawAffiliations.map(a => ({
    id: a.id,
    name: a.name,
    logoUrl: a.logoUrl || a.logo_url || "",
    website: a.website,
    description: a.description,
    order: a.order || 0,
    createdAt: a.createdAt || a.created_at || new Date(),
  }));

  const [open, setOpen] = useState(false);
  const [editingAffiliation, setEditingAffiliation] = useState<Affiliation | null>(null);
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    website: "",
    description: "",
    order: 0,
  });

  const saveAffiliation = useMutation({
    mutationFn: async () => {
      const method = editingAffiliation ? "PATCH" : "POST";
      const url = editingAffiliation ? `/api/affiliations/${editingAffiliation.id}` : "/api/affiliations";
      const res = await apiRequest(method, url, form);
      if (!res.ok) throw new Error('Failed to save affiliation');
      return res;
    },
    onSuccess: async () => {
      await forceRefresh(["/api/affiliations"], queryClient);
      toast({
        title: editingAffiliation ? "Affiliation Updated" : "Affiliation Created",
        description: "Affiliation saved successfully!",
      });
      setOpen(false);
      setEditingAffiliation(null);
      setForm({ name: "", logoUrl: "", website: "", description: "", order: 0 });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save affiliation.",
        variant: "destructive",
      });
    },
  });

  const deleteAffiliation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/affiliations/${id}`);
      if (!res.ok) throw new Error('Delete failed');
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["/api/affiliations"] });
      const previousAffiliations = queryClient.getQueryData<Affiliation[]>(["/api/affiliations"]) ?? [];
      queryClient.setQueryData<Affiliation[]>(["/api/affiliations"], (old) =>
        (old ?? []).filter(item => item.id !== deletedId)
      );
      return { previousAffiliations };
    },
    onError: (error, deletedId, context) => {
      if (context?.previousAffiliations) {
        queryClient.setQueryData(["/api/affiliations"], context.previousAffiliations);
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete affiliation.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Affiliation Deleted",
        description: "Affiliation removed successfully.",
      });
    },
    onSettled: async () => {
      await forceRefresh(["/api/affiliations"], queryClient);
    },
  });

  const handleSave = () => {
    if (!form.name || !form.logoUrl) {
      toast({
        title: "Validation Error",
        description: "Name and logo are required!",
        variant: "destructive",
      });
      return;
    }
    saveAffiliation.mutate();
  };

  const handleEdit = (affiliation: Affiliation) => {
    setEditingAffiliation(affiliation);
    setForm({
      name: affiliation.name,
      logoUrl: affiliation.logoUrl,
      website: affiliation.website || "",
      description: affiliation.description || "",
      order: affiliation.order,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this affiliation?")) {
      deleteAffiliation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Affiliations Management</h1>
          <p className="text-muted-foreground mt-2">Manage international affiliations</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              data-testid="button-add-affiliation"
              onClick={() => {
                setEditingAffiliation(null);
                setForm({ name: "", logoUrl: "", website: "", description: "", order: 0 });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Affiliation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAffiliation ? "Edit Affiliation" : "Add Affiliation"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Organization Name *</Label>
                <Input
                  placeholder="IJRU, IRSO, etc."
                  data-testid="input-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <ImageUpload
                label="Organization Logo *"
                value={form.logoUrl}
                onChange={(url) => setForm({ ...form, logoUrl: url })}
              />
              <div>
                <Label>Website</Label>
                <Input
                  placeholder="https://ijru.sport"
                  data-testid="input-website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description..."
                  className="min-h-[100px]"
                  data-testid="input-description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  placeholder="0"
                  data-testid="input-order"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                data-testid="button-save-affiliation"
                onClick={handleSave}
                disabled={saveAffiliation.isPending}
              >
                {saveAffiliation.isPending ? "Saving..." : editingAffiliation ? "Update Affiliation" : "Save Affiliation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {affiliations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No affiliations yet. Click "Add Affiliation" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {affiliations
            .sort((a, b) => a.order - b.order)
            .map((affiliation) => (
              <Card key={affiliation.id} className="p-4">
                <CardContent>
                  <img
                    src={affiliation.logoUrl}
                    alt={affiliation.name}
                    className="w-full h-32 object-contain mb-4"
                  />
                  <h3 className="font-bold text-lg">{affiliation.name}</h3>
                  {affiliation.website && (
                    <a href={affiliation.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {affiliation.website}
                    </a>
                  )}
                  {affiliation.description && (
                    <p className="text-sm text-muted-foreground mt-2">{affiliation.description}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(affiliation)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(affiliation.id)} disabled={deleteAffiliation.isPending}>
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
