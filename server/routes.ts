import { Express } from "express";
import { storage } from "./storage.js";
import { supabase } from "./lib/supabase.js";
import { requireAdmin, requireSuperAdmin, type AdminRequest } from "./authMiddleware.js";
import bcrypt from "bcrypt";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  insertAffiliationSchema,
  insertAmbassadorSchema,
  insertInterschoolYearSchema,
  insertSchoolStandingSchema,
  insertSchoolActivationSchema,
  insertInterschoolNewsSchema,
  type Admin,
} from "@shared/schema";

/**
 * Registers all CRUD API routes for the application.
 * Includes endpoints for all entities. Admin protection added where necessary.
 */
export function registerAllRoutes(app: Express): void {
  console.log("🔄 [ROUTES] Registering all routes (Version: Fixed Syntax Check)");
  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({ status: "API is working - AMBASSADORS_ADDED", timestamp: new Date().toISOString() });
  });

  // Cache test endpoint
  app.get("/api/cache-test", (req, res) => {
    res.json({
      message: "NEW VERSION DEPLOYED - 4 CARDS WORKING!",
      timestamp: Date.now(),
      version: "v2.0-4cards"
    });
  });

  // Database connection test
  app.get("/api/db-test", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ error: "Supabase client not initialized" });
      }

      // Test database connection
      const { data, error } = await supabase.from('news').select('count').limit(1);
      if (error) {
        console.error('Database test error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.json({
        status: "Database connected",
        supabase: !!supabase,
        timestamp: new Date().toISOString()
      });
    } catch (e: any) {
      console.error('Database test failed:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Keep-alive endpoint
  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  // Ping endpoint
  app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong", uptime: process.uptime() });
  });

  // ---------- HERO SLIDES ----------
  app.get("/api/hero-slides", async (req, res) => {
    try {
      const slides = await storage.getAllHeroSlides();
      res.json(slides);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
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
      console.log('🔍 [EVENTS API] Request received');
      const events = await storage.getAllEvents();
      console.log('🔍 [EVENTS API] Sending response:', { count: events.length, sample: events[0] });
      res.json(events);
    } catch (e: any) {
      console.error('🔍 [EVENTS API] Error:', e.message);
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
      console.log('🔍 [CLUBS API] Request received');
      const clubs = await storage.getAllClubs();
      console.log('🔍 [CLUBS API] Sending response:', { count: clubs.length, sample: clubs[0] });
      res.json(clubs);
    } catch (e: any) {
      console.error('🔍 [CLUBS API] Error:', e.message);
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
      console.log('🔍 [CONTACT API] Received:', req.body);
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);

      if (!contact) return res.status(500).json({ error: "Failed to create contact" });
      console.log('🔍 [CONTACT API] Created:', contact?.id);

      // Send emails (async, don't block response)
      import("./mail.js").then(({ sendContactEmails }) => {
        sendContactEmails({
          name: contact.name,
          email: contact.email,
          type: contact.type, // Now available in schema
          message: contact.message,
          subject: contact.subject || undefined,
          phone: contact.phone || undefined,
        }).catch(err => console.error("Mail error:", err));
      });

      res.status(201).json(contact);
    } catch (e: any) {
      console.error('🔍 [CONTACT API] Error:', e.message);
      res.status(400).json({ error: e.message });
    }
  });

  // Admin-only endpoints
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
      const item = all.find((c) => c.id === id);
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
      console.log('🔍 [CONTACT PATCH] Updating contact', id, 'with:', req.body);
      const updated = await storage.updateContact(id, req.body);
      if (!updated) return res.status(404).json({ error: "Contact not found" });
      console.log('🔍 [CONTACT PATCH] Updated:', updated);
      res.json(updated);
    } catch (e: any) {
      console.error('🔍 [CONTACT PATCH] Error:', e.message);
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
      console.error("Values:", req.body);
      console.error("Error creating affiliation:", e);
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
      const existing = settings.find(s => s.id === id);

      if (!existing) return res.status(404).json({ error: "Setting not found" });

      const setting = await storage.updateSiteSetting(existing.key, validatedBody.value || existing.value);
      res.json(setting);
    } catch (e: any) {
      console.error('Error patching site setting:', e);
      res.status(400).json({ error: e.message });
    }
  });


  // ---------- AMBASSADORS ----------
  console.log("Registering Ambassador routes..."); // Debug log to confirm reload
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
      console.log('POST /api/interschool-years Body:', req.body);

      const parsed = insertInterschoolYearSchema.safeParse(req.body);
      if (!parsed.success) {
        console.error('Validation Error:', parsed.error);
        return res.status(400).json({ error: "Validation failed", details: parsed.error });
      }

      const year = await storage.createInterschoolYear(parsed.data);
      console.log('Created Year:', year);
      res.status(201).json(year);
    } catch (e: any) {
      console.error('POST /api/interschool-years Error:', e);
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

      console.log(`[PATCH] Interschool Year ${id} - Body:`, req.body);

      // Remove ID and metadata from body to prevent validation errors
      const { id: _id, createdAt, ...cleanBody } = req.body;

      const parsed = insertInterschoolYearSchema.partial().safeParse(cleanBody);
      if (!parsed.success) {
        console.error('Validation Error:', parsed.error);
        return res.status(400).json({ error: "Validation failed", details: parsed.error });
      }

      const year = await storage.updateInterschoolYear(id, parsed.data);
      if (!year) return res.status(404).json({ error: "Year not found" });
      res.json(year);
    } catch (e: any) {
      console.error('PATCH /api/interschool-years/:id Error:', e);
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/interschool-years/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      console.log(`[DELETE] Interschool Year ${id}`);
      await storage.deleteInterschoolYear(id);
      res.status(204).send();
    } catch (e: any) {
      console.error('DELETE /api/interschool-years/:id Error:', e);
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

  // ---------- ADMINS ----------
  app.get("/api/admins", requireSuperAdmin, async (req, res) => {
    try { res.json(await storage.getAllAdmins()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/admins", requireSuperAdmin, async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
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

      // Then create admin record in database
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await storage.createAdmin({ name, email, passwordHash, role: role || "admin" });
      res.status(201).json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
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
  // ---------- NRSA AI BOT ----------
  // ---------- NRSA AI BOT (GEMINI) ----------
  app.post("/api/nrsa-bot", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        console.error("Missing GEMINI_API_KEY");
        return res.status(500).json({ error: "AI Service Unavailable (Missing Key)" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are the Official AI Ambassador for the Nigeria Rope Skipping Association (NRSA).
TONE: Conversational, Resilient, Professional, and Helpful.
FORMATTING RULE: Do NOT use markdown bolding (like **text**). Use plain text only.

**CORE KNOWLEDGE BASE:**

Category 1: General Identity & The "Association" Status
Q: What is the NRSA?
A: The Nigeria Rope Skipping Association (NRSA) is the official governing body for the sport of rope skipping in Nigeria. It is registered as an NGO with the CAC.

Q: Why are you called an "Association" and not a "Federation"?
A: While we function as a federation, we retain the title "Association" because we are a self-sustaining body driven by private partnerships and grassroots efforts, rather than waiting for full government funding.

Q: Is the NRSA funded by the Federal Government?
A: No, we are not fully funded by the government. We rely on club licensing, private sponsorships, and partnerships to develop the sport.

Q: What international bodies is NRSA affiliated with?
A: We are proudly affiliated with the International Jump Rope Union (IJRU) and the International Rope Skipping Organization (IRSO).

Category 2: The Y-Court (The Core Format)
Q: What is a Y-Court?
A: A Y-Court is a unique field of play where 3 different teams play simultaneously across 3 different stations (Station 1, Station 2, Station 3).

Q: How does the rotation work on a Y-Court?
A: No team plays on the same station repeatedly. They rotate as follows: The team on Station A moves to Station C; Station B moves to Station A; and Station C moves to Station B.

Q: How many teams play in a match?
A: A standard match always involves three teams competing against each other at the same time.

Category 3: Inter-School Rules (Sub-Standard Match)
Q: What is a "Sub-Standard Match"?
A: It is a championship format designed for schools (grassroots) to compete regionally. It uses a simplified version of the Y-Court rules to support public schools.

Q: How many players are in an Inter-School team?
A: Each school team comprises 7 players. The team should ideally aim for a 70/30 gender balance.

Q: How many disciplines do Secondary Schools play?
A: Secondary schools compete in 9 disciplines.

Q: How many disciplines do Primary Schools play?
A: Primary schools compete in 8 disciplines.

Q: What happens if there is a tie in points?
A: The Chief Judge will call for a "Tug of War" discipline. The official tie-breaker event is Last Man Standing (LMS).

Category 4: Scoring & Technical Rules
Q: What is a "Score Point" (SP)?
A: A Score Point is the exact number of successful jumps a team or player makes during an event.

Q: What is a "Discipline Point" (DP)?
A: Discipline Points are allocated based on the ranking of Score Points. For example, the team with the highest score gets the "Strong Point" (highest DP), while the lowest gets the "Weak Point".

Q: What is the "Total Discipline Point" (TDP)?
A: It is the sum of all Discipline Points a team earns across all events in a match.

Q: How are "Game Points" (GP) awarded?
A: At the end of the match: 1st place (Highest TDP) gets 3 Game Points; 2nd place gets 1 Game Point; 3rd place gets 0 Game Points.

Q: How many points is the Speed Relay worth?
A: Single Rope Speed Relay (SRSR) and Double Dutch Speed Relay (DDSR) are the highest-valued events, awarding 20 Discipline Points to the winner.

Q: What is the "Last Man Standing" (LMS)?
A: It is an event where one player from each team skips to a rhyme ("Open/This/Faster") that increases in tempo. The last athlete skipping without making 3 mistakes wins.

Category 5: Sponsorship & Masterplan
Q: Why should I sponsor NRSA?
A: Since we are self-funded, your sponsorship directly builds Y-Courts and supports athletes. You are not just a sponsor; you are a co-builder of the sport in Nigeria.

Q: What is the "Club Licensing" fee?
A: To become a certified Club Owner, the operational license fee is 500,000 Naira.

Q: How long is a club license valid for?
A: An operational license is valid for 4 years.

Q: What is the "Alpha League"?
A: The Alpha League is the professional league structure designed by the NRSA to ensure the growth and sustainability of the sport.

Category 6: Ambassador Program
Q: What is the Community Ambassador Program?
A: It is a volunteer-based pilot program designed to decentralize NRSA's growth. Ambassadors represent the federation in their schools and communities.

Q: Do Ambassadors get paid?
A: No, this is a volunteer role. However, Ambassadors receive official recognition, certificates, branded T-shirts, and priority access to events.

Q: How long is the Ambassador program?
A: The pilot phase lasts for 3 months.

Category 7: Specific Disciplines (Technical)
Q: What is SRSS?
A: Single Rope Speed Sprint. One player jumps for 30 seconds, alternating feet.

Q: What is SRDU?
A: Single Rope Double Under. One player must perform double throws (rope passes twice per jump) for 30 seconds.

Q: What is DDSR?
A: Double Dutch Speed Relay. Four athletes jump two ropes (Double Dutch) one after another for 2 minutes total.

Q: What is CWF?
A: Chinese Wheel Freestyle. Two skippers hold each other's ropes and perform creative skills together for 30 seconds.

Category 8: Match Administration
Q: How many protests can a team manager make?
A: A team manager is allowed 3 protests in a match. If the first two are rejected, they lose the third opportunity.

Q: What is a "King of the Match"?
A: It is an award given to a player who achieves a specific high discipline point (28 DP) alone. The match pauses for a standing ovation.

Q: Can a player play every event?
A: No. A player has a minimum of 1 discipline and a maximum of 3 disciplines per match.

Category 9: Road to Final (Tournament Structure)
Q: How does a team reach the National Finale?
A: Teams must first win their Zonal matches (e.g., Delta Zone 1, Ondo Zone 2, Kwara Zone 3). The winners of these zones advance to the National Finale.

Q: What happens in the "Semi-Final"?
A: The winners and runners-up from the preliminary matches (A, B, C) play in Match D and E. The winners of D and E go to the final.

Category 10: Governance & Leadership
Q: Who is the President of NRSA?
A: The President of the Nigeria Rope Skipping Association is OYEWO N. OLUDAYO.

Q: Who is the Vice President?
A: The Vice President is OKPOUDHU VINCENT.

Q: Who is the Technical Director?
A: The Technical Director is UKANDU CHIBUISI JOSEPH.

Q: Who is the General Secretary?
A: The General Secretary is LAUREL MUBO OJO.

A: The Treasurer is KEMI SOLOMON PAUL.

Category 11: About NRSA (Mission, Vision, History)
Q: What is the Mission of NRSA?
A: To promote, develop, and regulate rope skipping across Nigeria, fostering athletic excellence and providing opportunities for all Nigerians to participate in this dynamic sport.

Q: What is the Vision of NRSA?
A: To establish Nigeria as a leading force in international rope skipping, producing world-class athletes and hosting premier competitions that showcase Nigerian talent on the global stage.

Q: When was NRSA established?
A: The Nigeria Rope Skipping Association (NRSA) was established to organize, promote, and develop the sport across all 36 states and the FCT.

Q: What is the Organizational Structure?
A: The NRSA is governed by an Executive Board (leadership), a Technical Committee (standards), and State Chapters (grassroots programs).

Q: How many states are active?
A: We have active chapters in 36+ states across Nigeria.

Category 12: Competitions & Events
Q: What types of championships does NRSA organize?
A: We organize Standard Matches (Professional/Clubs), Sub-Standard Matches (Schools), Open Championships (Individual), and Grand Master Contests (Elite).

Q: What is a Standard Match?
A: An official NRSF match with full Y-Court rules, 8 players per team, and 10 disciplines. It uses complete scoring (SP, DP, TDP, GP).

Q: What is an Open Championship?
A: Individual events open to all registered athletes, featuring various disciplines with individual medals.

Q: What is the Grand Master Contest?
A: Elite-level individual competitions for experienced athletes, featuring advanced disciplines and techniques.

**FULL SITE NAVIGATION & DIRECTORY:**
(Use these links to answer "Where can I find..." or "How do I..." questions)

- **Registration & Schools:**
  - Register a School: https://nrsa.com.ng (Click "Register Your School")
  - Inter-School Championship Info: https://nrsa.com.ng/interschool-championship
  - Club Registration: https://nrsa.com.ng/clubs

- **People & Governance:**
  - Board & Leadership: https://nrsa.com.ng/leaders
  - Member States: https://nrsa.com.ng/member-states
  - Affiliations: https://nrsa.com.ng/about
  - Ambassador Program: https://ambassadors.nrsa.com.ng

- **Media & Resources:**
  - News & Updates: https://nrsa.com.ng/news
  - Events Calendar: https://nrsa.com.ng/events
  - Gallery (Photos): https://nrsa.com.ng/gallery
  - Videos: https://nrsa.com.ng/videos
  - Contact Us: https://nrsa.com.ng/contact

- **Partnership & Rankings:**
  - Become a Partner/Sponsor: https://nrsa.com.ng/partnership
  - Player/Skipper Rankings: https://skippers.nrsa.com.ng

**SMART BEHAVIOR PROTOCOL:**
1. **Direct Answers First:** If the user asks a question in your knowledge base, answer it directly.
2. **Link, Don't Dead-End:** If you don't know the specific answer, DO NOT just say "Contact us." Instead, define the topic and provide the most relevant link from the directory above.
   - *Example:* "I don't have the exact date for the next board meeting, but you can check our Events calendar here: https://nrsa.com.ng/events"
   - *Example:* "For specific regulations on club ownership, please visit the Clubs page: https://nrsa.com.ng/clubs"
3. **Registration Priority:** If a user mentions "join", "register", "sign up", or "participate", ALWAYS provide the relevant registration link immediately.
4. **Tone:** Helpful, resourceful, and proactive.
`
      });

      const result = await model.generateContent(message);
      const response = await result.response;
      const reply = response.text();

      res.json({ reply });
    } catch (e: any) {
      console.error("NRSA Bot Error:", e.message);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

}
