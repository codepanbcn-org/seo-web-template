// Project data: the ONE file to fill in when starting a new project.
// Everything SEO-related (metadata, sitemap, robots, JSON-LD) reads from here,
// so the same fact (domain, address, opening hours...) is never typed twice.
// Search the repo for "TODO(setup)" to find every placeholder.

// Canonical origin, no trailing slash. A hard-coded constant on purpose: an
// env variable that is missing at build time silently produces URLs like
// "undefined/about" in the sitemap (this happened on a real project).
// www or not? Existing site: keep whatever Google already indexes.
// New site: no www. See docs/SEO-CHECKLIST.md §0.
export const SITE_URL = "https://www.example.com"; // TODO(setup)

export const SITE_NAME = "Example"; // TODO(setup)

// Default image for link previews (WhatsApp, LinkedIn, X...): 1200x630, < 300 KB.
export const DEFAULT_OG_IMAGE = "/og-default.png"; // TODO(setup): replace the placeholder

// Language-independent paths (no locale prefix) that search engines should
// index. The sitemap is built from this list. Pages with noindex (legal pages,
// thank-you pages...) must NOT be here.
export const INDEXED_PATHS = ["", "/about"] as const;

// Organization behind the site (schema.org Organization, home page).
export const organization = {
  name: SITE_NAME,
  // TODO(setup): absolute path inside public/; raster (png) at least 112x112.
  logo: "/icon.svg",
  // TODO(setup): official profiles. Used as schema.org sameAs.
  sameAs: [
    // "https://www.instagram.com/example",
  ] as string[],
};

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export interface DaySchedule {
  dayKey: DayKey;
  /** null = closed. Each string is one opening slot: "13:00-16:00". */
  hours: string[] | null;
}

/** Helper: seven entries, Monday first. */
export const schedule = (mondayToSunday: (string[] | null)[]): DaySchedule[] =>
  DAY_KEYS.map((dayKey, i) => ({ dayKey, hours: mondayToSunday[i] ?? null }));

export interface LocalBusiness {
  /** schema.org type: "LocalBusiness", "Restaurant", "Store", "ProfessionalService"... */
  type: string;
  name: string;
  /** Path of the page that represents this business, e.g. "" or "/shop-madrid". */
  path: string;
  image: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "ES". */
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  hours?: DaySchedule[];
  priceRange?: string;
  /** Other names people search for (old name, spelling without accents...). */
  alternateName?: string[];
  sameAs?: string[];
}

// Physical locations (shops, restaurants, offices). Leave empty for an
// online-only project. Each one becomes schema.org JSON-LD on its page; keep
// it identical to the Google Business Profile (name, address, phone).
export const businesses: LocalBusiness[] = [
  // TODO(setup) example:
  // {
  //   type: "Restaurant",
  //   name: "Example Madrid",
  //   path: "",
  //   image: "/og-default.png",
  //   telephone: "+34600000000",
  //   address: {
  //     streetAddress: "Calle Ejemplo, 1",
  //     addressLocality: "Madrid",
  //     addressRegion: "Madrid",
  //     postalCode: "28001",
  //     addressCountry: "ES",
  //   },
  //   hours: schedule([null, ["13:00-16:00", "20:00-23:30"], ...]),
  //   priceRange: "€€",
  // },
];
