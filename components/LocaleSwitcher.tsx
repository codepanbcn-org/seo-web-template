"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Real <a href> links (not buttons with onClick): crawlers can follow them to
// the other language versions, and they work without JavaScript.
export default function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const pathname = usePathname();
  const activeLocale = useLocale();

  return (
    <ul aria-label={t("label")} className="flex gap-3 text-sm">
      {routing.locales.map((locale) => (
        <li key={locale}>
          <Link
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={locale === activeLocale ? "true" : undefined}
            className={locale === activeLocale ? "font-bold underline" : "hover:underline"}
          >
            {t(locale)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
