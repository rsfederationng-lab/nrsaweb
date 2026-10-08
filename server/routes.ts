import { Express } from "express";
import crypto from "crypto";
import { storage } from "./storage.js";
import { supabase } from "./lib/supabase.js";
import { requireAdmin, requireSuperAdmin, type AdminRequest } from "./authMiddleware.js";
import bcrypt from "bcrypt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendContactEmails, verifyEmailConnection, sendNewsletterWelcome, sendSchoolRegistrationConfirmation, sendAdminSchoolRegistrationNotification, sendSchoolSelectionEmail, sendSchoolRegistrationStatusEmail, sendStoreOrderEmails, sendStoreFulfillmentUpdate } from "./mail.js";
import { isNrsaEmail } from "./emailPolicy.js";

import {
  insertHeroSlideSchema,
  insertNewsSchema,
  insertEventSchema,
  insertPlayerSchema,
  insertClubSchema,
  insertLeaderSchema,
  insertMediaSchema,
  insertContactSchema,
  insertMemberStateSchema,
  insertSiteSettingSchema,
  insertFeaturedBannerSchema,
  insertStoreProductSchema,
  insertStoreOrderSchema,
  insertAffiliationSchema,
  insertAmbassadorSchema,
  insertInterschoolYearSchema,
  insertSchoolStandingSchema,
  insertSchoolActivationSchema,
  insertInterschoolNewsSchema,
  insertSubscriberSchema,
  insertChampionshipPhaseSchema,
  insertSchoolRegistrationSchema,
  updateSchoolRegistrationSchema,
  type Admin,
} from "@shared/schema";

