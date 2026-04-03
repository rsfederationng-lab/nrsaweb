import {
  type User, type InsertUser, type Admin, type InsertAdmin,
  type HeroSlide, type InsertHeroSlide,
  type News, type InsertNews, type Event, type InsertEvent,
  type Player, type InsertPlayer, type Club, type InsertClub,
  type MemberState, type InsertMemberState, memberStates,
  type Leader, type InsertLeader, type Media, type InsertMedia,
  type Affiliation, type InsertAffiliation, type Contact, type InsertContact,
  type SiteSetting, type InsertSiteSetting,
  type Ambassador, type InsertAmbassador,
  type InterschoolYear, type InsertInterschoolYear,
  type SchoolStanding, type InsertSchoolStanding,
  type SchoolActivation, type InsertSchoolActivation,
  type InterschoolNews, type InsertInterschoolNews,
  type Subscriber, type InsertSubscriber,
  users, admins, heroSlides, news, events, players, clubs, leaders,
  media, affiliations, contacts, siteSettings, ambassadors,
  interschoolYears, schoolStandings, schoolActivations, interschoolNews, subscribers
} from "@shared/schema";

import { supabase } from "./lib/supabase.js";

// Helper functions to convert between camelCase and snake_case
function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;

  const snakeObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    snakeObj[snakeKey] = toSnakeCase(obj[key]);
  }
  return snakeObj;
}

function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;

  const camelObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelObj[camelKey] = toCamelCase(obj[key]);
  }
  return camelObj;
}

