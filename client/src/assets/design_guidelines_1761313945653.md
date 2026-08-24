# Nigeria Rope Skipping Federation (NRSF) Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from international sports federation websites (ijru.sport, ropeskippingsport.org) while incorporating strong Nigerian national identity. The design communicates legitimacy, professionalism, and athletic energy befitting an official governing body registered with Nigeria's Corporate Affairs Commission.

## Core Design Principles
- **Official & Legitimate**: Professional sports federation aesthetic with governmental formality
- **Energetic & Dynamic**: Reflecting the athletic, competitive nature of rope skipping
- **Nigerian Identity**: Strong national pride through color scheme and cultural elements
- **International Standard**: Matching the visual quality of global sports federations

## Color System
**Primary Colors**:
- Nigerian Green: #009739 (primary brand color for CTAs, accents, active states)
- White: #FFFFFF (backgrounds, text on dark, clean sections)
- Black: #000000 (text, footer background, contrast elements)

**Gradients**: Green-to-white gradients for section headers and decorative banners
**Accent Usage**: NRSF logo watermark at light opacity (10-15%) on section dividers

## Typography
**Font Families**: Poppins (primary) or Montserrat (alternative) via Google Fonts CDN

**Hierarchy**:
- Hero Headlines: Bold, 48-64px (desktop), 32-40px (mobile)
- Section Headers: Bold, 36-48px with gradient underlines
- Card Titles: Semi-bold, 20-24px
- Body Text: Regular, 16-18px with 1.6 line-height
- Navigation: Medium, 16px
- Footer: Regular, 14px

## Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Widths**:
- Full-width hero sections
- Content sections: max-w-7xl
- Text content: max-w-4xl

**Grid Patterns**:
- Event cards: 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Player profiles: 4-column grid → 2-column → 1-column
- Club directory: 3-column grid → 2-column → 1-column
- News cards: 3-column grid with featured first item spanning 2 columns

## Component Library

### Header & Navigation
- Sticky header with NRSF logo (left-aligned)
- Horizontal navigation menu with smooth hover underlines (green)
- Mobile: Hamburger menu with smooth slide-in overlay
- White background with subtle shadow on scroll

### Hero Section
Auto-rotating 4-slide carousel (5-second intervals):
- Full-width background images with dark overlay (40% opacity)
- Centered text overlays with white headlines and green CTA buttons
- Smooth fade or slide transitions between slides
- Navigation dots and prev/next arrows in white

**Slide Content**:
1. "Welcome to Nigeria Rope Skipping Federation – Empowering Athletes Nationwide"
2. "National Rope Skipping Championship – Where Champions Rise"
3. "Celebrating Nigeria's Rope Skipping Athletes"
4. "Join NRSF Today – Be Part of the Fastest-Growing Sport in Nigeria"

### Buttons
- Modern rounded corners (border-radius: 8px)
- Bold text (font-weight: 600)
- Primary: Green background (#009739) with white text
- Hover: Scale 1.05 transform with deeper green shadow
- When over images: Blurred background (backdrop-filter: blur(8px)) with green tint
- Padding: py-3 px-8
- No active state interactions on image overlays

### Cards
**Event Cards**: White background, subtle shadow, green top border accent, hover lift effect (translateY -4px)

**Player Profile Cards**: Photo at top, name, club, state, points display, gradient background on hover

**Club Cards**: Logo/icon, club name, city, manager name, contact button with green accent

**News Cards**: Featured image, date badge in green, title, excerpt, "Read More" link

### Sections
**Section Headers**: Green/white gradient banner backgrounds, white text, centered alignment, padding py-16

**About Preview**: Two-column layout with text left, image right, green "Learn More" button

**Upcoming Events**: Card grid with date prominently displayed in green circle badge

**Latest News**: Featured article layout with 1 large + 2 small cards

**Partner Logos**: Grayscale logos with color on hover, 4-6 per row

### Footer
- Dark background (#000000) with white text
- Nigerian flag icon integrated
- Four columns: About, Quick Links, Contact Info, Social Media
- Social icons in white with green hover state
- Copyright bar at bottom with federation registration details

### Forms
**Registration & Contact Forms**:
- Floating labels with green accent
- Input borders: light gray default, green on focus
- Rounded corners (8px)
- Validation messages in green (success) or red (error)
- Submit button: full-width on mobile, auto-width on desktop

### Media Gallery
- Masonry/grid layout with 3-4 columns
- Image hover: Scale 1.05 with shadow overlay
- Video embeds with play button overlay
- Lightbox modal for full-screen viewing
- Lazy-loading for performance

### Data Tables
**Discipline/Fixture Tables**: Striped rows, green header background, white text in headers, responsive horizontal scroll on mobile

## Animations & Interactions
**Page Load**: Fade-in sections on scroll (subtle, 0.3s duration)

**Buttons**: Ripple effect on click, scale on hover

**Cards**: Lift on hover (shadow increase + translateY)

**Slider**: Smooth fade transitions (1s duration) with crossfade

**Navigation**: Smooth scroll behavior, green underline slide-in on hover

**Gallery Images**: Zoom on hover with overlay fade-in

**Admin Panel**: Slide-in from right, backdrop blur overlay

## Responsive Breakpoints
- Mobile: < 768px (single column, hamburger menu, stacked layouts)
- Tablet: 768px - 1024px (2-column grids, adjusted spacing)
- Desktop: > 1024px (full layouts, multi-column grids)

## Images

**Hero Carousel (4 slides)**: High-energy action shots of rope skipping athletes in competition, training sessions, championship ceremonies, and team celebrations. Each image should be full-width, high-resolution (1920x1080+), with dynamic composition showing movement and athleticism.

**About Section**: Professional photo of federation leadership or Y-Court setup with three teams in action

**Event Cards**: Competition photos, venue shots, or graphic designs with event details

**Player Profiles**: Professional headshots or action shots with consistent cropping

**News Articles**: Relevant event photos, championship highlights, or athlete features

**Partner Logos**: Federation partners, sponsors, international affiliations (IJRU)

**Background Watermarks**: NRSF logo at 10-15% opacity on section dividers

**Favicon**: NRSF logo optimized for 32x32px

## Accessibility
- Semantic HTML5 structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Alt text on all images
- Sufficient color contrast (WCAG AA)
- Focus indicators in green

## Performance Optimization
- Lazy-loading for images and videos
- Optimized font loading with font-display: swap
- Minified CSS and JavaScript
- Compressed images (WebP format preferred)
- Modular JavaScript for feature separation