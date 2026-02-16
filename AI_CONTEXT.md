# NRSA Website - AI Project Context

## 1. Project Overview
**Project Name:** Nigeria Rope Skipping Association (NRSA) Official Website
**Purpose:** To serve as the digital headquarters for the national governing body of rope skipping in Nigeria. The site promotes the sport, showcases athletes (rankings, records), engages the youth, and attracts partners/sponsors.
**Current State:** Active development (Localhost).
**Target Audience:** Athletes, Officials, Sponsors, General Public.

## 2. Tech Stack
- **Frontend Framework:** React 18 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Radix Primitives) + Custom "Elite Sports" Design System
- **Routing:** Wouter (Lightweight router)
- **State Management:** React Query (TanStack Query)
- **Backend:** Express.js (Node.js)
- **Database:** Supabase (PostgreSQL) - *Note: Local env may have missing credentials*
- **Icons:** Lucide React

## 3. Key Features
### Public Facing
- **Hero Section:** High-impact slideshow with "count-up" statistics (States, Medals, Athletes).
- **Partnership Page:** Specialized landing page (`/partnership`) for sponsors with tiers and value props.
- **News/Events:** Dynamic content sections for federation updates.
- **Athlete Rankings:** FIFA-style player cards and leaderboards (external links or internal).

### Admin Features
- **Dashboard:** `/admin-nrsa-dashboard` for managing content (News, Events, Players).

## 4. Key Components & Structure
### Directory: `client/src`
- **`components/Hero.tsx`**: The main landing slideshow. Features auto-scroll, text overlays, and "Join/Partner" CTAs.
- **`pages/HomeNew.tsx`**: The modern homepage layout.
- **`pages/Partnership.tsx`**: The targeted sponsorship page.
- **`App.tsx`**: Main application router.
- **`index.css`**: Global styles, Tailwind directives, and "Elevate" elevation system variables.

### Design System
- **Colors:**
    - Primary: Green (`--primary`, `hsl(142 100% 29%)`) - Represents Nigeria.
    - Accents: White, Black/Dark Grey.
- **Typography:** `Poppins` font family for a modern, athletic look.
- **Visuals:** Uses glassmorphism (backdrops), gradients, and bold large typography.

## 5. Recent Changes (Session History)
- **Hero Redesign:** Moved from a carousel component to a custom `Hero.tsx` with background slideshow, gradient text, and animated statistics.
- **Partnership Page:** Created a new route covering "Why Partner", "Tiers", and "Ambassadors".
- **Navigation:** Updated "Partner with Us" buttons to point to the new page.

## 6. How to Run
1.  **Frontend:** `npm run dev:client` (Port 5173)
2.  **Backend:** `npm run dev:server` (Port 5000)
3.  **Full Stack:** `npm run dev`

## 7. Future Roadmap (Implied)
- Complete Admin CRUD operations.
- Integrate livestreams or video galleries.
- Finalize mobile responsiveness for tabular data.
