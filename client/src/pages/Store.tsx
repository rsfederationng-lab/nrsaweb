import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import type { StoreProduct } from "@/types/schema";

type CartItem = { product: StoreProduct; quantity: number };

export default function Store() {
  const { data: products = [] } = useQuery<StoreProduct[]>({ queryKey: ["/api/store-products"] });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", deliveryAddress: "", fulfillmentMethod: "pickup" });
  const [message, setMessage] = useState("");
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;
    apiRequest("GET", `/api/store/orders/${encodeURIComponent(reference)}/verify`)
      .then(async (response) => {
        const result = await response.json();
        setMessage(response.ok ? `Payment confirmed for order ${result.orderNumber}. A receipt has been emailed to you.` : result.error || "Payment could not be verified.");
      })
      .catch(() => setMessage("Payment verification could not be completed. Please contact NRSA support."));
  }, []);

  const addToCart = (product: StoreProduct) => setCart((current) => {
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    return [...current, { product, quantity: 1 }];
  });
  const changeQuantity = (id: number, delta: number) => setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));

  const startPayment = async () => {
    setMessage("");
    const response = await apiRequest("POST", "/api/store/orders", {
      ...form,
      deliveryAddress: form.fulfillmentMethod === "delivery" ? form.deliveryAddress : null,
      items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Unable to start payment.");
      return;
    }
    window.location.href = result.authorizationUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <ShoppingBag className="mx-auto mb-5 h-12 w-12" />
          <h1 className="text-4xl font-bold md:text-5xl">NRSA Store</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/85">Official NRSA merchandise. Support the sport and represent Nigerian rope skipping with pride.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12">
        {message && <Card className="mb-6 border-primary"><CardContent className="p-4 text-center">{message}</CardContent></Card>}
        {checkout ? (
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_320px]">
            <Card><CardContent className="space-y-4 p-6">
              <Button variant="ghost" onClick={() => setCheckout(false)}><ArrowLeft className="mr-2 h-4 w-4" />Back to products</Button>
              <h2 className="text-2xl font-bold">Checkout</h2>
              <div><Label>Name</Label><Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} /></div>
              <div><Label>Fulfillment</Label><select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={form.fulfillmentMethod} onChange={(e) => setForm({ ...form, fulfillmentMethod: e.target.value })}><option value="pickup">Pickup</option><option value="delivery">Delivery</option></select></div>
              {form.fulfillmentMethod === "delivery" && <div><Label>Delivery address</Label><Textarea value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} /></div>}
              <Button className="w-full" disabled={!form.customerName || !form.customerEmail || !form.customerPhone} onClick={startPayment}>Pay ₦{total.toLocaleString()} securely</Button>
            </CardContent></Card>
            <OrderSummary cart={cart} total={total} changeQuantity={changeQuantity} />
          </div>
        ) : products.length === 0 ? (
          <Card><CardContent className="py-16 text-center"><h2 className="text-2xl font-bold">Store opening soon</h2><p className="mt-3 text-muted-foreground">T-shirt pre-order coming soon. Check back shortly for official merchandise.</p></CardContent></Card>
        ) : <><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Card key={product.id}><CardContent className="p-5">{product.imageUrl && <img src={product.imageUrl} alt={product.name} className="mb-4 aspect-square w-full rounded-lg object-cover" />}<h2 className="font-bold">{product.name}</h2><p className="mt-2 text-sm text-muted-foreground">{product.description}</p><p className="mt-4 font-bold">₦{product.price.toLocaleString()}</p><Button className="mt-4 w-full" onClick={() => addToCart(product)}><Plus className="mr-2 h-4 w-4" />Add to cart</Button></CardContent></Card>)}</div>
          {cart.length > 0 && <Card className="mt-8"><CardContent className="flex flex-col items-center justify-between gap-4 p-5 sm:flex-row"><span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)} item(s) · ₦{total.toLocaleString()}</span><Button onClick={() => setCheckout(true)}>Checkout</Button></CardContent></Card>}
        </>}
      </section>
    </div>
  );
}

function OrderSummary({ cart, total, changeQuantity }: { cart: CartItem[]; total: number; changeQuantity: (id: number, delta: number) => void }) {
  return <Card><CardContent className="space-y-4 p-6"><h2 className="font-bold">Your order</h2>{cart.map((item) => <div key={item.product.id} className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate">{item.product.name}</span><span className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => changeQuantity(item.product.id, -1)}><Minus className="h-3 w-3" /></Button>{item.quantity}<Button variant="outline" size="icon" onClick={() => changeQuantity(item.product.id, 1)}><Plus className="h-3 w-3" /></Button></span></div>)}<div className="border-t pt-3 font-bold">Total: ₦{total.toLocaleString()}</div></CardContent></Card>;
}
