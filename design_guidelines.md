# Nigeria Rope Skipping Association (NRSA) Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from international sports federation websites (IJRU.sport, World Rope Skipping Federation) while incorporating strong Nigerian national identity. The design communicates official legitimacy, professionalism, and athletic energy befitting an official governing body.

## Core Design Principles
- **Official & Authoritative**: Professional sports federation aesthetic with governmental formality
- **Energetic & Dynamic**: Reflecting the competitive, athletic nature of rope skipping
- **Nigerian Pride**: Strong national identity through Nigerian flag color scheme
- **International Standard**: Matching visual quality of global sports federations

## Color System
**Primary Colors**:
- Nigerian Green: #009739 (primary brand, CTAs, accents, active states, headers)
- White: #FFFFFF (backgrounds, text on dark sections, clean spaces)
- Red: #E91E63 (accent color for important CTAs, alerts, featured badges)
- Black: #000000 (text, footer background, high contrast elements)

**Usage Guidelines**:
- Green for primary buttons, navigation active states, section headers, and brand elements
- White for backgrounds and primary content areas
- Red sparingly for "Featured" badges, urgent CTAs, and emphasis
- Gradients: Green-to-white for section dividers and decorative banners
- NRSA logo watermark at 10-15% opacity on section backgrounds

## Typography
**Font Families**: Poppins (primary) via Google Fonts CDN

**Hierarchy**:
- Hero Headlines: Bold, 56-72px (desktop), 36-48px (mobile)
- Section Headers: Bold, 42-52px with green underline accents
- Subsection Titles: Semi-bold, 28-36px
- Card Titles: Semi-bold, 22-26px
- Body Text: Regular, 16-18px, line-height 1.7
- Navigation: Medium, 16-17px
- Admin Dashboard: Semi-bold, 18-24px for headers
- Footer Text: Regular, 14-15px

## Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32 for consistent vertical rhythm

**Container Strategy**:
- Full-width hero carousel and section headers
- Content sections: max-w-7xl mx-auto px-6 md:px-12
- Text-heavy content: max-w-4xl for optimal readability
- Admin dashboard: Full-width with fixed sidebar navigation

**Grid Patterns**:
- News cards: 3-column (desktop) → 2-column (tablet) → 1-column (mobile)
- Event cards: 3-column with featured event spanning 2 columns
- Player profiles: 4-column → 3-column → 2-column → 1-column
- Club directory: 3-column → 2-column → 1-column
- Affiliation logos: 4-6 per row, centered

## Component Library

### Header & Navigation
- NRSA logo left-aligned (height 52-60px desktop, 44px mobile), maintains aspect ratio
- Sticky header with white background, subtle shadow on scroll
- Horizontal navigation: Home, About, News, Events, Players, Clubs, Media, Contact
- Green hover underline animation (slide-in from left, 3px height)
- Phone number displayed in header top bar: +2347069465965
- Mobile: Hamburger menu with slide-in overlay (green background)

### Hero Carousel
Auto-rotating 5-second interval carousel with 11 provided competition photos:
- Full-width images (1920x1080+) with 35% dark overlay for text readability
- Centered white headlines with bold typography
- Green CTA buttons with blurred background (backdrop-filter: blur(10px), green tint)
- No hover/active states on image-overlay buttons
- Navigation: White dots (bottom center), prev/next arrows (sides)
- Smooth crossfade transitions (1s duration)

**Slide Headlines**:
1. "Welcome to Nigeria Rope Skipping Association - Official Governing Body"
2. "Join NRSA Today - Be Part of Nigeria's Fastest-Growing Sport"
3. "National Rope Skipping Championships - Where Champions Are Made"
4. "Excellence in Rope Skipping - Training the Next Generation"
5. "Affiliated with IJRU & IRSO - International Standards, Nigerian Excellence"

### About the Federation Section
**Two-column layout** (text 60%, affiliations/image 40%):
- Mission statement with green heading
- Vision statement with green heading  
- Brief history of NRSA establishment
- Organizational structure overview
- IJRU and IRSO affiliation logos displayed prominently with links
- "Learn More" button in green opening full About page

