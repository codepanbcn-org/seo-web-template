# SEO Web Template

CodePan's starting point for marketing and business websites: a **Next.js 15 (App Router) + next-intl + Tailwind** site, deployed on **Cloudflare Workers** via OpenNext, with the SEO groundwork already in place.

The approach comes from the chikinmos.com migration (Vercel → Cloudflare). The goal is that a new project starts with correct SEO instead of fixing it after launch.

## What's included

| | Where |
|---|---|
| Per-page title, description, canonical, hreflang, Open Graph, Twitter tags | `lib/seo.ts` → `pageMetadata()` |
| Multilingual URLs: default language without prefix, others under `/en` etc. | `i18n/routing.ts` |
| `sitemap.xml` with hreflang alternates, generated from one list | `app/sitemap.ts`, `INDEXED_PATHS` in `lib/site.ts` |
| `robots.txt`; preview branches automatically blocked + `noindex` | `app/robots.ts`, `next.config.ts` |
| JSON-LD: Organization, WebSite, LocalBusiness/Restaurant, BreadcrumbList | `lib/structuredData.ts`, `components/JsonLd.tsx` |
| Real 404s (localized), never "soft 404" 200s | `app/[locale]/not-found.tsx`, `app/[locale]/[...rest]` |
| Web manifest, icon, default share image | `app/manifest.ts`, `app/icon.svg`, `public/og-default.png` |
| Permanent redirects for changed URLs | `next.config.ts` → `redirects()` |
| Cloudflare Workers deploy config + long-term caching of static assets | `wrangler.jsonc`, `open-next.config.ts`, `public/_headers` |
| Post-deploy SEO check (status codes, tags, JSON-LD, redirects) | `npm run seo:check -- <url>` |
| Rules for AI coding agents | `AGENTS.md` (`CLAUDE.md` points to it) |

Everything project-specific (domain, name, addresses, opening hours, social profiles) lives in **one file: `lib/site.ts`**.

## Start a new project

1. **Create the repo** from this template on GitHub ("Use this template", or fork), then:
   ```bash
   npm install
   npm run dev          # http://localhost:3000
   ```
2. **Make the decisions that are expensive to change later.** See [docs/SEO-CHECKLIST.md §0](docs/SEO-CHECKLIST.md#0-decide-before-writing-code):
   - **Domain:** www or not
   - **Languages:** and which one is the default
   - **URLs:** the list of pages
   - **Noindex pages:** which ones stay out of Google
3. **Fill every placeholder:**
   ```bash
   grep -rn "TODO(setup)" --exclude-dir=node_modules .
   ```
   The main ones:
   - **`lib/site.ts`:** `SITE_URL`, `SITE_NAME`, organization, businesses, `INDEXED_PATHS`
   - **`i18n/routing.ts`:** the locales (plus `OG_LOCALE` in `lib/seo.ts`)
   - **`messages/*.json`:** titles and descriptions for every page, in every language
   - **`wrangler.jsonc`:** the Worker name, in both places it appears
   - **Brand assets:** `app/icon.svg` and `public/og-default.png` (1200×630)
4. **Build the pages.** Follow [Adding a page](#adding-a-page).
5. **Deploy:** [docs/DEPLOY-CLOUDFLARE.md](docs/DEPLOY-CLOUDFLARE.md).
6. **After launch:** follow [docs/SEO-CHECKLIST.md §4](docs/SEO-CHECKLIST.md#4-after-launch) (Search Console, Bing, Google Business Profile).

Replacing an existing site? Read [docs/MIGRATION.md](docs/MIGRATION.md) **before** changing any URL.

## Adding a page

1. Copy `app/[locale]/about/page.tsx` to `app/[locale]/<new-path>/page.tsx` and set `PATH`.
2. Add its texts (`metaTitle`, `metaDescription`, content) to **every** `messages/*.json`.
3. Add the path to `INDEXED_PATHS` in `lib/site.ts`. Skip this if the page is `noindex`; in that case pass `noindex: true` to `pageMetadata`.
4. Link to it from the navigation or another page. Pages nothing links to are found late or never.
5. If it replaces an old URL, add a permanent redirect in `next.config.ts`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Next.js production build / server (quick local checks) |
| `npm run preview` | Build for Cloudflare and run it locally on the Workers runtime (`wrangler dev`) |
| `npm run deploy` | Build and deploy to Cloudflare from your machine. Usually Workers Builds deploys from Git instead |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run seo:check -- <url>` | SEO smoke test against a running site (local or live). Exits 1 on problems |
| `npm run cf-typegen` | Generate types for Cloudflare bindings |

## Project structure

```
app/
  [locale]/            pages (one folder per route); layout.tsx sets <html lang>
  robots.ts            /robots.txt
  sitemap.ts           /sitemap.xml
  manifest.ts          /manifest.webmanifest
  icon.svg             favicon
components/            JsonLd, SiteHeader, SiteFooter, LocaleSwitcher
i18n/                  next-intl routing, request config, locale-aware Link
lib/
  site.ts              ← project data: the file to fill in
  seo.ts               pageMetadata(), localizedUrl(), IS_INDEXABLE
  structuredData.ts    schema.org JSON-LD builders
messages/              translations, one JSON per locale
scripts/seo-check.mjs  post-deploy SEO smoke test
docs/                  checklist, Cloudflare deploy, site migration
```

## Docs

- [docs/SEO-CHECKLIST.md](docs/SEO-CHECKLIST.md): the full checklist, from decisions to code to post-launch.
- [docs/DEPLOY-CLOUDFLARE.md](docs/DEPLOY-CLOUDFLARE.md): Workers Builds, domains, DNS, redirect rules.
- [docs/MIGRATION.md](docs/MIGRATION.md): replacing an existing site without losing rankings.
- [AGENTS.md](AGENTS.md): conventions for humans and AI agents working in the code.
·