// schema.org JSON-LD builders. Render them with <JsonLd data={...} />.
// Rule: JSON-LD must describe what is visible on the page, never more.
// Validate with https://search.google.com/test/rich-results and
// https://validator.schema.org after every change.
import { localizedUrl } from "./seo";
import { organization, SITE_NAME, SITE_URL, type DaySchedule, type LocalBusiness } from "./site";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/** Home page. Who is behind the site + official profiles. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.name,
    url: SITE_URL,
    logo: abs(organization.logo),
    ...(organization.sameAs.length > 0 && { sameAs: organization.sameAs }),
  };
}

/** Home page. Google uses it to pick the site name shown above the result. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  };
}

const SCHEMA_DAY: Record<DaySchedule["dayKey"], string> = {
  monday: "https://schema.org/Monday",
  tuesday: "https://schema.org/Tuesday",
  wednesday: "https://schema.org/Wednesday",
  thursday: "https://schema.org/Thursday",
  friday: "https://schema.org/Friday",
  saturday: "https://schema.org/Saturday",
  sunday: "https://schema.org/Sunday",
};

// One OpeningHoursSpecification per slot; closed days produce none (absence
// means closed in schema.org).
function openingHours(hours: readonly DaySchedule[]) {
  return hours.flatMap((day) =>
    (day.hours ?? []).map((slot) => {
      const [opens, closes] = slot.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: SCHEMA_DAY[day.dayKey], opens, closes };
    })
  );
}

/** Page of a physical location (shop, restaurant, office). */
export function localBusinessSchema(business: LocalBusiness, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": business.type,
    name: business.name,
    ...(business.alternateName && { alternateName: business.alternateName }),
    url: localizedUrl(locale, business.path),
    image: abs(business.image),
    telephone: business.telephone,
    ...(business.priceRange && { priceRange: business.priceRange }),
    address: { "@type": "PostalAddress", ...business.address },
    ...(business.geo && { geo: { "@type": "GeoCoordinates", ...business.geo } }),
    ...(business.hours && { openingHoursSpecification: openingHours(business.hours) }),
    ...(business.sameAs && { sameAs: business.sameAs }),
    brand: { "@type": "Brand", name: organization.name },
  };
}

/** Pages below the home page. items: from the home page down to the current page. */
export function breadcrumbSchema(locale: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}