export const storage = {
  // Admin methods
  getAdminByEmail: async (email: string) => {
    if (!supabase) return undefined;
    try {
      const { data, error } = await supabase.from('admins').select('*').eq('email', email).maybeSingle();
      if (error) throw error;
      return toCamelCase(data) || undefined;
    } catch (error: any) {
      console.error('Error getting admin by email:', error.message);
      return undefined;
    }
  },
  getAdminById: async (id: number) => {
    if (!supabase) return undefined;
    try {
      const { data, error } = await supabase.from('admins').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return toCamelCase(data) || undefined;
    } catch (error: any) {
      console.error('Error getting admin by ID:', error.message);
      return undefined;
    }
  },
  createAdmin: async (adminData: InsertAdmin) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(adminData);
      const { data, error } = await supabase.from('admins').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating admin:', error.message);
      throw error;
    }
  },
  getAllAdmins: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('admins').select('id, name, email, role, created_at').order('created_at', { ascending: false });
    return toCamelCase(data) || [];
  },
  updateAdmin: async (id: number, data: Partial<Admin>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('admins').update(updateData).eq('id', id).select().maybeSingle();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating admin:', error.message);
      throw error;
    }
  },
  deleteAdmin: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('admins').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  // News
  getAllNews: async (limit = 50, offset = 0) => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error getting all news:', error.message);
      return [];
    }
  },
  getNews: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createNews: async (article: InsertNews) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(article);
      console.log('🔍 [NEWS CREATE] Inserting:', insertData);
      const { data, error } = await supabase.from('news').insert(insertData).select().single();
      if (error) {
        console.error('🔍 [NEWS CREATE] Database error:', error);
        throw error;
      }
      console.log('🔍 [NEWS CREATE] Success:', data);
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating news:', error.message);
      throw error;
    }
  },
  updateNews: async (id: number, data: Partial<InsertNews>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      console.log('🔍 [NEWS UPDATE] Updating ID', id, 'with:', updateData);
      const { data: updated, error } = await supabase.from('news').update(updateData).eq('id', id).select().maybeSingle();
      if (error) {
        console.error('🔍 [NEWS UPDATE] Database error:', error);
        throw error;
      }
      console.log('🔍 [NEWS UPDATE] Success:', updated);
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating news:', error.message);
      throw error;
    }
  },
  deleteNews: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    console.log('🔍 [NEWS DELETE] Deleting ID:', id);
    const { error, count } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      console.error('🔍 [NEWS DELETE] Database error:', error);
      throw error;
    }
    console.log('🔍 [NEWS DELETE] Deleted count:', count);
    return true;
  },

  // Events
  getAllEvents: async () => {
    if (!supabase) {
      console.log('🔍 [EVENTS DEBUG] No supabase client');
      return [];
    }
    console.log('🔍 [EVENTS DEBUG] Fetching events from database...');
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    console.log('🔍 [EVENTS DEBUG] Raw database response:', { data, error, count: data?.length });
    const result = toCamelCase(data) || [];
    console.log('🔍 [EVENTS DEBUG] Processed result:', result);
    return result;
  },
  getEvent: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createEvent: async (event: InsertEvent) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(event);
      const { data, error } = await supabase.from('events').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating event:', error.message);
      throw error;
    }
  },
  updateEvent: async (id: number, data: Partial<InsertEvent>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('events').update(updateData).eq('id', id).select().maybeSingle();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating event:', error.message);
      throw error;
    }
  },
  deleteEvent: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Players
  getAllPlayers: async () => {
    if (!supabase) return [];
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('name');
    return toCamelCase(data) || [];
  },
  getPlayer: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('players').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createPlayer: async (player: InsertPlayer) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(player);
      const { data, error } = await supabase.from('players').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating player:', error.message);
      throw error;
    }
  },
  updatePlayer: async (id: number, data: Partial<InsertPlayer>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('players').update(updateData).eq('id', id).select().maybeSingle();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating player:', error.message);
      throw error;
    }
  },
  deletePlayer: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Clubs
  getAllClubs: async () => {
    if (!supabase) {
      console.log('🔍 [CLUBS DEBUG] No supabase client');
      return [];
    }
    console.log('🔍 [CLUBS DEBUG] Fetching clubs from database...');
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('name');
    console.log('🔍 [CLUBS DEBUG] Raw database response:', { data, error, count: data?.length });
    const result = toCamelCase(data) || [];
    console.log('🔍 [CLUBS DEBUG] Processed result:', result);
    return result;
  },
  getClub: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('clubs').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createClub: async (club: InsertClub) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(club);
      const { data, error } = await supabase.from('clubs').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating club:', error.message);
      throw error;
    }
  },
  updateClub: async (id: number, data: Partial<InsertClub>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('clubs').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating club:', error.message);
      throw error;
    }
  },
  deleteClub: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('clubs').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Leaders
  getAllLeaders: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('leaders').select('*').order('order');
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error getting all leaders:', error.message);
      return [];
    }
  },
  getLeader: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('leaders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createLeader: async (leader: InsertLeader) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(leader);
      const { data, error } = await supabase.from('leaders').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating leader:', error.message);
      throw error;
    }
  },
  updateLeader: async (id: number, data: Partial<InsertLeader>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('leaders').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating leader:', error.message);
      throw error;
    }
  },
  deleteLeader: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('leaders').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Media
  getAllMedia: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    return toCamelCase(data) || [];
  },
  getMediaItem: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('media').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createMedia: async (item: InsertMedia) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(item);
      const { data, error } = await supabase.from('media').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating media:', error.message);
      throw error;
    }
  },
  updateMedia: async (id: number, data: Partial<InsertMedia>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('media').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating media:', error.message);
      throw error;
    }
  },
  deleteMedia: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Contacts
  getAllContacts: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    return toCamelCase(data) || [];
  },

  // Contact Submissions
  createContact: async (contact: InsertContact) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('contacts').insert(toSnakeCase(contact)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateContact: async (id: number, data: any) => {
    if (!supabase) return undefined;
    const updateData = toSnakeCase(data);
    console.log('🔍 [CONTACT UPDATE] Updating ID', id, 'with:', updateData);
    const { data: updated, error } = await supabase.from('contacts').update(updateData).eq('id', id).select().maybeSingle();
    if (error) {
      console.error('🔍 [CONTACT UPDATE] Error:', error);
      throw error;
    }
    console.log('🔍 [CONTACT UPDATE] Result:', updated);
    return toCamelCase(updated);
  },
  deleteContact: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Ambassadors
  getAllAmbassadors: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('ambassadors').select('*').order('order');
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error fetching ambassadors:', error.message);
      return [];
    }
  },
  getAmbassador: async (id: number) => {
    if (!supabase) return undefined;
    try {
      const { data, error } = await supabase.from('ambassadors').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error fetching ambassador:', error.message);
      return undefined;
    }
  },
  createAmbassador: async (ambassador: InsertAmbassador) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(ambassador);
      const { data, error } = await supabase.from('ambassadors').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating ambassador:', error.message);
      throw error;
    }
  },
  updateAmbassador: async (id: number, update: Partial<InsertAmbassador>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(update);
      const { data, error } = await supabase.from('ambassadors').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error updating ambassador:', error.message);
      return undefined; // Or throw
    }
  },
  deleteAmbassador: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('ambassadors').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Site Settings
  getAllSiteSettings: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('site_settings').select('*');
    return toCamelCase(data) || [];
  },
  // Site Settings
  getSiteSettings: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('site_settings').select('*').order('key');
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error fetching site settings:', error.message);
      return [];
    }
  },

  getSiteSettingByKey: async (key: string) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('site_settings').select('*').eq('key', key).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },

  updateSiteSetting: async (key: string, value: string) => {
    if (!supabase) throw new Error('Database not available');

    // Check if exists first
    const existing = await storage.getSiteSettingByKey(key);

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date() })
        .eq('key', key)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('site_settings')
        .insert({ key, value })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }
    return toCamelCase(result);
  },

  // Member States
  getAllMemberStates: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('member_states').select('*').order('name');
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error getting all member states:', error.message);
      return [];
    }
  },
  getMemberState: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('member_states').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createMemberState: async (state: InsertMemberState) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(state);
      const { data, error } = await supabase.from('member_states').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating member state:', error.message);
      throw error;
    }
  },
  updateMemberState: async (id: number, data: Partial<InsertMemberState>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('member_states').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating member state:', error.message);
      throw error;
    }
  },
  deleteMemberState: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('member_states').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Hero Slides
  getAllHeroSlides: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('hero_slides').select('*').order('id');
    return toCamelCase(data) || [];
  },
  getHeroSlide: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('hero_slides').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createHeroSlide: async (slide: InsertHeroSlide) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(slide);
      const { data, error } = await supabase.from('hero_slides').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating hero slide:', error.message);
      throw error;
    }
  },
  updateHeroSlide: async (id: number, data: Partial<InsertHeroSlide>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('hero_slides').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating hero slide:', error.message);
      throw error;
    }
  },
  deleteHeroSlide: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Affiliations
  getAllAffiliations: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('affiliations').select('*').order('order');
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error fetching affiliations:', error.message);
      return [];
    }
  },
  getAffiliation: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('affiliations').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data || undefined;
  },
  createAffiliation: async (affiliation: InsertAffiliation) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const insertData = toSnakeCase(affiliation);
      const { data, error } = await supabase.from('affiliations').insert(insertData).select().single();
      if (error) throw error;
      return toCamelCase(data);
    } catch (error: any) {
      console.error('Error creating affiliation:', error.message);
      throw error;
    }
  },
  updateAffiliation: async (id: number, data: Partial<InsertAffiliation>) => {
    if (!supabase) throw new Error('Database not available');
    try {
      const updateData = toSnakeCase(data);
      const { data: updated, error } = await supabase.from('affiliations').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return toCamelCase(updated);
    } catch (error: any) {
      console.error('Error updating affiliation:', error.message);
      throw error;
    }
  },
  deleteAffiliation: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('affiliations').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Interschool Years
  getAllInterschoolYears: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('interschool_years').select('*').order('year', { ascending: false });
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error fetching interschool years:', error.message);
      return [];
    }
  },
  getInterschoolYear: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('interschool_years').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  createInterschoolYear: async (year: InsertInterschoolYear) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('interschool_years').insert(toSnakeCase(year)).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateInterschoolYear: async (id: number, update: Partial<InsertInterschoolYear>) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('interschool_years').update(toSnakeCase(update)).eq('id', id).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  deleteInterschoolYear: async (id: number) => {
    if (!supabase) throw new Error('Database not available');

    // Manual cascading delete: remove standings and activations first
    const { error: standingsError } = await supabase.from('school_standings').delete().eq('year_id', id);
    if (standingsError) {
      console.error("Error deleting related standings:", standingsError);
      throw standingsError;
    }

    const { error: activationsError } = await supabase.from('school_activations').delete().eq('year_id', id);
    if (activationsError) {
      console.error("Error deleting related activations:", activationsError);
      throw activationsError;
    }

    const { error: newsError } = await supabase.from('interschool_news').delete().eq('year_id', id);
    if (newsError) {
      console.error("Error deleting related news:", newsError);
      throw newsError;
    }

    const { error } = await supabase.from('interschool_years').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // School Standings
  getSchoolStandingsByYear: async (yearId: number) => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('school_standings')
        .select('*')
        .eq('year_id', yearId)
        .order('points', { ascending: false });
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error fetching school standings:', error.message);
      return [];
    }
  },
  createSchoolStanding: async (standing: InsertSchoolStanding) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('school_standings').insert(toSnakeCase(standing)).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateSchoolStanding: async (id: number, update: Partial<InsertSchoolStanding>) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('school_standings').update(toSnakeCase(update)).eq('id', id).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  deleteSchoolStanding: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('school_standings').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // School Activations
  getSchoolActivationsByYear: async (yearId: number) => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('school_activations')
        .select('*')
        .eq('year_id', yearId)
        .order('event_date', { ascending: false });
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error fetching school activations:', error.message);
      return [];
    }
  },
  createSchoolActivation: async (activation: InsertSchoolActivation) => {
    // FORCE ADMIN CLIENT - Bypass global client issues
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let client = supabase;
    if (url && key) {
      console.log(`[Storage] Creating fresh admin client for activation insert. Key len: ${key.length}`);
      const { createClient } = await import('@supabase/supabase-js');
      client = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
    } else {
      console.warn("[Storage] Missing Service Role Key, using global client (might be anon)");
    }

    if (!client) throw new Error('Database not available');

    // Explicitly use the fresh client
    const { data, error } = await client.from('school_activations').insert(toSnakeCase(activation)).select().single();

    if (error) {
      console.error("[Storage] Activation Insert Error:", error);
      throw error;
    }
    return toCamelCase(data);
  },
  updateSchoolActivation: async (id: number, update: Partial<InsertSchoolActivation>) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('school_activations').update(toSnakeCase(update)).eq('id', id).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  deleteSchoolActivation: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('school_activations').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Interschool News
  getInterschoolNewsByYear: async (yearId: number) => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('interschool_news')
        .select('*')
        .eq('year_id', yearId)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error fetching interschool news:', error.message);
      return [];
    }
  },
  createInterschoolNews: async (newsItem: InsertInterschoolNews) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('interschool_news').insert(toSnakeCase(newsItem)).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateInterschoolNews: async (id: number, update: Partial<InsertInterschoolNews>) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('interschool_news').update(toSnakeCase(update)).eq('id', id).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  deleteInterschoolNews: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('interschool_news').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Subscribers (Newsletter)
  getAllSubscribers: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error fetching subscribers:', error.message);
      return [];
    }
  },
  createSubscriber: async (subscriber: InsertSubscriber) => {
    if (!supabase) throw new Error('Database not available');
    const { data, error } = await supabase.from('subscribers').insert(toSnakeCase(subscriber)).select().single();
    if (error) throw error;
    return toCamelCase(data);
  },
  deleteSubscriber: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
