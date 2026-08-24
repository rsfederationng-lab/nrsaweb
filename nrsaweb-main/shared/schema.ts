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
  logoUrl: text("logo_url").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  themeColor: text("theme_color").default("#10b981"), // Default emerald
  videoUrl: text("video_url"),
  description: text("description"),
  aboutImageUrl: text("about_image_url"),
  registrationUrl: text("registration_url"), // Registration link for this season
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
