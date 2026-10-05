import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // TODO(setup): languages of the site. The first decision of the project:
  // changing it later changes every URL.
  locales: ["es", "en"],
  defaultLocale: "es",
  // "as-needed": the default language has no prefix ("/", "/about") and the
  // others do ("/en", "/en/about"). Shorter URLs for the main audience, and
  // when replacing an old site without language prefixes, its URLs survive.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