### Affiliation Display
- IJRU (International Jump Rope Union) logo with link to ijru.sport
- IRSO logo with descriptive text
- Grayscale logos with color on hover
- Brief affiliation descriptions beneath each logo
- "Proud Member" badge in green

### Buttons
- Rounded corners (8px border-radius)
- Bold text (font-weight: 600)
- Primary: Green background (#009739), white text, shadow
- Hover: Scale 1.05, deeper green shade, increased shadow
- Over images: Blurred green-tinted background, no hover scale
- Padding: py-3 px-8 (desktop), py-2.5 px-6 (mobile)

### Cards
**News Cards**: White background, 3px green top border, featured badge in red, date in green circle, hover lift (translateY -5px, shadow increase)

**Event Cards**: White background, prominent date badge (green circle), venue icon, "Register" button in green, time/location details

**Player Profile Cards**: Circular photo, name, club, state, total points, gradient green overlay on hover

**Club Cards**: Logo/icon top, club name, city, manager, contact button (green), registration status badge

### Footer
- Black background (#000000), white text
- NRSA logo (left), integrated Nigerian flag icon
- Four columns: About NRSA, Quick Links, Contact Info (+2347069465965), Social Media
- IJRU & IRSO affiliation logos in footer
- Social icons: White with green hover state
- Copyright with CAC registration details
- Newsletter subscription form with green submit button

### Admin Dashboard
**Layout**: Fixed left sidebar (280px), full-height, green background (#009739)
- NRSA logo + "Admin Panel" text (white)
- Navigation sections: Dashboard, Site Settings, Homepage Editor, News, Events, Players, Clubs, Leaders, Media, Affiliations, Contact Submissions
- Active state: lighter green background, left border accent (white 3px)
- Logout button (bottom, white text with red background)

**Topbar**: White background, breadcrumb navigation (left), admin avatar (right)

**Main Content**: Light gray background (#F9FAFB), padding p-8
- Data tables: White background, green headers, striped rows, sortable columns
- CRUD modals: Centered card (max-w-3xl), white background, green primary buttons
- Rich text editor for content creation
- Image upload: Drag-and-drop zone + URL input + browse button
- Toast notifications: Green (success), Red (error)

### Forms
- Floating labels with green accent on focus
- Input borders: Light gray default, green on focus (2px)
- Rounded corners (6px)
- Validation: Green checkmark (success), red error messages
- Submit button: Full-width mobile, auto-width desktop
- Contact form displays phone number: +2347069465965

## Images

**Hero Carousel (11 slides)**: Provided competition photos showing rope skipping athletes, award ceremonies, team celebrations, championship events. Full-width, dynamic composition.

**About Section**: NRSA leadership team or federation overview image

**News Articles**: Competition highlights, championship photos, athlete features

**Events**: Venue shots, past competition photos, promotional graphics

**Players**: Professional action shots or headshots, consistent cropping

**Clubs**: Club logos and team photos

**Affiliations**: IJRU and IRSO official logos

**Media Gallery**: Competition photos, training sessions, championship coverage

**Background Watermarks**: NRSA logo at 12% opacity on section dividers

## Animations
- Page sections: Fade-in on scroll (0.3s)
- Buttons: Ripple effect on click, scale 1.05 on hover
- Cards: Lift effect (translateY -5px, shadow increase)
- Carousel: Smooth crossfade (1s)
- Navigation: Green underline slide-in (0.25s)
- Modals: Fade-in with backdrop blur
- Gallery images: Zoom on hover with overlay

## Responsive Breakpoints
- Mobile: < 768px (single column, hamburger menu, stacked)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full layouts, multi-column)

## Icons
**Library**: Lucide React icons
- Navigation: Home, Calendar, Users, Trophy, Image, Mail
- Actions: Plus, Edit, Trash, Eye, X, Check
- Dashboard: BarChart, Settings, Upload, Download