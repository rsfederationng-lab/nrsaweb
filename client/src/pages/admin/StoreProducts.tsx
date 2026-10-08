import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { apiRequest, forceRefresh } from "@/lib/queryClient";
import type { StoreProduct } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";

type ProductForm = Omit<StoreProduct, "id" | "createdAt">;
const emptyProduct: ProductForm = { name: "", price: 0, imageUrl: "", description: "", isPreorder: true, isActive: false, order: 0 };

export default function AdminStoreProducts() {
  const { toast } = useToast(); const qc = useQueryClient();
  const { data: products = [] } = useQuery<StoreProduct[]>({ queryKey: ["/api/admin/store-products"] });
  const [form, setForm] = useState<ProductForm>(emptyProduct); const [editing, setEditing] = useState<StoreProduct | null>(null); const [open, setOpen] = useState(false);
  const save = useMutation({ mutationFn: async () => { const res = await apiRequest(editing ? "PATCH" : "POST", editing ? `/api/store-products/${editing.id}` : "/api/store-products", form); if (!res.ok) throw new Error((await res.json()).error || "Save failed"); }, onSuccess: async () => { await forceRefresh(["/api/admin/store-products"], qc); setOpen(false); setEditing(null); setForm(emptyProduct); toast({ title: "Product saved" }); }, onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }) });
  const remove = useMutation({ mutationFn: async (id: number) => { const res = await apiRequest("DELETE", `/api/store-products/${id}`); const result = await res.json().catch(() => ({})); if (!res.ok) throw new Error(result.error || "Delete failed"); return result; }, onSuccess: (result: { archived?: boolean }) => { forceRefresh(["/api/admin/store-products"], qc); toast({ title: result.archived ? "Product archived" : "Product deleted", description: result.archived ? "It is linked to an order, so it was hidden while order history was preserved." : undefined }); }, onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }) });
  const update = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="space-y-8"><div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Store Products</h1><p className="mt-2 text-muted-foreground">Prepare official merchandise and pre-orders.</p></div><Button onClick={() => { setEditing(null); setForm({ ...emptyProduct, order: products.length }); setOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Product</Button></div>
    {open && <Card><CardHeader><CardTitle>{editing ? "Edit" : "Create"} Product</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><Label>Name</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} /></div><div><Label>Price (₦)</Label><Input type="number" value={form.price} onChange={(e) => update("price", Number(e.target.value) || 0)} /></div><div className="md:col-span-2"><ImageUpload value={form.imageUrl || ""} onChange={(url) => update("imageUrl", url)} label="Product Image" /></div><div><Label>Display Order</Label><Input type="number" value={form.order} onChange={(e) => update("order", Number(e.target.value) || 0)} /></div><div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} /></div><div className="flex items-center gap-3"><Switch checked={form.isPreorder} onCheckedChange={(v) => update("isPreorder", v)} /><Label>Pre-order</Label></div><div className="flex items-center gap-3"><Switch checked={form.isActive} onCheckedChange={(v) => update("isActive", v)} /><Label>Visible in store</Label></div><div className="flex gap-3 md:col-span-2"><Button disabled={!form.name || save.isPending} onClick={() => save.mutate()}>Save Product</Button><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button></div></CardContent></Card>}
    <div className="grid gap-4">{products.map((product) => <Card key={product.id}><CardContent className="flex items-center justify-between gap-4 p-5"><div><h2 className="font-bold">{product.name}</h2><p className="text-sm text-muted-foreground">₦{product.price.toLocaleString()} · {product.isActive ? "Visible" : "Hidden"} · {product.isPreorder ? "Pre-order" : "Standard"}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { setEditing(product); setForm(product); setOpen(true); }}><Pencil className="mr-2 h-4 w-4" />Edit</Button><Button variant="destructive" size="sm" disabled={remove.isPending} onClick={() => { if (window.confirm(`Delete ${product.name}? This cannot be undone.`)) remove.mutate(product.id); }}><Trash2 className="mr-2 h-4 w-4" />Delete</Button></div></CardContent></Card>)}</div>
  </div>;
}
