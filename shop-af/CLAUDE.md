# AlleyLink Project Context

## Overview
AlleyLink is an affiliate marketing storefront platform. Users create personalized storefronts to showcase and share affiliate products. Built as a React SPA deployed to SiteGround Apache hosting with Supabase BaaS.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v3 + shadcn/ui components + Lucide React icons
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions, Storage, RLS)
- **Payments**: Stripe (via Supabase Edge Functions)
- **Package Manager**: pnpm
- **Deployment**: Static build → SCP to SiteGround Apache

## Repository
- **Local path**: `C:\Users\thriv\Documents\alleylink\shop-af\`
- **Remote**: `https://github.com/YellowjacketXVI/alleylink` branch `main`
- **Build command**: `pnpm run build` (runs `tsc -b && vite build`)
- **Dev command**: `pnpm run dev`

## Deployment (SiteGround)
- **SSH host alias**: `siteground-alleylink`
  - HostName: `ssh.alleylink.com`, Port: `18765`
  - User: `u1744-itgmyggoebhc`
  - IdentityFile: `C:\Users\thriv\.ssh\siteground_alleylink` (ed25519)
- **Document root**: `www/alleylink.com/public_html/`
- **Deploy process**:
  1. `pnpm run build` (creates `dist/`)
  2. SCP `dist/*` to server: `scp -r dist/* siteground-alleylink:www/alleylink.com/public_html/`
  3. Server has `.htaccess` for SPA routing, security headers, caching
  4. Server also has `robots.txt`, `sitemap.xml`, `sitetitle.png` (OG image)
- **Important**: Do NOT overwrite `.htaccess`, `robots.txt`, `sitemap.xml`, or `sitetitle.png` during deploy — those are server-only files managed separately.

## Supabase
- **Project ref**: `eyafgfuxvarbpkhjkuxq`
- **API URL**: `https://eyafgfuxvarbpkhjkuxq.supabase.co`
- **Env files**: `.env` (local dev), `.env.production` (prod keys), `supabase/.env` (CLI tokens)
- **Edge Functions**: `create-subscription`, `customer-portal`, `stripe-webhook`, `track-click`
- **Migrations**: Run via Supabase Management API (not CLI):
  ```bash
  curl --ssl-no-revoke -X POST \
    "https://api.supabase.com/v1/projects/eyafgfuxvarbpkhjkuxq/database/query" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"query": "SQL_HERE"}'
  ```
- **Personal access token**: stored in `supabase/.env` as `SUPABASE_ACCESS_TOKEN`

## Project Structure

