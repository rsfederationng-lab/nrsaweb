import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { apiRequest, forceRefresh } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FeaturedBanner } from "@/types/schema";

type BannerForm = Omit<FeaturedBanner, "id" | "createdAt">;
const emptyForm: BannerForm = {
  title: "", subtitle: "", badgeText: "FEATURED EVENT", primaryButtonText: "",
  primaryButtonLink: "", secondaryButtonText: "Learn More", secondaryButtonLink: "",
  backgroundStyle: "red", imageUrl: "", isActive: true, order: 0, startDate: null, endDate: null,
  displayFrequency: "every_visit", isEmergency: false,
  showCountdown: false,
};

export default function AdminFeaturedBanners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: banners = [], isLoading, isError, error } = useQuery<FeaturedBanner[]>({ queryKey: ["/api/featured-banners"] });
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [editing, setEditing] = useState<FeaturedBanner | null>(null);
  const [open, setOpen] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, startDate: form.startDate || null, endDate: form.endDate || null };
      const res = await apiRequest(editing ? "PATCH" : "POST", editing ? `/api/featured-banners/${editing.id}` : "/api/featured-banners", payload);
      if (!res.ok) throw new Error((await res.json()).error || "Unable to save banner");
    },
    onSuccess: async () => {
      await forceRefresh(["/api/featured-banners"], queryClient);
      setOpen(false); setEditing(null); setForm(emptyForm);
      toast({ title: "Banner saved", description: "Featured banner updated successfully." });
    },
    onError: (error: Error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/featured-banners/${id}`);
      if (!res.ok) throw new Error("Unable to delete banner");
    },
    onSuccess: () => forceRefresh(["/api/featured-banners"], queryClient),
    onError: (error: Error) => toast({ title: "Delete failed", description: error.message, variant: "destructive" }),
  });

  const update = <K extends keyof BannerForm>(key: K, value: BannerForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const edit = (banner: FeaturedBanner) => {
    setEditing(banner);
    setForm({ ...banner, startDate: banner.startDate ? new Date(banner.startDate) : null, endDate: banner.endDate ? new Date(banner.endDate) : null });
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Featured Banners</h1><p className="mt-2 text-muted-foreground">Manage homepage announcements, display rules, and emergency messages.</p></div>
        <Button onClick={() => { setEditing(null); setForm({ ...emptyForm, order: banners.length }); setOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Banner</Button>
      </div>

      {open && (
        <Card>
          <CardHeader><CardTitle>{editing ? "Edit" : "Create"} Featured Banner</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><Label>Title</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} /></div>
            <div className="md:col-span-2"><Label>Subtitle / Description</Label><Textarea value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} /></div>
            <div><Label>Badge Text</Label><Input value={form.badgeText} onChange={(e) => update("badgeText", e.target.value)} /></div>
            <div><Label>Background Style</Label><select className="h-10 w-full rounded-md border bg-background px-3" value={form.backgroundStyle} onChange={(e) => update("backgroundStyle", e.target.value as BannerForm["backgroundStyle"])}><option value="red">Red</option><option value="green">Green</option><option value="custom">Custom</option></select></div>
            <div className="md:col-span-2"><ImageUpload value={form.imageUrl || ""} onChange={(url) => update("imageUrl", url)} label="Announcement Image (optional)" /><p className="mt-1 text-xs text-muted-foreground">Use an image for merchandise, pre-orders, or other visual announcements. Text-only announcements can leave this empty.</p></div>
            <div><Label>Primary Button Text</Label><Input value={form.primaryButtonText} onChange={(e) => update("primaryButtonText", e.target.value)} /></div>
            <div><Label>Primary Button Link</Label><Input value={form.primaryButtonLink} onChange={(e) => update("primaryButtonLink", e.target.value)} /></div>
            <div><Label>Secondary Button Text</Label><Input value={form.secondaryButtonText || ""} onChange={(e) => update("secondaryButtonText", e.target.value)} /></div>
            <div><Label>Secondary Button Link</Label><Input value={form.secondaryButtonLink || ""} onChange={(e) => update("secondaryButtonLink", e.target.value)} /></div>
            <div><Label>Display Order</Label><Input type="number" value={form.order} onChange={(e) => update("order", Number(e.target.value) || 0)} /></div>
            <div className="flex items-center gap-3 pt-7"><Switch checked={form.isActive} onCheckedChange={(value) => update("isActive", value)} /><Label>Active banner</Label></div>
            <div><Label>Display Frequency</Label><select className="h-10 w-full rounded-md border bg-background px-3" value={form.displayFrequency} onChange={(e) => update("displayFrequency", e.target.value as BannerForm["displayFrequency"])}><option value="every_visit">Every visit</option><option value="once">Show once</option><option value="twice">Show twice</option><option value="weekly">Once every 7 days</option></select></div>
            <div className="flex items-center gap-3 pt-7"><Switch checked={form.isEmergency} onCheckedChange={(value) => update("isEmergency", value)} /><Label>Emergency: ignore dismissal</Label></div>
            <div className="flex items-center gap-3 pt-7"><Switch checked={form.showCountdown} onCheckedChange={(value) => update("showCountdown", value)} /><Label>Show competition countdown</Label></div>
            <div className="md:col-span-2 flex gap-3"><Button disabled={save.isPending || !form.title || !form.subtitle || !form.primaryButtonText || !form.primaryButtonLink} onClick={() => save.mutate()}>{save.isPending ? "Saving..." : "Save Banner"}</Button><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button></div>
          </CardContent>
        </Card>
      )}

      {isLoading ? <p>Loading banners...</p> : isError ? <Card><CardContent className="py-10 text-center text-destructive">{(error as Error)?.message || "Unable to load featured banners."}</CardContent></Card> : banners.length === 0 ? <Card><CardContent className="py-10 text-center text-muted-foreground">No featured banners created yet.</CardContent></Card> : (
        <div className="grid gap-4">{banners.map((banner) => <Card key={banner.id}><CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center"><div><div className="flex items-center gap-2"><h2 className="font-bold">{banner.title}</h2>{banner.isActive && <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Active</span>}</div><p className="mt-1 text-sm text-muted-foreground">{banner.subtitle}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => edit(banner)}><Pencil className="mr-2 h-4 w-4" />Edit</Button><Button variant="destructive" size="sm" onClick={() => remove.mutate(banner.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button></div></CardContent></Card>)}</div>
      )}
    </div>
  );
}
