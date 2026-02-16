import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, MoveUp, MoveDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, forceRefresh } from "@/lib/queryClient";
import type { HeroSlide } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";

/**
 * Hero Slides Admin Page
 * 
 * Manages homepage hero carousel slides with drag-and-drop image upload.
 * 
 * Features:
 * - Create, edit, delete hero slides
 * - Drag-and-drop image upload (replaces URL-only input)
 * - Reorder slides by changing order number
 * - Toggle slide active/inactive status
 * - All changes update live site immediately
 */
export default function AdminHeroSlides() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: slides = [] } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides"],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    imageUrl: "",
    headline: "",
    subheadline: "",
    ctaText: "",
    ctaLink: "",
    order: 0,
    isActive: true,
  });

  // Create or update mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const method = editSlide ? "PATCH" : "POST";
      const url = editSlide ? `/api/hero-slides/${editSlide.id}` : "/api/hero-slides";
      const res = await apiRequest(method, url, formData);
      if (!res.ok) throw new Error('Failed to save slide');
      return res;
    },
    onSuccess: async () => {
      await forceRefresh(["/api/hero-slides"], queryClient);
      toast({
        title: editSlide ? "Slide Updated" : "Slide Created",
        description: "Hero slide saved successfully!",
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save slide.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/hero-slides/${id}`);
      if (!res.ok) throw new Error('Delete failed');
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["/api/hero-slides"] });
      const previousSlides = queryClient.getQueryData<HeroSlide[]>(["/api/hero-slides"]) ?? [];
      queryClient.setQueryData<HeroSlide[]>(["/api/hero-slides"], (old) => 
        (old ?? []).filter(item => item.id !== deletedId)
      );
      return { previousSlides };
    },
    onError: (error, deletedId, context) => {
      if (context?.previousSlides) {
        queryClient.setQueryData(["/api/hero-slides"], context.previousSlides);
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete slide.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Slide Deleted",
        description: "Hero slide removed successfully.",
      });
    },
    onSettled: async () => {
      await forceRefresh(["/api/hero-slides"], queryClient);
    },
  });

  const handleSave = () => {
    if (!formData.imageUrl || !formData.headline) {
      toast({
        title: "Validation Error",
        description: "Please provide an image and headline.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate();
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditSlide(slide);
    setFormData({
      imageUrl: slide.imageUrl,
      headline: slide.headline,
      subheadline: slide.subheadline || "",
      ctaText: slide.ctaText || "",
      ctaLink: slide.ctaLink || "",
      order: slide.order,
      isActive: slide.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this slide?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditSlide(null);
    setFormData({
      imageUrl: "",
      headline: "",
      subheadline: "",
      ctaText: "",
      ctaLink: "",
      order: slides.length,
      isActive: true,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hero Slides</h1>
          <p className="text-muted-foreground mt-2">Manage homepage hero carousel slides</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-slide" onClick={() => { setEditSlide(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editSlide ? "Edit" : "Add"} Hero Slide</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* NEW: Drag-and-drop image upload component */}
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Hero Image *"
              />
              
              <div>
                <Label>Headline *</Label>
                <Input 
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Main headline text" 
                  data-testid="input-headline" 
                />
              </div>
              <div>
                <Label>Subheadline</Label>
                <Input 
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  placeholder="Supporting text (optional)" 
                  data-testid="input-subheadline" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Text</Label>
                  <Input 
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Learn More" 
                    data-testid="input-cta-text" 
                  />
                </div>
                <div>
                  <Label>CTA Link</Label>
                  <Input 
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="/about" 
                    data-testid="input-cta-link" 
                  />
                </div>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input 
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-active" 
                />
                <Label>Active</Label>
              </div>
              <Button 
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90" 
                data-testid="button-save-slide"
              >
                {saveMutation.isPending ? "Saving..." : "Save Slide"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {slides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hero slides created yet. Click "Add Slide" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide) => (
            <Card key={slide.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.headline}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{slide.headline}</h3>
                    {slide.subheadline && (
                      <p className="text-sm text-muted-foreground">{slide.subheadline}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100">
                        Order: {slide.order}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                        {slide.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEdit(slide)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(slide.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
