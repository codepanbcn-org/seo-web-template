import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./site";

// false on preview builds (see next.config.ts). Value inlined at build time.
export const IS_INDEXABLE = process.env.SEO_INDEXABLE !== "false";

/**
 * Absolute public URL of a path in a locale. `path` has no locale prefix:
 * "" for the home page, "/about", etc. With localePrefix "as-needed" the
 * default locale has no prefix.
 */
export function localizedUrl(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

/** hreflang map for a path: one entry per locale plus x-default. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((locale) => [locale, localizedUrl(locale, path)])),
    "x-default": localizedUrl(routing.defaultLocale, path),
  };
}

// TODO(setup): one entry per locale in i18n/routing.ts.
const OG_LOCALE: Record<Locale, string> = { es: "es_ES", en: "en_GB" };

export interface PageMetadataInput {
  locale: string;
  /** Path without locale prefix: "" (home), "/about"... */
  path: string;
  /** ~50-60 characters, unique per page, most important words first. */
  title: string;
  /** ~120-160 characters, unique per page. */
  description?: string;
  /** Link-preview image inside public/, 1200x630. */
  image?: string;
  /** true: use the title as is, without the " | Site" template suffix. */
  absoluteTitle?: boolean;
  /** true: keep this page out of search results (links are still followed). */
  noindex?: boolean;
}

/**
 * Metadata for every page: title, description, canonical, hreflang, Open
 * Graph, Twitter and robots. Every page.tsx must export a generateMetadata
 * that returns this. Next replaces (does not merge) openGraph when a page
 * sets it, which is why all of it lives in one place instead of layout + page.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  absoluteTitle = false,
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = localizedUrl(locale, path);
  const images = [{ url: image, width: 1200, height: 630 }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    ...((noindex || !IS_INDEXABLE) && { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title,
      description,
      locale: OG_LOCALE[locale as Locale] ?? OG_LOCALE[routing.defaultLocale],
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
