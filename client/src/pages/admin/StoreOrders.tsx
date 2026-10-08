import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest, forceRefresh } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type StoreOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
};

export default function AdminStoreOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: orders = [], isLoading, isError, error } = useQuery<StoreOrder[]>({ queryKey: ["/api/admin/store-orders"] });
  const update = useMutation({
    mutationFn: async ({ id, fulfillmentStatus }: { id: number; fulfillmentStatus: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/store-orders/${id}`, { fulfillmentStatus });
      if (!response.ok) throw new Error("Unable to update order");
    },
    onSuccess: () => forceRefresh(["/api/admin/store-orders"], queryClient),
  });
  const clearTestOrders = async () => {
    if (!window.confirm("Permanently delete ALL store orders and their line items? Use only to remove test data.")) return;
    const response = await apiRequest("DELETE", "/api/admin/store-orders");
    if (!response.ok) {
      toast({ title: "Cleanup failed", description: (await response.json()).error || "Unable to delete test orders.", variant: "destructive" });
      return;
    }
    await forceRefresh(["/api/admin/store-orders"], queryClient);
    toast({ title: "Test orders removed" });
  };
  return <div className="space-y-8">
    <div className="flex items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Store Orders</h1><p className="mt-2 text-muted-foreground">Track payment and fulfillment for NRSA Store orders.</p></div><Button variant="destructive" onClick={clearTestOrders}>Delete test orders</Button></div>
    {isLoading ? <p>Loading orders...</p> : isError ? <p className="text-destructive">Unable to load orders: {(error as Error).message}</p> : orders.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No store orders yet.</CardContent></Card> : <div className="space-y-4">{orders.map((order) => <Card key={order.id}><CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center"><div><h2 className="font-bold">{order.orderNumber}</h2><p className="text-sm">{order.customerName} · {order.customerEmail}</p><p className="text-sm text-muted-foreground">₦{order.amount.toLocaleString()} · Payment: {order.paymentStatus} · {new Date(order.createdAt).toLocaleString()}</p></div><div className="flex items-center gap-3"><select className="h-9 rounded-md border bg-background px-3 text-sm" value={order.fulfillmentStatus} onChange={(e) => update.mutate({ id: order.id, fulfillmentStatus: e.target.value })}><option value="pending">Pending</option><option value="processing">Processing</option><option value="ready_for_pickup">Ready for pickup</option><option value="shipped">Shipped</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><Button variant="outline" onClick={() => window.location.href = `mailto:${order.customerEmail}`}>Email customer</Button></div></CardContent></Card>)}</div>}
  </div>;
}
