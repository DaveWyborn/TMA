# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 marketing website for Tailor Made Analytics - analytics consulting service offering Google Tag Manager, GA4, Looker Studio dashboards, and consent management.

Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase, Framer Motion

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Production server
npm run start

# Linting
npm run lint
```

## Architecture

### Next.js App Router Structure

**Marketing Site:**
- `/src/app/page.tsx` - Homepage assembling main sections (Hero, Promise, Testimonials, BuyNow, Footer)
- `/src/app/layout.tsx` - Root layout with Google Tag Manager via custom Tag Gateway (`tags.tailormadeanalytics.com`)
- `/src/app/api/buy-now/route.ts` - Single API route for form submissions with spam protection
- `/src/components/` - React components (NavBar, HeroSection, PromiseSection, Testimonials, BuyNow, BuyNowModal, etc.)
- `/src/lib/` - Server actions and utilities
- `/src/data/` - Static data (testimonials, etc.)

**SEO Tools Suite:**
- `/src/app/seo-tools/` - Landing page listing all tools
- `/src/app/meta-checker/` - Meta tags, Open Graph, Twitter Cards, technical SEO analysis
- `/src/app/keyword-analyser/` - Keyword density, placement, and competitor comparison
- `/src/app/page-speed/` - Google PageSpeed Insights integration (Core Web Vitals)
- `/src/app/robots-checker/` - Robots.txt and sitemap validation
- `/src/app/api/meta-checker/` - Cheerio-based HTML parsing for meta extraction
- `/src/app/api/keyword-analyser/` - Keyword analysis with density calculations
- `/src/app/api/page-speed/` - Google PageSpeed Insights API wrapper
- `/src/app/api/robots-checker/` - Robots.txt and sitemap fetching

### Key Patterns

**Form Submission Flow:**
1. Client component (`BuyNowModal.tsx`) collects form data
2. Calls server action (`handleFormSubmit.ts` in `/src/lib/`)
3. Server action performs spam checks and writes to Supabase table `tma_buy_now_leads`
4. For "call" type: redirects to Google Calendar booking link
5. For "contact" type: shows success message

**Spam Protection:**
- Honeypot field (`companyName`) - hidden from users
- Rate limiting: max 3 submissions per email per 24h
- Known spammer blocking based on `spam_status` field
- All checks in both API route and server action

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_GOOGLE_MEETING_LINK` - Calendar booking URL
- `NEXT_PUBLIC_BOOKING_NOTIFICATION_EMAIL` - Notification email

### Path Alias
Use `@/*` for imports from `src/*`:
```typescript
import Component from "@/components/Component";
import { handler } from "@/lib/handler";
```

### Styling
- Tailwind CSS 4 via PostCSS
- Global styles in `src/app/globals.css`
- CSS variables for theming (e.g., `var(--primary-color)`)

### SEO Tools Architecture

All tools follow consistent pattern:
1. Client-side form (`page.tsx`) collects input
2. API route (`route.js`) performs analysis using Cheerio/fetch/external APIs
3. Results displayed in tables/cards with visual indicators

**Tool-Specific Notes:**
- **Meta Checker**: Extracts 20+ fields including OG tags, Twitter Cards, technical SEO, H1 counts, alt text audit
- **Keyword Analyser**: Calculates density, checks URL/title/H1 placement, counts image alt usage
- **Page Speed**: Calls Google PageSpeed Insights API (optional `GOOGLE_PAGESPEED_API_KEY` env var for higher rate limits)
- **Robots Checker**: Parses robots.txt for sitemap URLs, validates sitemap accessibility

## Important Notes

- **GTM Setup**: Uses custom Tag Gateway domain, not standard GTM. Script in `layout.tsx:17-30`
- **Supabase**: All submissions go to `tma_buy_now_leads` table with spam detection
- **Type Safety**: Strict TypeScript enabled
- **No Tests**: No test framework currently configured
- **SEO Tools**: Not indexed, no auth required. Clients access via direct URLs. Tools are in beta
