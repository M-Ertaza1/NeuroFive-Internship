# FlowBoard — SaaS Landing Page

Week 1 task for the NeuroFive Solutions Full Stack Web Development internship:
a responsive, component-based landing page for a fictional project-management
SaaS product ("FlowBoard").

## Live demo
[Add your Vercel/Netlify URL here after deploying]

## Why React
I chose React because it lets the page be broken into small, reusable
components (`FeatureCard`, `PricingCard`) instead of repeating markup, and it's
the framework I'll likely be extending with a backend in later weeks of this
internship.

## Structure
```
src/
  components/
    Navbar.jsx       — sticky nav with mobile hamburger menu
    Hero.jsx         — headline + animated "flow line" showing a task moving
                        through To Do → In Progress → Done
    FeatureCard.jsx  — reusable card, used 3x in Features.jsx
    Features.jsx
    PricingCard.jsx  — reusable card, used 3x in Pricing.jsx
    Pricing.jsx
    Testimonial.jsx
    CTASection.jsx
    Footer.jsx
  App.jsx            — assembles all sections
  index.css          — Tailwind + the flow-line/flow-dot animation
tailwind.config.js    — design tokens (colors, fonts)
```

## Design system
- **Colors**: canvas `#F5F6F8`, ink `#1B1F3B`, amber `#FFB800` (CTA), teal `#0EA5A4` (accent)
- **Type**: Space Grotesk (display), Inter (body), IBM Plex Mono (labels/tags)
- **Signature element**: an animated dotted path with a moving dot behind the
  hero's task cards — a visual metaphor for the product's core idea (one task
  flowing through stages), not a stock hero layout

## Responsiveness
Tested at 375px (mobile), 768px (tablet), and 1440px (desktop). Nav collapses
to a hamburger menu below the `md` breakpoint; grids go from 1 → 2 → 3 columns.

## Running locally
```bash
npm install
npm run dev
```

## Deploying
```bash
npm run build
```
Then deploy the `dist/` folder via Vercel, Netlify, or GitHub Pages — or connect
the GitHub repo directly to Vercel for automatic deploys on push.