export function registerAllRoutes(app: Express): void {
  // Health check
  app.get("/api/health", async (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Keep-alive
  app.get("/health", (_req, res) => res.status(200).send("OK"));
  // Keep-alive
  app.get("/health", (_req, res) => res.status(200).send("OK"));
  app.get("/ping", (_req, res) => res.status(200).json({ message: "pong", uptime: process.uptime() }));

  // ---------- HERO SLIDES ----------
  app.get("/api/hero-slides", async (req, res) => {
    try {
      const slides = await storage.getAllHeroSlides();
      res.json(slides);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- FEATURED BANNERS ----------
  app.get("/api/featured-banners/active", async (_req, res) => {
    try {
      res.json(await storage.getActiveFeaturedBanners());
    } catch (e: any) {
      console.error("Active featured banner error:", e.message);
      res.json([]);
    }
  });

  app.get("/api/featured-banners", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllFeaturedBanners()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/featured-banners", requireAdmin, async (req, res) => {
    try {
      const banner = await storage.createFeaturedBanner(insertFeaturedBannerSchema.parse(req.body));
      res.status(201).json(banner);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/featured-banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" });
      const banner = await storage.updateFeaturedBanner(id, insertFeaturedBannerSchema.partial().parse(req.body));
      res.json(banner);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/featured-banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteFeaturedBanner(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- STORE PRODUCTS ----------
  app.get("/api/store-products", async (_req, res) => {
    try { res.json(await storage.getAllStoreProducts(true)); }
    catch (e: any) { console.error("Public store products error:", e.message); res.json([]); }
  });

  app.get("/api/admin/store-products", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllStoreProducts()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/store-products", requireAdmin, async (req, res) => {
    try {
      const product = await storage.createStoreProduct(insertStoreProductSchema.parse(req.body));
      res.status(201).json(product);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/store-products/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" });
      res.json(await storage.updateStoreProduct(id, insertStoreProductSchema.partial().parse(req.body)));
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/store-products/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" });
      const result = await storage.deleteStoreProduct(id);
      res.status(200).json(result);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- STORE ORDERS / PAYSTACK ----------
  app.post("/api/store/orders", async (req, res) => {
    try {
      const input = insertStoreOrderSchema.parse(req.body);
      const requested = new Map<number, number>();
      for (const item of input.items) requested.set(item.productId, (requested.get(item.productId) || 0) + item.quantity);
      const products = await storage.getAllStoreProducts(true);
      const selected = products.filter((product: any) => requested.has(product.id));
      if (selected.length !== requested.size) return res.status(400).json({ error: "One or more products are unavailable." });

      const items: Array<{ productId: number; productName: string; unitPrice: number; quantity: number }> = selected.map((product: any) => ({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: requested.get(product.id) || 0,
      }));
      const amount = items.reduce((total: number, item) => total + item.unitPrice * item.quantity, 0);
      const orderNumber = `NRSA-STORE-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      const order = await storage.createStoreOrder({
        orderNumber,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        deliveryAddress: input.deliveryAddress || null,
        fulfillmentMethod: input.fulfillmentMethod,
        amount,
        currency: "NGN",
        paymentStatus: "pending",
        fulfillmentStatus: "pending",
      }, items);

      const secretKey = process.env.PAYSTACK_SECRET_KEY;
      if (!secretKey) {
        await storage.updateStoreOrder(order.id, { paymentStatus: "failed" });
        return res.status(503).json({ error: "Payments are not configured yet." });
      }
      const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email: input.customerEmail,
          amount: amount * 100,
          currency: "NGN",
          reference: orderNumber,
          callback_url: `${process.env.NODE_ENV === "production"
            ? (process.env.PUBLIC_APP_URL || "https://nrsa.com.ng")
            : `${req.protocol}://${req.get("host")}`}/store`,
          metadata: {
            business_unit: "NRSA Store",
            order_id: orderNumber,
            customer_phone: input.customerPhone,
            products: items.map((item: { productName: string; quantity: number }) => ({ name: item.productName, quantity: item.quantity })),
          },
        }),
      });
      const payload = await paystackResponse.json() as { status?: boolean; message?: string; data?: { authorization_url?: string; access_code?: string; reference?: string } };
      if (!paystackResponse.ok || !payload.status || !payload.data?.authorization_url) {
        await storage.updateStoreOrder(order.id, { paymentStatus: "failed" });
        return res.status(502).json({ error: payload.message || "Unable to initialize payment." });
      }
      await storage.updateStoreOrder(order.id, { paystackReference: payload.data.reference || orderNumber });
      res.status(201).json({ orderNumber, amount, authorizationUrl: payload.data.authorization_url, reference: payload.data.reference || orderNumber });
    } catch (error: any) {
      console.error("Store order creation error:", error.message);
      res.status(400).json({ error: error.message || "Unable to create order." });
    }
  });

  const completeStorePayment = async (reference: string) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error("Payments are not configured.");
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const payload = await response.json() as { status?: boolean; message?: string; data?: { status?: string; reference?: string; amount?: number; currency?: string } };
    if (!response.ok || !payload.status || payload.data?.status !== "success") throw new Error(payload.message || "Payment has not been completed.");
    const order = await storage.getStoreOrderByNumber(reference);
    if (!order) throw new Error("Order not found.");
    if (payload.data.amount !== order.amount * 100 || payload.data.currency !== order.currency) throw new Error("Payment amount or currency does not match the order.");
    const wasPaid = order.paymentStatus === "paid";
    const updated = wasPaid ? order : await storage.updateStoreOrder(order.id, { paymentStatus: "paid", paystackReference: reference });
    if (!wasPaid) {
      const items = await storage.getStoreOrderItems(order.id);
      const emailSent = await sendStoreOrderEmails({ ...updated, items });
      if (!emailSent) {
        console.error(`Store order ${order.orderNumber} was paid, but one or more order emails failed.`);
      }
    }
    return updated;
  };

  app.get("/api/store/orders/:orderNumber/verify", async (req, res) => {
    try {
      res.json(await completeStorePayment(String(req.params.orderNumber)));
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Payment verification failed." });
    }
  });

  app.post("/api/store/paystack/webhook", async (req, res) => {
    const signature = req.headers["x-paystack-signature"];
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey || typeof signature !== "string") return res.status(401).send("Unauthorized");
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
    const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
    const providedSignature = Buffer.from(signature);
    const expectedSignature = Buffer.from(expected);
    if (providedSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(providedSignature, expectedSignature)) return res.status(401).send("Invalid signature");
    try {
      const event = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString("utf8")) : req.body;
      if (event?.event === "charge.success" && event?.data?.reference) await completeStorePayment(event.data.reference);
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Paystack webhook error:", error.message);
      res.status(500).send("Webhook processing failed");
    }
  });

  app.get("/api/admin/store-orders", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllStoreOrders()); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.patch("/api/admin/store-orders/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" });
      const allowed = ["fulfillmentStatus", "paymentStatus"];
      const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
      const before = await storage.getStoreOrderById(id);
      const updated = await storage.updateStoreOrder(id, update);
      if (before && updated.fulfillmentStatus !== before.fulfillmentStatus && updated.customerEmail) {
        const items = await storage.getStoreOrderItems(updated.id);
        sendStoreFulfillmentUpdate({
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          fulfillmentStatus: updated.fulfillmentStatus,
          paymentStatus: updated.paymentStatus,
          fulfillmentMethod: updated.fulfillmentMethod,
          deliveryAddress: updated.deliveryAddress,
          amount: updated.amount,
          currency: updated.currency,
          items,
        }).catch((error) => console.error("Store fulfillment email failed:", error));
      }
      res.json(updated);
    } catch (error: any) { res.status(400).json({ error: error.message }); }
  });

  app.delete("/api/admin/store-orders/:id", requireSuperAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteStoreOrder(id);
      res.status(204).send();
    } catch (error: any) { res.status(400).json({ error: error.message }); }
  });

  app.delete("/api/admin/store-orders", requireSuperAdmin, async (_req, res) => {
    try {
      await storage.deleteAllStoreOrders();
      res.status(204).send();
    } catch (error: any) { res.status(400).json({ error: error.message }); }
  });

  app.post("/api/hero-slides", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.createHeroSlide(insertHeroSlideSchema.parse(req.body));
      res.status(201).json(slide);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      const validatedBody = insertHeroSlideSchema.partial().parse(req.body);
      const slide = await storage.updateHeroSlide(parseInt(req.params.id), validatedBody);
      if (!slide) return res.status(404).json({ error: "Slide not found" });
      res.json(slide);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteHeroSlide(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- NEWS ----------
  app.get("/api/news", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const newsArticles = await storage.getAllNews(limit, offset);
      res.json(newsArticles);
    } catch (e: any) {
      console.error('News API error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getNews(id);

      if (!article) {
        return res.status(404).json({ error: "News not found" });
      }

      res.json(article);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const article = await storage.createNews(validatedData);
      if (!article) return res.status(500).json({ error: "Failed to create news article" });
      res.status(201).json(article);
    } catch (e: any) {
      console.error('Create news error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const validatedBody = insertNewsSchema.partial().parse(req.body);
      const article = await storage.updateNews(id, validatedBody);
      if (!article) return res.status(404).json({ error: "News not found" });
      res.json(article);
    } catch (e: any) {
      console.error('Update news error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteNews(id);
      res.status(204).send();
    } catch (e: any) {
      console.error('Delete news error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- EVENTS ----------
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      if (!event) return res.status(500).json({ error: "Failed to create event" });
      res.status(201).json(event);
    } catch (e: any) {
      console.error('Create event error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const validatedBody = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(id, validatedBody);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e: any) {
      console.error('Update event error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteEvent(id);
      res.status(204).send();
    } catch (e: any) {
      console.error('Delete event error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- PLAYERS ----------
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/players", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      if (!player) return res.status(500).json({ error: "Failed to create player" });
      res.status(201).json(player);
    } catch (e: any) {
      console.error('Create player error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const validatedBody = insertPlayerSchema.partial().parse(req.body);
      const player = await storage.updatePlayer(id, validatedBody);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (e: any) {
      console.error('Update player error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deletePlayer(id);
      res.status(204).send();
    } catch (e: any) {
      console.error('Delete player error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- CLUBS ----------
  app.get("/api/clubs", async (req, res) => {
    try {
      const clubs = await storage.getAllClubs();
      res.json(clubs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/clubs", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(validatedData);
      if (!club) return res.status(500).json({ error: "Failed to create club" });
      res.status(201).json(club);
    } catch (e: any) {
      console.error('Create club error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const validatedBody = insertClubSchema.partial().parse(req.body);
      const club = await storage.updateClub(id, validatedBody);
      if (!club) return res.status(404).json({ error: "Club not found" });
      res.json(club);
    } catch (e: any) {
      console.error('Update club error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteClub(id);
      res.status(204).send();
    } catch (e: any) {
      console.error('Delete club error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- MEMBER STATES ----------
  app.get("/api/member-states", async (req, res) => {
    try {
      const states = await storage.getAllMemberStates();
      res.json(states);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/member-states/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const state = await storage.getMemberState(id);
      if (!state) return res.status(404).json({ error: "Member State not found" });
      res.json(state);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/member-states", requireAdmin, async (req, res) => {
    try {
      const state = await storage.createMemberState(insertMemberStateSchema.parse(req.body));
      res.status(201).json(state);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/member-states/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const validatedBody = insertMemberStateSchema.partial().parse(req.body);
      const state = await storage.updateMemberState(id, validatedBody);
      if (!state) return res.status(404).json({ error: "Member State not found" });
      res.json(state);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/member-states/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteMemberState(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });


  // ---------- LEADERS ----------
  app.get("/api/leaders", async (req, res) => {
    try {
      const leaders = await storage.getAllLeaders();
      res.json(leaders);
    } catch (e: any) {
      console.error('Leaders endpoint error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Get a single leader by ID
  app.get("/api/leaders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const leader = await storage.getLeader(id);
      if (!leader) return res.status(404).json({ error: "Leader not found" });
      res.json(leader);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/leaders", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertLeaderSchema.parse(req.body);
      const leader = await storage.createLeader(validatedData);
      if (!leader) return res.status(500).json({ error: "Failed to create leader" });
      res.status(201).json(leader);
    } catch (e: any) {
      console.error('Create leader error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/leaders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const validatedBody = insertLeaderSchema.partial().parse(req.body);
      const leader = await storage.updateLeader(id, validatedBody);
      if (!leader) return res.status(404).json({ error: "Leader not found" });
      res.json(leader);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/leaders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteLeader(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  // ---------- MEDIA ----------
  function extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  app.get("/api/media", async (req, res) => {
    try {
      const media = await storage.getAllMedia();
      res.json(media);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const item = await storage.getMediaItem(id);
      if (!item) return res.status(404).json({ error: "Media not found" });
      res.json(item);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const body = req.body;
      let mediaData: any = {
        title: body.title,
        description: body.description,
        category: body.category,
      };

      if (body.externalUrl) {
        mediaData.imageUrl = body.externalUrl;
        mediaData.isExternal = true;
        const videoId = extractYouTubeVideoId(body.externalUrl);
        if (videoId) {
          mediaData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      } else {
        mediaData.imageUrl = body.imageUrl;
        mediaData.isExternal = false;
        mediaData.thumbnailUrl = null;
      }

      const validatedData = insertMediaSchema.parse(mediaData);
      const item = await storage.createMedia({
        ...validatedData,
        isExternal: mediaData.isExternal,
        thumbnailUrl: mediaData.thumbnailUrl,
      });
      if (!item) return res.status(500).json({ error: "Failed to create media" });
      res.status(201).json(item);
    } catch (e: any) {
      console.error('Create media error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;
      let updateData: any = {
        title: body.title,
        description: body.description,
        category: body.category,
      };

      if (body.externalUrl) {
        updateData.imageUrl = body.externalUrl;
        updateData.isExternal = true;
        const videoId = extractYouTubeVideoId(body.externalUrl);
        if (videoId) {
          updateData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        } else {
          updateData.thumbnailUrl = null;
        }
      } else if (body.imageUrl) {
        updateData.imageUrl = body.imageUrl;
        updateData.isExternal = false;
        updateData.thumbnailUrl = null;
      }

      const validatedData = insertMediaSchema.partial().parse(updateData);
      const numericId = parseInt(id);
      if (isNaN(numericId)) return res.status(400).json({ error: "Invalid ID" });
      const updatedItem = await storage.updateMedia(numericId, {
        ...validatedData,
        isExternal: updateData.isExternal,
        thumbnailUrl: updateData.thumbnailUrl,
      });

      if (!updatedItem) return res.status(404).json({ error: "Media not found" });

      res.json(updatedItem);
    } catch (e: any) {
      console.error(e);
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteMedia(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });


  // ---------- CONTACTS ----------
  app.post("/api/contacts", async (req, res) => {
    try {
      let validatedData;
      try {
        validatedData = insertContactSchema.parse(req.body);
      } catch (validationErr: any) {
        return res.status(400).json({ error: validationErr.errors?.[0]?.message || validationErr.message });
      }

      const contact = await storage.createContact(validatedData);
      if (!contact) return res.status(500).json({ error: "Failed to create contact" });

      // Send emails in background (non-blocking)
      sendContactEmails({
        name: contact.name,
        email: contact.email,
        type: contact.type,
        message: contact.message,
        subject: contact.subject || undefined,
        phone: contact.phone || undefined,
      }).catch((err) => console.error("Email error:", err));

      res.status(201).json(contact);
    } catch (e: any) {
      res.status(500).json({ error: e?.message || "Unknown server error" });
    }
  });

  // ---------- CONTACTS ----------
  app.get("/api/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const all = await storage.getAllContacts();
      const item = all.find((c: { id?: number }) => c.id === id);
      if (!item) return res.status(404).json({ error: "Contact not found" });
      res.json(item);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const updated = await storage.updateContact(id, req.body);
      if (!updated) return res.status(404).json({ error: "Contact not found" });
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteContact(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- AFFILIATIONS ----------
  app.get("/api/affiliations", async (req, res) => {
    try {
      const affiliations = await storage.getAllAffiliations();
      res.json(affiliations);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/affiliations", requireAdmin, async (req, res) => {
    try {
      const affiliation = await storage.createAffiliation(insertAffiliationSchema.parse(req.body));
      res.status(201).json(affiliation);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/affiliations/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const validatedBody = insertAffiliationSchema.partial().parse(req.body);
      const affiliation = await storage.updateAffiliation(id, validatedBody);
      if (!affiliation) return res.status(404).json({ error: "Affiliation not found" });
      res.json(affiliation);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/affiliations/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteAffiliation(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- SITE SETTINGS ----------
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      res.json(settings);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/site-settings", requireAdmin, async (req, res) => {
    // Handling site settings updates
    try {
      const body = req.body;
      const results = [];

      // Helper to upsert a single setting
      const upsertSetting = async (key: string, value: string) => {
        return await storage.updateSiteSetting(key, value);
      };

      // Case 1: Single setting update (e.g. from SiteContentManager)
      if (body.key && typeof body.key === 'string' && body.value !== undefined) {
        const result = await upsertSetting(body.key, body.value);
        results.push(result);
      }
      // Case 2: Multiple settings update (e.g. from AdminSettings)
      else {
        for (const [key, value] of Object.entries(body)) {
          if (typeof value === 'string') {
            const result = await upsertSetting(key, value);
            results.push(result);
          }
        }
      }

      res.status(200).json(results);
    } catch (e: any) {
      console.error('Error saving site settings:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/site-settings/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      const validatedBody = insertSiteSettingSchema.partial().parse(req.body);

      // Need to find the key for this setting ID first since updateSiteSetting expects key
      const settings = await storage.getAllSiteSettings();
      const existing = settings.find((s: { id?: number }) => s.id === id);

      if (!existing) return res.status(404).json({ error: "Setting not found" });

      const setting = await storage.updateSiteSetting(existing.key, validatedBody.value || existing.value);
      res.json(setting);
    } catch (e: any) {
      console.error('Error patching site setting:', e);
      res.status(400).json({ error: e.message });
    }
  });


  // ---------- AMBASSADORS ----------
  app.get("/api/ambassadors", async (req, res) => {
    try {
      const ambassadors = await storage.getAllAmbassadors();
      res.json(ambassadors);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/ambassadors/:id", async (req, res) => {
    try {
      const ambassador = await storage.getAmbassador(parseInt(req.params.id));
      if (!ambassador) return res.status(404).json({ error: "Ambassador not found" });
      res.json(ambassador);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/ambassadors", requireAdmin, async (req, res) => {
    try {
      const ambassador = await storage.createAmbassador(insertAmbassadorSchema.parse(req.body));
      res.status(201).json(ambassador);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch("/api/ambassadors/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ambassador = await storage.updateAmbassador(id, insertAmbassadorSchema.partial().parse(req.body));
      if (!ambassador) return res.status(404).json({ error: "Ambassador not found" });
      res.json(ambassador);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete("/api/ambassadors/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteAmbassador(parseInt(req.params.id));
      res.status(204).end();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- INTERSCHOOL YEARS ----------
  app.get("/api/interschool-years", async (req, res) => {
    try {
      const years = await storage.getAllInterschoolYears();
      res.json(years);
    } catch (e: any) {
      console.error('GET /api/interschool-years Error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/interschool-years/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const year = await storage.getInterschoolYear(id);
      if (!year) return res.status(404).json({ error: "Year not found" });
      res.json(year);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/interschool-years", requireAdmin, async (req, res) => {
    try {
      const parsed = insertInterschoolYearSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error });
      }

      const year = await storage.createInterschoolYear(parsed.data);
      res.status(201).json(year);
    } catch (e: any) {
      if (e.message?.includes("unique constraint")) {
        return res.status(400).json({ error: "Season with this year already exists." });
      }
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/interschool-years/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      const { id: _id, createdAt, ...cleanBody } = req.body;

      const parsed = insertInterschoolYearSchema.partial().safeParse(cleanBody);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error });
      }

      const year = await storage.updateInterschoolYear(id, parsed.data);
      if (!year) return res.status(404).json({ error: "Year not found" });
      res.json(year);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/interschool-years/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteInterschoolYear(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- SCHOOL STANDINGS ----------
  app.get("/api/school-standings", async (req, res) => {
    try {
      const yearId = parseInt(req.query.yearId as string);
      if (isNaN(yearId)) return res.status(400).json({ error: "Missing or invalid yearId" });
      const standings = await storage.getSchoolStandingsByYear(yearId);
      res.json(standings);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/school-standings", requireAdmin, async (req, res) => {
    try {
      const standing = await storage.createSchoolStanding(insertSchoolStandingSchema.parse(req.body));
      res.status(201).json(standing);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/school-standings/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const standing = await storage.updateSchoolStanding(id, insertSchoolStandingSchema.partial().parse(req.body));
      if (!standing) return res.status(404).json({ error: "Standing not found" });
      res.json(standing);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/school-standings/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteSchoolStanding(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- SCHOOL ACTIVATIONS ----------
  app.get("/api/school-activations", async (req, res) => {
    try {
      const yearId = parseInt(req.query.yearId as string);
      if (isNaN(yearId)) return res.status(400).json({ error: "Missing or invalid yearId" });
      const activations = await storage.getSchoolActivationsByYear(yearId);
      res.json(activations);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/school-activations", requireAdmin, async (req, res) => {
    try {
      const activation = await storage.createSchoolActivation(insertSchoolActivationSchema.parse(req.body));
      res.status(201).json(activation);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/school-activations/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const activation = await storage.updateSchoolActivation(id, insertSchoolActivationSchema.partial().parse(req.body));
      if (!activation) return res.status(404).json({ error: "Activation not found" });
      res.json(activation);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/school-activations/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteSchoolActivation(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- INTERSCHOOL NEWS ----------
  app.get("/api/interschool-news", async (req, res) => {
    try {
      const yearId = parseInt(req.query.yearId as string);
      if (isNaN(yearId)) return res.status(400).json({ error: "Missing or invalid yearId" });
      const newsItems = await storage.getInterschoolNewsByYear(yearId);
      res.json(newsItems);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/interschool-news", requireAdmin, async (req, res) => {
    try {
      const newsItem = await storage.createInterschoolNews(insertInterschoolNewsSchema.parse(req.body));
      res.status(201).json(newsItem);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/interschool-news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const newsItem = await storage.updateInterschoolNews(id, insertInterschoolNewsSchema.partial().parse(req.body));
      if (!newsItem) return res.status(404).json({ error: "News item not found" });
      res.json(newsItem);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/interschool-news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteInterschoolNews(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- CHAMPIONSHIP PHASES ----------
  app.get("/api/championship-phases", async (req, res) => {
    try {
      const yearId = parseInt(req.query.yearId as string);
      if (isNaN(yearId)) return res.status(400).json({ error: "Missing or invalid yearId" });
      const phases = await storage.getChampionshipPhasesByYear(yearId);
      res.json(phases);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/championship-phases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const phase = await storage.getChampionshipPhase(id);
      if (!phase) return res.status(404).json({ error: "Phase not found" });
      res.json(phase);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/championship-phases", requireAdmin, async (req, res) => {
    try {
      const phase = await storage.createChampionshipPhase(insertChampionshipPhaseSchema.parse(req.body));
      res.status(201).json(phase);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/championship-phases/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const phase = await storage.updateChampionshipPhase(id, insertChampionshipPhaseSchema.partial().parse(req.body));
      if (!phase) return res.status(404).json({ error: "Phase not found" });
      res.json(phase);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/championship-phases/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteChampionshipPhase(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- SCHOOL REGISTRATIONS ----------
  app.get("/api/school-registrations", requireAdmin, async (req, res) => {
    try {
      const phaseId = req.query.phaseId ? parseInt(req.query.phaseId as string) : undefined;
      const yearId = req.query.yearId ? parseInt(req.query.yearId as string) : undefined;
      
      if (phaseId) {
        const registrations = await storage.getSchoolRegistrationsByPhase(phaseId);
        return res.json(registrations);
      }
      
      if (yearId) {
        const registrations = await storage.getSchoolRegistrationsByYear(yearId);
        return res.json(registrations);
      }
      
      const allRegistrations = await storage.getAllSchoolRegistrations();
      res.json(allRegistrations);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/school-registrations/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const registration = await storage.getSchoolRegistration(id);
      if (!registration) return res.status(404).json({ error: "Registration not found" });
      res.json(registration);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/school-registrations", async (req, res) => {
    try {
      console.log('Registration request body:', JSON.stringify(req.body, null, 2));
      
      // Auto-assign yearId and phaseId if not provided
      let data = { ...req.body };

      // Strip any NaN / null / invalid values that may have slipped through the client
      const toValidId = (v: any) => {
        if (v === undefined || v === null) return undefined;
        const n = Number(v);
        return isNaN(n) || n <= 0 ? undefined : n;
      };
      data.yearId  = toValidId(data.yearId);
      data.phaseId = toValidId(data.phaseId);
      
      // Get active season if yearId not provided
      if (!data.yearId) {
        const years = await storage.getAllInterschoolYears();
        const activeYear = years.find((y: any) => y.isActive) || years[0];
        if (activeYear) {
          data.yearId = activeYear.id;
          console.log('Auto-assigned yearId:', activeYear.id);
        } else {
          return res.status(400).json({ error: "No active season found. Please create a season first." });
        }
      }
      
      // Get or create phase for the state if phaseId not provided
      if (!data.phaseId && data.state && data.yearId) {
        const phases = await storage.getChampionshipPhasesByYear(data.yearId);
        let statePhase = phases.find((p: any) => p.stateName === data.state);
        
        // If no phase exists for this state, create one
        if (!statePhase) {
          console.log('Creating new phase for state:', data.state);
          statePhase = await storage.createChampionshipPhase({
            yearId: data.yearId,
            stateName: data.state,
            maxSchools: 9,
          });
        }
        
        data.phaseId = statePhase.id;
        console.log('Assigned phaseId:', statePhase.id);
      }
      
      console.log('Final data before validation:', JSON.stringify(data, null, 2));

      // Verify we have valid IDs before handing off to Zod
      if (!data.yearId || !data.phaseId) {
        console.error('Missing IDs after auto-assign â€” yearId:', data.yearId, 'phaseId:', data.phaseId);
        return res.status(400).json({ error: "Could not determine season or phase. Please try again." });
      }

      const validatedData = insertSchoolRegistrationSchema.parse(data);
      const registration = await storage.createSchoolRegistration(validatedData);
      if (!registration) return res.status(500).json({ error: "Failed to create registration" });

      // Send confirmation email in background â€” don't block the response
      const phaseName = `${data.state} State`;
      sendSchoolRegistrationConfirmation({
        schoolName: registration.schoolName,
        coordinatorName: registration.coordinatorName,
        coordinatorEmail: registration.email,
        phase: phaseName,
        state: registration.state,
      }).catch((err: any) => console.error('Failed to send registration confirmation email:', err));

      sendAdminSchoolRegistrationNotification({
        schoolName: registration.schoolName,
        coordinatorName: registration.coordinatorName,
        email: registration.email,
        phone: registration.coordinatorPhone,
        whatsappNumber: registration.whatsappNumber,
        phase: phaseName,
        state: registration.state,
        athleteCount: registration.athleteCount,
        category: registration.category,
        registrationId: registration.id,
      }).catch((err: any) => console.error('Failed to send admin notification email:', err));
      
      res.status(201).json(registration);
    } catch (e: any) {
      console.error('Registration error:', e);
      console.error('Error details:', e.message);
      if (e.errors) {
        console.error('Validation errors:', JSON.stringify(e.errors, null, 2));
      }
      // Return a human-readable message â€” Zod errors are arrays, not strings
      const message =
        e.errors?.[0]?.message ||
        (typeof e.message === 'string' && !e.message.startsWith('[') ? e.message : 'Registration failed. Please check your details.');
      res.status(400).json({ error: message });
    }
  });

  app.patch("/api/school-registrations/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      // Grab the current record so we know the previous status and have contact details
      const existing = await storage.getSchoolRegistration(id);
      if (!existing) return res.status(404).json({ error: "Registration not found" });

      const validatedData = updateSchoolRegistrationSchema.parse(req.body);
      const registration = await storage.updateSchoolRegistration(id, validatedData);
      if (!registration) return res.status(404).json({ error: "Registration not found" });

      // Notify the submitted coordinator email whenever the registration status changes.
      const newStatus = validatedData.status;
      const prevStatus = existing.status;
      if (newStatus && newStatus !== prevStatus && registration.email) {
        // Fetch phase for venue/date details
        const phase = await storage.getChampionshipPhase(registration.phaseId);
        const phaseName = phase?.stateName ? `${phase.stateName} State` : "State";

        sendSchoolRegistrationStatusEmail({
          schoolName: registration.schoolName,
          coordinatorName: registration.coordinatorName,
          coordinatorEmail: registration.email,
          phase: phaseName,
          state: registration.state,
          venue: phase?.venue || "To be announced",
          competitionDate: phase?.competitionDate
            ? new Date(phase.competitionDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
            : "To be announced",
          athleteCount: registration.athleteCount,
          category: registration.category,
          status: newStatus,
          adminNotes: registration.adminNotes,
          whatsappGroupLink: phase?.whatsappGroupLink || undefined,
        }).catch((err: any) => console.error("Failed to send selection email:", err));
      }

      res.json(registration);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/school-registrations/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteSchoolRegistration(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Batch notify selected schools for a phase
  app.post("/api/championship-phases/:id/notify-selected", requireAdmin, async (req, res) => {
    try {
      const phaseId = parseInt(req.params.id);
      if (isNaN(phaseId)) return res.status(400).json({ error: "Invalid phase ID" });

      const [registrations, phase] = await Promise.all([
        storage.getSchoolRegistrationsByPhase(phaseId),
        storage.getChampionshipPhase(phaseId),
      ]);

      const phaseName = phase?.stateName ? `${phase.stateName} State` : "State";
      const venue = phase?.venue || "To be announced";
      const competitionDate = phase?.competitionDate
        ? new Date(phase.competitionDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "To be announced";
      const whatsappGroupLink = phase?.whatsappGroupLink || undefined;

      const selectedSchools    = registrations.filter((r: any) => r.status === "selected");
      const notSelectedSchools = registrations.filter((r: any) => r.status === "not_selected");

      // Fire all emails in parallel, collect results
      const emailJobs = [
        ...selectedSchools.map((r: any) =>
          sendSchoolSelectionEmail({
            schoolName: r.schoolName,
            coordinatorName: r.coordinatorName,
            coordinatorEmail: r.email,
            phase: phaseName,
            state: r.state,
            venue,
            competitionDate,
            whatsappGroupLink,
            isSelected: true,
          }).catch((err: any) => {
            console.error(`Failed to email selected school ${r.schoolName}:`, err);
            return null;
          })
        ),
        ...notSelectedSchools.map((r: any) =>
          sendSchoolSelectionEmail({
            schoolName: r.schoolName,
            coordinatorName: r.coordinatorName,
            coordinatorEmail: r.email,
            phase: phaseName,
            state: r.state,
            venue,
            competitionDate,
            isSelected: false,
          }).catch((err: any) => {
            console.error(`Failed to email not-selected school ${r.schoolName}:`, err);
            return null;
          })
        ),
      ];

      await Promise.all(emailJobs);

      res.json({
        message: "Notifications sent",
        selected: selectedSchools.length,
        notSelected: notSelectedSchools.length,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- ADMINS ----------
  app.get("/api/admins", requireSuperAdmin, async (req, res) => {
    try { res.json(await storage.getAllAdmins()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/admins", requireSuperAdmin, async (req, res) => {
    let createdAuthUserId: string | undefined;
    try {
      const { name, password, role } = req.body;
      const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
      }
      if (!isNrsaEmail(email)) {
        return res.status(400).json({ error: "Admin email must use the @nrsa.com.ng domain." });
      }
      const existing = await storage.getAdminByEmail(email);
      if (existing) return res.status(409).json({ error: "Admin already exists" });

      // Create user in Supabase Auth first
      if (!supabase) {
        return res.status(500).json({ error: "Authentication service not configured" });
      }

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      } as any);

      if (authError) {
        return res.status(400).json({ error: `Auth creation failed: ${authError.message}` });
      }
      createdAuthUserId = authData.user?.id;

      // Then create admin record in database
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await storage.createAdmin({ name, email, passwordHash, role: role || "admin" });
      res.status(201).json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
    } catch (e: any) {
      if (createdAuthUserId && supabase) {
        const { error: rollbackError } = await supabase.auth.admin.deleteUser(createdAuthUserId);
        if (rollbackError) {
          console.error("Failed to roll back Auth user after admin creation failure:", rollbackError.message);
        }
      }
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/admins/:id", requireSuperAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

      // prevent deleting yourself
      if ((req as any).adminId === id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }

      // check admin exists
      const existing = await storage.getAdminById(id);
      if (!existing) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // If the target is a super-admin, ensure we don't delete the last super-admin
      if (existing.role === "super-admin") {
        const allAdmins = (await storage.getAllAdmins()) as Admin[];
        const superAdminCount = allAdmins.filter((a: Admin) => a.role === "super-admin").length;
        if (superAdminCount <= 1) {
          return res.status(400).json({ error: "Cannot delete the last super-admin account" });
        }
      }

      // perform delete
      await storage.deleteAdmin(id);

      // success (204 No Content)
      res.status(204).send();
    } catch (e: any) {
      console.error("DELETE /api/admins/:id error:", e);
      res.status(500).json({ error: e.message });
    }
  });
  // ---------- NRSA AI BOT (GEMINI) ----------
  app.post("/api/nrsa-bot", async (req, res) => {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        console.error("Missing GEMINI_API_KEY");
        return res.status(500).json({ error: "AI Service Unavailable (Missing Key)" });
      }

      // â”€â”€ Fetch live site data to inject into context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      let liveContext = "";
      try {
        const [leaders, news, events, players] = await Promise.all([
          storage.getAllLeaders().catch(() => []),
          storage.getAllNews().catch(() => []),
          storage.getAllEvents().catch(() => []),
          storage.getAllPlayers().catch(() => []),
        ]);

        if (leaders.length > 0) {
          liveContext += "\n\nCURRENT NRSA LEADERSHIP (live from database):\n";
          leaders.forEach((l: any) => {
            liveContext += `- ${l.name}, ${l.position}${l.state ? ` (${l.state})` : ""}\n`;
          });
        }

        const recentNews = news.slice(0, 5);
        if (recentNews.length > 0) {
          liveContext += "\n\nRECENT NEWS (live from database):\n";
          recentNews.forEach((n: any) => {
            liveContext += `- "${n.title}" â€” ${n.excerpt || ""} | Link: https://nrsa.com.ng/news/${n.id}\n`;
          });
        }

        const upcomingEvents = events
          .filter((e: any) => e.eventDate && new Date(e.eventDate).getTime() >= Date.now())
          .slice(0, 5);
        if (upcomingEvents.length > 0) {
          liveContext += "\n\nUPCOMING EVENTS (live from database):\n";
          upcomingEvents.forEach((e: any) => {
            const eventDate = new Date(e.eventDate);
            const venue = [e.venue, e.city, e.state].filter(Boolean).join(", ") || "TBC";
            liveContext += `- "${e.title}" on ${eventDate.toDateString()} at ${venue}\n`;
          });
        }

        if (players.length > 0) {
          liveContext += `\n\nREGISTERED ATHLETES: There are currently ${players.length} registered athletes on the platform.\n`;
        }
      } catch (dbErr: any) {
        console.warn("Could not fetch live data for bot context:", dbErr.message);
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are the Official AI Assistant for the Nigeria Rope Skipping Association (NRSA).

CRITICAL HONESTY RULES â€” YOU MUST FOLLOW THESE WITHOUT EXCEPTION:
1. NEVER make up facts, names, dates, numbers, or any information you are not certain about.
2. If you do not know the answer, say exactly: "I don't have that information right now. Please check [relevant page link] or contact us at rsfederationng@gmail.com"
3. NEVER guess or estimate. If something is not in your knowledge base or the live data below, admit it.
4. Only use the links listed in the SITE NAVIGATION section â€” do not invent URLs.
5. Do NOT use markdown formatting like **bold** or *italic*. Plain text only.
6. Be concise â€” give direct answers. One clear answer + one link is better than a wall of text.

ABOUT NRSA:
The Nigeria Rope Skipping Association (NRSA) is the official governing body for rope skipping in Nigeria. Registered as an NGO with the CAC. Affiliated with IJRU (International Jump Rope Union) and IRSO (International Rope Skipping Organization). Not funded by government â€” self-sustaining through club licensing, sponsorships, and partnerships.

LEADERSHIP:
- President: OYEWO N. OLUDAYO
- Vice President: OKPOUDHU VINCENT
- Technical Director: UKANDU CHIBUISI JOSEPH
- General Secretary: LAUREL MUBO OJO
- Treasurer: KEMI SOLOMON PAUL

Y-COURT FORMAT:
- A Y-Court has 3 stations where 3 teams compete simultaneously.
- Rotation: Station A to C, Station B to A, Station C to B. No team repeats a station.
- Each match involves exactly 3 teams at the same time.

INTER-SCHOOL (SUB-STANDARD MATCH):
- Designed for schools to compete regionally using simplified Y-Court rules.
- The NRSA National Interschool Championship 2026 is currently advertised as registration open.
- The championship has 3 zones: Delta, Ondo, and Kwara.
- The homepage registration notice currently says: "20 Days To Go". Do not invent an exact calendar date unless it is present in live database data or confirmed by NRSA.
- Schools register at https://nrsa.com.ng/interschool/register.
- Learn more about the championship at https://nrsa.com.ng/interschool.
- Each team: 7 players, ideally 70/30 gender balance.
- Secondary Schools: 9 disciplines. Primary Schools: 8 disciplines.
- Tie-breaker: Last Man Standing (LMS).
- States currently participating: Delta, Ondo, Kwara.

THE 9 DISCIPLINES (Secondary School):
SRSS - Single Rope Speed Sprint (one player, 30 seconds, alternating feet)
SRSE - Single Rope Speed Endurance
SROF - Single Rope Open Freestyle
SRCC - Single Rope Consecutive Crosses
SRDU - Single Rope Double Under (double throws, 30 seconds)
SRSR - Single Rope Speed Relay
DDSR - Double Dutch Speed Relay (4 athletes, two ropes, 2 minutes)
DSS - Double Dutch Speed Sprint
LMS - Last Man Standing (tie-breaker; tempo increases to Open/This/Faster)

All 9 discipline tutorial videos are accessible on the NRSA YouTube channel.

SCORING:
- SP (Score Point): Number of successful jumps.
- DP (Discipline Point): Ranking-based. Highest SP = Strong Point, Lowest = Weak Point.
- TDP (Total Discipline Point): Sum of all DPs across all events.
- GP (Game Points): 1st = 3 GP, 2nd = 1 GP, 3rd = 0 GP.
- SRSR and DDSR award 20 DP to the winner (highest-valued events).

MATCH RULES:
- A player can compete in minimum 1, maximum 3 disciplines per match.
- Team managers allowed 3 protests per match.
- King of the Match: player achieving 28 DP alone. Match pauses for a standing ovation.

TOURNAMENT STRUCTURE:
- Teams win Zonal matches (Delta Zone 1, Ondo Zone 2, Kwara Zone 3) to advance.
- Winners advance to National Finale.
- Semi-Finals: Match D and E, winners go to Final.

SPONSORSHIP & CLUBS:
- Club License Fee: 500,000 Naira, valid for 4 years.
- Alpha League: professional league structure for growth and sustainability.

AMBASSADOR PROGRAM:
- Volunteer-based pilot program, 3 months.
- No pay. Ambassadors receive certificates, branded T-shirts, and event priority.
- Apply at: https://ambassadors.nrsa.com.ng

SITE NAVIGATION (ONLY use these exact links â€” never invent a URL):
- Home: https://nrsa.com.ng
- About NRSA: https://nrsa.com.ng/about
- History: https://nrsa.com.ng/history
- Interschool Championship: https://nrsa.com.ng/interschool
- Register Your School: https://nrsa.com.ng/interschool/register
- Competitions: https://nrsa.com.ng/competitions
- News: https://nrsa.com.ng/news
- Events: https://nrsa.com.ng/events
- Athletes: https://nrsa.com.ng/players
- Clubs: https://nrsa.com.ng/clubs
- Leadership Team: https://nrsa.com.ng/leaders
- Member States: https://nrsa.com.ng/member-states
- Gallery: https://nrsa.com.ng/gallery
- Videos: https://nrsa.com.ng/videos
- Contact: https://nrsa.com.ng/contact
- Partnership/Sponsorship: https://nrsa.com.ng/partnership
- Privacy Policy: https://nrsa.com.ng/privacy-policy
- Terms of Service: https://nrsa.com.ng/terms-of-service
- Skipper Rankings: https://skippers.nrsa.com.ng
- Ambassador Program: https://ambassadors.nrsa.com.ng

CONTACT: rsfederationng@gmail.com | https://nrsa.com.ng

${liveContext}

BEHAVIOR:
- News/events/athletes questions: use the LIVE DATA above.
- School registration: https://nrsa.com.ng/interschool/register
- Club registration: https://nrsa.com.ng/clubs
- Unknown info: admit it and give the contact email or relevant page.
- Keep answers short and direct.
`
      });

      // Build conversation history for Gemini multi-turn chat
      const chat = model.startChat({
        history: history.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const reply = response.text();

      res.json({ reply });
    } catch (e: any) {
      console.error("NRSA Bot Error:", e.message);
      res.status(500).json({ error: "Failed to process request" });
    }
  });


  // ---------- SUBSCRIBERS ----------
  app.get("/api/subscribers", requireAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getAllSubscribers();
      res.json(subscribers);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/subscribers", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      let subscriber;
      try {
        subscriber = await storage.createSubscriber(validatedData);
      } catch (dbError: any) {
        const msg = dbError?.message || JSON.stringify(dbError) || "";
        console.error("[Subscribers] DB Error:", msg);

        // Duplicate email
        if (msg.includes("duplicate") || msg.includes("unique") || msg.includes("23505")) {
          return res.status(409).json({ error: "This email is already subscribed!" });
        }
        // Table missing â€” give an actionable message
        if (msg.includes("relation") && msg.includes("does not exist")) {
          return res.status(500).json({ error: "Database table not set up. Please run the SQL migration in Supabase." });
        }
        return res.status(500).json({ error: "Database error: " + msg });
      }

      if (!subscriber) return res.status(500).json({ error: "Failed to create subscriber" });

      // Fire and forget welcome email
      sendNewsletterWelcome(validatedData.email).catch(e => console.error("Welcome email failed:", e));

      res.status(201).json(subscriber);
    } catch (e: any) { 
      console.error("[Subscribers] Validation Error:", e.message);
      res.status(400).json({ error: e.message }); 
    }
  });

  app.delete("/api/subscribers/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteSubscriber(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

}