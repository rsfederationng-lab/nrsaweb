# Design Guidelines: Nigeria Rope Skipping Association (NRSA) Website

## Design Approach

**Selected Approach:** Reference-based, drawing inspiration from professional sports federation websites (IJRU.sport, World Rope Skipping Federation) combined with modern SaaS dashboard patterns for the admin interface.

**Design Philosophy:** Create a credible, authoritative sports federation presence that balances professional gravitas with the dynamic energy of rope skipping as a competitive sport. The design must inspire confidence in stakeholders (athletes, clubs, sponsors) while remaining accessible to the general public.

## Color System
Deep blue (#003366) as primary accent with clean white backgrounds. Secondary blues for hierarchy, success greens for CTAs, and neutral grays for text.

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN) - for UI, body text, and admin dashboard
- Display: Poppins (via Google Fonts CDN) - for headlines and hero text

**Type Scale:**
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Titles: text-3xl md:text-4xl, font-bold
- Subsection Titles: text-2xl md:text-3xl, font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base leading-relaxed
- Small Text: text-sm
- Admin Dashboard Headers: text-2xl font-bold
- Admin Table Headers: text-xs font-semibold uppercase tracking-wide

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, and 24 (p-2, h-8, m-4, gap-6, py-12, px-16, space-y-24)

**Container Strategy:**
- Public pages: max-w-7xl mx-auto px-4 md:px-8
- Admin dashboard: Full-width layout with fixed sidebar
- Content sections: py-16 md:py-24 for vertical rhythm
- Card grids: gap-6 md:gap-8

## Public Website Components

### 1. Navigation Header
- Fixed top navigation with NRSA logo (left), menu links (center), "Admin Login" button (right)
- Transparent over hero, solid white background on scroll
- Mobile: Hamburger menu with slide-in drawer
- Links: Home, News, Events, Players, Clubs, Media, Contact

### 2. Hero Section (Homepage)
- Full-width image slider showcasing rope skipping action shots
- Overlay with semi-transparent dark gradient for text readability
- Centered content: Large headline, supporting tagline, dual CTAs (primary + secondary)
- Slider controls: Dots navigation (bottom) + arrow controls (sides)
- Height: min-h-[600px] md:min-h-[700px]
- **Images Required:** 3-5 high-quality rope skipping action photos (competitions, training, team celebrations)

### 3. Mission/Vision Section
- Two-column layout on desktop (mission left, vision right), stacked on mobile
- Each column: Icon/graphic, heading, descriptive paragraph
- Background: Subtle light gray or white
- Padding: py-20

### 4. Featured News Section
- Three-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Card design: Featured image (aspect-ratio-video), category badge, headline, excerpt, "Read More" link, date
- Hover effect: Subtle lift and shadow increase
- "View All News" button centered below

### 5. News Page
- Masonry-style grid or standard card grid
- Filters: Category tags (All, Events, Achievements, Updates)
- Each article card: Large featured image, title, date, excerpt, category badge
- Pagination: 9-12 articles per page

### 6. Events Page
- Dual-view option: Grid view + Calendar view (toggle)
- Event cards: Date badge (prominent), title, location icon + text, time, registration CTA
- Upcoming events prominently featured, past events in separate section
- Calendar integration displaying event dates from events.json

### 7. Players Directory
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Player cards: Profile photo (circular or square), name, NRSF ID badge, awards/medals icons
- Click to expand modal: Full bio, achievements list, competition history, photo gallery
- Filter/search: By name, club, achievement level

### 8. Clubs Section
- Card grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Club cards: Logo, name, location, contact button, "Registered" badge
- Hover: Scale slightly, shadow increase
- Registration status indicator (color-coded)

### 9. Media Gallery
- Masonry grid for photos (Pinterest-style)
- Video thumbnails with play icon overlays
- Lightbox modal for full-screen viewing
- Categories: Competition Photos, Training, Events, Promotional Videos
- Upload date and description on hover

### 10. Contact Page
- Two-column: Contact form (left 60%), contact information + map (right 40%)
- Form fields: Name, Email, Subject, Message
- Contact info: Email (rsfederationng@gmail.com), social links, office location
- Success/error toast notifications

### 11. Leaders/Executive Board
- Horizontal card layout for each leader
- Photo (left), name + title + bio (right)
- Alternating layout direction for visual interest
- Background: Alternating white/subtle gray sections

