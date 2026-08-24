# Nigeria Rope Skipping Association (NRSA) Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from international sports federation websites (ijru.sport, ropeskippingsport.org) while incorporating strong Nigerian national identity. The design communicates legitimacy, professionalism, and athletic energy befitting an official governing body registered with Nigeria's Corporate Affairs Commission.

## Core Design Principles
- **Official & Legitimate**: Professional sports federation aesthetic with governmental formality
- **Energetic & Dynamic**: Reflecting the athletic, competitive nature of rope skipping
- **Nigerian Identity**: Strong national pride through color scheme and cultural elements
- **International Standard**: Matching the visual quality of global sports federations

## Color System
**Primary Colors**:
- Nigerian Green: #009739 (primary brand, CTAs, accents, active states)
- White: #FFFFFF (backgrounds, text on dark sections)
- Black: #000000 (text, footer background, contrast elements)

**Gradients**: Green-to-white gradients for section headers and decorative banners
**Accent Usage**: NRSA logo watermark at 10-15% opacity on section dividers

## Typography
**Font Families**: Poppins (primary) or Montserrat (alternative) via Google Fonts CDN

**Hierarchy**:
- Hero Headlines: Bold, 48-64px (desktop), 32-40px (mobile)
- Section Headers: Bold, 36-48px with gradient underlines
- Card Titles: Semi-bold, 20-24px
- Body Text: Regular, 16-18px, line-height 1.6
- Navigation: Medium, 16px
- Footer: Regular, 14px

## Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Widths**:
- Full-width hero sections
- Content sections: max-w-7xl
- Text content: max-w-4xl

**Grid Patterns**:
- Event cards: 3-column (desktop) → 2-column (tablet) → 1-column (mobile)
- Player profiles: 4-column → 2-column → 1-column
- Club directory: 3-column → 2-column → 1-column
- News cards: 3-column grid with featured first item spanning 2 columns

## Component Library

### Header & Navigation
- **Logo Positioning**: Left-aligned, height 48-56px (desktop), 40px (mobile), vertical center alignment with 16px padding, maintain aspect ratio
- Sticky header with subtle shadow on scroll
- Horizontal navigation menu with smooth green hover underlines
- Mobile: Hamburger menu with slide-in overlay
- White background with Nigerian flag icon integrated subtly

### Hero Section
Full-width auto-rotating 4-slide carousel (5-second intervals):
- High-energy action shots of rope skipping athletes in competition
- Dark overlay (40% opacity) over images
- Centered white headlines with green CTA buttons
- Smooth fade transitions
- Navigation dots and prev/next arrows in white
- CTA buttons: Blurred background (backdrop-filter: blur(8px)) with green tint

**Slide Content**:
1. "Welcome to Nigeria Rope Skipping Association – Empowering Athletes Nationwide"
2. "National Rope Skipping Championship – Where Champions Rise"
3. "Celebrating Nigeria's Rope Skipping Athletes"
4. "Join NRSA Today – Be Part of the Fastest-Growing Sport in Nigeria"

### Buttons
- Rounded corners (8px border-radius)
- Bold text (font-weight: 600)
- Primary: Green background (#009739), white text
- Hover: Scale 1.05 with deeper green shadow
- Over images: Blurred background with green tint, no hover/active states
- Padding: py-3 px-8

### Cards
**Event/News Cards**: 
- White background, subtle shadow
- Green top border accent (3px)
- Hover: Lift effect (translateY -4px, increased shadow)
- "Learn More" button at bottom
- Date badge in green circle

**Player Profile Cards**: 
- Photo at top, name, club, state, points
- Gradient background on hover

**Club Cards**: 
- Logo/icon, club name, city, manager, contact button

### Expandable Content
**"Learn More" Functionality**:
- Clicking "Learn More" on news/events opens modal overlay OR navigates to detail page
- Modal: Full-screen on mobile, centered card (max-w-4xl) on desktop
- Detail View: Full article/event content with images, metadata, and related items
- Smooth transition animations (fade-in 0.3s)
- Close button (X) in top-right corner
- Backdrop blur effect on modal overlay

### Sections
**Section Headers**: Green/white gradient banners, white text, centered, py-16

**About Preview**: Two-column layout (text left, image right), green "Learn More" button opens full About page

**Upcoming Events**: Card grid with prominent date badges, "View Details" expands to full event info

**Latest News**: Featured article layout (1 large + 2 small), each with "Read Full Article" button

**Partner Logos**: Grayscale logos with color on hover, 4-6 per row

### Footer
- Black background (#000000), white text
- Nigerian flag icon integrated
- Four columns: About, Quick Links, Contact Info, Social Media
- Social icons in white with green hover state
- Copyright bar with NRSA registration details

### Forms
- Floating labels with green accent
- Light gray borders (default), green on focus
- Rounded corners (8px)
- Validation messages: green (success), red (error)
- Submit button: Full-width (mobile), auto-width (desktop)

### Admin Dashboard
- Sidebar navigation with sections: Dashboard, News, Events, Clubs, Players, Media
- Topbar: "Welcome Admin" greeting, Logout button
- Data tables: Striped rows, green headers, responsive horizontal scroll
- Modal forms for Add/Edit with green primary buttons
- Toast notifications for success/error states

## Images

**Hero Carousel (4 slides)**: High-energy rope skipping action shots - competitions, training, championships, team celebrations. Full-width, 1920x1080+, dynamic composition showing movement.

**About Section**: Federation leadership or Y-Court setup with three teams in action

**Event Cards**: Competition photos, venue shots, event graphics

**Player Profiles**: Professional headshots or action shots, consistent cropping

**News Articles**: Event photos, championship highlights, athlete features

**Partner Logos**: Federation partners, sponsors, IJRU

**Background Watermarks**: NRSA logo at 10-15% opacity on section dividers

## Animations
- Page Load: Fade-in sections on scroll (0.3s)
- Buttons: Ripple effect on click, scale on hover
- Cards: Lift on hover (shadow increase + translateY)
- Slider: Smooth fade transitions (1s) with crossfade
- Navigation: Smooth scroll, green underline slide-in
- Gallery: Zoom on hover with overlay fade-in
- Modals: Fade-in with backdrop blur

## Responsive Breakpoints
- Mobile: < 768px (single column, hamburger menu, stacked)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full multi-column layouts)