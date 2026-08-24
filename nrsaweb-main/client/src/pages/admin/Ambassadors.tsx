
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { apiRequest, forceRefresh } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Ambassador } from "@/types/schema";

export default function AdminAmbassadors() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: rawAmbassadors = [] } = useQuery<any[]>({
        queryKey: ["/api/ambassadors"],
    });

    // Normalize data (handle snake_case from DB if necessary)
    const ambassadors: Ambassador[] = rawAmbassadors.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        photoUrl: a.photoUrl || a.photo_url || "",
        bio: a.bio,
        socialLinks: a.socialLinks || a.social_links,
        order: a.order || 0,
        createdAt: a.createdAt || a.created_at || new Date(),
    }));

    const [open, setOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);
    const [editingAmbassador, setEditingAmbassador] = useState<Ambassador | null>(null);

    const [form, setForm] = useState({
        name: "",
        role: "",
        photoUrl: "",
        bio: "",
        order: 0,
    });

    const saveAmbassador = useMutation({
        mutationFn: async () => {
            const method = editingAmbassador ? "PATCH" : "POST";
            const url = editingAmbassador ? `/api/ambassadors/${editingAmbassador.id}` : "/api/ambassadors";
            const res = await apiRequest(method, url, form);
            if (!res.ok) throw new Error('Failed to save ambassador');
            return res;
        },
        onSuccess: async () => {
            await forceRefresh(["/api/ambassadors"], queryClient);
            toast({
                title: editingAmbassador ? "Ambassador Updated" : "Ambassador Created",
                description: "Ambassador saved successfully!",
            });
            setOpen(false);
            setEditingAmbassador(null);
            setForm({ name: "", role: "", photoUrl: "", bio: "", order: 0 });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to save ambassador.",
                variant: "destructive",
            });
        },
    });

    const deleteAmbassador = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("DELETE", `/api/ambassadors/${id}`);
            if (!res.ok) throw new Error('Delete failed');
            return id;
        },
        onSuccess: () => {
            forceRefresh(["/api/ambassadors"], queryClient);
            toast({
                title: "Ambassador Deleted",
                description: "Ambassador removed successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete ambassador.",
                variant: "destructive",
            });
        },
    });

    const handleSave = () => {
        if (!form.name || !form.role || !form.photoUrl) {
            toast({
                title: "Validation Error",
                description: "Name, Role and Photo are required!",
                variant: "destructive",
            });
            return;
        }
        saveAmbassador.mutate();
    };

    const handleEdit = (ambassador: Ambassador) => {
        setEditingAmbassador(ambassador);
        setForm({
            name: ambassador.name,
            role: ambassador.role,
            photoUrl: ambassador.photoUrl,
            bio: ambassador.bio || "",
            order: ambassador.order,
        });
        setOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this ambassador?")) {
            deleteAmbassador.mutate(id);
        }
    };

    const handlePreview = (ambassador: Ambassador) => {
        setSelectedAmbassador(ambassador);
        setPreviewOpen(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Featured Ambassadors</h1>
                    <p className="text-muted-foreground mt-2">Manage ambassadors and their profiles</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => {
                                setEditingAmbassador(null);
                                setForm({ name: "", role: "", photoUrl: "", bio: "", order: 0 });
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Ambassador
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingAmbassador ? "Edit Ambassador" : "Add Ambassador"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div>
                                <Label>Full Name *</Label>
                                <Input
                                    placeholder="e.g. Gbenga Ezekiel"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Role / Title *</Label>
                                <Input
                                    placeholder="e.g. World Record Holder"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                />
                            </div>
                            <ImageUpload
                                label="Profile Photo *"
                                value={form.photoUrl}
                                onChange={(url) => setForm({ ...form, photoUrl: url })}
                            />
                            <div>
                                <Label>Biography</Label>
                                <Textarea
                                    placeholder="Enter ambassador statistics and story..."
                                    className="min-h-[150px]"
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Display Order</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={form.order}
                                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                                />
                            </div>
                            <Button
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={handleSave}
                                disabled={saveAmbassador.isPending}
                            >
                                {saveAmbassador.isPending ? "Saving..." : editingAmbassador ? "Update Ambassador" : "Save Ambassador"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {ambassadors.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No ambassadors added yet. Click "Add Ambassador" to create one.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ambassadors
                        .sort((a, b) => a.order - b.order)
                        .map((ambassador) => (
                            <Card key={ambassador.id} className="overflow-hidden">
                                <div className="aspect-square relative">
                                    <img
                                        src={ambassador.photoUrl}
                                        alt={ambassador.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-lg">{ambassador.name}</h3>
                                    <p className="text-sm text-primary font-medium mb-2">{ambassador.role}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{ambassador.bio}</p>

                                    <div className="flex gap-2 mt-4">
                                        <Button variant="secondary" size="sm" onClick={() => handlePreview(ambassador)}>
                                            <Eye className="w-4 h-4 mr-1" /> View
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(ambassador)}>
                                            <Edit className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(ambassador.id)}>
                                            <Trash className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            )}

            {/* Details Preview Dialog (Similar to what user wants on Main Website) */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Ambassador Profile</DialogTitle>
                    </DialogHeader>
                    {selectedAmbassador && (
                        <div className="grid md:grid-cols-2 gap-8 mt-4">
                            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={selectedAmbassador.photoUrl}
                                    alt={selectedAmbassador.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedAmbassador.name}</h2>
                                    <p className="text-primary font-medium text-lg">{selectedAmbassador.role}</p>
                                </div>
                                <div className="prose prose-sm dark:prose-invert">
                                    <p className="whitespace-pre-line text-muted-foreground">{selectedAmbassador.bio || "No biography available."}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
