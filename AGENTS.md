# AGENTS.md

Instructions for AI coding agents (and humans) working in this repository. Read [README.md](README.md) for the overview.

## Stack

- Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS 3.
- next-intl 4 with `localePrefix: "as-needed"`: the default locale has no URL prefix, the others do (`/en/...`).
- Deployed to Cloudflare Workers through `@opennextjs/cloudflare`. There is **no** Next.js image optimisation (`images.unoptimized: true`); images must be pre-optimised.

## Commands

```bash
npm run dev                      # dev server
npm run typecheck && npm run lint
npm run build                    # must pass before any commit
npm run preview                  # run on the Workers runtime locally
npm run seo:check -- http://localhost:8787   # SEO smoke test against a running build
```

## SEO rules (non-negotiable)

These rules protect search rankings. A change that breaks one of them is a bug, even if the page looks fine.

1. **Every `page.tsx` exports `generateMetadata` returning `pageMetadata({...})`** from `lib/seo.ts`. Never hand-write `alternates`, `openGraph` or `robots` in a page. Next replaces `openGraph` wholesale, so partial objects lose fields.
2. **Never hard-code the domain.** Use `SITE_URL` from `lib/site.ts`, and `localizedUrl(locale, path)` for absolute URLs. Do not move `SITE_URL` to an env variable: when an env variable is missing at build time, the sitemap ends up with URLs like `undefined/...` (this happened on a real project).
3. **Indexable pages are listed in `INDEXED_PATHS`** (`lib/site.ts`); the sitemap is built from it. `noindex` pages (`pageMetadata({ noindex: true })`) must not be in it.
4. **Changing or removing a URL requires a permanent redirect** in `next.config.ts` → `redirects()`. Never delete existing redirects.
5. **One `<h1>` per page.** Headings don't skip levels.
6. **Links use `Link` from `@/i18n/navigation`** (real `<a href>`; adds the locale prefix). No `onClick` navigation, no `next/link` directly.
7. **Content is server-rendered.** Text that matters for search must be in the HTML returned by the server: no fetching it client-side, and not only in images or PDFs. Add `"use client"` only to components that need interactivity.
8. **Structured data goes through `lib/structuredData.ts` + `<JsonLd />`**, and must match what's visible on the page. Business facts (address, phone, hours) come from `lib/site.ts`, the same source the UI uses.
9. **Every text exists in every `messages/*.json`**, including `metaTitle` / `metaDescription`. Titles ~50–60 chars, descriptions ~120–160 chars, unique per page.
10. **Images:**
    - descriptive `alt` (`alt=""` for decorative images)
    - explicit `width`/`height`, or `fill` + `sizes`
    - `priority` on the main above-the-fold image
    - pre-compressed webp/avif, ideally < 300 KB
11. **Unknown URLs must return 404**, never a 200 page saying "not found". Use `notFound()`.
12. **Don't touch the preview-build guard** (`SEO_INDEXABLE` in `next.config.ts`, `IS_INDEXABLE` in `lib/seo.ts`) unless asked. It keeps preview deployments out of Google.

## Conventions

- Project-specific data belongs in `lib/site.ts`, not inline in components.
- Comments explain *why* (a client request, an SEO reason, a platform limit), not what the code does.
- Keep `docs/` in sync when changing behaviour described there.

## Before finishing a task

- [ ] `npm run typecheck`, `npm run lint` and `npm run build` pass
- [ ] New or changed pages follow "Adding a page" in README.md
- [ ] For SEO-relevant changes: `npm start` and `npm run seo:check -- http://localhost:3000` pass
