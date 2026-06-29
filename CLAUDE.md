# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Public website for **RUCB** (Reims Union Club Basket), a French basketball club. Next.js 13 + TypeScript app using the **Pages Router** (`pages/`), not the App Router. Most UI text and domain vocabulary is in French. There is no test suite.

A 2026 redesign ("refonte") restyled the whole site (violet `#3d1e7b` + orange `#dc8d32` charter, Oswald/Manrope fonts) and **migrated the dynamic content from Sanity to Supabase**. The original design handoff lives in `design_handoff_refonte_site 4/` (reference only — excluded from the build via `tsconfig.json`).

## Commands

```bash
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build (also type-checks)
npm start       # serve the production build
npm run lint    # next lint (eslint-config-next, config in .eslintrc.json)
```

## Environment

Supabase config lives in `.env.local` (untracked); legacy Sanity/Auth0 config lives in `.env`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase (planning, actus, comité, partenaires + admin). `lib/supabaseClient.ts` falls back to placeholders so the build never crashes when these are unset; real data needs the real keys.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity (still used by the legacy pages below; dataset hardcoded to `production` in `src/client.ts`).
- `AUTH0_*` — legacy Auth0 OAuth routes, now **orphaned** (admin auth moved to Supabase; the `pages/api/auth/*` routes remain but nothing links to them).

## Architecture

Content comes from **two backends**; the redesign moved the core content to Supabase and left the rest on Sanity.

### 1. Supabase (primary — planning, actus, comité, partenaires, admin)
Public pages read **client-side in `useEffect`** through the shared client `lib/supabaseClient.ts`. RLS gives public `select` on all tables and restricts writes to authenticated users; the `anon` key is safe in the browser.
- Tables: `gymnase`, `creneau` (planning) · `actu` (actualités) · `partenaire`, `comite`. SQL to provision them is in `supabase/01_…`, `02_…`, `03_…` (run in order in the Supabase SQL Editor).
- Storage buckets (public): `actus`, `partenaires`, `comite` — image uploads from the admin.
- Pages: `pages/planning.tsx`, `pages/actus/index.tsx`, `pages/actus/[slug].tsx` (queries by `slug`), `pages/qui/comite.tsx`, and partner logos on `pages/partenaires/info.tsx`. Each falls back gracefully (placeholder copy or bundled `/public/sponsors` logos) when Supabase is empty/unconfigured.
- **Admin** `pages/admin/index.tsx`: single page, Supabase-Auth login + left-nav sections (Planning · Actualités · Partenaires · Comité), full CRUD incl. image upload. Create the admin user in Supabase → Authentication → Users.

### 2. Sanity CMS (legacy — not yet migrated)
Still GROQ-fetched client-side via `src/client.ts` + `urlFor()` (`src/fonctions/urlImageSanity.ts`): `pages/qui/historique.tsx` (`historiqueRucb`), `pages/qui/entraineurs.tsx` (`entraineurs`), `pages/formation.tsx` (`formations`), `pages/partenaires/mecenat.tsx` (`mecenat`). `pages/qui/complexe.tsx` is static. Sanity deps stay installed until these are migrated too.

### API routes
- `pages/api/loadFFBB.ts` — fetches the FFBB RSS feed (`ffbb.com/rss2.xml`), **ISO-8859-1 encoded** (decoded explicitly), hand-parsed into `{title, link, description}`. Used by the homepage "Actu FFBB" card. **Kept as-is** by the migration.
- `pages/api/sitemap.js` — sitemap from a **hardcoded URL list** (add new public pages here manually).
- `pages/api/auth/*` — legacy Auth0 flow, now unused (see Environment).

## UI conventions

- The redesign is driven by `styles/globals.css`: it keeps the **existing class/id names** (`#badge`, `.divHoraires`, `.boxX`, `.NavBar`, `.footer`…) so the reskin applies without JSX changes, then adds a "AJOUTS REFONTE" block for new structural classes (`.navBrand`, `.navLinks`, `.navCta`, `.footerGrid`, `.newsCard`, `.sponsorTile`, `.instaTile`…). Fonts (Oswald/Manrope) load via `@import` at the top of the file.
- `components/Layout.tsx` (`Header` + `NavBar` + children + `Footer`) wraps every page. `components/PageHeader.tsx` renders the gradient page-title band used on internal pages.
- The homepage `pages/index.tsx` is a full custom layout (Hero → Valeurs → Actualités → 3 info cards → Instagram → Sponsors → CTA) with mostly **inline styles** matching the mockup; the section components from the old homepage were deleted.
- Mixed component libs: **react-bootstrap** (NavBar, Container; `_app.tsx` wraps the app in `<SSRProvider>`) and **MUI** with Emotion, on the legacy pages.
- Internal navigation uses `next/link`; `<img>` is used throughout (the `no-img-element` lint warnings are intentionally left).
- The NavBar keeps the sticky-on-scroll behavior (`fix` state → `.NavBar.fixed`) and the react-bootstrap mobile `Toggle`/`Collapse`.

## Caveats

- TypeScript is `strict` but `any` is pervasive (Supabase/Sanity responses, props). Don't assume types are meaningful. TypeScript is pinned to `4.9.5` (≥4.7 is required to read Supabase's `.d.cts` types).
- Adding a public route also means updating `pages/api/sitemap.js` and, for nav, `components/NavBar.tsx` (+ `components/Footer.tsx`).
- Supabase is provisioned **manually in the dashboard** (project, the 3 SQL scripts, 3 public buckets, an admin user). Until then the dynamic pages show fallback/empty states but the site builds and renders.