### 12. Footer
- Three-column layout: About NRSA (left), Quick Links (center), Contact & Social (right)
- Newsletter subscription form
- Copyright, privacy policy links
- Social media icons (Facebook, Twitter, Instagram, YouTube)

## Admin Dashboard Components

### Dashboard Layout Structure
- **Sidebar (Fixed Left):** 280px width, full-height, deep blue background
  - NRSA logo + "Admin Panel" text (top)
  - Navigation menu: Dashboard, Site Settings, Leaders, News, Events, Players, Clubs, Media, Contact Submissions
  - Logout button (bottom)
  - Active state: Lighter blue background, left border accent

- **Topbar:** Full-width, white background, border-bottom
  - Breadcrumb navigation (left)
  - Search bar (center)
  - Admin name + avatar dropdown (right)

- **Main Content Area:** Padding: p-8, background: light gray (#F9FAFB)

### Dashboard Home (Overview)
- Stats cards grid: 4 columns (Total News, Upcoming Events, Registered Players, Active Clubs)
- Each card: Large number, icon, label, change indicator (+/-)
- Recent activity feed (latest 5 additions/edits)
- Quick actions: "Add News", "Create Event", "Upload Media"

### CRUD Pages Layout (News, Events, Players, Clubs, Leaders)
- Page header: Title, "Add New [Item]" button (primary CTA, right-aligned)
- Data table: Striped rows, hover states, sortable columns
  - Columns: Thumbnail/Image, Title/Name, Date, Status, Actions (Edit/Delete icons)
  - Pagination controls (bottom)
  - Search/filter inputs (top-right)

### Form Modals (Add/Edit)
- Modal overlay: Semi-transparent dark background
- Modal content: max-w-2xl, white background, rounded corners, shadow-2xl
- Header: Title, close button (X)
- Form sections: Grouped fields with labels, Tailwind form styling
- Image upload: Drag-and-drop zone + browse button + URL input option
- Footer: Cancel (secondary) + Save (primary) buttons, aligned right

### Site Settings Page
- Tab navigation: General, Homepage, Contact, Social Media
- Form sections with clear headings
- Live preview option (split-view for certain settings)
- Save button: Sticky bottom-right

### Media Manager
- Grid view with thumbnail previews
- Upload area: Drag-and-drop (prominent), supports multiple files
- Each media item: Thumbnail, filename, upload date, file size, delete icon
- Filter: All, Images, Videos
- Bulk actions: Select multiple, delete selected

### Contact Submissions Page
- Table view: Sender name, email, subject, date, status (read/unread)
- Click row to expand: Full message, reply button
- Mark as read/unread toggle
- Delete option

## Icons
**Library:** Heroicons (via CDN)
- Navigation: Home, Calendar, Users, Trophy, Image, Mail icons
- Actions: Plus, Pencil, Trash, Eye, X icons
- Dashboard: Chart, Bell, Settings icons

## Images Strategy

### Public Website Images Required:
1. **Hero Slider (3-5 images):** Dynamic rope skipping action - competition jumps, synchronized team routines, athletes mid-air, podium celebrations
2. **Mission/Vision Section:** Inspirational team training photo or rope skipping silhouettes
3. **Leaders/Executive Board:** Professional headshots for each board member
4. **News Articles:** Featured images for each article (competitions, workshops, ceremonies)
5. **Events:** Event-specific photos (venue, past event highlights)
6. **Players:** Individual athlete photos (action shots or portraits)
7. **Clubs:** Club logos and group photos
8. **Media Gallery:** Competition photos, training sessions, promotional videos

### Admin Dashboard Images:
- NRSA logo (sidebar)
- Default avatar placeholders
- Upload preview thumbnails

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked layouts, hamburger menu)
- Tablet: 768px - 1024px (2-column grids, condensed spacing)
- Desktop: > 1024px (full multi-column layouts, expanded sidebar)

## Animation & Interactions
- Page transitions: Minimal, fast (200ms)
- Hover states: Subtle scale (1.02), shadow increase, slight color shift
- Loading states: Spinner overlays for data fetching
- Success/error toasts: Slide in from top-right, auto-dismiss after 4 seconds
- Modal animations: Fade in overlay, scale up content (300ms ease-out)
- Avoid: Excessive animations, parallax scrolling, complex scroll-triggered effects

## Accessibility
- WCAG 2.1 AA compliance
- Focus states: Visible outline on all interactive elements
- ARIA labels for icon-only buttons
- Keyboard navigation support throughout admin dashboard
- Alt text for all images
- Form validation with clear error messages