```
shop-af/
├── public/                    # Static assets (copied to dist root)
│   ├── .htaccess              # Apache SPA routing + security headers
│   ├── _redirects             # Netlify redirects (unused, SiteGround deploy)
│   ├── sitetitle.png          # OG image / favicon
│   └── *.png                  # Landing page marketing images
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Router + lazy-loaded page routes
│   ├── index.css              # Tailwind base + custom CSS vars
│   ├── components/
│   │   ├── Navbar.tsx         # Top nav (active link highlighting via useLocation)
│   │   ├── ProductForm.tsx    # Add/edit product modal (bg_color picker)
│   │   ├── ProductGrid.tsx    # Product card grid (bg_color + aspect-square)
│   │   ├── ProfileCustomization.tsx  # Storefront customizer (3 tabs: Material/Title/Background)
│   │   ├── ProfileSettings.tsx       # Username, display name, bio, avatar
│   │   ├── SubscriptionManager.tsx   # Plan status + Stripe portal
│   │   ├── AuthRedirect.tsx   # OAuth callback handler
│   │   ├── ErrorBoundary.tsx  # React error boundary
│   │   ├── LoadingSpinner.tsx # Reusable spinner
│   │   ├── MetaProvider.tsx   # Per-route SEO meta tags
│   │   ├── ProtectedRoute.tsx # Auth guard wrapper
│   │   └── Toast.tsx          # Toast notification component
│   ├── context/
│   │   ├── AuthContext.tsx     # Auth provider (user, profile, signUp/signIn/signOut)
│   │   └── ErrorContext.tsx    # Global error handler
│   ├── hooks/
│   │   ├── useProducts.ts     # CRUD for products table
│   │   ├── useAnalytics.ts    # Click analytics queries
│   │   ├── useSubscription.ts # Stripe subscription management
│   │   ├── useImageUpload.ts  # Supabase storage image upload
│   │   ├── useOptimizedAnalytics.ts  # Optimized analytics hook
│   │   └── use-mobile.tsx     # shadcn mobile detection hook
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client + types + PLAN_LIMITS (dev)
│   │   ├── supabase.prod.ts   # Supabase client + types (prod keys)
│   │   ├── stripe.ts          # Stripe client init
│   │   ├── utils.ts           # cn() helper, username validation
│   │   └── utils.test.ts      # Utils tests
│   └── pages/
│       ├── LandingPage.tsx    # Marketing homepage
│       ├── LoginPage.tsx      # Email/username + password login
│       ├── SignUpPage.tsx     # Registration form
│       ├── DashboardPage.tsx  # 5-tab dashboard (Products/Analytics/Customization/Profile/Subscription)
│       ├── ProfilePage.tsx    # Public storefront (/u/:username)
│       ├── PricingPage.tsx    # Plan comparison + upgrade CTAs
│       ├── CreateProfilePage.tsx  # First-time profile setup
│       ├── AdminPage.tsx      # Admin panel
│       ├── HelpCenterPage.tsx # FAQ + suggestion box + bug report
│       ├── TermsPage.tsx      # Terms of Service
│       ├── TestPage.tsx       # Dev testing page
│       └── NotFoundPage.tsx   # 404 page
├── database/migrations/       # SQL migration files
│   ├── add_feedback_table.sql       # feedback table + RLS
│   ├── add_product_bg_color.sql     # bg_color column on products
│   ├── combined_migration.sql       # Both above combined
│   ├── add_analytics_tables.sql
│   ├── add_card_styling.sql
│   ├── add_display_name_customization.sql
│   ├── add_glass_styling.sql
│   ├── add_stripe_fields.sql
│   ├── complete_schema_fix.sql
│   ├── create_increment_click_count_function.sql
│   ├── optimize_analytics_performance.sql
│   └── update_font_constraint.sql
├── supabase/
│   ├── .env                   # Access tokens (gitignored)
│   └── functions/             # Supabase Edge Functions
│       ├── create-subscription/index.ts
│       ├── customer-portal/index.ts
│       ├── stripe-webhook/index.ts
│       └── track-click/index.ts
├── docs/
│   └── customization-ui-redesign.md  # Accordion redesign plan
├── deploy.sh                  # Build verification script
├── package.json               # pnpm project config
├── vite.config.ts             # Vite config
├── tailwind.config.js         # Tailwind config
├── tsconfig.json              # TypeScript config
└── .gitignore                 # Ignores .env*, node_modules, dist, supabase/.env
```

## Subscription Tiers
| Plan | Price | Products | Analytics |
|------|-------|----------|-----------|
| Free | $0 | 9 | No |
| Basic | $2.99/mo | 100 | Yes |
| Pro | $4.99/mo | Unlimited | Yes |

## Dashboard Tabs (5 tabs, matching deployed)
1. **Products** (Package icon) — Product CRUD, category filter dropdown
2. **Analytics** (TrendingUp icon) — Click tracking, product performance (paid plans)
3. **Customization** (Palette icon) — ProfileCustomization component (3 sub-tabs: Material/Title/Background)
4. **Profile** (User icon) — ProfileSettings component (username, display name, bio, avatar)
5. **Subscription** (CreditCard icon) — SubscriptionManager component (plan status, Stripe portal)

Mobile: Dashboard tabs render as a dropdown selector (< 768px breakpoint).

## Profile Customization Settings (13 total)
| Setting | DB Column | Visual Layer |
|---------|-----------|-------------|
| Background type | background_type | Page Background (Layer 0) |
| Background image | background_image | Page Background |
| Background color | background_color | Page Background |
| Gradient type | background_gradient_type | Page Background |
| Gradient direction | background_gradient_direction | Page Background |
| Glass mode | glass_mode | Header Card (Layer 2) |
| Glass tint | glass_tint | Header Card |
| Display name font | display_name_font | Header Card |
| Display name color | display_name_color | Header Card |
| Card style | card_style | Product Cards (Layer 3+4) |
| Card color | card_color | Product Cards |
| Card text color | card_text_color | Product Cards + Bio text |
| Button color | primary_color | Product Cards |

## Key Database Tables
- **profiles** — User profiles with all customization columns
- **products** — Affiliate products (title, url, image, bg_color, category_tags, is_featured)
- **product_clicks** — Click analytics tracking
- **feedback** — Suggestion box + bug reports from Help Center

## Important Notes
- `.env.production` is gitignored — contains real Supabase anon key
- `supabase/.env` is gitignored — contains personal access token + service role key
- The app uses `supabase.ts` for dev and `supabase.prod.ts` for production (configured in vite.config.ts resolve aliases)
- Google Fonts: ProfilePage loads only the single font the profile uses (optimized from loading all 70+)
- ProfileCustomization still loads all fonts for the font picker preview
- All console.logs have been removed except error-level warnings in useSubscription
- Contact email: support@alleylink.com
