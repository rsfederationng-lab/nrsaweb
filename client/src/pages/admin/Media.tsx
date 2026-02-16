import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, Edit2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Media } from "@/types/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminMedia() {
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"upload" | "external">("upload");
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    externalUrl: "",
    category: "",
  });

  const fetchMedia = async () => {
    try {
      const res = await apiRequest("GET", "/api/media");
      const data = await res.json();
      setMediaItems(data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.category) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (uploadMode === "upload" && !form.imageUrl) {
      toast({
        title: "Validation Error",
        description: "Please upload an image.",
        variant: "destructive",
      });
      return;
    }

    if (uploadMode === "external" && !form.externalUrl) {
      toast({
        title: "Validation Error",
        description: "Please enter an external URL.",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      title: form.title,
      description: form.description,
      category: form.category,
    };

    if (uploadMode === "external") {
      payload.externalUrl = form.externalUrl;
    } else {
      payload.imageUrl = form.imageUrl;
    }

    try {
      const method = editingMedia ? "PATCH" : "POST";
      const url = editingMedia ? `/api/media/${editingMedia.id}` : "/api/media";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const savedMedia = await res.json();

      if (editingMedia) {
        setMediaItems(items => items.map(item => 
          item.id === editingMedia.id ? savedMedia : item
        ));
      } else {
        setMediaItems(items => [savedMedia, ...items]);
      }

      toast({
        title: editingMedia ? "Media Updated" : "Media Created",
        description: "Media item saved successfully!",
      });
      setEditingMedia(null);
      setForm({ title: "", description: "", imageUrl: "", externalUrl: "", category: "" });
      setIsDialogOpen(false);
      setUploadMode("upload");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save media.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      setMediaItems(items => items.filter(item => item.id !== id));
      toast({
        title: "Media Deleted",
        description: "Media item removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete media.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: Media) => {
    setEditingMedia(item);
    setUploadMode(item.isExternal ? "external" : "upload");
    setForm({
      title: item.title,
      description: item.description || "",
      imageUrl: item.isExternal ? "" : (item.imageUrl || ""),
      externalUrl: item.isExternal ? (item.imageUrl || "") : "",
      category: item.category || "",
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingMedia(null);
    setUploadMode("upload");
    setForm({ title: "", description: "", imageUrl: "", externalUrl: "", category: "" });
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Management</h1>
          <p className="text-muted-foreground mt-2">
            Add, edit, or delete gallery images
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMedia ? "Edit Media" : "Add Media"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Title *</Label>
              <Input
                data-testid="input-media-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Media title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                data-testid="input-media-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description (optional)"
              />
            </div>

            <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as "upload" | "external")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" data-testid="tab-upload">Upload File</TabsTrigger>
                <TabsTrigger value="external" data-testid="tab-external">External Link</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <ImageUpload
                  label="Media Image *"
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                />
              </TabsContent>
              
              <TabsContent value="external" className="mt-4">
                <div>
                  <Label>External URL * (YouTube, Vimeo, etc.)</Label>
                  <Input
                    data-testid="input-external-url"
                    value={form.externalUrl}
                    onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For YouTube videos, we'll automatically generate a thumbnail
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger data-testid="select-media-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Achievement">Achievement</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              data-testid="button-save-media"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleSubmit}
            >
              {editingMedia ? "Update Media" : "Save Media"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading media...</p>
          </CardContent>
        </Card>
      ) : mediaItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No media items yet. Click "Add Media" to upload one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <Card key={item.id} className="overflow-hidden p-4" data-testid={`card-media-${item.id}`}>
              {item.isExternal && item.thumbnailUrl ? (
                <div className="relative">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover object-top rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                    <div className="bg-white/90 px-3 py-1 rounded text-sm font-medium">
                      External Link
                    </div>
                  </div>
                </div>
              ) : item.isExternal ? (
                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">External Link</p>
                </div>
              ) : (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover object-top rounded-md"
                />
              )}
              <h3 className="font-semibold mt-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {item.category} {item.isExternal && "• External"}
              </p>
              <div className="flex justify-between">
                <Button
                  data-testid={`button-edit-${item.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  data-testid={`button-delete-${item.id}`}
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}