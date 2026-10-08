export interface HeroSlide {
  id: number;
  imageUrl: string;
  headline: string;
  subheadline?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

export interface FeaturedBanner {
  id: number;
  title: string;
  subtitle: string;
  badgeText: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  backgroundStyle: "red" | "green" | "custom";
  imageUrl?: string | null;
  isActive: boolean;
  order: number;
  startDate?: Date | null;
  endDate?: Date | null;
  displayFrequency: "every_visit" | "once" | "twice" | "weekly";
  isEmergency: boolean;
  showCountdown: boolean;
  createdAt: Date;
}

export interface StoreProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  isPreorder: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

export interface News {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string | null;
  isFeatured: boolean;
  publishedAt: Date;
  createdAt: Date;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  city: string;
  state: string;
  eventDate: Date;
  registrationDeadline?: Date | null;
  registrationLink?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  startTime?: string | null;
  endTime?: string | null;
  createdAt: Date;
}

export interface Player {
  id: number;
  name: string;
  photoUrl?: string | null;
  club: string;
  state: string;
  category: string;
  totalPoints: number;
  achievements?: string | null;
  awardsWon?: number | null;
  gamesPlayed?: number | null;
  biography?: string | null;
  createdAt: Date;
}

export interface Club {
  id: number;
  name: string;
  logoUrl?: string | null;
  city: string;
  state: string;
  managerName: string;
  contactEmail: string;
  contactPhone: string;
  isRegistered: boolean;
  createdAt: Date;
}

export interface InsertClub {
  name: string;
  logoUrl?: string;
  city: string;
  state: string;
  managerName: string;
  contactEmail: string;
  contactPhone: string;
  isRegistered?: boolean;
}

export interface Leader {
  id: number;
  name: string;
  position: string;
  photoUrl?: string | null;
  bio?: string | null;
  order: number;
  createdAt: Date;
}

export interface Media {
  id: number;
  title: string;
  description?: string | null;
  imageUrl: string;
  category: string;
  isExternal: boolean;
  thumbnailUrl?: string | null;
  createdAt: Date;
}

export interface Affiliation {
  id: number;
  name: string;
  logoUrl: string;
  website?: string | null;
  description?: string | null;
  order: number;
  createdAt: Date;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface MemberState {
  id: number;
  name: string;
  logoUrl?: string | null;
  representativeName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  isRegistered?: boolean | null;
}

export interface InsertMemberState {
  name: string;
  logoUrl?: string | null;
  representativeName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  isRegistered?: boolean | null;
}

export const insertContactSchema = {
  parse: (data: any) => data
};

export interface Ambassador {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  bio?: string | null;
  socialLinks?: string | null;
  order: number;
  createdAt: Date;
}
