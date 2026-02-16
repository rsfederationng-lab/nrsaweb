# Nigeria Rope Skipping Association (NRSA) Website

## Overview

The Nigeria Rope Skipping Association (NRSA) website is an official sports federation platform built to promote and manage rope skipping as a competitive sport across Nigeria. The application serves as the central hub for news, events, athlete registries, club management, and administrative control. It features a public-facing website showcasing Nigerian national identity through the green-white-black color scheme while maintaining international sports federation standards, alongside a comprehensive admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**November 13, 2025 - Schema Validation & Data Transformation Standardization**:
- **Schema Validation Enhancement**: Added `insertSchema.partial().parse()` validation to ALL PATCH endpoints (hero-slides, news, events, players, clubs, member-states, leaders, contacts, site-settings) to prevent undefined → null conversion bugs during partial updates
- **Clubs Schema Fix**: Restored email/phone validation to `insertClubSchema` using `createInsertSchema` refinements with `.trim()`, `.email()`, and `.min(10)` validators
- **Contacts Admin Fix**: Created separate `updateContactSchema` that includes `isRead` field (omitted from `insertContactSchema`) to restore admin "mark as read" functionality while preventing clients from manipulating read status on creation
- **Storage Layer Enforcement**: Verified all API routes exclusively use the storage layer (no direct `supabase.from()` bypasses) ensuring consistent camelCase ↔ snake_case transformation between frontend and database
- **Upload Pipeline Documentation**: Confirmed `/api/upload` endpoint properly configured for Supabase Storage uploads to `nrsa-uploads` bucket (requires bucket to be created and set to public access in Supabase dashboard)
- **Architect Review**: All changes architect-reviewed and approved for production

**November 4, 2025 - Production Deployment Ready**:
- **Route Consolidation**: Removed duplicate `apiRoutes.ts`, consolidated all API routes into single `routes.ts` file
- **TypeScript Build Fixes**: Resolved all TypeScript compilation errors, clean build to `dist/` directory
- **API Route Protection**: Fixed `vite.ts` to correctly skip `/api/*` routes in SPA fallback (prevents HTML responses from API endpoints)
- **Conditional Supabase**: Made Supabase initialization optional - server runs gracefully without credentials, file uploads return informative 503 error
- **Production Documentation**: Created comprehensive `DEPLOYMENT.md` with step-by-step cPanel deployment instructions
- **Environment Documentation**: Updated `.env.example` with optional Supabase configuration
- **Critical Bug Fix**: Fixed DELETE `/api/admins/:id` route that was accidentally nested inside POST handler

**October 27, 2025**:
- **Admin Portal Standardization**: Updated Leaders and Players admin components to use React Query + Toast notifications pattern (consistent with Events, Media, Contacts)
- **Event Registration Links**: Added `registrationLink` field to Events schema, admin form input, and functional "Register Now" button on frontend that opens links in new tab
- **Media Category Dropdown**: Enhanced Media admin form with Select dropdown for categories (Training, Achievement, Event, Announcement) instead of free-text input
- **Frontend Cleanup**: Removed non-functional "Contact Club" button from Clubs page
- **Backend Code Quality**: Formatted Leaders routes in `server/routes.ts` for consistency with other endpoints
- **Verified Functionality**: News detail page and Admin Contacts modal already fully implemented and working

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite as the development server and build tool. The choice of Vite provides fast hot module replacement during development and optimized production builds.

**Routing**: Wouter - a minimalist client-side routing library chosen for its small bundle size (~1.2KB) and simplicity over heavier alternatives like React Router. Routes are organized with admin routes prioritized first, followed by public routes.

**UI Component Library**: Shadcn/ui built on Radix UI primitives with Tailwind CSS for styling. The design system follows the "new-york" style variant with a neutral base color palette. Components are highly customizable through CSS variables defined in HSL format with alpha channel support, enabling consistent theming across the application.

**State Management**: TanStack Query (React Query) v5 handles all server state management, providing built-in caching, background refetching, automatic retries, and optimistic updates. No separate global client state library is used - component state is managed locally with React hooks.

**Form Management**: React Hook Form with Zod schema validation via @hookform/resolvers. This combination provides type-safe form handling with minimal re-renders and automatic validation.

**Styling Strategy**: Tailwind CSS utility-first framework with custom design tokens. The color system uses HSL values with CSS variables for dynamic theming. Custom utility classes (`hover-elevate`, `active-elevate-2`) provide consistent interaction states. Typography uses Poppins font via Google Fonts CDN with a defined hierarchy for headlines, body text, and UI elements.

