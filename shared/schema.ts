import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Admins
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  protected: boolean("protected").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admins, {
  role: z.enum(["super-admin", "admin"]).default("admin"),
}).omit({
  id: true,
  createdAt: true,
  protected: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Hero Slides
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHeroSlideSchema = createInsertSchema(heroSlides, {
  order: z.coerce.number()
    .int({ message: "Order must be a whole number." })
    .nonnegative({ message: "Order cannot be negative." }),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type HeroSlide = typeof heroSlides.$inferSelect;

// News Articles
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsSchema = createInsertSchema(news, {
  publishedAt: z.union([
    z.date(),
    z.string().transform((str, ctx) => {
      const d = new Date(str);
      if (isNaN(d.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid date format" });
        return z.NEVER;
      }
      return d;
    })
  ]).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  eventDate: timestamp("event_date").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  registrationLink: text("registration_link"),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events, {
  eventDate: z.union([
    z.date(),
    z.string().min(1, "Event date is required").transform((str) => new Date(str))
  ]),
  registrationDeadline: z.union([
    z.date(),
    z.string().transform((str) => str && str.trim() !== "" ? new Date(str) : undefined)
  ]).optional(),
  registrationLink: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.trim() === "" || /^https?:\/\/.+/.test(value),
      "Invalid URL format"
    ),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  club: text("club").notNull(),
  state: text("state").notNull(),
  category: text("category").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  achievements: text("achievements"),
  awardsWon: integer("awards_won").default(0),
  gamesPlayed: integer("games_played").default(0),
  biography: text("biography"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players, {
  totalPoints: z.coerce.number()
    .int({ message: "Total points must be a whole number." })
    .nonnegative({ message: "Total points cannot be negative." }),
  awardsWon: z.coerce.number()
    .int({ message: "Awards won must be a whole number." })
    .nonnegative({ message: "Awards won cannot be negative." }),
  gamesPlayed: z.coerce.number()
    .int({ message: "Games played must be a whole number." })
    .nonnegative({ message: "Games played cannot be negative." }),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Clubs
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  managerName: text("manager_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  isRegistered: boolean("is_registered").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClubSchema = createInsertSchema(clubs, {
  contactEmail: z.string().trim().email("Invalid email address"),
  contactPhone: z.string().trim().min(10, "Phone number must be at least 10 characters"),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;

// Member State
export const memberStates = pgTable("member_states", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  representativeName: varchar("representative_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  isRegistered: boolean("is_registered").default(false),
});

export const insertMemberStateSchema = createInsertSchema(memberStates).omit({
  id: true,
});

export type MemberState = typeof memberStates.$inferSelect;
export type InsertMemberState = typeof memberStates.$inferInsert;

// Federation Leaders
export const leaders = pgTable("leaders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeaderSchema = createInsertSchema(leaders, {
  order: z.coerce.number()
    .int({ message: "Order must be a whole number." })
    .nonnegative({ message: "Order cannot be negative." }),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertLeader = z.infer<typeof insertLeaderSchema>;
export type Leader = typeof leaders.$inferSelect;

// Media Gallery
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  isExternal: boolean("is_external").notNull().default(false),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media, {
  isExternal: z.boolean().optional(),
  thumbnailUrl: z.string().nullable().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// Affiliations
export const affiliations = pgTable("affiliations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website"),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliationSchema = createInsertSchema(affiliations, {
  order: z.coerce.number()
    .int({ message: "Order must be a whole number." })
    .nonnegative({ message: "Order cannot be negative." }),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliation = z.infer<typeof insertAffiliationSchema>;
export type Affiliation = typeof affiliations.$inferSelect;

// Contact Submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  type: text("type").notNull().default("General"),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts, {
  subject: z.string().optional(),
  type: z.enum(["General", "Partnership", "Registration", "Volunteering"]).default("General"),
}).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const updateContactSchema = createInsertSchema(contacts, {
  subject: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type UpdateContact = z.infer<typeof updateContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Site Settings
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// Featured Homepage Banners
export const featuredBanners = pgTable("featured_banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  badgeText: text("badge_text").notNull().default("FEATURED EVENT"),
  primaryButtonText: text("primary_button_text").notNull(),
  primaryButtonLink: text("primary_button_link").notNull(),
  secondaryButtonText: text("secondary_button_text"),
  secondaryButtonLink: text("secondary_button_link"),
  backgroundStyle: text("background_style").notNull().default("red"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(false),
  order: integer("order").notNull().default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  displayFrequency: text("display_frequency").notNull().default("every_visit"),
  isEmergency: boolean("is_emergency").notNull().default(false),
  showCountdown: boolean("show_countdown").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFeaturedBannerSchema = createInsertSchema(featuredBanners, {
  backgroundStyle: z.enum(["red", "green", "custom"]).default("red"),
  order: z.coerce.number().int().nonnegative(),
  startDate: z.union([z.date(), z.string().transform((value) => new Date(value))]).nullable().optional(),
  endDate: z.union([z.date(), z.string().transform((value) => new Date(value))]).nullable().optional(),
  displayFrequency: z.enum(["every_visit", "once", "twice", "weekly"]).default("every_visit"),
  isEmergency: z.boolean().default(false),
  showCountdown: z.boolean().default(false),
}).omit({ id: true, createdAt: true });

export type InsertFeaturedBanner = z.infer<typeof insertFeaturedBannerSchema>;
export type FeaturedBanner = typeof featuredBanners.$inferSelect;

// Store Products (foundation for merchandise and pre-orders)
export const storeProducts = pgTable("store_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull().default(0),
  imageUrl: text("image_url"),
  description: text("description"),
  isPreorder: boolean("is_preorder").notNull().default(false),
  isActive: boolean("is_active").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStoreProductSchema = createInsertSchema(storeProducts, {
  price: z.coerce.number().int().nonnegative(),
  order: z.coerce.number().int().nonnegative(),
}).omit({ id: true, createdAt: true });

export type InsertStoreProduct = z.infer<typeof insertStoreProductSchema>;
export type StoreProduct = typeof storeProducts.$inferSelect;

// NRSA Store orders and line items
export const storeOrders = pgTable("store_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address"),
  fulfillmentMethod: text("fulfillment_method").notNull().default("pickup"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("NGN"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  fulfillmentStatus: text("fulfillment_status").notNull().default("pending"),
  paystackReference: text("paystack_reference").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const storeOrderItems = pgTable("store_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStoreOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(160),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(7).max(30),
  deliveryAddress: z.string().trim().max(500).optional().nullable(),
  fulfillmentMethod: z.enum(["pickup", "delivery"]).default("pickup"),
  items: z.array(z.object({
    productId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive().max(100),
  })).min(1).max(50),
});

export type InsertStoreOrder = z.infer<typeof insertStoreOrderSchema>;
export type StoreOrder = typeof storeOrders.$inferSelect;
export type StoreOrderItem = typeof storeOrderItems.$inferSelect;

// Ambassadors
export const ambassadors = pgTable("ambassadors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  photoUrl: text("photo_url").notNull(),
  bio: text("bio"),
  socialLinks: text("social_links"), // JSON string or simple text, let's keep it simple text for now or JSON if needed. User just wants "details".
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAmbassadorSchema = createInsertSchema(ambassadors, {
  order: z.coerce.number()
    .int({ message: "Order must be a whole number." })
    .nonnegative({ message: "Order cannot be negative." }),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertAmbassador = z.infer<typeof insertAmbassadorSchema>;
export type Ambassador = typeof ambassadors.$inferSelect;

// Interschool Years (Seasons)
export const interschoolYears = pgTable("interschool_years", {
  id: serial("id").primaryKey(),
  year: text("year").notNull().unique(), // e.g., "2025"
  logoUrl: text("logo_url").notNull().default("/branding/nrsa_logo_sm.png"),
  isActive: boolean("is_active").notNull().default(false),
  themeColor: text("theme_color").default("#10b981"), // Default emerald
  videoUrl: text("video_url"),
  description: text("description"),
  aboutImageUrl: text("about_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInterschoolYearSchema = createInsertSchema(interschoolYears).omit({
  id: true,
  createdAt: true,
});

export type InsertInterschoolYear = z.infer<typeof insertInterschoolYearSchema>;
export type InterschoolYear = typeof interschoolYears.$inferSelect;

// School Standings (Leaderboard)
export const schoolStandings = pgTable("school_standings", {
  id: serial("id").primaryKey(),
  yearId: integer("year_id").references(() => interschoolYears.id).notNull(),
  schoolName: text("school_name").notNull(),
  state: text("state").notNull(),
  points: integer("points").notNull().default(0),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSchoolStandingSchema = createInsertSchema(schoolStandings, {
  points: z.coerce.number()
    .int({ message: "Points must be a whole number." })
    .nonnegative({ message: "Points cannot be negative." }),
}).omit({
  id: true,
  createdAt: true,
  yearId: true, // We'll handle this manually in the route or pass it explicitly if needed
}).extend({
  yearId: z.coerce.number(),
});

export type InsertSchoolStanding = z.infer<typeof insertSchoolStandingSchema>;
export type SchoolStanding = typeof schoolStandings.$inferSelect;

// School Activations (Recent Events)
export const schoolActivations = pgTable("school_activations", {
  id: serial("id").primaryKey(),
  yearId: integer("year_id").references(() => interschoolYears.id).notNull(),
  schoolName: text("school_name").notNull(),
  eventTitle: text("event_title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  eventDate: timestamp("event_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSchoolActivationSchema = createInsertSchema(schoolActivations, {
  eventDate: z.union([
    z.date(),
    z.string().transform((str) => new Date(str))
  ]),
}).omit({
  id: true,
  createdAt: true,
  yearId: true,
}).extend({
  yearId: z.coerce.number(),
});


export type InsertSchoolActivation = z.infer<typeof insertSchoolActivationSchema>;
export type SchoolActivation = typeof schoolActivations.$inferSelect;

// Interschool News (Year-specific news for interschool section)
export const interschoolNews = pgTable("interschool_news", {
  id: serial("id").primaryKey(),
  yearId: integer("year_id").references(() => interschoolYears.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInterschoolNewsSchema = createInsertSchema(interschoolNews, {
  publishedAt: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
}).omit({
  id: true,
  createdAt: true,
  yearId: true,
}).extend({
  yearId: z.coerce.number(),
});

export type InsertInterschoolNews = z.infer<typeof insertInterschoolNewsSchema>;
export type InterschoolNews = typeof interschoolNews.$inferSelect;

// Subscribers (Newsletter)
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers, {
  email: z.string().trim().email("Invalid email address"),
}).omit({
  id: true,
  createdAt: true,
  isActive: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// ─── CHAMPIONSHIP PHASES ────────────────────────────────────────────────────
// Each season (interschool_year) can have multiple state-based phases,
// e.g. Delta Week 1, Ondo Week 2, Kwara Week 3.
export const championshipPhases = pgTable("championship_phases", {
  id: serial("id").primaryKey(),
  yearId: integer("year_id").references(() => interschoolYears.id).notNull(),
  stateName: text("state_name").notNull(),          // e.g. "Delta"
  venue: text("venue"),
  registrationOpens: timestamp("registration_opens"),
  registrationCloses: timestamp("registration_closes"),
  competitionDate: timestamp("competition_date"),
  maxSchools: integer("max_schools").notNull().default(9),
  whatsappGroupLink: text("whatsapp_group_link"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChampionshipPhaseSchema = createInsertSchema(championshipPhases, {
  registrationOpens: z.union([z.date(), z.string().transform((s) => new Date(s))]).nullable().optional(),
  registrationCloses: z.union([z.date(), z.string().transform((s) => new Date(s))]).nullable().optional(),
  competitionDate: z.union([z.date(), z.string().transform((s) => new Date(s))]).nullable().optional(),
  maxSchools: z.coerce.number().int().positive().default(9),
}).omit({ id: true, createdAt: true, yearId: true }).extend({
  yearId: z.coerce.number(),
});

export type InsertChampionshipPhase = z.infer<typeof insertChampionshipPhaseSchema>;
export type ChampionshipPhase = typeof championshipPhases.$inferSelect;

// ─── SCHOOL REGISTRATIONS ────────────────────────────────────────────────────
// Schools that register for a specific championship phase.
export const REGISTRATION_STATUSES = [
  "pending",
  "under_review",
  "selected",
  "not_selected",
  "waitlisted",
  "withdrawn",
] as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const schoolRegistrations = pgTable("school_registrations", {
  id: serial("id").primaryKey(),
  phaseId: integer("phase_id").references(() => championshipPhases.id).notNull(),
  yearId: integer("year_id").references(() => interschoolYears.id).notNull(),

  // School details
  schoolName: text("school_name").notNull(),
  state: text("state").notNull(),
  schoolAddress: text("school_address").notNull(),

  // Contact persons
  principalName: text("principal_name").notNull(),
  coordinatorName: text("coordinator_name").notNull(),
  coordinatorPhone: text("coordinator_phone").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  email: text("email").notNull(),

  // Participation details
  athleteCount: integer("athlete_count").notNull(),
  category: text("category").notNull(), // "junior" | "senior" | "both"
  eventsCategories: text("events_categories"),   // JSON string of selected events
  logoUrl: text("logo_url"),
  consentGiven: boolean("consent_given").notNull().default(false),
  additionalNotes: text("additional_notes"),

  // Admin workflow
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSchoolRegistrationSchema = createInsertSchema(schoolRegistrations, {
  email: z.string().email("Invalid email address"),
  coordinatorPhone: z.string().min(7, "Phone number required"),
  whatsappNumber: z.string().min(7, "WhatsApp number required"),
  athleteCount: z.coerce.number().int().positive("Must be at least 1"),
  category: z.enum(["junior", "senior", "both"]),
  status: z.enum(REGISTRATION_STATUSES).default("pending"),
  consentGiven: z.boolean(),
}).omit({ id: true, createdAt: true, updatedAt: true, yearId: true, status: true, adminNotes: true }).extend({
  phaseId: z.preprocess((val) => {
    if (val === undefined || val === null || val === '' || val === 'NaN') return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().positive().optional()),
  yearId: z.preprocess((val) => {
    if (val === undefined || val === null || val === '' || val === 'NaN') return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().positive().optional()),
});

export const updateSchoolRegistrationSchema = z.object({
  status: z.enum(REGISTRATION_STATUSES).optional(),
  adminNotes: z.string().optional(),
});

export type InsertSchoolRegistration = z.infer<typeof insertSchoolRegistrationSchema>;
export type UpdateSchoolRegistration = z.infer<typeof updateSchoolRegistrationSchema>;
export type SchoolRegistration = typeof schoolRegistrations.$inferSelect;