**Design Philosophy**: Reference-based approach inspired by international sports federation websites (ijru.sport) while incorporating strong Nigerian national identity through the green (#009739), white, and black color scheme. The design balances professional authority with athletic dynamism.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript, configured as ESM modules. The server handles both API routes and static file serving in production.

**API Design**: RESTful API with endpoints organized under `/api/*` routes. Standard CRUD operations are available for all entities (news, events, players, clubs, leaders, media, affiliations, contacts, site settings). Admin endpoints are protected with JWT authentication middleware.

**Authentication System**: JWT-based authentication with bcrypt password hashing (10 rounds). Admin login returns a token valid for 8 hours. The `requireAdmin` middleware validates JWT tokens on protected routes. Tokens are stored in localStorage on the client and sent via Authorization header.

**File Upload Strategy**: Multer middleware configured with Supabase Storage for permanent file hosting. Files are uploaded to the `nrsa-uploads` bucket with a 10MB file size limit and type validation (JPEG, PNG, GIF, WebP). The system supports both direct file uploads and external URLs (YouTube videos, etc.). Supabase initialization is conditional - the server runs gracefully without credentials, returning a 503 error for upload attempts when not configured.

**Database Layer**: Drizzle ORM with PostgreSQL via the standard `pg` driver (not Neon serverless). The `storage` object in `server/storage.ts` provides a clean abstraction layer for all database operations, implementing methods for CRUD operations on all entities. Database credentials are configured via the `DATABASE_URL` environment variable.

**Development Workflow**: Custom Vite middleware integration enables hot module replacement in development. The server serves the Vite dev server in development mode and static built files in production. Logging middleware tracks API request duration and response data.

### Database Schema

**ORM**: Drizzle ORM chosen for its TypeScript-first approach, lightweight footprint, and SQL-like query builder. Schema definitions use Drizzle's column type builders with type inference.

**Dialect**: PostgreSQL configured through `drizzle.config.ts`. Migrations are stored in the `./migrations` directory with schema definitions in `shared/schema.ts`.

**Core Entities**:
- **Admins**: Admin accounts with bcrypt-hashed passwords for dashboard access
- **Hero Slides**: Homepage carousel images with headlines, subheadlines, CTAs, and ordering
- **News**: Articles with titles, content, images, categories, and publication dates
- **Events**: Competitions and training sessions with dates, locations, descriptions, and featured status
- **Players**: Athlete registry with photos, NRSA IDs, achievements, state information
- **Clubs**: Affiliated organizations with logos, contact details, registration status
- **Leaders**: Executive board members with photos, positions, bios, and display order
- **Media**: Photo/video gallery with categories and URLs
- **Affiliations**: International organization memberships
- **Contacts**: Form submissions from the public contact page
- **Site Settings**: Configurable site metadata (name, tagline, mission, vision, contact info, social links)

**Schema Validation**: Drizzle-Zod generates Zod schemas from Drizzle table definitions, ensuring type safety between database operations and API validation.

**Relationships**: The schema uses Drizzle's relations API to define foreign key relationships where applicable, though the current implementation is primarily flat with minimal joins.

## External Dependencies

### Cloud Services

**Cloudinary**: Image hosting and CDN service for all uploaded media. Credentials are configured via the `CLOUDINARY_URL` environment variable. The service handles image transformations, optimization, and delivery with the Cloudinary SDK (`cloudinary` package and `multer-storage-cloudinary`).

**AWS S3**: The codebase includes the AWS SDK (`@aws-sdk/client-s3`) suggesting potential S3 integration for file storage, though Cloudinary is the active implementation.

### Database

**PostgreSQL**: Primary data store accessed via Drizzle ORM with the standard Node.js `pg` driver. Connection pooling is configured through the `Pool` class from the `pg` package.

### Email (Optional)

**Nodemailer**: Email sending capability for contact form notifications. The implementation is conditional - only initialized if SMTP credentials are provided via environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).

### Authentication

**bcrypt**: Password hashing library for admin account security (version ^6.0.0)
**jsonwebtoken**: JWT token generation and validation for admin sessions

### UI Libraries

**Radix UI**: Comprehensive set of accessible React components including accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, hover-card, label, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, and tooltip primitives.

**Embla Carousel**: Lightweight carousel implementation used for the hero slider (`embla-carousel-react`).

### Utility Libraries

**date-fns**: Date formatting and manipulation (v3.6.0)
**axios**: HTTP client for external API requests (v1.12.2)
**class-variance-authority**: CVA for building variant-based component APIs
**clsx** & **tailwind-merge**: Utility for conditional className composition
**nanoid**: Unique ID generation

### Development Tools

**Replit Plugins**: Custom Vite plugins for Replit integration including runtime error modal, cartographer for debugging, and dev banner (only loaded in development when `REPL_ID` is defined).

**TypeScript**: Strict type checking with ES2020 target and ESNext module format. Path aliases configured for `@/*` (client), `@shared/*` (shared), and `@assets/*` (attached assets).

**Cross-env**: Environment variable handling across platforms for npm scripts.